// lib/session.ts
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function getSession() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("sessionToken")?.value;
    
    if (!sessionToken) {
      return null;
    }
    
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true }
    });
    
    if (!session || session.expiresAt <= new Date()) {
      // Süresi dolmuş session'ı temizle
      if (session) {
        await prisma.session.delete({
          where: { sessionToken }
        });
      }
      return null;
    }
    
    return session;
  } catch (error) {
    console.error("Session kontrolü hatası:", error);
    return null;
  }
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }
}