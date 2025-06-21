import { prisma } from "@/lib/prisma";
import CreateAttributeForm from "./CreateAttributeForm";

async function getAttributeGroups() {
  try {
    return await prisma.attributeGroup.findMany();
  } catch (error) {
    console.error("Error fetching attribute groups:", error);
    return [];
  }
}

async function getMedias() {
  try {
    return await prisma.media.findMany({
      select: {
        id: true,
        urls: true,
      },
    });
  } catch (error) {
    console.error("Error fetching medias:", error);
    return [];
  }
}

export default async function CreateAttribute() {
  const [attributeGroups, medias] = await Promise.all([
    getAttributeGroups(),
    getMedias(),
  ]);

  return (
    <div className="w-full max-w-6xl mx-auto text-center h-screen">
      <h1 className="font-bold text-2xl mt-20 mb-10">Yeni Nitelik Oluştur</h1>
      <CreateAttributeForm attributeGroups={attributeGroups} medias={medias} />
    </div>
  );
}
