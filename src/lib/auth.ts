import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  baseURL: process.env.BETTER_AUTH_URL || "https://toyzzbox.com",
  secret: process.env.BETTER_AUTH_SECRET!,
  trustProxy: true,
});