// auth.config.ts

import Google from "auth/providers/google";
import Credentials from "auth/providers/credentials";
import type { NextAuthConfig } from "auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../prisma/prisma";
import { LoginSchema } from "./schema";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Zod tipi çıkarımı
type CredentialsType = z.infer<typeof LoginSchema>;

const authConfig: NextAuthConfig = {
  // Prisma ile adapter bağlantısı
  adapter: PrismaAdapter(prisma),

  // Kullanılacak oturum sağlayıcıları
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      async authorize(credentials: CredentialsType | undefined) {
        // Null kontrolü
        if (!credentials) return null;

        // Şema validasyonu
        const validated = LoginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;

        // Kullanıcıyı veritabanında bul
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.password) return null;

        // Şifre karşılaştır
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return null;

        return user;
      },
    }),
  ],

  // Oturum yapısı
  session: {
    strategy: "database",
  },

  // Sayfa yönlendirmeleri
  pages: {
    signIn: "/login",
  },
};

export default authConfig;
