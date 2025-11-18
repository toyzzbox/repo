// src/actions/searchProducts.ts
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
      price: true, // 💰 LiveSearch'te fiyat gösteriyorsun, o yüzden burada şart
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
        take: 1, // 🔍 sadece ilk medyayı al
        include: {
          media: {
            select: {
              variants: {
                select: {
                  cdnUrl: true,
                  key: true,
                  width: true,
                  height: true,
                  format: true,
                },
              },
            },
          },
        },
      },
    },
    take: 10,
  });
}
