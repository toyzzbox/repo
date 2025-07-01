import type { Brand } from "./brand";

/* ----------------------------- Media Tipi ----------------------------- */

export type Media = {
  id: string;
  type: "image" | "video";
  urls: string[];       // Medya URL’leri (ör: farklı çözünürlüklerde)
  createdAt: string;
  updatedAt: string;
};

/* ---------------------------- Product Tipi ---------------------------- */

export type Product = {
  id: string;                // Ürünün benzersiz kimliği
  name: string;              // Ürün adı
  slug: string;              // URL dostu ad
  price: number;             // Fiyat
  description?: string;      // Opsiyonel açıklama
  discount?: number;         // Opsiyonel indirim miktarı
  createdAt?: Date;
  updatedAt?: Date;

  mediaIds?: string[];       // Form submit için seçili media ID dizisi
  medias?: Media[];          // Populate edilmiş medya nesneleri

  image?: string;            // Opsiyonel tekil görsel (eski kullanım için)
  brands: Brand[];           // İlişkili markalar
  group?: { name: string };  // Opsiyonel ürün grubu
};

/* ------------------------ LiteProduct Tipi ------------------------ */
/**
 * Listeleme veya basit kart view için optimize edilmiş ürün tipi.
 */

export type LiteProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  brands: { name: string }[];
  medias?: Media[];          // Medya dizisi eklenirse frontend’de url erişimi kolaylaşır
};

/* ------------------------ ProductCardType Tipi ------------------------ */
/**
 * ProductCard bileşeni için genişletilmiş tip.
 */

export type ProductCardType = Product & {
  group?: { name: string };
};

/* ------------------------ ProductWithMedia Tipi ------------------------ */
/**
 * API response veya SSR'de medya populate edilmiş ürün tipi.
 */

export type ProductWithMedia = {
  id: string;
  slug: string;
  name: string;
  price: number;
  medias: { urls: string[] }[]; // Medya dizisi (sadece urls kullanılıyorsa bu tip uygundur)
  group?: { name: string };
};

/* ------------------------ Sıralama Tipleri ------------------------ */

export type SortField = 'name' | 'price' | 'createdAt';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  field: SortField;
  order: SortOrder;
}
