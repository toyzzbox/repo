import { getCategories } from "@/actions/getCategories";
import { getProducts } from "@/actions/getProduct";
import ProductCard from "@/components/(frontend)/product/ProductCard";

export default async function Home() {
  const products = await getProducts();
  const categories = await getCategories()
  return (
    <main className="m-2">
      <h1 className="text-2xl font-bold text-center p-5">En Popüler Ürünler</h1>
      {products.length === 0 ? (
  <p className="text-center text-gray-500">Ürün bulunamadı.</p>
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)}

    </main>
  );
}
