import { Media } from "./product";

export interface ProductGroup {
    id: string;
    name: string;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
    mediaIds?: string[];       // Form submit için seçili media ID dizisi
    medias?: Media[];          // Populate edilmiş medya nesneleri
    image?: string;   
  }