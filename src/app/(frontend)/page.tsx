import { getAttributes } from "@/actions/getAttributes";
import { getBrands } from "@/actions/getBrands";
import { getCategories } from "@/actions/getCategories";
import { getDiscountedProducts } from "@/actions/getDiscountedProducts";
import { getPopularProducts } from "@/actions/getPopularProducts";
import { getProducts } from "@/actions/getProduct";

import { AttributeCard } from "@/components/(frontend)/attribute/AttributeCard";
import { CustomCarousel, ProductCarousel } from "@/components/(frontend)/home/CustomCarousel";
import { BrandCard } from "@/components/(frontend)/product/BrandCard";
import { CategoryCard } from "@/components/(frontend)/product/CategoryCard";
import { ProductCard } from "@/components/(frontend)/product/ProductCard"; // Sizin mevcut ProductCard


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
    <main className="container mx-auto px-4 py-8 space-y-12">
      {/* En Popüler Ürünler */}

        <CustomCarousel
          title="Popüler Ürünler"
          itemsPerView={{
            mobile: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 6
          }}
          showDots={true}
          showArrows={true}
          autoPlay={false}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </CustomCarousel>


      {/* En İndirimli Ürünler */}
      <Section title="En İndirimli Ürünler">
        <CustomCarousel 
          itemsPerView={{
            mobile: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5
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
            mobile: 1,
            sm: 2,
            md: 3,
            lg: 4,
            xl: 5
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
          title="Markalar"
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
            lg: 6,
            xl: 8
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
            xl: 8
          }}
          showDots={true}
          showArrows={true}
        >
          {attributes.map((attribute) => (
            <AttributeCard key={attribute.id} attribute={attribute} />
          ))}
        </CustomCarousel>
      </Section>

      {/* Alternatif kullanım - ProductCarousel wrapper */}
      <Section title="Önerilen Ürünler">
        <ProductCarousel
          products={products} 
          title="Size Özel Öneriler"
          productCardComponent={ProductCard}
        />
      </Section>
    </main>
  );
}

/* ---------------- Yardımcı Bileşenler ---------------- */

// Her bölüm başlığı ve içeriği
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
        <div className="w-20 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>
      {children}
    </section>
  );
}