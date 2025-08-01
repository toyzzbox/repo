import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "/api/auth",
});

export const { signIn, signUp, useSession } = authClient;
export { authClient };