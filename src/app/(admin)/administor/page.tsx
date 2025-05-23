import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const medias = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Yüklenen Medyalar</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {medias.map((media) =>
          media.urls.map((url, index) => (
            <div key={`${media.id}-${index}`} className="border rounded overflow-hidden">
              {media.type === "image" ? (
                <img src={url} alt="medya" className="w-full h-auto" />
              ) : (
                <video controls className="w-full h-auto">
                  <source src={url} />
                  Tarayıcınız videoyu desteklemiyor.
                </video>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
