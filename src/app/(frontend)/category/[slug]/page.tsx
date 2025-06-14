// src/app/categories/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import FilterSidebar from "./FilterSideBar";
import MobileFilter from "./MobileFilter";

interface Props {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams = {} }: Props) {
  const { slug } = params;

  const {
    price_gte = "0",
    price_lte = "99999",
    attribute,
    brand,
    subcategory,
  } = searchParams;

  const minPrice = Number(price_gte);
  const maxPrice = Number(price_lte);

  const selectedAttributes = Array.isArray(attribute)
    ? attribute
    : attribute
    ? [attribute]
    : [];

  const selectedBrand = typeof brand === "string" ? brand : undefined;
  const selectedSubcategory = typeof subcategory === "string" ? subcategory : undefined;

  const category = await prisma.category.findUnique({
    where: { slug },
    select: { id: true, name: true },
  });

  if (!category) {
    return <div className="p-4">Kategori bulunamadı.</div>;
  }

  const products = await prisma.product.findMany({
    where: {
      categories: {
        some: { id: category.id },
      },
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
      brandId: selectedBrand,
      attributes: selectedAttributes.length
        ? {
            some: {
              id: { in: selectedAttributes },
            },
          }
        : undefined,
      subcategoryId: selectedSubcategory,
    },
    include: {
      medias: true,
      brand: true,
    },
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6 px-4 py-6">
      <div className="hidden md:block">
        <FilterSidebar
          categoryId={category.id}
          selectedAttributes={selectedAttributes}
          selectedBrand={selectedBrand}
          selectedSubcategory={selectedSubcategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
      <div className="md:hidden mb-4">
        <MobileFilter
          categoryId={category.id}
          selectedAttributes={selectedAttributes}
          selectedBrand={selectedBrand}
          selectedSubcategory={selectedSubcategory}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {products.length === 0 && (
          <div className="col-span-full text-center text-muted-foreground">
            Ürün bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
