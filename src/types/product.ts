import { Brand } from "./brand";

export type Product = {
	id: string; // Ürünün benzersiz kimliği
	url?: string;
	name: string; // Ürün adı
	price: number; // Ürün fiyatı
	slug: string; // Ürün için kullanılacak URL dostu ad
	description?: string; // Ürün açıklaması (isteğe bağlı)
	image?: string; // Ürün resmi URL'si (isteğe bağlı)
	createdAt?: Date; // Ürünün oluşturulma tarihi (isteğe bağlı)
	updatedAt?: Date; // Ürünün güncellenme tarihi (isteğe bağlı)
	urls: string[];
  mediaIds: string[];
  brands: Brand[];
  };


  export type SortField = 'name' | 'price' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}