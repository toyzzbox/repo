// lib/auth.ts
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'
import crypto from 'crypto'

// User operations
export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
  } catch (error) {
    console.error('Find user by email error:', error)
    return null
  }
}

// Reset token operations
export async function generateResetToken(userId: string, email: string): Promise<string> {
  try {
    // Generate secure random token
    const token = crypto.randomBytes(32).toString('hex')
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    
    // Token 1 saat geçerli
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    
    // Önceki tokenları sil
    await prisma.passwordResetToken.deleteMany({
      where: { userId }
    })
    
    // Yeni token kaydet
    await prisma.passwordResetToken.create({
      data: {
        userId,
        email,
        token: hashedToken,
        expiresAt,
      }
    })
    
    // Ham token'ı döndür (email'de kullanılacak)
    return token
  } catch (error) {
    console.error('Generate reset token error:', error)
    throw new Error('Token oluşturulamadı')
  }
}

export async function validateResetToken(token: string): Promise<{ userId: string; email: string } | null> {
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
    
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken }
    })
    
    if (!resetToken || resetToken.expiresAt < new Date() || resetToken.used) {
      return null
    }
    
    return {
      userId: resetToken.userId,
      email: resetToken.email
    }
  } catch (error) {
    console.error('Validate reset token error:', error)
    return null
  }
}

export async function updatePasswordSecure(
  token: string, 
  newPassword: string, 
  ipAddress: string, 
  userAgent: string
): Promise<void> {
  try {
    // Token'ı validate et
    const tokenData = await validateResetToken(token)
    if (!tokenData) {
      throw new Error('Geçersiz veya süresi dolmuş token')
    }
    
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(newPassword, 12)
    
    // Transaction ile güncelle
    await prisma.$transaction(async (tx) => {
      // Şifreyi güncelle
      await tx.user.update({
        where: { id: tokenData.userId },
        data: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      })
      
      // Token'ı kullanıldı olarak işaretle
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex')
      await tx.passwordResetToken.update({
        where: { token: hashedToken },
        data: { used: true }
      })
      
      // Kullanıcının tüm aktif sessionlarını sonlandır
      await tx.session.updateMany({
        where: { 
          userId: tokenData.userId,
          isActive: true 
        },
        data: { isActive: false }
      })
    })
    
    // Security log
    await logSecurityEvent('PASSWORD_RESET_COMPLETED', tokenData.userId, {}, ipAddress, userAgent, true)
    
  } catch (error) {
    console.error('Update password error:', error)
    throw error
  }
}

// Rate limiting
export async function checkResetRateLimit(userId: string): Promise<boolean> {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    
    const recentRequests = await prisma.passwordResetToken.count({
      where: {
        userId,
        createdAt: { gte: oneHourAgo }
      }
    })
    
    // Saatte maksimum 3 talep
    return recentRequests < 3
  } catch (error) {
    console.error('Check reset rate limit error:', error)
    return false
  }
}

// Security logging
export async function logSecurityEvent(
  eventType: string,
  userId?: string,
  metadata: Record<string, any> = {},
  ipAddress: string = 'unknown',
  userAgent: string = 'unknown',
  success: boolean = true
): Promise<void> {
  try {
    await prisma.securityLog.create({
      data: {
        eventType,
        userId,
        ipAddress,
        userAgent,
        metadata,
        success,
      }
    })
  } catch (error) {
    console.error('Security log error:', error)
    // Security log hatası diğer işlemleri etkilemez
  }
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// Session utilities
export async function createSession(userId: string, ipAddress: string, userAgent: string): Promise<string> {
  try {
    const sessionToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 gün
    
    await prisma.session.create({
      data: {
        sessionToken,
        userId,
        expiresAt,
        ipAddress,
        userAgent,
        isActive: true,
        lastAccessAt: new Date(),
      }
    })
    
    return sessionToken
  } catch (error) {
    console.error('Create session error:', error)
    throw new Error('Session oluşturulamadı')
  }
}

export async function invalidateSession(sessionToken: string): Promise<void> {
  try {
    await prisma.session.update({
      where: { sessionToken },
      data: { isActive: false }
    })
  } catch (error) {
    console.error('Invalidate session error:', error)
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  try {
    await prisma.session.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isActive: false }
        ]
      }
    })
  } catch (error) {
    console.error('Cleanup sessions error:', error)
  }
}

// User session management
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    
    // Session token'ı cookie'den al
    const sessionToken = cookieStore.get('session_token')?.value;
    
    if (!sessionToken) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: {
        sessionToken,
      },
      include: { user: true },
    });

    if (!session || session.expiresAt < new Date() || !session.isActive) {
      return null;
    }

    // Last access time'ı güncelle
    await prisma.session.update({
      where: { id: session.id },
      data: { lastAccessAt: new Date() },
    });

    return session.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

// Authentication helpers
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

// Protected action wrapper
export async function requireAuth<T>(
  callback: (user: User) => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
  const user = await getCurrentUser();
  
  if (!user) {
    return { success: false, error: 'Bu işlem için giriş yapmalısınız' };
  }

  try {
    const data = await callback(user);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Bir hata oluştu' };
  }
}

// Admin action wrapper
export async function requireAdmin<T>(
  callback: (user: User) => Promise<T>
): Promise<{ success: boolean; data?: T; error?: string }> {
  const user = await getCurrentUser();
  
  if (!user) {
    return { success: false, error: 'Bu işlem için giriş yapmalısınız' };
  }

  if (user.role !== 'ADMIN') {
    return { success: false, error: 'Bu işlem için yetkiniz yok' };
  }

  try {
    const data = await callback(user);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Bir hata oluştu' };
  }
}