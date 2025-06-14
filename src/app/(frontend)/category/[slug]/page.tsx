import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import FilterSidebar from "./FilterSideBar";
import MobileFilter from "./MobileFilter";

// Rekürsif kategori ID toplayıcı
function getDescendantIds(category: any): string[] {
  const ids: string[] = [];
  function traverse(cat: any) {
    ids.push(cat.id);
    cat.children?.forEach(traverse);
  }
  traverse(category);
  return ids;
}

interface Props {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams = {} }: Props) {
  const slug = params.slug;

  const minPrice = Number(searchParams.price_gte ?? 0);
  const maxPrice = Number(searchParams.price_lte ?? 99999);

  const selectedAttributes = Array.isArray(searchParams.attribute)
    ? searchParams.attribute
    : searchParams.attribute
    ? [searchParams.attribute]
    : [];

  const selectedBrand =
    typeof searchParams.brand === "string" ? searchParams.brand : undefined;

  const selectedSubcategory =
    typeof searchParams.subcategory === "string" ? searchParams.subcategory : undefined;

  // Kategoriyi ve tüm torunları al
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      children: {
        include: {
          children: {
            include: {
              children: true, // 3 seviye derinlik, gerekirse artırabilirsin
            },
          },
        },
      },
    },
  });

  if (!category) {
    return <div className="p-4">Kategori bulunamadı.</div>;
  }

  // Alt + torun tüm kategori ID'lerini al
  const categoryIds = getDescendantIds(category);

  // Ürünleri getir
  const products = await prisma.product.findMany({
    where: {
      categories: {
        some: {
          id: { in: categoryIds },
        },
      },
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
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
  });

  const [attributeGroups, brands] = await Promise.all([
    prisma.attributeGroup.findMany({
      include: { attributes: true },
    }),
    prisma.brand.findMany(),
  ]);

  return (
    <div className="mt-4 px-2">
      {/* Mobil Filtre */}
      <div className="block lg:hidden mb-4">
        <MobileFilter
          attributeGroups={attributeGroups}
          brands={brands}
          subcategories={category.children}
        />
      </div>

      {/* Masaüstü görünüm */}
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
