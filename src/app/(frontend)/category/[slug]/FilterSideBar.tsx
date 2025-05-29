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
}

export default function FilterSidebar({ attributeGroups, brands }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    price_gte: searchParams.get("price_gte") || "",
    price_lte: searchParams.get("price_lte") || "",
    brand: searchParams.get("brand") || "",
    attributes: new Set<string>(
      (searchParams.getAll("attribute") as string[]) || []
    ),
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
    filters.attributes.forEach((attr) => params.append("attribute", attr));
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="w-[250px] p-4 border">
      <h2 className="font-bold mb-2">Fiyat</h2>
      <input
        type="number"
        placeholder="En az"
        value={filters.price_gte}
        onChange={(e) =>
          setFilters((f) => ({ ...f, price_gte: e.target.value }))
        }
        className="mb-2 w-full"
      />
      <input
        type="number"
        placeholder="En çok"
        value={filters.price_lte}
        onChange={(e) =>
          setFilters((f) => ({ ...f, price_lte: e.target.value }))
        }
        className="mb-4 w-full"
      />

      <h2 className="font-bold mb-2">Marka</h2>
      <select
        value={filters.brand}
        onChange={(e) =>
          setFilters((f) => ({ ...f, brand: e.target.value }))
        }
        className="mb-4 w-full"
      >
        <option value="">Tümü</option>
        {brands.map((b) => (
          <option key={b.id} value={b.slug}>
            {b.name}
          </option>
        ))}
      </select>

      {attributeGroups.map((group) => (
        <div key={group.id} className="mb-4">
          <h3 className="font-semibold">{group.name}</h3>
          {group.attributes.map((attr) => (
            <label key={attr.id} className="flex gap-2 items-center">
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

      <button
        className="mt-4 bg-black text-white px-4 py-2"
        onClick={handleApply}
      >
        Uygula
      </button>
    </div>
  );
}
