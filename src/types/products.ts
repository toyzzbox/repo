export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    originalPrice: number | null;
    stockQuantity: number | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ProductMedia {
    id: string;
    url: string;
    altText: string | null;
    productId: string;
  }
  
  export interface ProductWithMedia extends Product {
    medias: ProductMedia[];
  }