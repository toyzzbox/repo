'use client';

import { useEffect, useRef, useState, useTransition } from "react";
import { searchProducts } from "@/actions/searchProducts";
import debounce from "lodash.debounce";
import { FaSearch, FaClock, FaFire, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Popüler aramalar - bunları backend'den de çekebilirsiniz
const POPULAR_SEARCHES = [
  "LEGO",
  "Barbie",
  "Hot Wheels",
  "Puzzle",
  "Bebek",
  "Oyuncak Araba",
  "Eğitici Oyuncak",
  "Peluş Oyuncak"
];

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
    setQuery("");
    setResults([]);
    setHighlightIndex(-1);
    setIsFocused(false);
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
        setIsFocused(false);
      }
    } else if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  // 📦 LocalStorage: son aramalar
  const saveSearchToLocal = (text: string) => {
    const existing = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    const updated = [text, ...existing.filter((item: string) => item !== text)].slice(0, 5);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const clearRecentSearches = () => {
    localStorage.removeItem("recentSearches");
    setRecentSearches([]);
  };

  const removeRecentSearch = (searchToRemove: string) => {
    const updated = recentSearches.filter(search => search !== searchToRemove);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
    setRecentSearches(updated);
  };

  const handlePopularSearchClick = (search: string) => {
    saveSearchToLocal(search);
    router.push(`/search?query=${encodeURIComponent(search)}`);
    setQuery("");
    setResults([]);
    setIsFocused(false);
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    handleSearch(search);
    inputRef.current?.focus();
  };

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem("recentSearches") || "[]");
    setRecentSearches(existing);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto z-60">
      <form
        onSubmit={onSubmit}
        className="relative"
      >
        <div className="flex w-full">
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
            placeholder="Ürün, marka veya kategori ara..."
            autoComplete="off"
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-r-md transition-colors"
          >
            <FaSearch className="h-5 w-5" />
          </button>
        </div>

        {isPending && (
          <p className="text-sm text-gray-500 mt-1 ml-1">Yükleniyor...</p>
        )}
      </form>

      {/* Dropdown - Arama Sonuçları veya Öneriler */}
      {isFocused && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* Arama Sonuçları Varsa */}
          {query.trim() && results.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-semibold text-gray-500 uppercase px-2 py-1 mb-1">
                Arama Sonuçları
              </div>
              <ul className="space-y-1">
                {results.map((product, i) => (
                  <li
                    key={product.id}
                    className={`rounded-md transition-colors ${
                      i === highlightIndex ? "bg-orange-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <a
                      href={`/${product.slug}`}
                      className="flex items-center gap-3 p-2 w-full"
                      onClick={() => saveSearchToLocal(product.name)}
                    >
                      <Image
                        src={product.medias?.[0]?.urls?.[0] || "/placeholder.png"}
                        alt={product.name}
                        width={40}
                        height={40}
                        className="object-cover rounded border"
                      />
                      <div className="flex flex-col overflow-hidden flex-1">
                        <span className="font-medium text-sm truncate text-gray-900">
                          {product.name}
                        </span>
                        <span className="text-xs text-gray-500 truncate">
                          {product.brand?.name || ""}
                          {product.categories?.length
                            ? ` • ${product.categories.map((c: any) => c.name).join(", ")}`
                            : ""}
                        </span>
                      </div>
                      {product.price && (
                        <span className="text-sm font-semibold text-orange-600 whitespace-nowrap">
                          {product.price} ₺
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Arama Yapılmamışken veya Sonuç Yoksa */}
          {!query.trim() && (
            <>
              {/* Önceki Aramalar */}
              {recentSearches.length > 0 && (
                <div className="p-2 border-b border-gray-100">
                  <div className="flex items-center justify-between px-2 py-1 mb-1">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase">
                      <FaClock className="text-gray-400" />
                      Önceki Aramalar
                    </div>
                    <button
                      type="button"
                      onClick={clearRecentSearches}
                      className="text-xs text-orange-600 hover:text-orange-700 font-medium"
                    >
                      Temizle
                    </button>
                  </div>
                  <ul className="space-y-1">
                    {recentSearches.map((search, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between hover:bg-gray-50 rounded-md transition-colors group"
                      >
                        <button
                          type="button"
                          onClick={() => handleRecentSearchClick(search)}
                          className="flex items-center gap-2 p-2 flex-1 text-left"
                        >
                          <FaSearch className="text-gray-400 text-xs" />
                          <span className="text-sm text-gray-700">{search}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRecentSearch(search)}
                          className="p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FaTimes className="text-gray-400 hover:text-red-500 text-xs" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Popüler Aramalar */}
              <div className="p-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase px-2 py-1 mb-1">
                  <FaFire className="text-orange-500" />
                  Popüler Aramalar
                </div>
                <div className="flex flex-wrap gap-2 px-2">
                  {POPULAR_SEARCHES.map((search, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePopularSearchClick(search)}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-gray-700 rounded-full transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Arama Yapıldı Ama Sonuç Yok */}
          {query.trim() && results.length === 0 && !isPending && (
            <div className="p-6 text-center">
              <div className="text-gray-400 mb-2">
                <FaSearch className="h-8 w-8 mx-auto" />
              </div>
              <p className="text-sm text-gray-600 mb-1">
                <span className="font-medium">"{query}"</span> için sonuç bulunamadı
              </p>
              <p className="text-xs text-gray-500">
                Farklı anahtar kelimeler deneyebilirsiniz
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}