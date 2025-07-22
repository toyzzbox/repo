// src/auth.config.ts
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  trustHost: true,

  /** ───── Adapter ───── */
  adapter: PrismaAdapter(prisma),

  /** ───── Providers ───── */
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Email & Şifre",
      credentials: {
        email: { label: "E-Posta", type: "text" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
    
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
    
        if (!user || !user.password) return null;
    
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
    
        return isValid ? user : null;
      },
    }),
  ],

  /** ───── Session Strategy ───── */
  session: { strategy: "database" },

  /** ───── Callbacks ───── */
  callbacks: {
    /** 1) Her oturum açılışında admin rolünü senkronize et */
    async signIn({ user }) {
      if (user.email === process.env.ADMIN_EMAIL && user.role !== "admin") {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "admin" },
        });
      }
      return true;
    },

    /** 2) Oturuma ekstra alanlar ekle */
    async session({ session, user }) {
      session.user.id = user.id;           // → ui tarafında id erişilebilir
      session.user.role = user.role as "admin" | "user";
      return session;
    },
  },

  /** ───── Diğer ayarlar ───── */
  secret: process.env.AUTH_SECRET,
};

export default authConfig;
