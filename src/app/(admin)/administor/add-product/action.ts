"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";

/** Yardımcı: Seçilen kategorilerin tüm ata-kimliklerini döndürür */
async function collectAncestorIds(initialIds: string[]): Promise<string[]> {
  const allIds = new Set<string>(initialIds);
  const stack = [...initialIds];           // DFS / BFS için kuyruk

  while (stack.length > 0) {
    const id = stack.pop()!;
    const { parentId } = await prisma.category.findUnique({
      where: { id },
      select: { parentId: true },
    }) ?? {};

    if (parentId && !allIds.has(parentId)) {
      allIds.add(parentId);
      stack.push(parentId);                // bir üst basamağı da ara
    }
  }
  return [...allIds];                      // dizi olarak dön
}

const schema = z.object({
  groupId: z.string().optional(),
  name: z.string().min(1),
  serial: z.string().optional(),
  stock: z.coerce.number().optional(),
  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).optional(),
  brandIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  mediaIds: z.array(z.string()).default([]),
  description: z.string().optional(),
});

export async function createProduct(prevState: any, formData: FormData) {
  try {
    // 1️⃣ Form verisini oku & doğrula
    const raw = {
      groupId: formData.get("groupId") || undefined,
      name: formData.get("name"),
      serial: formData.get("serial") || undefined,
      stock: formData.get("stock"),
      price: formData.get("price"),
      discount: formData.get("discount"),
      brandIds: formData.getAll("brandIds[]"),
      categoryIds: formData.getAll("categoryIds[]"),
      mediaIds: formData.getAll("mediaIds[]"),
      description: formData.get("description")?.toString() || undefined,
    };
    const data = schema.parse(raw);


    console.log("mediaIds:", data.mediaIds);
    // 2️⃣ Kategori zincirini genişlet
    const fullCategoryIds = await collectAncestorIds(data.categoryIds as string[]);

    // 3️⃣ Slug oluştur
    const slug = slugify(`${data.name}-${data.serial || Date.now()}`, {
      lower: true,
      strict: true,
    });

    // 4️⃣ Ürünü kaydet
    await prisma.product.create({
      data: {
        name: data.name,
        slug,
        serial: data.serial || undefined,
        stock: typeof data.stock === "number" ? data.stock : undefined,
        price: data.price,
        discount: typeof data.discount === "number" ? data.discount : undefined,
        description: data.description,
        group: data.groupId ? { connect: { id: data.groupId } } : undefined,
        medias: data.mediaIds.length
          ? { connect: data.mediaIds.map((id) => ({ id })) }
          : undefined,
        brands: data.brandIds.length
          ? { connect: data.brandIds.map((id) => ({ id })) }
          : undefined,
        categories: fullCategoryIds.length
          ? { connect: fullCategoryIds.map((id) => ({ id })) }
          : undefined,
      },
    });

    return null; // başarı
  } catch (err) {
    console.error("Ürün oluşturulurken hata:", err);
    return "Ürün oluşturulurken bir hata oluştu.";
  }
}
