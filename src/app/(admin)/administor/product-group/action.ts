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
