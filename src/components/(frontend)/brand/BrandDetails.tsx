"use client";

import { useState } from "react";
import  ProductCard  from "../product/ProductCard";
import FilterSidebar from "./FilterSidebar";
import SortSelect, { SortOption } from "./SortSelect";

export function BrandDetails({ brand }: { brand: any }) {
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const sortedProducts = [...brand.products].sort((a, b) => {
    switch (sortOption) {
      case "price_asc":
        return a.price - b.price;
      case "price_desc":
        return b.price - a.price;
      case "date_desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "stock_desc":
        return (b.stock ?? 0) - (a.stock ?? 0);
      case "name_asc":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-2">{brand.name}</h1>
      {brand.description && (
        <p className="text-gray-600 mb-4">{brand.description}</p>
      )}

      <SortSelect value={sortOption} onChange={setSortOption} />

      <div className="flex gap-6">
        <aside className="w-1/4 hidden lg:block">
          <FilterSidebar />
        </aside>

        <main className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedProducts.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      </div>
    </div>
  );
}
