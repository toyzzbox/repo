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

export async function createBrand(_previousState: unknown, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mediaIds = formData.getAll("mediaIds[]") as string[];

    const slug = slugify(name);

    await prisma.brand.create({
      data: {
        name,
        description,
        slug,

        // ⭐ DOĞRU ilişki oluşturma:
        medias: {
          create: mediaIds.map((mediaId) => ({
            media: { connect: { id: mediaId } },
          })),
        },
      },
    });

    return "Brand created successfully";
  } catch (error) {
    console.error("Error creating brand:", (error as Error).message);
    return "An error occurred: " + (error as Error).message;
  }
}
