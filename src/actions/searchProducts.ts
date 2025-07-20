'use server';

import { prisma } from "@/lib/prisma";

export async function searchProducts(query: string) {
  if (!query.trim()) return [];

  return await prisma.product.findMany({
    where: {
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          categories: {
            some: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        },
        {
          brands: {
            some: {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      brands: {
        select: {
          name: true,
        },
      },
      categories: {
        select: {
          name: true,
        },
      },
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
    take: 10,
  });
}
