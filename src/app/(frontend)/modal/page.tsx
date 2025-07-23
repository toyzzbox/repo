import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";

// MediaModalButtonWrapper dinamik olarak sadece client'ta yüklenecek
const MediaModalButtonWrapper = dynamic(() => import("./MediaModalButtonWrapper"), {
  ssr: false,
});

export default async function MediasPage() {
  const medias = await prisma.media.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Medya Yöneticisi</h1>
      </div>

      <MediaModalButtonWrapper initialMedias={medias} />
    </div>
  );
}
