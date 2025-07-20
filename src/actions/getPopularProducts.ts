import { prisma } from "@/lib/prisma";

export async function getPopularProducts() {
  const products = await prisma.product.findMany({
    orderBy: {
      views: "desc", // views alanına göre popüler
    },
    take: 20, // ilk 20 ürün
    include: {
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
      brands: true,
      categories: true,
      group: {
        select: {
          name: true,
        },
      },
    },
  });

  return products;
}
