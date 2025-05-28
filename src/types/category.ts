import { Media } from "./product";

export type Category = {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    parentId: string | null;  // Media ID
    medias: Media[]; // ✅ doğru isimlendirme
  };