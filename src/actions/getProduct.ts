import { prisma } from "@/lib/prisma";
import { Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  try {
    const products = await prisma.product.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        discount: true,
        medias: {
          orderBy: { order: "asc" },
          include: {
            media: {
              select: {
                id: true,
                urls: true,
              },
            },
          },
        },
        group: {
          select: {
            name: true,
          },
        },
      },
    });

    return products as Product[];
  } catch (error) {
    console.error("Ürünler alınamadı:", error);
    return [];
  }
}
