import { prisma } from "@/lib/prisma";
import CreateAttributeForm from "./CreateAttributeForm";

async function getAttributeGroups() {
  return prisma.attributeGroup.findMany();
}

async function getMedias() {
  return prisma.media.findMany({
    include: {
      variants: true, // ✔ S3 URL buradan geliyor
    },
    orderBy: { createdAt: "desc" },
  });
}

export default async function CreateAttribute() {
  const [attributeGroups, medias] = await Promise.all([
    getAttributeGroups(),
    getMedias(),
  ]);

  // Frontend'e sade formatla gönder
  const safeMedias = medias.map((m) => ({
    id: m.id,
    urls: m.variants.map((v) => v.cdnUrl), // ✔ modal için URL dizisi
  }));

  return (
    <div className="w-full max-w-6xl mx-auto text-center h-screen">
      <h1 className="font-bold text-2xl mt-20 mb-10">Yeni Nitelik Oluştur</h1>

      <CreateAttributeForm
        attributeGroups={attributeGroups}
        medias={safeMedias}
      />
    </div>
  );
}
