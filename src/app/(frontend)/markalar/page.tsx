// src/app/brands/page.tsx
import Link from "next/link";
import { apiClient } from "@/lib/api-client";
import { BrandCard } from "@/components/(frontend)/product/BrandCard";

export const metadata = {
  title: "Markalar",
};

export default async function BrandsPage() {
  const brands = (await apiClient.getBrands().catch(() => [])) || [];

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Markalar</h1>
      
      {brands.length === 0 ? (
        <p className="text-gray-500">Henüz marka bulunmamaktadır.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {brands.map((brand: any) => (
            <BrandCard key={brand.id} brand={brand} />
          ))}
        </div>
      )}
    </main>
  );
}