"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface FilterSidebarProps {
  attributeGroups: {
    id: string;
    name: string;
    attributes: { id: string; name: string }[];
  }[];
  brands: { id: string; name: string; slug: string }[];
  subcategories: { id: string; name: string; slug: string }[];
}

export default function FilterSidebar({
  attributeGroups,
  brands,
  subcategories,
}: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Başlangıç filtre değerlerini al
  const [filters, setFilters] = useState({
    price_gte: searchParams.get("price_gte") ?? "",
    price_lte: searchParams.get("price_lte") ?? "",
    brand: searchParams.get("brand") ?? "",
    subcategory: searchParams.get("subcategory") ?? "",
    attributes: new Set<string>(searchParams.getAll("attribute")),
  });

  const toggleAttribute = (name: string) => {
    const newSet = new Set(filters.attributes);
    newSet.has(name) ? newSet.delete(name) : newSet.add(name);
    setFilters((prev) => ({ ...prev, attributes: newSet }));
  };

  const handleApply = () => {
    const params = new URLSearchParams();

    if (filters.price_gte) params.set("price_gte", filters.price_gte);
    if (filters.price_lte) params.set("price_lte", filters.price_lte);
    if (filters.brand) params.set("brand", filters.brand);
    if (filters.subcategory) params.set("subcategory", filters.subcategory);
    filters.attributes.forEach((attr) => params.append("attribute", attr));

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-[250px] p-4 border border-gray-200 space-y-6">
      {/* Fiyat Aralığı */}
      <div>
        <h2 className="font-bold mb-2">Fiyat</h2>
        <input
          type="number"
          placeholder="En az"
          value={filters.price_gte}
          onChange={(e) => setFilters((f) => ({ ...f, price_gte: e.target.value }))}
          className="mb-2 w-full border px-2 py-1"
        />
        <input
          type="number"
          placeholder="En çok"
          value={filters.price_lte}
          onChange={(e) => setFilters((f) => ({ ...f, price_lte: e.target.value }))}
          className="mb-4 w-full border px-2 py-1"
        />
      </div>

      {/* Marka Seçimi */}
      <div>
        <h2 className="font-bold mb-2">Marka</h2>
        <select
          value={filters.brand}
          onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
          className="mb-4 w-full border px-2 py-1"
        >
          <option value="">Tümü</option>
          {brands.map((brand) => (
            <option key={brand.id} value={brand.slug}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* Alt Kategoriler */}
      {subcategories.length > 0 && (
        <div>
          <h2 className="font-bold mb-2">Alt Kategoriler</h2>
          <ul className="space-y-1">
            {subcategories.map((sub) => (
              <li key={sub.id}>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="subcategory"
                    value={sub.slug}
                    checked={filters.subcategory === sub.slug}
                    onChange={(e) =>
                      setFilters((f) => ({ ...f, subcategory: e.target.value }))
                    }
                  />
                  {sub.name}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Özellikler */}
      {attributeGroups.map((group) => (
        <div key={group.id}>
          <h3 className="font-semibold mb-1">{group.name}</h3>
          {group.attributes.map((attr) => (
            <label key={attr.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.attributes.has(attr.name)}
                onChange={() => toggleAttribute(attr.name)}
              />
              {attr.name}
            </label>
          ))}
        </div>
      ))}

      {/* Uygula Butonu */}
      <button
        className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 w-full rounded"
        onClick={handleApply}
      >
        Uygula
      </button>
    </div>
  );
}
