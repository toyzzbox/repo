"use client";

import { ProductCard } from "./ProductCard";

interface RelatedProductsProps {
  products: {
    id: string;
    name: string;
    slug: string;
    price: number;
    medias: { urls: string[] }[];
  }[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (!products.length) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold mb-4 text-slate-800">Benzer Ürünler</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              urls: product.medias.map((m) => m.urls[0]), // Product tipine uygun hale getir
              brands: [], // placeholder
            }}
          />
        ))}
      </div>
    </section>
  );
}
