import { prisma } from "@/lib/prisma";

export async function getMedias() {
  const medias = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return medias.map(m => ({
    ...m,
    urls: m.urls.map(u => u.replace(/[{}]/g, "")), // {} karakterlerini temizle
  }));
}