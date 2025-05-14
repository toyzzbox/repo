export type Category = {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    parentId: string | null;  // Media ID
    media?: {  // Media opsiyonel olabilir
      url: string;  // Media'nın URL'si
      type: "image" | "video";  // Media tipi (resim veya video)
    } | null;  // Media null veya undefined olabilir
  };