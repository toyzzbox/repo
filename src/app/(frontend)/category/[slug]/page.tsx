// src/app/categories/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/(frontend)/product/ProductCard";
import FilterSidebar from "./FilterSideBar";


interface Props {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = params;

  const minPrice = Number(searchParams.price_gte) || 0;
  const maxPrice = Number(searchParams.price_lte) || 99999;
  const selectedAttributes = Array.isArray(searchParams.attribute)
    ? searchParams.attribute
    : searchParams.attribute
    ? [searchParams.attribute]
    : [];

  const selectedBrand = searchParams.brand?.toString();

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: {
          price: { gte: minPrice, lte: maxPrice },
          ...(selectedBrand && {
            brands: { some: { slug: selectedBrand } },
          }),
          ...(selectedAttributes.length > 0 && {
            attributes: {
              some: {
                name: { in: selectedAttributes },
              },
            },
          }),
        },
        include: {
          medias: true,
          brands: true,
          categories: true,
          attributes: { include: { group: true } },
        },
      },
    },
  });

  // Filtre seçenekleri için tüm attribute grup ve attribute'ları getir
  const attributeGroups = await prisma.attributeGroup.findMany({
    include: { attributes: true },
  });

  const brands = await prisma.brand.findMany();

  return (
    <div className="flex">
      <FilterSidebar attributeGroups={attributeGroups} brands={brands} />
      <div className="grid grid-cols-4 gap-6 p-4">
        {category?.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
