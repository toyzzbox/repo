import { betterAuth } from "better-auth";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://toyzzbox.com",
  trustedOrigins: ["https://toyzzbox.com"], // HTTPS domain'inizi ekleyin
  // SSL sorunları için:
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
  },
});