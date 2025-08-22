
"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function logoutAction() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (sessionToken) {
      // Database'den session'ı sil
      await prisma.session.deleteMany({
        where: { sessionToken },
      });
    }

    // Cookie'yi sil
    cookieStore.delete("session");
  } catch (error) {
    console.error("Logout error:", error);
  }

  // Login sayfasına yönlendir
  redirect("/login");
}