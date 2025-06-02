import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import FilterSidebar from "./FilterSideBar";
import MobileFilter from "./MobileFilter"; // 📱 mobil filtre bileşeni

interface Props {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
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
  const selectedBrand = typeof searchParams.brand === "string" ? searchParams.brand : undefined;

  // Seçilen alt kategori
  const selectedSubcategory =
    typeof searchParams.subcategory === "string" ? searchParams.subcategory : undefined;

  // Kategori ve filtrelenmiş ürünleri getir
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: true, // alt kategoriler
      products: {
        where: {
          price: { gte: minPrice, lte: maxPrice },
          ...(selectedBrand && {
            brands: {
              some: {
                slug: selectedBrand,
              },
            },
          }),
          ...(selectedAttributes.length > 0 && {
            attributes: {
              some: {
                name: { in: selectedAttributes },
              },
            },
          }),
          ...(selectedSubcategory && {
            categories: {
              some: {
                slug: selectedSubcategory,
              },
            },
          }),
        },
        include: {
          medias: true,
          brands: true,
          categories: true,
          attributes: {
            include: { group: true },
          },
        },
      },
    },
  });

  // Filtre verileri
  const [attributeGroups, brands] = await Promise.all([
    prisma.attributeGroup.findMany({ include: { attributes: true } }),
    prisma.brand.findMany(),
  ]);

  return (
    <div className="mt-4 px-2">
      {/* Mobil Filtre */}
      <div className="block lg:hidden mb-4">
        <MobileFilter
          attributeGroups={attributeGroups}
          brands={brands}
          subcategories={category?.children || []}
        />
      </div>

      {/* Ana Grid */}
      <div className="flex">
        {/* Masaüstü Filtre */}
        <aside className="hidden lg:block w-[250px]">
          <FilterSidebar
            attributeGroups={attributeGroups}
            brands={brands}
            subcategories={category?.children || []}
          />
        </aside>

        {/* Ürün Listesi */}
        <main className="flex-1">
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-2">{category?.name} Kategorisi</h1>
            <p className="text-gray-600">
              Toplam {category?.products.length || 0} ürün listelendi.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {category?.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
