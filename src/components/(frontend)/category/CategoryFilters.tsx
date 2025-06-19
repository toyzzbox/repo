"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface CategoryFiltersProps {
  subcategories: { id: string; name: string }[];
  brands: { id: string; name: string; slug: string }[];
}

export default function CategoryFilters({ subcategories, brands }: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedCategories = searchParams.getAll("category");
  const selectedBrands = searchParams.getAll("brand");

  const toggleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const values = new Set(params.getAll(key));

    if (values.has(value)) {
      values.delete(value);
    } else {
      values.add(value);
    }

    params.delete(key);
    values.forEach((val) => params.append(key, val));
    router.push("?" + params.toString());
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Alt Kategoriler */}
      {subcategories.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Alt Kategoriler</h3>
          <div className="space-y-1">
            {subcategories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleFilter("category", cat.id)}
                />
                {cat.name}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Markalar */}
      {brands.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Markalar</h3>
          <div className="space-y-1">
            {brands.map((brand) => (
              <label key={brand.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.slug)}
                  onChange={() => toggleFilter("brand", brand.slug)}
                />
                {brand.name}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
