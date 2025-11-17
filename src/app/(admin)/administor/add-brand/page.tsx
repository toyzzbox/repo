import { prisma } from "@/lib/prisma";
import BrandForm from "./BrandForm";

export default async function Page() {
  const medias = await prisma.media.findMany({
    include: {
      variants: true, // cdnUrl burada
    },
    orderBy: { createdAt: "desc" },
  });

  const safeMedias = medias.map((media) => ({
    id: media.id,
    urls: media.variants.map((v) => v.cdnUrl),
    title: media.title,
    altText: media.altText,
  }));

  return <BrandForm medias={safeMedias} />;
}
