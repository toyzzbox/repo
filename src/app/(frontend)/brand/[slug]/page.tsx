// app/brand/[slug]/page.tsx

import { BrandDetails } from "@/components/(frontend)/brand/BrandDetails";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function BrandPage({ params }: PageProps) {
  const brand = await prisma.brand.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      medias: {
        select: {
          urls: true,
        },
      },
      products: {
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          medias: {
            select: {
              urls: true,
            },
          },
        },
      },
    },
  });

  if (!brand) {
    return <div>Brand not found</div>;
  }

  return <BrandDetails brand={brand} />;
}
