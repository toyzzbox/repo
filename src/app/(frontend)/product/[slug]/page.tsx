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
      urls: true,
      categories: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!product) {
    return <div>Product not found</div>;
  }

  return <ProductDetails product={product} />;
}
