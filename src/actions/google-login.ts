"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function googleAuthenticate() {
  try {
    await signIn("google");
  } catch (error) {
    if (error instanceof AuthError) {
      return "Google login failed";
    }
    throw error;
  }
}
