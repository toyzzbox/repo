import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL || "https://toyzzbox.com", // ✅ daha güvenli ve env destekli
});