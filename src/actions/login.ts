"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";

// Validation schema
const LoginSchema = z.object({
  email: z.string().email("Geçerli bir email adresi girin").toLowerCase(),
  password: z.string().min(1, "Şifre gerekli"),
  rememberMe: z.boolean().optional(),
});

// Helper functions
async function getClientInfo() {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");
  const cfIP = headersList.get("cf-connecting-ip");
  
  return {
    ipAddress: (forwarded?.split(",")[0] || realIP || cfIP || "unknown").trim(),
    userAgent: headersList.get("user-agent") || "unknown",
  };
}

async function checkRateLimit(email: string, ipAddress: string): Promise<boolean> {
  const last15Minutes = new Date(Date.now() - 15 * 60 * 1000);
  
  const recentFailedAttempts = await prisma.loginAttempt.count({
    where: {
      OR: [
        { email: email.toLowerCase() },
        { ipAddress }
      ],
      success: false,
      createdAt: { gte: last15Minutes },
    },
  });

  return recentFailedAttempts < 5;
}

async function isAccountLocked(email: string): Promise<boolean> {
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const recentFailedAttempts = await prisma.loginAttempt.count({
    where: {
      email: email.toLowerCase(),
      success: false,
      createdAt: { gte: last24Hours },
    },
  });

  return recentFailedAttempts >= 10;
}

async function recordLoginAttempt(
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
    console.error('Failed to record login attempt:', error);
  }
}

async function createSession(
  userId: string, 
  rememberMe: boolean = false,
  ipAddress: string,
  userAgent: string
) {
  // Eski sessionları temizle
  await prisma.session.deleteMany({
    where: {
      userId,
      expiresAt: { lt: new Date() }
    }
  });

  // Yeni session oluştur
  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  
  if (rememberMe) {
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 gün
  } else {
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 gün
  }

  const session = await prisma.session.create({
    data: {
      id: token,
      userId,
      sessionToken: token,
      expiresAt,
      ipAddress,
      userAgent,
      isActive: true,
      lastAccessAt: new Date(),
    }
  });
  
  return session;
}

async function setSessionCookie(sessionToken: string, rememberMe: boolean = false) {
  const cookieStore = await cookies();
  const maxAge = rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60;
  
  cookieStore.set("session-token", sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge,
    path: "/",
  });
}

// Main login action
export async function loginUser(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  
  const { ipAddress, userAgent } = await getClientInfo();

  try {
    // Extract and validate form data
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      rememberMe: formData.get("rememberMe") === "on",
    };

    const validatedData = LoginSchema.parse(rawData);

    // Check if account is locked
    const accountLocked = await isAccountLocked(validatedData.email);
    if (accountLocked) {
      await recordLoginAttempt(
        validatedData.email,
        false,
        ipAddress,
        userAgent,
        undefined,
        "Account locked - too many failed attempts"
      );
      return {
        success: false,
        message: "Hesabınız geçici olarak kilitlendi. 24 saat sonra tekrar deneyin.",
      };
    }

    // Rate limiting check
    const isAllowed = await checkRateLimit(validatedData.email, ipAddress);
    if (!isAllowed) {
      await recordLoginAttempt(
        validatedData.email,
        false,
        ipAddress,
        userAgent,
        undefined,
        "Rate limit exceeded"
      );
      return {
        success: false,
        message: "Çok fazla deneme. 15 dakika sonra tekrar deneyin.",
      };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (!user) {
      await recordLoginAttempt(
        validatedData.email,
        false,
        ipAddress,
        userAgent,
        undefined,
        "User not found"
      );
      return {
        success: false,
        message: "Email veya şifre hatalı",
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(validatedData.password, user.password);

    if (!passwordMatch) {
      await recordLoginAttempt(
        validatedData.email,
        false,
        ipAddress,
        userAgent,
        user.id,
        "Invalid password"
      );
      return {
        success: false,
        message: "Email veya şifre hatalı",
      };
    }

    // Successful login - create session
    const session = await createSession(
      user.id, 
      validatedData.rememberMe,
      ipAddress,
      userAgent
    );
    await setSessionCookie(session.id, validatedData.rememberMe);

    // Record successful login attempt
    await recordLoginAttempt(
      validatedData.email,
      true,
      ipAddress,
      userAgent,
      user.id,
      "Login successful"
    );

    // Update last login time
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        lastLogin: new Date(),
      },
    });

    // Redirect based on user role or default dashboard
    const redirectPath = user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard";
    redirect(redirectPath);

  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        message: firstError.message,
      };
    }

    return {
      success: false,
      message: "Bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
}

// Logout action
export async function logoutUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session-token");

    if (sessionToken) {
      await prisma.session.delete({
        where: { id: sessionToken.value },
      }).catch(() => {});
    }

    cookieStore.delete("session-token");
  } catch (error) {
    console.error("Logout error:", error);
  }

  redirect("/login");
}

// Session doğrulama helper'ı
export async function validateSession(sessionToken: string) {
  try {
    const session = await prisma.session.findUnique({
      where: {
        id: sessionToken,
        expiresAt: { gt: new Date() },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
          }
        }
      }
    });

    return