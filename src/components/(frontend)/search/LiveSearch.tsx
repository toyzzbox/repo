'use client';

import { useState, useTransition } from "react";
import { searchProducts } from "@/actions/searchProducts";
import debounce from "lodash.debounce";

export default function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  const handleSearch = debounce((q: string) => {
    startTransition(async () => {
      const res = await searchProducts(q);
      setResults(res);
    });
  }, 300);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    handleSearch(val);
  };

  return (
    <div className="relative w-full">
      <input
        value={query}
        onChange={onChange}
        className="w-full border rounded px-4 py-2"
        placeholder="Ürün, marka veya kategori ara..."
      />

      {isPending && <p className="text-sm text-gray-500">Yükleniyor...</p>}

      {results.length > 0 && (
        <ul className="absolute top-full left-0 w-full mt-1 bg-white border rounded shadow z-50">
          {results.map((product) => (
            <li key={product.id} className="p-2 hover:bg-gray-100">
              <a href={`/products/${product.slug}`}>
                <div className="font-medium">{product.name}</div>
                <div className="text-xs text-gray-500">
                  {product.brand?.name} | {product.categories.map(c => c.name).join(", ")}
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
