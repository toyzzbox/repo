"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function logout() {
  try {
    const cookieStore = await cookies(); // await ekleyin
    const sessionToken = cookieStore.get("session-token")?.value; // "session" yerine "session-token"

    if (sessionToken) {
      try {
        await prisma.session.delete({
          where: { sessionToken },
        });
      } catch (error) {
        console.error('Session delete error:', error);
      }
    }

    cookieStore.delete("session-token"); // "session" yerine "session-token"
  } catch (error) {
    console.error("Logout error:", error);
  }

  redirect("/login");
}