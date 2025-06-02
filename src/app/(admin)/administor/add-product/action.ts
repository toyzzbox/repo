"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";

// ✅ Gerekli alanlar için şema tanımı
const schema = z.object({
  groupId: z.string().min(1),
  name: z.string().min(1),
  serial: z.string().min(1),
  stock: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  description: z.string().optional(),
  brandIds: z.array(z.string()).default([]),     // ✅ boş da gelse array olur
  categoryIds: z.array(z.string()).default([]),
  mediaIds: z.array(z.string()).default([]),
});

export async function createProduct(prevState: any, formData: FormData) {
  try {
    // ✅ Form verisini al
    const raw = {
      groupId: formData.get("groupId"),
      name: formData.get("name"),
      serial: formData.get("serial"),
      stock: formData.get("stock"),
      price: formData.get("price"),
      description: formData.get("description"),
      brandIds: formData.getAll("brandIds[]"),
      categoryIds: formData.getAll("categoryIds[]"),
      mediaIds: formData.getAll("mediaIds[]"),
    };

    // ✅ Zod ile doğrula
    const data = schema.parse(raw);

    // ✅ Slug oluştur
    const slug = slugify(`${data.name}-${data.serial}`, {
      lower: true,
      strict: true,
    });

    // ✅ Ürünü oluştur
    await prisma.product.create({
      data: {
        name: data.name,
        slug,
        serial: data.serial,
        stock: data.stock,
        price: data.price,
        description: data.description,
        group: { connect: { id: data.groupId } },
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
