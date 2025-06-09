// app/admin/product-groups/action.ts

"use server";

import { prisma } from "@/lib/prisma";
import slugify from "slugify";

export async function createProductGroup(prevState: any, formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  if (!name) return "Grup adı gerekli";

  const slug = slugify(name, { lower: true });

  const existing = await prisma.productGroup.findUnique({ where: { slug } });
  if (existing) return "Bu grup zaten var";

  await prisma.productGroup.create({
    data: {
      name,
      slug,
    },
  });

  return null;
}


"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import slugify from "slugify";

const schema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  serial: z.string().optional(),

});

export async function createProductGroup(prevState: any, formData: FormData) {
  try {
    const raw = {
      name: formData.get("name"),
      description: formData.get("description")?.toString() || undefined,
      serial: formData.get("serial") || undefined,


    };

    const data = schema.parse(raw);


    const slug = slugify(`${data.name}-${data.serial || Date.now()}`, {
      lower: true,
      strict: true,
    });

    await prisma.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
       
      },
    });

    return null;
  } catch (err: any) {
    console.error("Ürün oluşturulurken hata:", err);
    return "Ürün oluşturulurken bir hata oluştu.";
  }
}
