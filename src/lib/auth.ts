import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "./prisma"


export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // SES ile email gönderimi için true yapabilirsiniz
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 gün
    updateAge: 60 * 60 * 24, // 1 gün
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5 // 5 dakika
    }
  },
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: ["https://toyzzbox.com"],
  
  // Email gönderimi için SES konfigürasyonu (opsiyonel)
  emailVerification: {
    sendOnSignUp: false, // İsterseniz true yapabilirsiniz
    expiresIn: 60 * 10, // 10 dakika
    sendVerificationEmail: async ({ user, url, token }) => {
      // SES ile email gönderimi burada yapılabilir
      console.log(`Email verification URL for ${user.email}: ${url}`)
    }
  },

  // Rate limiting (production için önemli)
  rateLimit: {
    window: 60, // 1 dakika
    max: 100 // dakikada maksimum 100 istek
  }
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.User