// app/page.tsx
import { getProducts } from "@/actions/getProduct";
import ProductCard from "@/components/(frontend)/product/ProductCard";

export default async function Home() {
  const products = await getProducts();

  return (
    <main className="m-2">
      <h1 className="text-2xl font-bold text-center p-5">En Popüler Ürünler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Hiç ürün bulunamadı.
          </p>
        )}
      </div>
      <h1 className="text-2xl font-bold text-center p-5">Flaş İndirimler</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Hiç ürün bulunamadı.
          </p>
        )}
      </div>
      <h1 className="text-2xl font-bold text-center p-5">En Yeni Gelenler</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            Hiç ürün bulunamadı.
          </p>
        )}
      </div>
      deneme
    </main>
  );
}
