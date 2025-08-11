// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma"; 
// Eğer projende @better-auth/prisma-adapter yüklüyse şunu kullan:
// import { prismaAdapter } from "@better-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

/**
 * .env gereklilikleri:
 * - BETTER_AUTH_SECRET
 * - NEXT_PUBLIC_APP_URL (örn: https://toyzzbox.com)
 * - (opsiyonel) GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
 */
export const auth = betterAuth({
  // Prisma adapter: provider vermene gerek yok; Prisma'dan otomatik okunur
  database: prismaAdapter(prisma),

  secret: process.env.BETTER_AUTH_SECRET!,

  session: {
    // 30 gün oturum
    expiresIn: 60 * 60 * 24 * 30,
    // Session tablosunda log tutmak istersen:
    storeIP: true,
    storeUserAgent: true,
  },

  emailAndPassword: {
    enabled: true,
    async hashPassword(password) {
      return bcrypt.hash(password, 10);
    },
    async verifyPassword(password, hash) {
      return bcrypt.compare(password, hash);
    },
  },

  // Sosyal girişler (örnek: Google). Değerler yoksa otomatik devre dışı kalır.
  socialProviders: {
    google:
      process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
        ? {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          }
        : undefined,
  },

  // session.user içinde dönecek alanlar
  user: {
    model: {
      select: { id: true, email: true, name: true, image: true, role: true },
    },
  },

  // CORS/origin doğrulaması için
  trustedOrigins: [process.env.NEXT_PUBLIC_APP_URL!],
});

// RSC tarafında session almak için:  const session = await getSession();
export const getSession = auth;

// Opsiyonel: kayıt sonrası ADMIN_EMAIL eşleşirse rol terfisi
export async function promoteAdminIfNeeded(email: string) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) return;
  if (email.toLowerCase() !== adminEmail.toLowerCase()) return;

  await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });
}

// Tip kolaylığı (isteğe bağlı)
export type AppSession = Awaited<ReturnType<typeof getSession>>;
