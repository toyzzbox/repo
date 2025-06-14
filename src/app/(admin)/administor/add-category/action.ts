"use server";

import { prisma } from "@/lib/prisma";

export async function createCategory(_previousState: unknown, formData: FormData) {
  try {
    // Form verilerini al
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    // parentId boşsa null yap, doluysa string olarak al
    const rawParentId = formData.get("parentId");
    const parentId = typeof rawParentId === "string" && rawParentId.trim() !== "" ? rawParentId : null;

    // Çoklu medya ID'lerini al
    const mediaIds = formData.getAll("mediaIds[]") as string[];

    // Yeni kategori oluştur
    await prisma.category.create({
      data: {
        name,
        slug,
        description,
        ...(parentId && {
          parent: {
            connect: { id: parentId },
          },
        }),
        medias: {
          connect: mediaIds.map((id) => ({ id })),
        },
      },
    });

    return "Kategori başarıyla oluşturuldu.";
  } catch (error: any) {
    console.error("Kategori oluşturulurken hata oluştu:", error);
    return "Kategori oluşturma sırasında bir hata oluştu.";
  }
}
