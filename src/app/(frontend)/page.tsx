import { getBrands } from "@/actions/getBrands";
import { getCategories } from "@/actions/getCategories";
import { getProducts } from "@/actions/getProduct";
import AgeCatalogue from "@/components/(frontend)/home/AgeCatalogue";
import { BrandCard } from "@/components/(frontend)/product/BrandCard";
import { CategoryCard } from "@/components/(frontend)/product/CategoryCard";
import  {ProductCard}  from "@/components/(frontend)/product/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {products.map((product) => (
            <CarouselItem
            key={product.id}
            className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"          >
            <ProductCard product={product} />
          </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      )}

<h1 className="text-2xl font-bold text-center p-5">En Popüler Markalar</h1>

{brands.length === 0 ? (
  <p className="text-center text-gray-500">Marka bulunamadı.</p>
) : (
  <Carousel
    opts={{
      align: "start",
      loop: true,
    }}
    className="w-full"
  >
    <CarouselContent>
      {brands.map((brand) => (
        <CarouselItem
          key={brand.id}
          className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
        >
          <BrandCard brand={brand} />
        </CarouselItem>
      ))}
    </CarouselContent>

    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
)}

<h1 className="text-2xl font-bold text-center p-5">En Popüler Kategoriler</h1>

{categories.length === 0 ? (
  <p className="text-center text-gray-500">Kategori bulunamadı.</p>
) : (
  <Carousel
    opts={{
      align: "start",
      loop: true,
    }}
    className="w-full"
  >
    <CarouselContent>
      {categories.map((category) => (
        <CarouselItem
          key={category.id}
          className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
        >
          <CategoryCard category={category} />
        </CarouselItem>
      ))}
    </CarouselContent>

    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
)}


<h1 className="text-2xl font-bold text-center p-5">En Popüler Kategoriler</h1>
<AgeCatalogue/>

    </main>
  );
}
