"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createComment(
  productId: string,
  content: string,
  rating: number
) {
  const session = await auth();

  if (!session?.user?.id) {
    return { status: "error", message: "Giriş yapmalısınız" };
  }

  try {
    await prisma.comment.create({
      data: {
        productId,
        content,
        rating,
        userId: session.user.id,
      },
    });

    return { status: "success" };
  } catch (error) {
    console.error("Yorum ekleme hatası:", error);
    return { status: "error", message: "Yorum eklenemedi" };
  }
}
