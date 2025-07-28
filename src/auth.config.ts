import type { NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 gün
    updateAge: 24 * 60 * 60, // 24 saatte bir güncelle
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
  
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true, // Email ile hesap bağlama
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Boş credential kontrolü
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing credentials");
            return null;
          }

          // User bulma
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user) {
            console.log("User not found:", credentials.email);
            return null;
          }

          // Password kontrolü
          if (!user.password) {
            console.log("User has no password (OAuth user)");
            return null;
          }

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) {
            console.log("Invalid password for user:", credentials.email);
            return null;
          }

          console.log("User authenticated successfully:", user.email);

          // Return user object (PrismaAdapter ile uyumlu)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: user.image,
            emailVerified: user.emailVerified,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("🔐 SignIn callback triggered:", {
        provider: account?.provider,
        email: user?.email,
      });
      
      // Google OAuth için ek kontrol
      if (account?.provider === "google") {
        return true; // Google ile giriş her zaman kabul
      }
      
      // Credentials için
      if (account?.provider === "credentials") {
        return !!user; // User varsa true
      }
      
      return true;
    },

    async session({ session, user, token }) {
      console.log("📋 Session callback triggered:", {
        hasSession: !!session,
        hasUser: !!user,
        userEmail: user?.email || session?.user?.email,
      });

      // Database strategy kullanıyoruz, user parametresi mevcut
      if (session?.user && user) {
        session.user.id = user.id;
        session.user.role = (user as any).role;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
      }

      return session;
    },

    async jwt({ token, user, account }) {
      // Database strategy kullanıyoruz ama yine de JWT callback gerekebilir
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
  },

  events: {
    async signIn({ user, account, profile }) {
      console.log("✅ User signed in:", {
        provider: account?.provider,
        email: user?.email,
        userId: user?.id,
      });
    },
    
    async signOut({ session, token }) {
      console.log("👋 User signed out:", {
        email: session?.user?.email || token?.email,
      });
    },

    async createUser({ user }) {
      console.log("👤 New user created:", user.email);
    },
  },

  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
};