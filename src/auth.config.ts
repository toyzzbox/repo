import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma"; // senin prisma yoluna göre güncelle
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  trustHost: true,

  adapter: PrismaAdapter(prisma),

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
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });

        if (!user || !user.hashedPassword) return null;

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.hashedPassword
        );

        if (!isValid) return null;

        return user;
      },
    }),
  ],

  session: {
    strategy: "database", // ✅ Veritabanı tabanlı session
  },

  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id; // ✅ Artık user DB'den geldiği için direk kullanılır
      return session;
    },
  },

  secret: process.env.AUTH_SECRET,
};
