// app/actions/auth.ts
'use server'

import { z } from 'zod'
import { redirect } from 'next/navigation'
import { 
  findUserByEmail,
  generateResetToken,
  sendResetEmail,
  validateResetToken,
  updatePasswordSecure,
  checkResetRateLimit,
  logSecurityEvent 
} from '@/lib/auth'
import { headers } from 'next/headers'

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

      // Generate token and send email
      const token = await generateResetToken(user.id, user.email)
      await sendResetEmail(user.email, token)
      
      await logSecurityEvent('PASSWORD_RESET_REQUESTED', user.id, { email }, ipAddress, userAgent, true)
    } else {
      // Log attempt for non-existent email
      await logSecurityEvent('PASSWORD_RESET_ATTEMPTED', undefined, { email, found: false }, ipAddress, userAgent, true)
    }

    // Her durumda aynı mesaj (güvenlik için)
    return { 
      success: 'Eğer e-posta adresiniz kayıtlıysa, şifre sıfırlama bağlantısı gönderilmiştir.' 
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