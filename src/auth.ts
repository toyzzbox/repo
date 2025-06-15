import NextAuth from "next-auth";
import authConfig from "./auth.config"; // ✅ default export olmalı

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig); // ✅ tekrar adapter verme!
