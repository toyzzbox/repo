import { apiClient } from "@/lib/api-client";
import { Brand } from "@/types/brand";

export async function getBrands(): Promise<Brand[]> {
  try {
    const brands = await apiClient.getBrands(); // Backend'e API çağrısı
    return brands;
  } catch (error) {
    console.error("Markalar alınamadı:", error);
    return [];
  }
}