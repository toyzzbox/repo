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

  const medias = await prisma.media.findMany();

  if (!brand) return <div>Marka bulunamadı.</div>;

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
