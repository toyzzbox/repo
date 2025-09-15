import { apiClient } from '@/lib/api-client';

export async function getPopularProducts() {
  try {
    return await apiClient.getPopularProducts();
  } catch (error) {
    console.error("Popüler ürünler alınamadı:", error);
    return [];
  }
}