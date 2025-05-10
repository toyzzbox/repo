"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Slug oluşturma fonksiyonu
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
    .replace(/[^\w\-]+/g, "") // Alfanümerik olmayan karakterleri kaldır
    .replace(/\-\-+/g, "-"); // Birden fazla tireyi tek tireye indir
}

export const addProduct = async (formData: FormData): Promise<void> => {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = formData.get("price");

  if (!name) {
    throw new Error("Ürün adı gerekli.");
  }

  if (!price || isNaN(Number(price))) {
    throw new Error("Geçerli bir fiyat girin.");
  }

  // Slug oluştur
  const slug = slugify(name);

  // Prisma ile ürünü kaydet
  await prisma.product.create({
    data: {
      name,
      description,
      price: Number(price),
      slug, // slug alanını ekledik
    },
  });

  // Path revalidate işlemi
  revalidatePath("/servis");
};
