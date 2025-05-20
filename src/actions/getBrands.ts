
import { prisma } from "@/lib/prisma";
import { Brand } from "@/types/brand";


export async function getBrands(): Promise<Brand[]> {
  try {
    // Prisma üzerinden veritabanından ürünleri al
    const brands = await prisma.brand.findMany({
      take: 40, // İsteğe bağlı: İlk 12 ürünü getir
    });
    return brands; // Ürünleri döndür
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Hata durumunda boş bir dizi döndür
  }
}