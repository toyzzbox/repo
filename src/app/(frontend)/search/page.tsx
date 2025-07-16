import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import { searchProducts } from "@/lib/searchProducts";

export const dynamic = "force-dynamic";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams.query?.trim() || "";

  const products = query ? await searchProducts(query) : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Arama Sonuçları</h1>

      {query && (
        <p className="mb-4 text-gray-600">
          “{query}” için {products.length} sonuç bulundu.
        </p>
      )}

      {products.length === 0 ? (
        <p className="text-gray-500">Hiçbir ürün bulunamadı.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
