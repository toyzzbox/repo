import { prisma } from "@/lib/prisma";
import BrandForm from "./BrandForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const medias = await prisma.media.findMany({
    include: { variants: true },
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
