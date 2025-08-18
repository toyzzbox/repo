import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: "https://toyzzbox.com/api",
});


export const { signIn, signUp, signOut } = authClient;