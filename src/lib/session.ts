"use server";

import { randomBytes } from "crypto";
import { cookies, headers } from "next/headers";
import { prisma } from "./prisma";

// Tipler
interface User {
  id: string;
  email: string;
  name: string | null;
  role: string;
  emailVerified: boolean | null;
  lockedUntil?: Date | null;
}

interface SessionValidationResult {
  user: User;
  refreshed: boolean;
  expiresAt: Date;
}

interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  lockTime?: number;
}

// Sabitler
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 gün
const REFRESH_THRESHOLD = 7 * 24 * 60 * 60 * 1000; // 7 gün

// Güvenli token
function generateSecureToken(): string {
  return randomBytes(48).toString("base64url");
}

// Session oluştur
export async function createSession(
  userId: string,
  ipAddress: string,
  userAgent: string
) {
  const sessionToken = generateSecureToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);

  const [session] = await Promise.all([
    prisma.session.create({
      data: {
        sessionToken,
        userId,
        userAgent,
        ipAddress,
        expiresAt,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            emailVerified: true,
          },
        },
      },
    }),
    prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        lastLoginIp: ipAddress,
        failedLoginCount: 0,
      },
    }),
  ]);

  return { sessionToken, user: session.user };
}

// Session doğrula ve yenile
export async function validateAndRefreshSession(
  sessionToken: string
): Promise<SessionValidationResult | null> {
  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken, isActive: true },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          lockedUntil: true,
        },
      },
    },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await destroySession(sessionToken);
    return null;
  }

  if (session.user.lockedUntil && session.user.lockedUntil > new Date()) {
    await destroySession(sessionToken);
    return null;
  }

  const timeUntilExpiry = session.expiresAt.getTime() - Date.now();
  const shouldRefresh = timeUntilExpiry < REFRESH_THRESHOLD;

  if (shouldRefresh) {
    const newExpiresAt = new Date(Date.now() + SESSION_DURATION);
    await prisma.session.update({
      where: { sessionToken },
      data: { expiresAt: newExpiresAt, lastAccessAt: new Date() },
    });

    return { user: session.user, refreshed: true, expiresAt: newExpiresAt };
  } else {
    await prisma.session.update({
      where: { sessionToken },
      data: { lastAccessAt: new Date() },
    });

    return { user: session.user, refreshed: false, expiresAt: session.expiresAt };
  }
}

// Login attempt
export async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress: string,
  userAgent: string,
  userId?: string,
  reason?: string
) {
  try {
    await prisma.loginAttempt.create({
      data: {
        email: email.toLowerCase(),
        userId: userId || null,
        ipAddress,
        userAgent,
        success,
        reason: reason || null,
      },
    });
  } catch (error) {
    console.error("Failed to record login attempt:", error);
  }
}

// Rate limiting
export async function checkRateLimit(
  email: string,
  ipAddress: string
): Promise<RateLimitResult> {
  const last15Minutes = new Date(Date.now() - 15 * 60 * 1000);

  const recentAttempts = await prisma.loginAttempt.count({
    where: {
      OR: [{ email: email.toLowerCase() }, { ipAddress }],
      success: false,
      createdAt: { gte: last15Minutes },
    },
  });

  const maxAttempts = 5;
  return {
    allowed: recentAttempts < maxAttempts,
    remainingAttempts: Math.max(0, maxAttempts - recentAttempts),
    lockTime: recentAttempts >= maxAttempts ? 15 : undefined,
  };
}

// Session destroy
export async function destroySession(sessionToken: string) {
  await prisma.session.update({
    where: { sessionToken },
    data: { isActive: false },
  });
}

// Cookie ayarla
export async function setSessionCookie(
  sessionToken: string,
  rememberMe: boolean = false
) {
  const cookieStore = await cookies();
  cookieStore.set("session-token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60,
    path: "/",
  });
}

// Cookie temizle
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("session-token");
}

// Mevcut session
export async function getSession(): Promise<SessionValidationResult | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session-token")?.value;
  if (!sessionToken) return null;
  return await validateAndRefreshSession(sessionToken);
}

// Client info
export async function getClientInfo() {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const realIP = h.get("x-real-ip");
  const cfIP = h.get("cf-connecting-ip");

  return {
    ipAddress: (forwarded?.split(",")[0] || realIP || cfIP || "unknown").trim(),
    userAgent: h.get("user-agent") || "unknown",
  };
}
