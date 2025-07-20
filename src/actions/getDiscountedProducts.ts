import { prisma } from "@/lib/prisma";

export async function getDiscountedProducts() {
  const products = await prisma.product.findMany({
    where: {
      discount: {
        not: null,
        gt: 0,
      },
      price: {
        gt: 0,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
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
      group: {
        select: {
          name: true,
        },
      },
    },
  });

  return products;
}
