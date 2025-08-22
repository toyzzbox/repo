import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
}

// Mevcut kullanıcıyı getir
export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (!sessionToken) {
      return null;
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (!session || session.expires < new Date()) {
      // Süresi dolmuş session'ı temizle
      if (session) {
        await prisma.session.delete({
          where: { sessionToken },
        });
      }
      return null;
    }

    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      emailVerified: session.user.emailVerified,
      image: session.user.image,
    };
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

// Çıkış yap
export async function logout() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (sessionToken) {
      // Database'den session'ı sil
      await prisma.session.delete({
        where: { sessionToken },
      });
    }

    // Cookie'yi sil
    cookieStore.delete("session");
  } catch (error) {
    console.error("Logout error:", error);
  }
}

// Session kontrolü
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}