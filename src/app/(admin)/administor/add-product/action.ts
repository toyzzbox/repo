"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";

const schema = z.object({
  groupId: z.string().min(1),
  name: z.string().min(1),
  serial: z.string().min(1),
  stock: z.coerce.number().min(0),
  price: z.coerce.number().min(0),
  description: z.string().optional(),
  brandIds: z.array(z.string()).optional(),
  categoryIds: z.array(z.string()).optional(),
  mediaIds: z.array(z.string()).optional(),
});

export async function createProduct(prevState: any, formData: FormData) {
  try {
    const raw = {
      groupId: formData.get("groupId"),
      name: formData.get("name"),
      serial: formData.get("serial"),
      stock: formData.get("stock"),
      price: formData.get("price"),
      description: formData.get("description"),
      brandIds: formData.getAll("barandIds[]"),
      categoryIds: formData.getAll("categoryIds[]"),
      mediaIds: formData.getAll("mediaIds[]"),
    };

    const data = schema.parse(raw);

    const slug = slugify(`${data.name}-${data.serial}`, {
      lower: true,
      strict: true,
    });

    const created = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        serial: data.serial,
        stock: data.stock,
        price: data.price,
        description: data.description,
        group: { connect: { id: data.groupId } },
        medias: {
          connect: data.mediaIds.map((id) => ({ id })),
        },
        brands: {
          connect: data.brandIds.map((id) => ({ id })),
        },
        categories: {
          connect: data.categoryIds.map((id) => ({ id })),
        },
      },
    });

    return null; // başarıyla tamamlandı

  } catch (err: any) {
    console.error("Ürün oluşturulurken hata:", err);
    return "Ürün oluşturulurken bir hata oluştu.";
  }
}
