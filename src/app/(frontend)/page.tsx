import { getAttributes } from "@/actions/getAttributes";
import { getBrands } from "@/actions/getBrands";
import { getCategories } from "@/actions/getCategories";
import { getDiscountedProducts } from "@/actions/getDiscountedProducts";
import { getPopularProducts } from "@/actions/getPopularProducts";
import { getProducts } from "@/actions/getProduct";

import { AttributeCard } from "@/components/(frontend)/attribute/AttributeCard";
import { BrandCard } from "@/components/(frontend)/product/BrandCard";
import { CategoryCard } from "@/components/(frontend)/product/CategoryCard";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function Home() {
  // ✅ Tüm veri çekimleri paralel hale getirildi
  const [
    productNew,
    products,
    brands,
    categories,
    attributes,
    discountProducts,
  ] = await Promise.all([
    getProducts(),
    getPopularProducts(),
    getBrands(),
    getCategories(),
    getAttributes(),
    getDiscountedProducts(),
  ]);

  return (
    <main className="m-2 space-y-8">
      {/* En Popüler Ürünler */}
      <Section title="En Popüler Ürünler">
        <ProductCarousel products={products} />
      </Section>

      {/* En İndirimli Ürünler */}
      <Section title="En İndirimli Ürünler">
        <ProductCarousel products={discountProducts} />
      </Section>

      {/* En Yeni Ürünler */}
      <Section title="En Yeni Ürünler">
        <ProductCarousel products={productNew} />
      </Section>

      {/* Popüler Markalar */}
      <Section title="En Popüler Markalar">
        <CarouselLayout>
          {brands.map((brand) => (
            <CarouselItem
              key={brand.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <BrandCard brand={brand} />
            </CarouselItem>
          ))}
        </CarouselLayout>
      </Section>

      {/* Popüler Kategoriler */}
      <Section title="En Popüler Kategoriler">
        <CarouselLayout>
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <CategoryCard category={category} />
            </CarouselItem>
          ))}
        </CarouselLayout>
      </Section>

      {/* Yaş Aralığına Göre Oyuncaklar */}
      <Section title="Yaş Aralığına Göre Oyuncaklar">
        <CarouselLayout>
          {attributes.map((attribute) => (
            <CarouselItem
              key={attribute.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <AttributeCard attribute={attribute} />
            </CarouselItem>
          ))}
        </CarouselLayout>
      </Section>
    </main>
  );
}

/* ---------------- Yardımcı Bileşenler ---------------- */

// Her bölüm başlığı ve içeriği
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-2xl font-bold text-center">{title}</h2>
      {children}
    </section>
  );
}

// Ürünleri dönen carousel
function ProductCarousel({ products }: { products: any[] }) {
  if (!products || products.length === 0)
    return <p className="text-center text-gray-500">Ürün bulunamadı.</p>;

  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem
            key={product.id}
            className="basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/5 xl:basis-1/6"
          >
            <ProductCard product={product} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}

// Ortak carousel layout
function CarouselLayout({ children }: { children: React.ReactNode }) {
  return (
    <Carousel opts={{ align: "start", loop: true }} className="w-full">
      <CarouselContent>{children}</CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
