// lib/auth.ts
import { randomBytes, createHmac, timingSafeEqual } from 'crypto'
import argon2 from 'argon2'
import nodemailer from 'nodemailer'

import { prisma } from './prisma'

// Types
export interface ResetTokenPayload {
  userId: string
  email: string
  tokenId: string
  type: 'password-reset'
  exp: number
}

// Email transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
})

// Argon2 configuration
const argon2Config = {
  type: argon2.argon2id, // En güvenli varyant
  memoryCost: 2 ** 16,   // 64MB RAM
  timeCost: 3,           // 3 iterasyon
  parallelism: 1,        // 1 thread
}

// Utility functions
export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, argon2Config)
  } catch (error) {
    console.error('Password hashing error:', error)
    throw new Error('Şifre hashleme hatası')
  }
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    // Argon2 hash kontrolü
    if (hashedPassword.startsWith('$argon2')) {
      return await argon2.verify(hashedPassword, password)
    }
    
    // Legacy bcrypt support (migration için)
    if (hashedPassword.startsWith('$2b$') || hashedPassword.startsWith('$2a$')) {
      const bcrypt = await import('bcrypt')
      return await bcrypt.compare(password, hashedPassword)
    }

    return false
  } catch (error) {
    console.error('Password verification error:', error)
    return false
  }
}

// Migration function - mevcut kullanıcılar için
export async function upgradePasswordHash(
  userId: string,
  plainPassword: string,
  oldHash: string
): Promise<void> {
  try {
    // Eski hash'i doğrula
    const isValid = await verifyPassword(plainPassword, oldHash)
    
    if (isValid && !oldHash.startsWith('$argon2')) {
      // Eski hash'i yeni Argon2 hash ile değiştir
      const newHash = await hashPassword(plainPassword)
      
      await prisma.user.update({
        where: { id: userId },
        data: { password: newHash }
      })
      
      console.log(`Password upgraded to Argon2 for user: ${userId}`)
    }
  } catch (error) {
    console.error('Password upgrade error:', error)
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })
  } catch (error) {
    console.error('Find user error:', error)
    return null
  }
}

// Security logging
export async function logSecurityEvent(
  action: string,
  userId?: string,
  metadata?: any,
  ipAddress?: string,
  userAgent?: string,
  success: boolean = true
): Promise<void> {
  try {
    await prisma.securityLog.create({
      data: {
        userId,
        action,
        ipAddress,
        userAgent,
        metadata,
        success,
      }
    })
  } catch (error) {
    console.error('Security log error:', error)
  }
}

// Crypto Token Generation (JWT yerine)
export async function generateResetToken(userId: string, email: string): Promise<string> {
  try {
    // 1. Database'de minimal token kaydı
    const dbToken = await prisma.resetToken.create({
      data: {
        userId,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 dakika
        used: false,
      }
    })

    // 2. Crypto token oluştur (JWT yerine)
    const payload = {
      userId,
      email,
      tokenId: dbToken.id,
      type: 'password-reset' as const,
      exp: Date.now() + (15 * 60 * 1000) // 15 dakika
    }
    
    const payloadString = JSON.stringify(payload)
    const payloadBase64 = Buffer.from(payloadString).toString('base64url')
    
    // HMAC signature oluştur
    const signature = createHmac('sha256', process.env.TOKEN_SECRET!)
      .update(payloadBase64)
      .digest('base64url')
    
    return `${payloadBase64}.${signature}`
  } catch (error) {
    console.error('Generate token error:', error)
    throw new Error('Token oluşturma hatası')
  }
}

// Crypto Token Validation (JWT yerine)
export async function validateResetToken(token: string): Promise<ResetTokenPayload | null> {
  try {
    const [payloadBase64, signature] = token.split('.')
    if (!payloadBase64 || !signature) return null
    
    // 1. Signature doğrula (ilk katman)
    const expectedSignature = createHmac('sha256', process.env.TOKEN_SECRET!)
      .update(payloadBase64)
      .digest('base64url')
    
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return null
    }
    
    // 2. Payload decode et
    const payload: ResetTokenPayload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString()
    )
    
    // 3. Type ve expiry kontrol
    if (payload.type !== 'password-reset' || payload.exp < Date.now()) {
      return null
    }

    // 4. Database doğrulama (ikinci katman)
    const dbToken = await prisma.resetToken.findFirst({
      where: {
        id: payload.tokenId,
        userId: payload.userId,
        expiresAt: { gt: new Date() },
        used: false
      }
    })

    if (!dbToken) {
      return null
    }

    return payload
  } catch (error) {
    console.error('Validate token error:', error)
    return null
  }
}

// Rate limiting check
export async function checkResetRateLimit(userId: string): Promise<boolean> {
  try {
    const recentTokens = await prisma.resetToken.count({
      where: {
        userId,
        createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } // Son 1 saat
      }
    })

    return recentTokens < 3 // Max 3 token per hour
  } catch (error) {
    console.error('Rate limit check error:', error)
    return false
  }
}

// Send reset email
export async function sendResetEmail(email: string, token: string): Promise<void> {
  try {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Şifre Sıfırlama Talebi - E-Ticaret',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; border-radius: 15px 15px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Şifre Sıfırlama</h1>
          </div>
          
          <div style="background: white; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <p style="color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
              Merhaba,<br><br>
              Hesabınız için şifre sıfırlama talebinde bulundunuz. Yeni şifrenizi belirlemek için aşağıdaki butona tıklayın:
            </p>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 16px 35px; 
                        text-decoration: none; 
                        border-radius: 30px; 
                        font-weight: 600; 
                        font-size: 16px;
                        display: inline-block;
                        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
                        transition: transform 0.2s ease;">
                Şifremi Sıfırla
              </a>
            </div>
            
            <div style="background: #f8f9ff; padding: 20px; border-radius: 10px; border-left: 4px solid #667eea; margin: 30px 0;">
              <p style="margin: 0; color: #555; font-size: 14px;">
                <strong>Bağlantı çalışmıyorsa:</strong><br>
                Bu URL'yi kopyalayıp tarayıcınıza yapıştırın:
              </p>
              <p style="word-break: break-all; color: #667eea; font-size: 12px; margin: 10px 0 0 0; background: white; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
            </div>
            
            <div style="border: 1px solid #ffe6e6; background: #fff5f5; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <h3 style="color: #e53e3e; margin: 0 0 15px 0; font-size: 16px;">Güvenlik Uyarısı</h3>
              <ul style="color: #666; font-size: 14px; margin: 0; padding-left: 18px; line-height: 1.6;">
                <li>Bu bağlantı <strong>15 dakika</strong> içinde geçerliliğini yitirecektir</li>
                <li>Bu talebi siz yapmadıysanız, bu e-postayı güvenle silebilirsiniz</li>
                <li>Şifrenizi asla kimseyle paylaşmayın</li>
                <li>Şüpheli durumda destek ekibimizle iletişime geçin</li>
              </ul>
            </div>
            
            <hr style="border: none; height: 1px; background: #eee; margin: 35px 0;">
            
            <div style="text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0; line-height: 1.5;">
                Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayın.<br>
                <strong>E-Ticaret Mağazanız</strong> © ${new Date().getFullYear()} | Tüm hakları saklıdır.
              </p>
            </div>
          </div>
        </div>
      `
    }

    await transporter.sendMail(mailOptions)
    console.log(`Reset email sent to: ${email}`)
  } catch (error) {
    console.error('Send email error:', error)
    throw new Error('E-posta gönderme hatası')
  }
}

// Update password with full security
export async function updatePasswordSecure(
  token: string, 
  newPassword: string,
  ipAddress?: string,
  userAgent?: string
): Promise<void> {
  const payload = await validateResetToken(token)
  if (!payload) {
    await logSecurityEvent('PASSWORD_RESET_FAILED', undefined, { reason: 'Invalid token' }, ipAddress, userAgent, false)
    throw new Error('Geçersiz veya süresi dolmuş token')
  }

  try {
    const hashedPassword = await hashPassword(newPassword)

    // Transaction ile güvenli güncelleme
    await prisma.$transaction([
      // 1. Şifreyi güncelle
      prisma.user.update({
        where: { id: payload.userId },
        data: { 
          password: hashedPassword,
          sessionVersion: { increment: 1 }, // Tüm session'ları geçersiz kıl
          updatedAt: new Date()
        }
      }),
      
      // 2. Kullanılan token'ı işaretle
      prisma.resetToken.update({
        where: { id: payload.tokenId },
        data: { 
          used: true,
          usedAt: new Date()
        }
      }),
      
      // 3. Kullanıcının diğer tüm reset token'larını iptal et
      prisma.resetToken.updateMany({
        where: {
          userId: payload.userId,
          used: false,
          id: { not: payload.tokenId }
        },
        data: { used: true, usedAt: new Date() }
      })
    ])

    // Success log
    await logSecurityEvent('PASSWORD_RESET_SUCCESS', payload.userId, { email: payload.email }, ipAddress, userAgent, true)
    
    console.log(`Password updated successfully for user: ${payload.email}`)
  } catch (error: any) {
    await logSecurityEvent('PASSWORD_RESET_FAILED', payload.userId, { error: error.message }, ipAddress, userAgent, false)
    console.error('Update password error:', error)
    throw new Error('Şifre güncelleme hatası')
  }
}

// Cleanup expired tokens
export async function cleanupExpiredTokens(): Promise<number> {
  try {
    const result = await prisma.resetToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { 
            used: true,
            usedAt: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // 7 gün önce kullanılmış
          }
        ]
      }
    })
    
    console.log(`Cleaned up ${result.count} expired/used tokens`)
    return result.count
  } catch (error) {
    console.error('Cleanup error:', error)
    return 0
  }
}