import NextAuth from "auth";
import authConfig from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth(authConfig);