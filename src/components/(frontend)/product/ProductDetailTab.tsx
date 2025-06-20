"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductGroup {
  /** Varyant/Grup açıklaması (HTML) */
  description?: string | null;
}

interface ProductDetailTabsProps {
  /** Ürüne ait veriler */
  product: {
    /** Ürün açıklaması (HTML) */
    description?: string | null;
    /** (İsteğe bağlı) Ürünün ait olduğu ProductGroup bilgisi */
    group?: ProductGroup | null;
  };
  /** Yorum bileşeni */
  comments: React.ReactNode;
  /** Soru–cevap bileşeni */
  questions: React.ReactNode;
}

export default function ProductDetailTabs({
  product,
  comments,
  questions,
}: ProductDetailTabsProps) {
  // 1️⃣ Açıklamaları birleştir: önce grup açıklaması, sonra ürün açıklaması
  const mergedDescription = [product.group?.description, product.description]
    .filter(Boolean)
    .join("<hr class=\"my-4\" />");

  return (
    <Tabs defaultValue="description" className="w-full mt-6">
      {/* ───────── Tab başlıkları ───────── */}
      <TabsList className="w-full flex justify-start border-b">
        <TabsTrigger value="description">Açıklama</TabsTrigger>
        <TabsTrigger value="comments">Yorumlar</TabsTrigger>
        <TabsTrigger value="questions">Sorular</TabsTrigger>
      </TabsList>

      {/* ───────── Açıklama sekmesi ───────── */}
      <TabsContent value="description">
        <div
          className="text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: mergedDescription }}
        />
      </TabsContent>

      {/* ───────── Yorumlar sekmesi ───────── */}
      <TabsContent value="comments">
        <div className="mt-4">{comments}</div>
      </TabsContent>

      {/* ───────── Sorular sekmesi ───────── */}
      <TabsContent value="questions">
        <div className="mt-4">{questions}</div>
      </TabsContent>
    </Tabs>
  );
}
