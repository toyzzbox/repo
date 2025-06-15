import { Media } from "./product";

export type Category = {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: Date;
    parentId: string | null;  // Media ID
    parent?: Category | null; // ✅ bunu ekle!
    medias: Media[]; // ✅ doğru isimlendirme
  };