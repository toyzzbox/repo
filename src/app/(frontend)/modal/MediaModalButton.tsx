"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MediaModal from "./MediaModal";
import Image from "next/image";

interface Media {
  id: string;
  urls: string[];
}

interface MediaModalButtonProps {
  medias: Media[];
}

export default function MediaModalButton({ medias }: MediaModalButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSelectedMediasChange = (medias: Media[]) => {
    setSelectedMedias(medias);
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleOpenModal}>
        Medya Seç
      </Button>

      {/* Seçili Medyaları Göster */}
      {selectedMedias.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            Seçili Medyalar ({selectedMedias.length})
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {selectedMedias.map((media) => (
              <div
                key={media.id}
                className="relative border rounded overflow-hidden"
              >
                <Image
                  src={media.urls[0]}
                  alt="Selected media"
                  width={150}
                  height={100}
                  className="object-cover w-full h-24"
                  unoptimized
                />
                <button
                  onClick={() => {
                    const updated = selectedMedias.filter(m => m.id !== media.id);
                    setSelectedMedias(updated);
                  }}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <MediaModal
        open={isModalOpen}
        onClose={handleCloseModal}
        medias={medias}
        onSelectedMediasChange={handleSelectedMediasChange}
        selectedMediaIds={selectedMedias.map(m => m.id)}
      />
    </div>
  );
}