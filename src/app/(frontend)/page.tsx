import { apiClient } from "@/lib/api-client";
import { AttributeCard } from "@/components/(frontend)/attribute/AttributeCard";
import { CustomCarousel } from "@/components/(frontend)/home/CustomCarousel";
import { BrandCard } from "@/components/(frontend)/product/BrandCard";
import { CategoryCard } from "@/components/(frontend)/product/CategoryCard";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";

export default async function Home() {
  try {
    const [
      productNew,
      products,
      brands,
      categories,
      attributes,
      discountProducts,
    ] = await Promise.all([
      apiClient.getProducts().catch(() => []),
      apiClient.getPopularProducts().catch(() => []),
      apiClient.getBrands().catch(() => []),
      apiClient.getCategories().catch(() => []),
      apiClient.getAttributes().catch(() => []),
      apiClient.getDiscountedProducts().catch(() => []),
    ]);

    return (
      <main className="container mx-auto p-4 space-y-6">
        {/* En Popüler Ürünler */}
        <Section title="En Popüler Ürünler">
          <CustomCarousel 
            itemsPerView={{
              mobile: 2,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 6
            }}
            showDots={true}
            showArrows={true}
            autoPlay={true}
            autoPlayInterval={4000}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CustomCarousel>
        </Section>

        {/* En İndirimli Ürünler */}
        <Section title="En İndirimli Ürünler">
          <CustomCarousel 
            itemsPerView={{
              mobile: 2,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 6
            }}
            showDots={true}
            showArrows={true}
            autoPlay={true}
            autoPlayInterval={4000}
          >
            {discountProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CustomCarousel>
        </Section>

        {/* En Yeni Ürünler */}
        <Section title="En Yeni Ürünler">
          <CustomCarousel 
            itemsPerView={{
              mobile: 2,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 6
            }}
            showDots={false}
            showArrows={true}
          >
            {productNew.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </CustomCarousel>
        </Section>

        {/* Popüler Markalar */}
        <Section title="En Popüler Markalar">
          <CustomCarousel 
            itemsPerView={{
              mobile: 2,
              sm: 3,
              md: 4,
              lg: 6,
              xl: 8
            }}
            showDots={true}
            showArrows={true}
          >
            {brands.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </CustomCarousel>
        </Section>

        {/* Popüler Kategoriler */}
        <Section title="En Popüler Kategoriler">
          <CustomCarousel 
            itemsPerView={{
              mobile: 2,
              sm: 3,
              md: 4,
              lg: 5,
              xl: 6,
            }}
            showDots={true}
            showArrows={true}
          >
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </CustomCarousel>
        </Section>

        {/* Yaş Aralığına Göre Oyuncaklar */}
        <Section title="Yaş Aralığına Göre Oyuncaklar">
          <CustomCarousel 
            itemsPerView={{
              mobile: 2,
              sm: 3,
              md: 4,
              lg: 6,
              xl: 6
            }}
            showDots={true}
            showArrows={true}
          >
            {attributes.map((attribute) => (
              <AttributeCard key={attribute.id} attribute={attribute} />
            ))}
          </CustomCarousel>
        </Section>
      </main>
    );
  } catch (error) {
    console.error('Ana sayfa yüklenirken hata:', error);
    return (
      <main className="container mx-auto p-4">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Sayfa Yüklenirken Hata Oluştu
          </h2>
          <p className="text-gray-600">
            Lütfen sayfayı yenilemeyi deneyin veya daha sonra tekrar gelin.
          </p>
        </div>
      </main>
    );
  }
}

/* ---------------- Yardımcı Bileşenler ---------------- */

// Her bölüm başlığı ve içeriği
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="w-20 h-1 bg-orange-600 mx-auto rounded-full"></div>
      </div>
      {children}
    </section>
  );
}
