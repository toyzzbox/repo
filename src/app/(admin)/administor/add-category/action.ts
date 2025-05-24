"use server";

import { prisma } from "@/lib/prisma";

// createCategory fonksiyonu
export async function createCategory(_previousState: unknown, formData: FormData) {
  try {
    // FormData'dan değerleri al
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const parentId = formData.get("parentId") as string | null; // parentId null olabilir
    const mediaIds = formData.getAll("mediaIds[]") as string[]; // ✅ burası yeni

    // Kategori oluşturma
    await prisma.category.create({
      data: {
        slug,
        name,
        description,
        parentId: parentId || null,
        medias: {
          connect: mediaIds.map((id) => ({ id })), // ✅ medya ilişkisi burada kuruluyor
        },
      },
    });

    return "Kategori başarıyla oluşturuldu.";
  } catch (error) {
    console.error("Error creating category:", error);
    return "Kategori oluşturma sırasında bir hata oluştu.";
  }
}





   