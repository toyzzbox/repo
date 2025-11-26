import { prisma } from "@/lib/prisma";
import CreateBannerForm from "../CreateBannerForm";

export default async function Page() {
  const medias = await prisma.media.findMany({
    include: {
      variants: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const safeMedias = medias.map((media) => ({
    id: media.id,
    urls: media.variants.map((v) => v.cdnUrl),
    title: media.title,
    altText: media.altText,
    type: media.type,
  }));

  const serialize = (data: any) => JSON.parse(JSON.stringify(data));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Yeni Banner Ekle</h1>

      <CreateBannerForm medias={serialize(safeMedias)} />
    </div>
  );
}
