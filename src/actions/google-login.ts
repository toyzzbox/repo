"use server";

import { signIn } from "@/auth";

export async function googleAuthenticate() {
  try {
    await signIn("google");
  } catch (error) {
    if (error ) {
      return "Google login failed";
    }
    throw error;
  }
}
