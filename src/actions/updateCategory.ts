"use server";

import { prisma } from "@/lib/prisma";

export async function updateCategory(
  _previousState: unknown,
  formData: FormData
) {
  try {
    const id = formData.get("id") as string;
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    const rawParentId = formData.get("parentId");
    const parentId =
      typeof rawParentId === "string" && rawParentId.trim() !== ""
        ? rawParentId
        : null;

    const mediaIds = formData.getAll("mediaIds[]") as string[];

    await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        parent: parentId
          ? { connect: { id: parentId } }
          : { disconnect: true },
        medias: {
          set: mediaIds.map((id) => ({ id })),
        },
      },
    });

    return "Kategori başarıyla güncellendi.";
  } catch (error: any) {
    console.error("Kategori güncelleme hatası:", error);
    return "Kategori güncellenirken hata oluştu.";
  }
}
