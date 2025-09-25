"use server"
import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

// Tip tanımları
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

export class SessionAuth {
  private static readonly SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 gün
  private static readonly REFRESH_THRESHOLD = 7 * 24 * 60 * 60 * 1000;  // 7 gün önce yenile

  // Güvenli token oluştur
  private static generateSecureToken(): string {
    return randomBytes(48).toString('base64url');
  }

  // Session oluştur
  static async createSession(userId: string, ipAddress: string, userAgent: string) {
    const sessionToken = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

    // Session oluştur ve user bilgilerini al
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
      // User'ın login bilgilerini güncelle
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
  static async validateAndRefreshSession(sessionToken: string): Promise<SessionValidationResult | null> {
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
      if (session) {
        await this.destroySession(sessionToken);
      }
      return null;
    }

    // User kilitli mi?
    if (session.user.lockedUntil && session.user.lockedUntil > new Date()) {
      await this.destroySession(sessionToken);
      return null;
    }

    // Rolling session
    const timeUntilExpiry = session.expiresAt.getTime() - Date.now();
    const shouldRefresh = timeUntilExpiry < this.REFRESH_THRESHOLD;

    if (shouldRefresh) {
      const newExpiresAt = new Date(Date.now() + this.SESSION_DURATION);
      await prisma.session.update({
        where: { sessionToken },
        data: {
          expiresAt: newExpiresAt,
          lastAccessAt: new Date(),
        },
      });
      
      return {
        user: session.user,
        refreshed: true,
        expiresAt: newExpiresAt,
      };
    } else {
      await prisma.session.update({
        where: { sessionToken },
        data: { lastAccessAt: new Date() },
      });
      
      return {
        user: session.user,
        refreshed: false,
        expiresAt: session.expiresAt,
      };
    }
  }

  // Login attempt kaydet
  static async recordLoginAttempt(
    email: string,
    success: boolean,
    ipAddress: string,
    userAgent: string,
    userId?: string,
    reason?: string
  ): Promise<void> {
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

  // Rate limiting
  static async checkRateLimit(email: string, ipAddress: string): Promise<RateLimitResult> {
    const last15Minutes = new Date(Date.now() - 15 * 60 * 1000);
    
    const recentAttempts = await prisma.loginAttempt.count({
      where: {
        OR: [
          { email: email.toLowerCase() },
          { ipAddress }
        ],
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
  static async destroySession(sessionToken: string): Promise<void> {
    await prisma.session.update({
      where: { sessionToken },
      data: { isActive: false },
    });
  }

  // Cookie ayarla (Server Action için) - ASYNC!
  static async setSessionCookie(sessionToken: string, rememberMe: boolean = false): Promise<void> {
    const cookieStore = await cookies(); // ASYNC await eklendi
    
    cookieStore.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 : 7 * 24 * 60 * 60, // 30 gün / 7 gün
      path: '/',
    });
  }

  // Cookie temizle - ASYNC!
  static async clearSessionCookie(): Promise<void> {
    const cookieStore = await cookies(); // ASYNC await eklendi
    cookieStore.delete('session-token');
  }

  // Mevcut session'ı al (Server Component/Action için) - ASYNC!
  static async getCurrentSession(): Promise<SessionValidationResult | null> {
    const cookieStore = await cookies(); // ASYNC await eklendi
    const sessionToken = cookieStore.get('session-token')?.value;
    
    if (!sessionToken) return null;
    
    return await this.validateAndRefreshSession(sessionToken);
  }

  // Client Info Helper (Server Action için)
  static async getClientInfo() {
    // Next.js 15'te headers da async
    const { headers } = await import('next/headers');
    const headersList = await headers();
    
    const forwarded = headersList.get("x-forwarded-for");
    const realIP = headersList.get("x-real-ip");
    const cfIP = headersList.get("cf-connecting-ip");
    
    return {
      ipAddress: (forwarded?.split(",")[0] || realIP || cfIP || "unknown").trim(),
      userAgent: headersList.get("user-agent") || "unknown",
    };
  }
}