"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface MobileFilterProps {
  attributeGroups: {
    id: string;
    name: string;
    attributes: { id: string; name: string }[];
  }[];
  brands: { id: string; name: string; slug: string }[];
  subcategories: { id: string; name: string; slug: string }[];
}

export default function MobileFilter({
  attributeGroups,
  brands,
  subcategories,
}: MobileFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

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
    <Dialog>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 text-orange-600 border border-orange-400 px-4 py-2 rounded w-full justify-center">
          <Filter className="w-4 h-4" />
          Filtrele
        </button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white shadow-lg rounded-md p-4">
        <DialogHeader>
          <DialogTitle>Filtreleme</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Fiyat */}
          <div>
            <h2 className="font-bold mb-2">Fiyat</h2>
            <input
              type="number"
              placeholder="En az"
              value={filters.price_gte}
              onChange={(e) =>
                setFilters((f) => ({ ...f, price_gte: e.target.value }))
              }
              className="mb-2 w-full border px-2 py-1"
            />
            <input
              type="number"
              placeholder="En çok"
              value={filters.price_lte}
              onChange={(e) =>
                setFilters((f) => ({ ...f, price_lte: e.target.value }))
              }
              className="w-full border px-2 py-1"
            />
          </div>

          {/* Marka */}
          <div>
            <h2 className="font-bold mb-2">Marka</h2>
            <select
              value={filters.brand}
              onChange={(e) =>
                setFilters((f) => ({ ...f, brand: e.target.value }))
              }
              className="w-full border px-2 py-1"
            >
              <option value="">Tümü</option>
              {brands.map((b) => (
                <option key={b.id} value={b.slug}>
                  {b.name}
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
                          setFilters((f) => ({
                            ...f,
                            subcategory: e.target.value,
                          }))
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
              <div className="flex flex-wrap gap-2">
                {group.attributes.map((attr) => (
                  <label key={attr.id} className="flex gap-1 items-center">
                    <input
                      type="checkbox"
                      checked={filters.attributes.has(attr.name)}
                      onChange={() => toggleAttribute(attr.name)}
                    />
                    {attr.name}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Uygula Butonu */}
          <button
            onClick={handleApply}
            className="mt-4 w-full bg-orange-500 text-white py-2 px-4 rounded"
          >
            Uygula
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
