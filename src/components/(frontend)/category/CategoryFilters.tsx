'use client';

import { useRouter, useSearchParams } from 'next/navigation';

interface CategoryFiltersProps {
  subcategories?: { id: string; name: string }[];
  brands?: { slug: string; name: string }[];
  attributeGroups?: {
    id: string;
    name: string;
    attributes: { id: string; name: string }[];
  }[];
}

export default function CategoryFilters({
  subcategories = [],
  brands = [],
  attributeGroups = [],
}: CategoryFiltersProps) {
  const router = useRouter();
  const params = useSearchParams();

  /* ---------------- helpers ---------------- */
  const toggleMulti = (key: string, value: string) => {
    const url = new URL(window.location.href);
    const values = new Set(url.searchParams.getAll(key));
    values.has(value) ? values.delete(value) : values.add(value);
    url.searchParams.delete(key);
    values.forEach((v) => url.searchParams.append(key, v));
    router.push('?' + url.searchParams.toString());
  };

  const setSingle = (key: string, value: string | null) => {
    const url = new URL(window.location.href);
    value ? url.searchParams.set(key, value) : url.searchParams.delete(key);
    router.push('?' + url.searchParams.toString());
  };

  /* ---------------- UI ---------------- */
  return (
    <aside className="mb-8 space-y-6">
      {/* ALT KATEGORİLER */}
      {subcategories.length > 0 && (
        <section>
          <h3 className="font-semibold mb-1">Alt Kategoriler</h3>
          {subcategories.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm py-[2px]">
              <input
                type="checkbox"
                checked={params.getAll('category').includes(c.id)}
                onChange={() => toggleMulti('category', c.id)}
              />
              {c.name}
            </label>
          ))}
        </section>
      )}

      {/* MARKALAR */}
      {brands.length > 0 && (
        <section>
          <h3 className="font-semibold mb-1">Markalar</h3>
          {brands.map((b) => (
            <label key={b.slug} className="flex items-center gap-2 text-sm py-[2px]">
              <input
                type="checkbox"
                checked={params.getAll('brand').includes(b.slug)}
                onChange={() => toggleMulti('brand', b.slug)}
              />
              {b.name}
            </label>
          ))}
        </section>
      )}

      {/* FİYAT ARALIĞI */}
      <section>
        <h3 className="font-semibold mb-1">Fiyat Aralığı</h3>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            defaultValue={params.get('minPrice') ?? ''}
            onBlur={(e) =>
              setSingle('minPrice', e.target.value ? e.target.value : null)
            }
            className="w-20 border px-2 py-1 rounded text-sm"
          />
          <span className="px-1">-</span>
          <input
            type="number"
            placeholder="Max"
            defaultValue={params.get('maxPrice') ?? ''}
            onBlur={(e) =>
              setSingle('maxPrice', e.target.value ? e.target.value : null)
            }
            className="w-20 border px-2 py-1 rounded text-sm"
          />
        </div>
      </section>

      {/* ATTRIBUTE GRUPLARI */}
      {attributeGroups.length > 0 && (
        attributeGroups.map((g) => (
          <section key={g.id}>
            <h3 className="font-semibold mb-1">{g.name}</h3>
            {g.attributes.map((a) => (
              <label key={a.id} className="flex items-center gap-2 text-sm py-[2px]">
                <input
                  type="checkbox"
                  checked={params.getAll('attribute').includes(a.id)}
                  onChange={() => toggleMulti('attribute', a.id)}
                />
                {a.name}
              </label>
            ))}
          </section>
        ))
      )}
    </aside>
  );
}
