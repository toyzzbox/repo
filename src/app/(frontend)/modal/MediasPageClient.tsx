"use client";

import { useState } from "react";
import MediaModalButton from "./MediaModalButton";
import Image from "next/image";

interface Media {
  id: string;
  urls: string[];
}

interface MediasPageClientProps {
  medias: Media[];
}

export default function MediasPageClient({ medias }: MediasPageClientProps) {
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  const handleSelect = (selected: Media[]) => {
    setSelectedMedias(selected);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Medya Yöneticisi</h1>
      </div>

      {/* 🔘 Modal Button, seçilenleri parent'a gönderir */}
      <MediaModalButton medias={medias} onSelect={handleSelect} />

      {/* 📷 Seçilen medyaları burada göster */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {selectedMedias.map((media) =>
          media.urls.map((url, idx) => (
            <Image
              key={media.id + idx}
              src={url}
              alt="Selected Media"
              width={200}
              height={200}
              className="rounded-md object-cover"
            />
          ))
        )}
      </div>
    </div>
  );
}
