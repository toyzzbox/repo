// types/next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
      role?: "admin" | "user";
    };
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    password?: string | null;
    role?: "admin" | "user";
  }
}
