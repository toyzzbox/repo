import { getBrands } from "@/actions/getBrands";
import { getCategories } from "@/actions/getCategories";
import { getProducts } from "@/actions/getProduct";
import { BrandCard } from "@/components/(frontend)/product/BrandCard";
import { CategoryCard } from "@/components/(frontend)/product/CategoryCard";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

export default async function Home() {
  const products = await getProducts();
  const brands = await getBrands();
  const categories = await getCategories();
  return (
    <main className="m-2">
      <h1 className="text-2xl font-bold text-center p-5">En Popüler Ürünler</h1>
      {products.length === 0 ? (
  <p className="text-center text-gray-500">Ürün bulunamadı.</p>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
      
    ))}
  </div>
)}

<h1 className="text-2xl font-bold text-center p-5">En Popüler Markalar</h1>
      {brands.length === 0 ? (
  <p className="text-center text-gray-500">Marka bulunamadı.</p>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {brands.map((brand) => (
      <BrandCard key={brand.id} brand={brand} />
      
    ))}
  </div>
)}

<h1 className="text-2xl font-bold text-center p-5">En Popüler Kategoriler</h1>
      {categories.length === 0 ? (
  <p className="text-center text-gray-500">Marka bulunamadı.</p>
) : (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
    {categories.map((category) => (
      <CategoryCard key={category.id} category={category} />
      
    ))}
  </div>
)}





    </main>
  );
}
