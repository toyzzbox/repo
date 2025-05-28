
import { prisma } from "@/lib/prisma";
import type { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      include: {
        medias: true,
      },
    });

    return products as Product[];
  } catch (error) {
    console.error("Ürünler alınamadı:", error);
    return [];
  }
}
