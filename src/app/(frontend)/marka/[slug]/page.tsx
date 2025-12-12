import { BrandDetails } from "@/components/(frontend)/brand/BrandDetails";
import { prisma } from "@/lib/prisma";

type SearchParams = Record<string, string | string[] | undefined>;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<SearchParams>;
};

export default async function BrandPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = (searchParams ? await searchParams : {}) as SearchParams;

  const minPrice = Number(sp.price_gte ?? 0);
  const maxPrice = Number(sp.price_lte ?? 999999);

  const brand = await prisma.brand.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,

      // BRAND MEDIAS (LOGO, GÖRSELLER)
      medias: {
        select: {
          id: true,
          title: true,
          altText: true,
          variants: {
            select: {
              cdnUrl: true,
              key: true,
              width: true,
              height: true,
              format: true,
            },
          },
        },
      },

      // BRAND PRODUCTS
      products: {
        where: {
          price: { gte: minPrice, lte: maxPrice },
        },
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          medias: {
            orderBy: { order: "asc" },
            include: {
              media: {
                select: {
                  variants: {
                    select: {
                      cdnUrl: true,
                      key: true,
                      width: true,
                      height: true,
                      format: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!brand) return <div>Brand not found</div>;

  return <BrandDetails brand={brand} />;
}
