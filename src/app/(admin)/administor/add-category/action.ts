"use server";

import { prisma } from "@/lib/prisma";

export async function createCategory(_previousState: unknown, formData: FormData) {
  try {
    // 🧩 Form verilerini al
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const rawParentId = formData.get("parentId");
    const orderValue = formData.get("order");
    const order = orderValue ? Number(orderValue) : 0;

    // parentId boşsa null yap
    const parentId =
      typeof rawParentId === "string" && rawParentId.trim() !== ""
        ? rawParentId
        : null;

    // Çoklu medya ID'lerini al
    const mediaIds = formData.getAll("mediaIds[]") as string[];

    // 🧠 Eğer parent varsa, alt kategorinin order değeri parent’tan küçük olamaz
    if (parentId) {
      const parent = await prisma.category.findUnique({
        where: { id: parentId },
        select: { order: true },
      });

      if (!parent) {
        throw new Error("Parent kategori bulunamadı.");
      }

      // Eğer alt kategorinin order'ı parent'tan küçükse, parent'tan sonra olacak şekilde düzelt
      const finalOrder = order <= parent.order ? parent.order + 1 : order;

      // ✅ Yeni kategori oluştur
      await prisma.category.create({
        data: {
          name,
          slug,
          description,
          order: finalOrder, // 👈 düzeltme yapılmış değer
          parent: {
            connect: { id: parentId },
          },
          medias: {
            connect: mediaIds.map((id) => ({ id })),
          },
        },
      });
    } else {
      // 🟢 Parent yoksa (yani ana kategori)
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
