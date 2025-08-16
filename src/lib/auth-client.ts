import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "https://toyzzbox.com",
  fetchOptions: {
    onError(e) {
      if (e.error.status === 429) {
        console.warn("Rate limit exceeded")
      }
    }
  }
})

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  getSession
} = authClient