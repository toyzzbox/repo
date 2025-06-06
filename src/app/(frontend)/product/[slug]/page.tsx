import { getRelatedProducts } from "@/actions/getRelatedProducts";
import ProductDetailsWrapper from "@/components/(frontend)/product/ProductDetailsWrapper";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: {
    slug: string;
  };
};

export default async function ProductPage({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true, // ✅ Doğru alan bu
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
          name: true,
          slug: true,
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

  const categoryIds = product.categories?.map((cat) => cat.id) || [];
  const relatedProducts = categoryIds.length
    ? await getRelatedProducts(product.id, categoryIds)
    : [];

  return (
    <ProductDetailsWrapper
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
