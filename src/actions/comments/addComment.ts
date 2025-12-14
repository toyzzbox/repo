// src/actions/addComment.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

interface AddCommentFormState {
  message: string | null;
}

export async function addComment(
  prevState: AddCommentFormState,
  formData: FormData
): Promise<AddCommentFormState> {
  const user = await getCurrentUser();
  if (!user) {
    return { message: "Yorum yapmak için giriş yapmalısınız." };
  }

  const productId = formData.get("productId") as string;
  const content = (formData.get("content") as string)?.trim();
  const ratingRaw = formData.get("rating");
  const rating = Number(ratingRaw);

  if (!productId || !content || !Number.isFinite(rating) || rating < 1 || rating > 5) {
    return { message: "Tüm alanlar zorunludur. (Puan 1-5 arası olmalı)" };
  }

  // ✅ Aynı kullanıcı aynı ürüne tekrar yorum yapamasın
  const existing = await prisma.comment.findFirst({
    where: {
      productId,
      userId: user.id,
    },
    select: { id: true },
  });

  if (existing) {
    return { message: "Bu ürüne zaten yorum yaptınız." };
  }

  await prisma.comment.create({
    data: {
      content,
      rating,
      productId,
      userId: user.id, // ✅ zorunlu alan
    },
  });

  revalidatePath(`/products/${productId}`);

  return { message: null };
}
