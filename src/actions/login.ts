"use server";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

// Session token oluştur
function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export async function loginUser(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, message: "Email ve şifre zorunludur" };
    }

    // Kullanıcıyı veritabanından bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: "Kullanıcı bulunamadı" };
    }

    // Şifre kontrolü (eğer schema'da password alanı varsa)
    if (user.password) {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return { success: false, message: "Geçersiz şifre" };
      }
    } else {
      return { success: false, message: "Bu hesap için şifre ile giriş yapılamaz" };
    }

    // Eski session'ları temizle
    await prisma.session.deleteMany({
      where: { userId: user.id },
    });

    // Yeni session oluştur
    const sessionToken = generateSessionToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 gün

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expiresAt: expiresAt, // ✅ doğru alan adı
      },
    });

    // Session cookie'yi ayarla
    const cookieStore = await cookies();
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 gün
      path: "/",
    });

    // Ana sayfaya yönlendir
    redirect("/dashboard"); // veya istediğiniz sayfa
    
  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Giriş yapılırken bir hata oluştu" };
  }
}