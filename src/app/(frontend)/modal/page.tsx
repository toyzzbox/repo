// app/admin/medias/page.tsx
import { prisma } from "@/lib/prisma";
import MediaModalButton from "./MediaModalButton";

export default async function MediasPage() {
  const medias = await prisma.media.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Medya Yöneticisi</h1>
      </div>

      <MediaModalButton medias={medias} />
    </div>
  );
  
}
