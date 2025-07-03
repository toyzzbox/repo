"use server";

import { prisma } from "@/lib/prisma";

/**
 * En son eklenen 20 indirimli ürünü getirir.
 * İndirimli ürün = discount > 0 && discount < price
 */
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
      // Discount, price'dan küçük olmalı
      AND: [
        {
          discount: {
            lt: {
              path: ["price"],
            },
          },
        },
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    include: {
      medias: true,
      group: true,
    },
  });

  return products;
}
