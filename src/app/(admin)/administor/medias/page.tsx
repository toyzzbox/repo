import { prisma } from "@/lib/prisma";
import MediaManagerModal from "../media/MediaManagerModal";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const medias = await prisma.media.findMany({
    include: { variants: true }, // urls gerekiyorsa
    orderBy: { createdAt: "desc" },
  });

  const safeMedias = medias.map((m) => ({
    id: m.id,
    title: m.title,
    altText: m.altText,
    urls: m.variants?.map((v) => v.cdnUrl) ?? [],
    createdAt: m.createdAt?.toISOString?.() ?? null,
  }));

  return (
    <div className="p-6">
      <MediaManagerModal medias={safeMedias} />
    </div>
  );
}
