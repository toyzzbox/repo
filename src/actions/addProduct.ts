"use server";


import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";



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


  // Prisma ile ürünü kaydet
  await prisma.product.create({
    data: {

      name: name,
      description: description,
      price: Number(price),

    },
  });

  // Path revalidate işlemi
  revalidatePath("/servis");
};
