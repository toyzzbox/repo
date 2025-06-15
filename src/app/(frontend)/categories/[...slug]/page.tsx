// src/app/categories/[...slug]/page.tsx
import { prisma} from "@/lib/prisma";          // 🔄 tek satırda ikisi birden
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import FilterSidebar from "./FilterSideBar";
import MobileFilter from "./MobileFilter";

interface Props {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}

// Derin kategori ID'lerini toplayan fonksiyon
type CategoryWithChildren = Prisma.CategoryGetPayload<{
  include: { children: { include: { children: true } } };
}>;

function collectCategoryIds(category: CategoryWithChildren): string[] {
  return [category.id, ...category.children.flatMap(collectCategoryIds)];
}

export default async function CategoryPage({ params, searchParams = {} }: Props) {
  const slugSegments = params.slug;
  const currentSlug = slugSegments.at(-1)!;
  const parentSlugs = slugSegments.slice(0, -1);

  const minPrice = Number(searchParams.price_gte ?? 0);
  const maxPrice = Number(searchParams.price_lte ?? 99999);

  const selectedAttributes = Array.isArray(searchParams.attribute)
    ? searchParams.attribute
    : searchParams.attribute
    ? [searchParams.attribute]
    : [];

  const selectedBrand =
    typeof searchParams.brand === "string" ? searchParams.brand : undefined;

  const category = await prisma.category.findUnique({
    where: { slug: currentSlug },
    include: {
      parent: { select: { slug: true } },
      children: {
        include: {
          children: {
            include: { children: true },
          },
        },
      },
    },
  });

  if (!category) return notFound();

  if (parentSlugs.length && category.parent?.slug !== parentSlugs.at(-1)) {
    return notFound();
  }

  const categoryIds = collectCategoryIds(category);

  const products = await prisma.product.findMany({
    where: {
      AND: [
        { categories: { some: { id: { in: categoryIds } } } },
        { price: { gte: minPrice, lte: maxPrice } },
        ...(selectedBrand
          ? [{ brands: { some: { slug: selectedBrand } } }]
          : []),
        ...(selectedAttributes.length
          ? [
              {
                attributes: { some: { name: { in: selectedAttributes } } },
              },
            ]
          : []),
      ],
    },
    include: {
      medias: true,
      brands: true,
      categories: true,
      attributes: { include: { group: true } },
    },
  });

  const [attributeGroups, brands] = await Promise.all([
    prisma.attributeGroup.findMany({ include: { attributes: true } }),
    prisma.brand.findMany(),
  ]);

  return (
    <div className="mt-4 px-2">
      {process.env.NODE_ENV === "development" && (
        <div className="bg-yellow-100 p-2 mb-4 text-sm">
          <p>Kategori: {category.name} (ID: {category.id})</p>
          <p>Kapsanan Alt Kategoriler: {categoryIds.join(", ")}</p>
          <p>Toplam Ürün: {products.length}</p>
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
