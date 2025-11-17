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

export async function createBrand(_prev: any, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mediaId = formData.get("mediaId") as string | null;

    const slug = slugify(name);

    await prisma.brand.create({
      data: {
        name,
        description,
        slug,
        medias: mediaId
          ? {
              connect: { id: mediaId }, // M:N ilişkide doğru kullanım
            }
          : undefined,
      },
    });

    return "Brand created successfully";
  } catch (error: any) {
    console.error("Brand create error:", error);
    return "An error occurred: " + error.message;
  }
}
