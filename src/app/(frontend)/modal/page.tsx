// app/(admin)/medya/page.tsx veya başka bir yerden tetiklenen bir modal olabilir
import { prisma } from "@/lib/prisma";
import MediaModal from "./MediaModal";

export default async function MediaModalPage() {
  const medias = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* modal burada açılır (ister sayfada, ister butonla tetiklenebilir) */}
      <MediaModal open={true} onClose={() => {}} medias={medias} />
    </div>
  );
}
