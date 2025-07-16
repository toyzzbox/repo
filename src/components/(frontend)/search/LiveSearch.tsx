'use client';

import { useEffect, useRef, useState, useTransition } from "react";
import { searchProducts } from "@/actions/searchProducts";
import debounce from "lodash.debounce";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // 🔄 Arama sonuçları
  const handleSearch = debounce((q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }

    startTransition(async () => {
      const res = await searchProducts(q);
      setResults(res);
      setHighlightIndex(-1);
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

    saveSearchToLocal(query.trim());
    router.push(`/search?query=${encodeURIComponent(query.trim())}`);
    setQuery(""); // temizle
    setResults([]);
    setHighlightIndex(-1);
  };

  // ⌨️ Klavye kontrolleri
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (highlightIndex >= 0 && results[highlightIndex]) {
        saveSearchToLocal(results[highlightIndex].name);
        router.push(`/${results[highlightIndex].slug}`);
        setQuery("");
        setResults([]);
        setHighlightIndex(-1);
      }
    }
  };

  // 📦 LocalStorage: son aramalar
  const saveSearchToLocal = (text: string) => {
    const existing = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    const updated = [text, ...existing.filter((item: string) => item !== text)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecentSearches(updated);
  };

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(existing);
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full max-w-xl mx-auto"
      onFocus={() => setIsFocused(true)}
      onBlur={() => setTimeout(() => setIsFocused(false), 200)}
    >
      <div className="flex w-full">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-slate-500"
          placeholder="Ürün, marka veya kategori ara..."
          autoComplete="off"
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

      {(isFocused && (results.length > 0 || recentSearches.length > 0)) && (
        <ul className="absolute top-full left-0 w-full mt-1 bg-white border rounded shadow z-50 max-h-80 overflow-y-auto text-sm">
          {results.length > 0 ? (
            results.map((product, i) => (
              <li
                key={product.id}
                className={`hover:bg-gray-100 ${i === highlightIndex ? "bg-gray-100" : ""}`}
              >
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
            ))
          ) : (
            recentSearches.map((search, i) => (
              <li
                key={i}
                className="hover:bg-gray-100 cursor-pointer p-2"
                onClick={() => {
                  setQuery(search);
                  handleSearch(search);
                }}
              >
                <span className="text-sm text-gray-700">🔎 {search}</span>
              </li>
            ))
          )}
        </ul>
      )}
    </form>
  );
}
