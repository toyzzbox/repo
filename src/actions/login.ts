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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Email ve şifre zorunludur" };
  }

  try {
    // Kullanıcıyı veritabanından bul
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, message: "Kullanıcı bulunamadı" };
    }

    // Şifre kontrolü
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
    expiresAt.setDate(expiresAt.getDate() + 30);

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Session cookie'yi ayarla - await EKLENDİ
    const cookieStore = await cookies(); // ✅ await eklendi
    cookieStore.set("session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

  } catch (err) {
    console.error("Login error:", err);
    return { success: false, message: "Giriş yapılırken bir hata oluştu" };
  }

  // Başarı durumunda yönlendirme
  redirect("/dashboard");
}