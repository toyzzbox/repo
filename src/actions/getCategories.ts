
import { prisma } from "@/lib/prisma";
import { Category } from "@/types/category";




export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      include: {
        medias: true,
      },
    });

    return categories as Category[];
  } catch (error) {
    console.error("Ürünler alınamadı:", error);
    return [];
  }
}
