"use server";

import { prisma } from "@/lib/prisma";

// Basit bir slugify fonksiyonu
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
    .replace(/[^\w\-]+/g, "") // Alfanümerik olmayan karakterleri kaldır
    .replace(/\-\-+/g, "-"); // Birden fazla tireyi tek tireye indir
}

export async function createBrand(_previousState: unknown, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const mediaIds = formData.getAll("mediaIds[]") as string[]; // ✅ burası yeni

    // slug değerini oluştur
    const slug = slugify(name);

    await prisma.brand.create({
      data: {
        name,
        description,
        slug,
        medias: {
          connect: mediaIds.map((id) => ({ id })), // ✅ medya ilişkisi burada kuruluyor
        },
      },
    });

    return "Brand created successfully";
  } catch (error) {
    console.error("Error creating product:", (error as Error).message);
    return "An error occurred: " + (error as Error).message;
  }
}
