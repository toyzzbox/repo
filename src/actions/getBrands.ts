
import { prisma } from "@/lib/prisma";
import { Brand } from "@/types/brand";

export async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await prisma.brand.findMany({
      include: {
        medias: true,
      },
    });

    return brands as Brand[];
  } catch (error) {
    console.error("Ürünler alınamadı:", error);
    return [];
  }
}
