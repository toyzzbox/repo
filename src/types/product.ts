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
  mediaIds?: string[];
  brands: Brand[];
  medias?: Media[]; // ✅ doğru isimlendirme
  group?: {
    name: string;
  }; // ✅
};


  type LiteProduct = {
	id: string;
	name: string;
	slug: string;
	price: number;
	urls: string[];
	brands: { name: string }[];
  };


  export type ProductCardType = Product & {
	group?: { name: string };
  };


  export type ProductWithMedia = {
	id: string;
	slug: string;
	name: string;
	price: number;
	medias: { urls: string[] }[];
	group?: { name: string };
  };


  export type Media = {
	id: string;
	type: "image" | "video";
	urls: string[];
	createdAt: string;
	updatedAt: string;
  };


  export type SortField = 'name' | 'price' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}



