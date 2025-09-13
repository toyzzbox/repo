import { apiClient } from '@/lib/api-client';

export async function getProducts() {
  try {
    return await apiClient.getProducts();
  } catch (error) {
    console.error('Ürünler alınamadı:', error);
    return [];
  }
}