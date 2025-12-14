import { prisma } from "@/lib/prisma";
import { VariantType } from "@prisma/client";

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
              variants: {
                where: {
                  type: VariantType.ORIGINAL, // istersen WEBP yap
                },
                select: {
                  cdnUrl: true,
                  key: true,
                  type: true,
                },
                take: 1,
              },
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
