import { prisma } from "@/lib/prisma";
import BrandForm from "./BrandForm";

export default async function Page() {
  // ✅ Media + MediaVariant ilişkisini birlikte çek
  const medias = await prisma.media.findMany({
    include: {
      variants: true, // burada cdnUrl bilgisi var
    },
    orderBy: { createdAt: "desc" },
  });

  // ✅ Frontend'e sade ve güvenli formatta gönder (S3 URL'ler dahil)
  const safeMedias = medias.map((media) => ({
    id: media.id,
    urls: media.variants.map((v) => v.cdnUrl), // cdnUrl dizisi oluştur
    title: media.title,
    altText: media.altText,
  }));

  return <BrandForm medias={safeMedias} />;
}
