// components/(frontend)/brand/BrandDetails.tsx

import { ProductCard } from "@/components/(frontend)/product/ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  medias?: {
    urls: string[];
  }[];
};

type Brand = {
  id: string;
  slug: string;
  name: string;
  description: string;
  medias: {
    urls: string[];
  }[];
  products: Product[];
};

interface BrandDetailsProps {
  brand: Brand;
}

export function BrandDetails({ brand }: BrandDetailsProps) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{brand.name}</h1>
      <p className="text-gray-700 mb-4">{brand.description}</p>

      {/* Brand görseli varsa */}
      {brand.medias?.[0]?.urls?.[0] && (
        <img
          src={brand.medias[0].urls[0]}
          alt={brand.name}
          className="w-full max-w-md h-auto mb-6"
        />
      )}

      {/* Ürünler */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {brand.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
