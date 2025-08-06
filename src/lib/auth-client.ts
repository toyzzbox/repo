import { createAuthClient } from "better-auth/react";
 
export const authClient = createAuthClient({
    baseURL: "https://toyzzbox.com",// Optional if the API base URL matches the frontend
});
 
export const { signIn, signOut, useSession } = authClient;