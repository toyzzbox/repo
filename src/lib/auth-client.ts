import { createAuthClient } from "better-auth/client";

export const { signIn, signOut, useSession } = createAuthClient({
  baseURL: "https://toyzzbox.com/api/auth",
});