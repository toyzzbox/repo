// src/actions/productActions.ts

import { prisma } from "@/lib/prisma";

export async function getRelatedProducts(productId: string, categoryIds: string[]) {
  if (!categoryIds.length) return [];

  return await prisma.product.findMany({
    where: {
      id: { not: productId },
      categories: {
        some: {
          id: { in: categoryIds },
        },
      },
    },
    take: 12,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      medias: {
        orderBy: { order: "asc" },
        take: 1,
        include: {
          media: {
            select: {
              urls: true,
            },
          },
        },
      },
    },
  });
}
