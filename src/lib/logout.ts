"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function logout() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("session")?.value; // cookie adı senin session ile eşleşmeli

  if (sessionToken) {
    // DB’den session sil
    await prisma.session.deleteMany({
      where: { sessionToken },
    });

    // Cookie sil
    cookieStore.delete("session");
  }

  // Çıkış sonrası login sayfasına yönlendir
  redirect("/login");
}
