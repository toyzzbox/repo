
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