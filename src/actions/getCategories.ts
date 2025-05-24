import { getCategories } from '@/actions/getCategories';

import { prisma } from "@/lib/prisma";
import { Category } from "@/types/category";

export async function getCategories(): Promise<Category[]> {
  try {
    // Prisma üzerinden veritabanından ürünleri al
    const categories = await prisma.category.findMany({
      take: 40, // İsteğe bağlı: İlk 12 ürünü getir
    });
    return categories; // Ürünleri döndür
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Hata durumunda boş bir dizi döndür
  }
}



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
