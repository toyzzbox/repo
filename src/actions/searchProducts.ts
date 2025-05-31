'use server';

import { prisma } from "@/lib/prisma";

export async function searchProducts(query: string) {
  if (!query.trim()) return [];

  return await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        {
          categories: {
            some: { name: { contains: query, mode: "insensitive" } },
          },
        },
        {
          brand: {
            name: { contains: query, mode: "insensitive" },
          },
        },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      brand: { select: { name: true } },
      categories: { select: { name: true } },
      medias: { select: { urls: true }, take: 1 },
    },
    take: 10,
  });
}
