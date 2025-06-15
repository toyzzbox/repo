// src/actions/addComment.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface AddCommentFormState {
  message: string | null;
}

export async function addComment(
  prevState: AddCommentFormState,
  formData: FormData
): Promise<AddCommentFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { message: "Giriş yapmalısınız." };
  }

  const productId = formData.get("productId") as string;
  const content = formData.get("content") as string;
  const rating = Number(formData.get("rating"));

  if (!productId || !content || !rating) {
    return { message: "Tüm alanlar zorunludur." };
  }

  const existing = await prisma.comment.findFirst({
    where: {
      productId,
      userId: session.user.id,
    },
  });

  if (existing) {
    return { message: "Bu ürüne zaten yorum yaptınız." };
  }

  await prisma.comment.create({
    data: {
      content,
      rating,
      productId,
      userId: session.user.id,
    },
  });

  revalidatePath(`/products/${productId}`); // Sayfa tekrar valide edilsin

  return { message: null }; // success
}
