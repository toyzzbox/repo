"use server";

import { prisma } from "@/lib/prisma";

export async function createCategory(_prev: unknown, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;

    const rawParentId = formData.get("parentId");
    const orderValue = formData.get("order");
    const order = orderValue ? Number(orderValue) : 0;

    // 🟢 parentId boşsa null
    const parentId =
      typeof rawParentId === "string" && rawParentId.trim() !== ""
        ? rawParentId
        : null;

    // 🟢 Çoklu medya
    const mediaIds = formData.getAll("mediaIds[]") as string[];

    // ======================================================
    // 🟡 ALT KATEGORİ İSE → order kontrolü
    // ======================================================
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
        select: { order: true },
      });

      if (!parent) throw new Error("Parent kategori bulunamadı.");

      // Alt kategori sırası parent'ın üstüne çıkamaz
      const finalOrder = order <= parent.order ? parent.order + 1 : order;

      await prisma.category.create({
        data: {
          name,
          slug,
          description,
          order: finalOrder,

          parent: {
            connect: { id: parentId },
          },

          medias: {
            connect: mediaIds.map((id) => ({ id })),
          },
        },
      });
    }

    // ======================================================
    // 🟢 ANA KATEGORİ İSE
    // ======================================================
    else {
      await prisma.category.create({
        data: {
          name,
          slug,
          description,
          order,

          medias: {
            connect: mediaIds.map((id) => ({ id })),
          },
        },
      });
    }

    return "Kategori başarıyla oluşturuldu.";

  } catch (error: any) {
    console.error("Kategori oluşturulurken hata oluştu:", error);
    return error.message || "Kategori oluşturma sırasında bir hata oluştu.";
  }
}
