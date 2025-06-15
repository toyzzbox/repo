"use server";

import { prisma } from "@/lib/prisma";
import  getServerSession  from "next-auth";
import { authConfig } from "@/auth.config"; // ✅ doğru

export async function toggleFavorite(productId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    throw new Error("Giriş yapmalısınız");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("Kullanıcı bulunamadı");

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId: user.id,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId: user.id,
          productId,
        },
      },
    });
    return { status: "removed" };
  } else {
    await prisma.favorite.create({
      data: {
        userId: user.id,
        productId,
      },
    });
    return { status: "added" };
  }
}
