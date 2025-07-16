import { prisma } from "@/lib/prisma";

export async function searchProducts(query: string) {
  return prisma.product.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive", // büyük-küçük harf farkı gözetmez
      },
    },
    include: {
      medias: {
        select: { urls: true },
        take: 1,
      },
      group: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
}
