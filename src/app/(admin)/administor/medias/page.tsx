
import { prisma } from "@/lib/prisma";
import MediaManagerModal from "../media/MediaManagerModal";

export default async function Page() {
  const medias = await prisma.media.findMany();

  return (
    <div className="p-6">
<MediaManagerModal
  medias={medias}
  onSelect={(media) => {
    console.log("Seçilen medya:", media);
  }}
/>
    </div>
  );
}
