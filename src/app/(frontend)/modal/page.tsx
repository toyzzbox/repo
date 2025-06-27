"use client";

import { useState } from "react";
import MediaModal from "./MediaModal";

interface Media {
  id: string;
  urls: string[];
}

export default function MediaSelectorPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  const handleSelectMedia = (medias: Media[]) => {
    setSelectedMedias(medias); // Modal kapandığında seçilenleri state'e ata
  };

  return (
    <div className="p-10">
      <button
        onClick={() => setModalOpen(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Medya Seç
      </button>

      {/* Modal */}
      <MediaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        medias={[]} // Buraya media listeni props olarak geçir
        onSelectMedia={handleSelectMedia}
        isSelectionMode={true}
        selectedMediaIds={selectedMedias.map(m => m.id)}
      />

      {/* Seçilen Medyalar */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {selectedMedias.map((media) => (
          <div key={media.id} className="border rounded overflow-hidden">
            {media.urls && media.urls[0] && (
              <img
                src={media.urls[0]}
                alt="selected media"
                className="object-cover w-full h-48"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
