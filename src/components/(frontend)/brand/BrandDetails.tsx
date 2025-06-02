import { ProductCard } from "../product/ProductCard";
import FilterSidebar from "./FilterSidebar";

export function BrandDetails({ brand }: { brand: any }) {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">{brand.name}</h1>
      {brand.description && (
        <p className="text-gray-600 mb-6">{brand.description}</p>
      )}

      <div className="flex gap-6">
        <aside className="w-1/4 hidden lg:block">
          <FilterSidebar />
        </aside>

        <main className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
          {brand.products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </main>
      </div>
    </div>
  );
}
