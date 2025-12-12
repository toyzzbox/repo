import EditBrandForm from "@/components/(backend)/brand/EditBrandForm";
import { prisma } from "@/lib/prisma";
import { Brand } from "@/types/brand";

type BrandWithMedias = Brand & {
  medias: { id: string }[];
};

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPage({ params }: PageProps) {
  const { id } = await params;

  const brand = await prisma.brand.findUnique({
    where: { id },
    include: {
      medias: {
        include: {
          variants: true, // Ürünün mevcut medyaları için gerekli
        },
      },
    },
  });

  if (!brand) return <div>Marka bulunamadı.</div>;

  // 🟢 1) Marka'ya ait medya format dönüşümü
  const brandMedias = brand.medias.map((m) => ({
    id: m.id,
    urls: m.variants.map((v) => v.cdnUrl),
  }));

  // 🟢 2) Tüm medya listesini çek (modal için) — urls formatında
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

  const typedBrand = brand as BrandWithMedias;

  return (
    <EditBrandForm
      brand={{
        ...typedBrand,
        mediaIds: brandMedias.map((m) => m.id),
        medias: brandMedias,
      }}
      medias={medias}
    />
  );
}
