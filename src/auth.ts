import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import google from "next-auth/providers/google";
import authConfig from "./auth.config";
import { prisma } from "./lib/prisma";


export const {handlers ,signIn, signOut, auth} = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [google],
    session: {strategy: "jwt"},
    ...authConfig,
})