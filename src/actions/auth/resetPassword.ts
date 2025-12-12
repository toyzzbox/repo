"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/* =====================
   TYPES
===================== */

export type ResetPasswordResult = {
  error: string | null;
  success: string | null;
};

/* =====================
   RESET PASSWORD ACTION
===================== */

export async function resetPassword(
  _prevState: ResetPasswordResult,
  formData: FormData
): Promise<ResetPasswordResult> {
  try {
    const token = formData.get("token");
    const password = formData.get("password");

    if (!token || typeof token !== "string") {
      return { error: "Geçersiz veya eksik token.", success: null };
    }

    if (!password || typeof password !== "string") {
      return { error: "Şifre alanı zorunludur.", success: null };
    }

    if (password.length < 6) {
      return {
        error: "Şifre en az 6 karakter olmalıdır.",
        success: null,
      };
    }

    /* =====================
       TOKEN KONTROLÜ
    ===================== */

    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      return { error: "Şifre sıfırlama linki geçersiz.", success: null };
    }

    if (resetToken.expiresAt < new Date()) {
      return {
        error: "Şifre sıfırlama linkinin süresi dolmuş.",
        success: null,
      };
    }

    /* =====================
       ŞİFRE GÜNCELLE
    ===================== */

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: resetToken.userId },
        data: {
          password: hashedPassword,
        },
      }),

      // 🔐 Token tek kullanımlık
      prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      }),
    ]);

    return {
      success: "Şifreniz başarıyla güncellendi. Giriş yapabilirsiniz.",
      error: null,
    };
  } catch (error) {
    console.error("resetPassword error:", error);
    return {
      error: "Bir hata oluştu. Lütfen tekrar deneyin.",
      success: null,
    };
  }
}
