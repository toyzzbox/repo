import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
  } from "@/components/ui/carousel";
  import { ProductCard } from "@/components/(frontend)/product/ProductCard";
  
  interface Product {
    id: string;
    // ProductCard için gereken diğer alanları da burada tanımlayabilirsin
  }
  
  interface PopularProductsCarouselProps {
    products: Product[];
  }
  
  export default function PopularProductsCarousel({ products }: PopularProductsCarouselProps) {
    if (products.length === 0) {
      return <p className="text-center text-gray-500">Ürün bulunamadı.</p>;
    }
  
    return (
      <section className="px-4 py-8">
        <h1 className="text-2xl font-bold text-center mb-6">En Popüler Ürünler</h1>
  
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
                className="basis-[80%] sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
  
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    );
  }
  