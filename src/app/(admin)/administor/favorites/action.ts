import { auth } from "@/auth"; // 👈 src/auth.ts içinden geliyor
import { prisma } from "@/lib/prisma";

export async function toggleFavorite(productId: string) {
  const session = await auth();
  console.log("SESSION:", session);

  if (!session?.user?.id) {
    throw new Error("Giriş yapmalısınız");
  }

  const userId = session.user.id;

  const existing = await prisma.favorite.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (existing) {
    await prisma.favorite.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    return { status: "removed" };
  } else {
    await prisma.favorite.create({
      data: {
        userId,
        productId,
      },
    });
    return { status: "added" };
  }
}
