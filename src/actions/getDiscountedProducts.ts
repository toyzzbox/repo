import { apiClient } from '@/lib/api-client';

export async function getDiscountedProducts() {
  try {
    return await apiClient.getDiscountedProducts();
  } catch (error) {
    console.error("İndirimli ürünler alınamadı:", error);
    return [];
  }
}