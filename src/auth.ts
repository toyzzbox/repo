import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const {
  handlers: { GET, POST }, // ✅ bunu export etmeliyiz
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
