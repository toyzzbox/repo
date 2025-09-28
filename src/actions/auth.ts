// app/actions/auth.ts
'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { 
  findUserByEmail,
  generateResetToken,
  validateResetToken,
  updatePasswordSecure,
  checkResetRateLimit,
  logSecurityEvent 
} from '@/lib/auth'
import { headers, cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { User } from '@prisma/client'

// Validation schemas
const ForgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi girin').toLowerCase(),
})

const ResetPasswordSchema = z.object({
  password: z.string().min(8, 'Şifre en az 8 karakter olmalı'),
  confirmPassword: z.string().min(8, 'Şifre tekrar en az 8 karakter olmalı'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
})

// Types
export type ForgotPasswordResult = { 
  success?: string; 
  error?: string; 
}

export type ResetPasswordResult = { 
  success?: string; 
  error?: string; 
}

// Helper: Get client info
async function getClientInfo() {
  const headersList = headers()
  return {
    ipAddress: headersList.get('x-forwarded-for') || 'unknown',
    userAgent: headersList.get('user-agent') || 'unknown',
  }
}

// FORGOT PASSWORD ACTION
export async function forgotPasswordAction(
  _prevState: ForgotPasswordResult,
  formData: FormData
): Promise<ForgotPasswordResult> {
  const { ipAddress, userAgent } = await getClientInfo()
  
  try {
    // Validate input
    const data = {
      email: String(formData.get('email') ?? '').trim(),
    }

    const parsed = ForgotPasswordSchema.safeParse(data)
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    const { email } = parsed.data

    // Find user
    const user = await findUserByEmail(email)
    
    if (user) {
      // Rate limiting check
      const canRequest = await checkResetRateLimit(user.id)
      if (!canRequest) {
        await logSecurityEvent('PASSWORD_RESET_RATE_LIMITED', user.id, { email }, ipAddress, userAgent, false)
        return { error: 'Çok fazla talep. Lütfen 1 saat sonra tekrar deneyin.' }
      }

      // Generate token
      const token = await generateResetToken(user.id, user.email)
      
      // Email yerine console log (Nodemailer kaldırıldı)
      console.log(`Password reset token for ${email}: ${token}`)
      
      await logSecurityEvent('PASSWORD_RESET_REQUESTED', user.id, { email }, ipAddress, userAgent, true)
    } else {
      // Log attempt for non-existent email
      await logSecurityEvent('PASSWORD_RESET_ATTEMPTED', undefined, { email, found: false }, ipAddress, userAgent, true)
    }

    // Her durumda aynı mesaj (güvenlik için)
    return { 
      success: 'Eğer e-posta adresiniz kayıtlıysa, şifre sıfırlama bağlantısı oluşturuldu.' 
    }

  } catch (error: any) {
    console.error('Forgot password error:', error)
    await logSecurityEvent('PASSWORD_RESET_ERROR', undefined, { error: error.message }, ipAddress, userAgent, false)
    return { error: 'Bir hata oluştu. Lütfen tekrar deneyin.' }
  }
}

// RESET PASSWORD ACTION
export async function resetPasswordAction(
  token: string,
  _prevState: ResetPasswordResult,
  formData: FormData
): Promise<ResetPasswordResult> {
  const { ipAddress, userAgent } = await getClientInfo()

  try {
    // Validate input
    const data = {
      password: String(formData.get('password') ?? ''),
      confirmPassword: String(formData.get('confirmPassword') ?? ''),
    }

    const parsed = ResetPasswordSchema.safeParse(data)
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message }
    }

    // Update password
    await updatePasswordSecure(token, parsed.data.password, ipAddress, userAgent)

    // Redirect to login with success message
    redirect('/login?message=password-reset-success')

  } catch (error: any) {
    console.error('Reset password error:', error)
    return { error: error.message || 'Şifre sıfırlama sırasında bir hata oluştu.' }
  }
}

/**
 * Server-side'da mevcut kullanıcıyı getir
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
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

/**
 * Kullanıcının giriş yapıp yapmadığını kontrol et
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Admin kontrolü
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'ADMIN';
}

/**
 * Protected action wrapper
 */
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

/**
 * Admin action wrapper
 */
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
