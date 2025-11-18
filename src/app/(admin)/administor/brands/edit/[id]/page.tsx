import EditBrandForm from "@/components/(backend)/brand/EditBrandForm";
import { prisma } from "@/lib/prisma";
import { Brand } from "@/types/brand";
import { Media } from "@/types/product";

type BrandWithMedias = Brand & {
  medias: Media[];
};

export default async function EditPage({ params }: { params: { id: string } }) {
  const brand = await prisma.brand.findUnique({
    where: { id: params.id },
    include: {
      medias: true,
    },
  });

  if (!brand) return <div>Marka bulunamadı.</div>;

  // 📌 BURAYA DÜZELTİLMİŞ MEDIA GETİRME KODU GELİYOR
  const medias = await prisma.media.findMany({
    include: {
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
  });

  const typedBrand = brand as BrandWithMedias;

  return (
    <EditBrandForm
      brand={{
        ...typedBrand,
        mediaIds: typedBrand.medias.map((m) => m.id),
      }}
      medias={medias}
    />
  );
}
