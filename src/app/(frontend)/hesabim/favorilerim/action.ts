"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function getUserFavorites() {
  const session = await getSession();
  if (!session?.user) return [];

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          medias: { include: { media: true } },
          brands: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return favorites.map((f) => f.product);
}
