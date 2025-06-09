"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";

const schema = z.object({
  id: z.string(), // ✅ Güncelleme için gerekli
  name: z.string().min(1),
  description: z.string().optional(),
  serial: z.string().optional(),
});

export async function updateProductGroup(prevState: any, formData: FormData) {
  try {
    const raw = {
      id: formData.get("id"),
      name: formData.get("name"),
      description: formData.get("description")?.toString() || undefined,
      serial: formData.get("serial") || undefined,
    };

    const data = schema.parse(raw);

    const slug = slugify(`${data.name}-${data.serial || Date.now()}`, {
      lower: true,
      strict: true,
    });

    await prisma.productGroup.update({
      where: { id: data.id },
      data: {
        name: data.name,
        slug,
        description: data.description,
      },
    });

    return null;
  } catch (err: any) {
    console.error("Grup güncellenirken hata:", err);
    return "Grup güncellenirken bir hata oluştu.";
  }
}
