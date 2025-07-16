import { searchProducts } from "@/lib/searchProducts";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import Search from "@/components/(frontend)/header/Search";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams.query?.trim() || "";

  const results = query ? await searchProducts(query) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Sayfanın üst kısmında tekrar arama kutusu */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Ürün Arama</h1>
        <Search />
      </div>

      {/* Arama sonucu bilgisi */}
      {query && (
        <p className="text-gray-600 mb-4">
          “{query}” için {results.length} sonuç bulundu.
        </p>
      )}

      {/* Sonuçlar */}
      {results.length === 0 ? (
        <p className="text-gray-500">Sonuç bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
