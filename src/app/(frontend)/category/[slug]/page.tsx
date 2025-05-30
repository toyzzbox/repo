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

  // Fiyat aralığı
  const minPrice = Number(searchParams.price_gte) || 0;
  const maxPrice = Number(searchParams.price_lte) || 99999;

  // Seçilen attribute'lar
  const selectedAttributes = Array.isArray(searchParams.attribute)
    ? searchParams.attribute
    : searchParams.attribute
    ? [searchParams.attribute]
    : [];

  // Seçilen marka
  const selectedBrand = searchParams.brand?.toString();

  // Seçilen alt kategori (tek seçim)
  const selectedSubcategory = searchParams.subcategory?.toString();

  // Mevcut kategori + alt kategorileri + ürünleri al
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
  const attributeGroups = await prisma.attributeGroup.findMany({
    include: { attributes: true },
  });

  const brands = await prisma.brand.findMany();

  return (
    <div className="flex">
      <FilterSidebar
        attributeGroups={attributeGroups}
        brands={brands}
        subcategories={category?.children || []}
      />
      <div className="flex-1">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-2">
            {category?.name} Kategorisi
          </h1>
          <p className="text-gray-600">
            Toplam {category?.products.length || 0} ürün listelendi.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {category?.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
