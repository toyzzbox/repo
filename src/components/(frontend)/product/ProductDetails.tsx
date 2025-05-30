'use client';

import { ProductDetailTabs } from "./ProductDetailTab";


type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  medias: { urls: string[] }[];
  categories: { id: string; name: string }[];
};

export default function ProductDetails({ product }: { product: Product }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>
      <p className="text-lg text-gray-700 mb-4">₺{product.price}</p>

      {/* Ürün görselleri */}
      <div className="flex gap-2 overflow-x-auto mb-6">
        {product.medias.map((media, index) => (
          <img
            key={index}
            src={media.urls[0]}
            alt={product.name}
            className="h-48 w-auto rounded border"
          />
        ))}
      </div>

      {/* Sekmeli içerik */}
      <ProductDetailTabs
        description={product.description}
        comments={
          <div>Henüz yorum bulunmamaktadır.</div>
          // TODO: Buraya yorum listesi eklenecek
        }
        questions={
          <div>Henüz soru bulunmamaktadır.</div>
          // TODO: Buraya soru listesi eklenecek
        }
      />
    </div>
  );
}
