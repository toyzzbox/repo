// app/(backend)/administor/products/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import EditProductForm from "@/components/(backend)/product/EditProductForm";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({
    where: { id: params.id },
    include: {
      brands: true,
      categories: true,
      attributes: true,
      group: true,
      medias: {
        orderBy: { order: "asc" },
        include: {
          media: {
            include: {
              variants: true, // cdnUrl
            },
          },
        },
      },
    },
  });

  if (!product) return <div>Ürün bulunamadı.</div>;

  // Ürüne ait medyalar -> Edit form için dönüştürme
  const productMedias = product.medias.map((m) => ({
    id: m.media.id,
    urls: m.media.variants.map((v) => v.cdnUrl),
  }));

  // Tüm medya listesi (modal için)
  const mediasRaw = await prisma.media.findMany({
    include: {
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const medias = mediasRaw.map((m) => ({
    id: m.id,
    urls: m.variants.map((v) => v.cdnUrl),
  }));

  const brands = await prisma.brand.findMany();
  const categories = await prisma.category.findMany();
  const attributes = await prisma.attribute.findMany();
  const productGroups = await prisma.productGroup.findMany();

  return (
    <EditProductForm
      product={{
        id: product.id,
        name: product.name,
        serial: product.serial || "",
        barcode: product.barcode || "",
        stock: product.stock,
        price: product.price,
        discount: product.discount || 0,
        groupId: product.groupId || "",
        description: product.description || "",
        brandIds: product.brands.map((b) => b.id),
        categoryIds: product.categories.map((c) => c.id),
        mediaIds: productMedias.map((m) => m.id), // sadece id
      }}
      medias={medias}
      productMedias={productMedias}            // 👈 ürünün kendi medyaları
      brands={brands}
      categories={categories}
      productGroups={productGroups}
      attributes={attributes}
    />
  );
}
