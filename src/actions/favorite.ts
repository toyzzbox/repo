"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";


export async function toggleFavorite(productId: string) {
  const session = await getSession();
  if (!session?.user) throw new Error("Not authenticated");

  const userId = session.user.id;

  const existing = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    return { status: "removed", productId };
  } else {
    await prisma.favorite.create({ data: { userId, productId } });
    return { status: "added", productId };
  }
}
