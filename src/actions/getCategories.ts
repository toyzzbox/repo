import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type CategoryWithMedia = Prisma.CategoryGetPayload<{
  include: {
    medias: {
      include: {
        variants: {
          select: { cdnUrl: true; key: true; type: true };
        };
      };
    };
  };
}>;

export async function getCategories(): Promise<CategoryWithMedia[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        medias: {
          include: {
            variants: {
              select: { cdnUrl: true, key: true, type: true },
            },
          },
        },
      },
    });

    return categories;
  } catch (error) {
    console.error("Kategoriler alınamadı:", error);
    return [];
  }
}
