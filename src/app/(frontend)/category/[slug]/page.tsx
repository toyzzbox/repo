// src/app/categories/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import FilterSidebar from "./FilterSideBar";
import MobileFilter from "./MobileFilter";
import { Category } from "@/types/category";

interface Props {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// ♻️ Alt kategorileri derinlemesine toplayan yardımcı fonksiyon
function collectCategoryIds(category: Category & { children?: (Category & { children?: any[] })[] }): string[] {
  let ids = [category.id];
  if (category.children && category.children.length > 0) {
    for (const child of category.children) {
      ids = ids.concat(collectCategoryIds(child));
    }
  }
  return ids;
}

export default async function CategoryPage({ params, searchParams = {} }: Props) {
  const slug = params.slug;

  // Fiyat aralığı
  const minPrice = Number(searchParams.price_gte ?? 0);
  const maxPrice = Number(searchParams.price_lte ?? 99999);

  // Seçilen attribute'lar
  const selectedAttributes = Array.isArray(searchParams.attribute)
    ? searchParams.attribute
    : searchParams.attribute
    ? [searchParams.attribute]
    : [];

  // Seçilen marka
  const selectedBrand =
    typeof searchParams.brand === "string" ? searchParams.brand : undefined;

  // Seçilen alt kategori
  const selectedSubcategory =
    typeof searchParams.subcategory === "string" ? searchParams.subcategory : undefined;

  // Ana kategori ve tüm alt kategorilerini (çok seviyeli) al
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: true, // daha fazla seviye gerekiyorsa buraya da children eklenebilir
            },
          },
        },
      },
    },
  });

  if (!category) {
    return <div className="p-4">Kategori bulunamadı.</div>;
  }

  // Tüm alt kategori ID'lerini topla
  let categoryIds = collectCategoryIds(category);

  // Eğer kullanıcı alt kategori seçtiyse, sadece onun alt kategorilerini al
  if (selectedSubcategory) {
    const selectedChild = category.children.find(c => c.slug === selectedSubcategory);
    if (selectedChild) {
      categoryIds = collectCategoryIds(selectedChild);
    }
  }

  // Ürünleri getir
  const products = await prisma.product.findMany({
    where: {
      AND: [
        {
          categories: {
            some: {
              id: { in: categoryIds },
            },
          },
        },
        {
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
        ...(selectedBrand
          ? [
              {
                brands: {
                  some: {
                    slug: selectedBrand,
                  },
                },
              },
            ]
          : []),
        ...(selectedAttributes.length > 0
          ? [
              {
                attributes: {
                  some: {
                    name: { in: selectedAttributes },
                  },
                },
              },
            ]
          : []),
      ],
    },
    include: {
      medias: true,
      brands: true,
      categories: true,
      attributes: {
        include: { group: true },
      },
    },
  });

  // Filtreleme için veriler
  const [attributeGroups, brands] = await Promise.all([
    prisma.attributeGroup.findMany({ include: { attributes: true } }),
    prisma.brand.findMany(),
  ]);

  return (
    <div className="mt-4 px-2">
      {/* Debug */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-100 p-2 mb-4 text-sm">
          <p>Ana Kategori: {category.name} (ID: {category.id})</p>
          <p>
            Aranan Kategori ID'leri: <strong>{categoryIds.join(", ")}</strong>
          </p>
          <p>Bulunan Ürün Sayısı: {products.length}</p>
        </div>
      )}

      {/* Mobil filtre */}
      <div className="block lg:hidden mb-4">
        <MobileFilter
          attributeGroups={attributeGroups}
          brands={brands}
          subcategories={category.children}
        />
      </div>

      {/* Masaüstü */}
      <div className="flex">
        <aside className="hidden lg:block w-[250px]">
          <FilterSidebar
            attributeGroups={attributeGroups}
            brands={brands}
            subcategories={category.children}
          />
        </aside>

        <main className="flex-1">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">{category.name} Kategorisi</h1>
            <p className="text-gray-600">
              Toplam {products.length} ürün listelendi.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              Bu kategoride henüz ürün bulunmuyor.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
