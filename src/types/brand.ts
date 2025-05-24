import { Media } from "./product";

export type Brand = {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    medias: Media[]; // ✅ doğru isimlendirme
  };