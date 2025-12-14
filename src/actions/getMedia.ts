import { prisma } from "@/lib/prisma";

export async function getMedias() {
  const medias = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      variants: {
        select: {
          cdnUrl: true,
          key: true,
          type: true,
        },
      },
    },
  });

  return medias.map((m) => ({
    ...m,
    urls: m.variants.map((v) => v.cdnUrl), // ✅ eski urls yerine
  }));
}
