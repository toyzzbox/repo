'use client';

import { useState, useTransition } from "react";
import { searchProducts } from "@/actions/searchProducts";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = debounce((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

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

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={onSubmit} className="relative w-full max-w-xl mx-auto">
      <div className="flex w-full">
        <input
          value={query}
          onChange={onChange}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-slate-500"
          placeholder="Ürün, marka veya kategori ara..."
        />
        <button
          type="submit"
          className="bg-orange-600 hover:opacity-80 text-white p-2 rounded-r-md"
        >
          <FaSearch className="h-5 w-5" />
        </button>
      </div>

      {isPending && (
        <p className="text-sm text-gray-500 mt-1">Yükleniyor...</p>
      )}

      {results.length > 0 && (
        <ul className="absolute top-full left-0 w-full mt-1 bg-white border rounded shadow z-50 max-h-80 overflow-y-auto text-sm">
          {results.map((product) => (
            <li key={product.id} className="hover:bg-gray-100">
              <a
                href={`/${product.slug}`}
                className="flex items-center gap-3 p-2 w-full"
              >
                <Image
                  src={product.medias?.[0]?.urls?.[0] || "/placeholder.png"}
                  alt={product.name}
                  width={32}
                  height={32}
                  className="object-cover rounded border"
                />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate">{product.name}</span>
                  <span className="text-xs text-gray-500 truncate">
                    {product.brand?.name || ""}{" "}
                    {product.categories?.length
                      ? `| ${product.categories.map((c: any) => c.name).join(", ")}`
                      : ""}
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
