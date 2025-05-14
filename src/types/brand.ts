export type Brand = {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    media?: {  // Media opsiyonel olabilir
      url: string;  // Media'nın URL'si
      type: "image" | "video";  // Media tipi (resim veya video)
    } | null;  // Media null veya undefined olabilir
  };