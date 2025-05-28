"use server";

import { prisma } from "@/lib/prisma";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function createProduct(_previousState: unknown, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const categoryIds = formData.getAll("categoryIds[]") as string[];
    const brandIds = formData.getAll("brandIds[]") as string[];
    const mediaIds = formData.getAll("mediaIds[]") as string[]; // ✅ burası yeni
    const attributeIds = formData.getAll("attributeIds[]") as string[];

    const slug = slugify(name);

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        slug,
        
        brands: {
          connect: brandIds.map((id) => ({ id })),
        },
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
        medias: {
          connect: mediaIds.map((id) => ({ id })), // ✅ medya ilişkisi burada kuruluyor
        },
        attributes: {
          connect: attributeIds.map((id) => ({ id })),
        },
      },
    });

    return "Product created successfully";
  } catch (error) {
    console.error("Error creating product:", (error as Error).message);
    return "An error occurred: " + (error as Error).message;
  }
}
