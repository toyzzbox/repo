import { prisma } from "@/lib/prisma";

export async function getPopularProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      views: "desc", // views alanına göre popüler
    },
    group: {
        select: {
          name: true,
        },
      },
    take: 20, // ilk 20 ürün
    include: {
      medias: true,
      brands: true,
      categories: true,
    },
  });

  return products;
}
