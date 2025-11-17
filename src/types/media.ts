export type MediaVariant = {
    id: string;
    key: string;
    cdnUrl: string;
    format?: string | null;
    width?: number | null;
    height?: number | null;
    size?: number | null;
    type: string; // VariantType enum
  };
  
  export type Media = {
    id: string;
    type: string;
    title?: string | null;
    description?: string | null;
    altText?: string | null;
    metadata?: any;
    createdAt: string;
    updatedAt: string;
    variants: MediaVariant[]; // 🔥 BURASI ÖNEMLİ
  };
  