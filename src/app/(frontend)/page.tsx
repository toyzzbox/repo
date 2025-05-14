// app/page.tsx
import { getProducts } from "@/actions/getProduct";
import ProductCard from "@/components/(frontend)/product/ProductCard";
import { ProductSection } from "@/components/(frontend)/product/ProductSection";

export default async function Home() {
  // const products = await getProducts();

  return (
    <main className="m-2">
      <h1 className="text-2xl font-bold text-center p-5">En Popüler Ürünler</h1>
      <main className="m-2">
deneme</main>
    </main>
  );
}
