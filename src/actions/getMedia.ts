import { prisma } from "@/lib/prisma";

export async function getMedias() {
    return await prisma.media.findMany({
      orderBy: {
        createdAt: "desc", // 🔥 en son yüklenen en önde
      },
    });
  }