import ProductDetails from "@/components/(frontend)/product/ProductDetails";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: {
      slug: params.slug,
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      price: true,
      medias: {
        select: {
          urls: true,
        },
      },
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
      group: {
        select: {
          name: true, // ✅ grup ismi eklendi
          slug: true, // (istersen detay sayfası linki için)
          products: {
            select: {
              id: true,
              slug: true,
              name: true,
              price: true,
              stock: true,
              medias: {
                select: {
                  urls: true,
                },
              },
            },
          },
        },
      },
    },
  });
  

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductDetails product={product} />;
}
