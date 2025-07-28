import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database", // ✅ Session veritabanında tutulur
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET, // ✅ .env içinde olmalı

  providers: [
    // ✅ Google login desteği
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ✅ Email + Şifre login
    CredentialsProvider({
      name: "Email & Şifre",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // ❗Güvenli return (password gibi hassas alanları çıkart)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    // ✅ Session içine id ve role gibi ekstra bilgiler ekle
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role as "admin" | "user";
        session.user.email = user.email;
        session.user.name = user.name;
      }
      return session;
    },

    // (İsteğe bağlı) admin email tanımlaması
    async signIn({ user }) {
      if (
        user.email === process.env.ADMIN_EMAIL &&
        user.role !== "admin"
      ) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "admin" },
        });
      }
      return true;
    },
  },

  // (Opsiyonel) Cookie ayarları - https zorunluysa kullan
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true, // ✅ HTTPS zorunlu
      },
    },
  },
};

export default authConfig;
