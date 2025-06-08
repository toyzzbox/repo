'use client';

import { useState, useTransition } from "react";
import { searchProducts } from "@/actions/searchProducts";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";

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
    <div className="relative w-full max-w-xl mx-auto">
      <div className="flex w-full">
        <input
          value={query}
          onChange={onChange}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-slate-500"
          placeholder="Ürün, marka veya kategori ara..."
        />
        <button
          type="button"
          className="bg-orange-600 hover:opacity-80 text-white p-2 rounded-r-md"
        >
          <FaSearch className="h-5 w-5" />
        </button>
      </div>

      {isPending && (
        <p className="text-sm text-gray-500 mt-1">Yükleniyor...</p>
      )}

      {results.length > 0 && (
      <ul className="absolute top-full left-0 w-full mt-1 bg-white border rounded shadow z-50 max-h-80 overflow-y-auto">
      {results.map((product) => (
        <li key={product.id} className="flex items-center gap-3 p-2 hover:bg-gray-100">
          <a href={`/product/${product.slug}`} className="flex items-center gap-3 w-full">
          
            <div className="flex flex-row overflow-hidden">
            <Image
            src={product.medias?.[0]?.urls?.[0] || "/placeholder.png"}
            alt={product.name}
            width={22}
            height={14}
            className="object-cover rounded border"
          />
              <span className="font-medium truncate">{product.name}</span>
              <span className="text-xs text-gray-500 truncate">
                {product.brand?.name} | {product.categories.map((c: any) => c.name).join(", ")}
              </span>
            </div>
          </a>
        </li>
      ))}
    </ul>
      )}
    </div>
  );
}
