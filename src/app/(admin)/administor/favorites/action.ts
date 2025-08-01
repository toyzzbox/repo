"use server";


import { prisma } from "@/lib/prisma";

export async function toggleFavorite(productId: string) {



  const existing = await prisma.favorite.findUnique({
    where: {
      userId_productId: { productId },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: { userId_productId: { productId } },
    });
    return { status: "removed" };
  } else {
    await prisma.favorite.create({
      data: { productId },
    });
    return { status: "added" };
  }
}
