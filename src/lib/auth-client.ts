import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: "https://toyzzbox.com",
});


export const { signIn, signUp, signOut } = authClient;