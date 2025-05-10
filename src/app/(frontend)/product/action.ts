"use server";

import { prisma } from "@/lib/prisma";

// Kullanılmadığı için bu tipi kaldırabiliriz.
// Eğer ileride form verilerini tiplemek için kullanacaksan, o zaman formData'dan gelen verileri bu tipe map ederek kullanabilirsin.
// Şimdilik kaldırıyoruz:
// type CreateProductArgs = {
//   name: string;
//   description: string;
//   price: number;
// };

// `any` yerine `unknown` kullanıyoruz ve formData olduğunu belirtiyoruz
export async function createProduct(_previousState: unknown, formData: FormData) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);

    // product değişkeni kullanılmadığı için direkt await ile işlem yapıyoruz
    await prisma.product.create({
      data: {
        name,
        description,
        price,
      },
    });

    return "Product created successfully";
  } catch (error) {
    // `error: any` yerine bilinmeyen hata tipini string'e çevirmeye çalışıyoruz
    console.error("Error creating product:", (error as Error).message);
    return "An error occurred: " + (error as Error).message;
  }
}
