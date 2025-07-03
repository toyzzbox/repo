import { getAttributes } from "@/actions/getAttributes";
import { getBrands } from "@/actions/getBrands";
import { getCategories } from "@/actions/getCategories";
import { getDiscountedProducts } from "@/actions/getDiscountedProducts";
import { getProducts } from "@/actions/getProduct";
import { AttributeCard } from "@/components/(frontend)/attribute/AttributeCard";
import { BrandCard } from "@/components/(frontend)/product/BrandCard";
import { CategoryCard } from "@/components/(frontend)/product/CategoryCard";
import  {ProductCard}  from "@/components/(frontend)/product/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default async function Home() {
  const products = await getProducts();
  const brands = await getBrands();
  const categories = await getCategories();
  const attributes = await getAttributes();
  const discountProducts = await getDiscountedProducts();
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
       <h1 className="text-2xl font-bold text-center p-5">En İndirimli Ürünler</h1>
    {discountProducts.length === 0 ? (
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


<h1 className="text-2xl font-bold text-center p-5">Yaş Aralığına Göre Oyuncaklar</h1>


{attributes.length === 0 ? (
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
      {attributes.map((attribute) => (
        <CarouselItem
          key={attribute.id}
          className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
        >
          <AttributeCard attribute={attribute} />
        </CarouselItem>
      ))}
    </CarouselContent>

    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
)}
    </main>
  );
}
