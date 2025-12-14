"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function createComment(
  productId: string,
  content: string,
  rating: number
) {
  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Yorum yapmak için giriş yapmalısınız." };
  }

  const trimmed = (content ?? "").trim();
  if (!productId || !trimmed || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Geçersiz veri. (Puan 1-5 arası olmalı)" };
  }

  try {
    // ✅ Aynı kullanıcı aynı ürüne tekrar yorum yapamasın
    const existing = await prisma.comment.findFirst({
      where: {
        productId,
        userId: user.id,
      },
      select: { id: true },
    });

    if (existing) {
      return { status: "error", message: "Bu ürüne zaten yorum yaptınız." };
    }

    await prisma.comment.create({
      data: {
        productId,
        content: trimmed,
        rating,
        userId: user.id, // ✅ zorunlu alan
      },
    });

    return { status: "success" };
  } catch (error) {
    console.error("Yorum ekleme hatası:", error);
    return { status: "error", message: "Yorum eklenemedi" };
  }
}
