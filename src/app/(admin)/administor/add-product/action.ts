"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";

// ✅ Opsiyonel alanlara uygun Zod şeması
const schema = z.object({
  groupId: z.string().optional(),
  name: z.string().min(1),
  serial: z.string().optional(),
  stock: z.coerce.number().optional(),
  price: z.coerce.number().min(0),
  description: z.string().optional(),
  brandIds: z.array(z.string()).default([]),
  categoryIds: z.array(z.string()).default([]),
  mediaIds: z.array(z.string()).default([]),
});

export async function createProduct(prevState: any, formData: FormData) {
  try {
    // ✅ Form verisini al
    const raw = {
      groupId: formData.get("groupId") || undefined,
      name: formData.get("name"),
      serial: formData.get("serial") || undefined,
      stock: formData.get("stock"),
      price: formData.get("price"),
      description: formData.get("description") || undefined,
      brandIds: formData.getAll("brandIds[]"),
      categoryIds: formData.getAll("categoryIds[]"),
      mediaIds: formData.getAll("mediaIds[]"),
    };

    // ✅ Zod ile doğrula
    const data = schema.parse(raw);

    // ✅ Slug oluştur
    const slug = slugify(`${data.name}-${data.serial || Date.now()}`, {
      lower: true,
      strict: true,
    });

    // ✅ Ürünü oluştur
    await prisma.product.create({
      data: {
        name: data.name,
        slug,
        serial: data.serial || undefined,
        stock: typeof data.stock === "number" ? data.stock : undefined,
        price: data.price,
        description: data.description || undefined,
        group: data.groupId ? { connect: { id: data.groupId } } : undefined,
        medias: data.mediaIds.length > 0 ? {
          connect: data.mediaIds.map((id) => ({ id })),
        } : undefined,
        brands: data.brandIds.length > 0 ? {
          connect: data.brandIds.map((id) => ({ id })),
        } : undefined,
        categories: data.categoryIds.length > 0 ? {
          connect: data.categoryIds.map((id) => ({ id })),
        } : undefined,
      },
    });

    return null; // ✅ Başarı

  } catch (err: any) {
    console.error("Ürün oluşturulurken hata:", err);
    return "Ürün oluşturulurken bir hata oluştu.";
  }
}
