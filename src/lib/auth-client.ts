import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "/api/auth",
  trustedOrigins: ["https://yourdomain.com"], // HTTPS domain'inizi ekleyin
  // SSL sorunları için:
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
}});

