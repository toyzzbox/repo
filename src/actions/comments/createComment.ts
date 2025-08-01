"use server";

import { prisma } from "@/lib/prisma";


export async function createComment(
  productId: string,
  content: string,
  rating: number
) {



  try {
    await prisma.comment.create({
      data: {
        productId,
        content,
        rating,

      },
    });

    return { status: "success" };
  } catch (error) {
    console.error("Yorum ekleme hatası:", error);
    return { status: "error", message: "Yorum eklenemedi" };
  }
}
