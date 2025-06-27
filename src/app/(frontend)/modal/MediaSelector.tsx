"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { X } from "lucide-react";
import MediaModal from "./MediaModal";

interface Media {
  id: string;
  urls: string[];
}

interface MediaSelectorProps {
  medias: Media[]; // Tüm medyalar
  initialSelectedMedias?: Media[]; // Başlangıçta seçili medyalar
  onSelectionChange?: (selectedMedias: Media[]) => void; // Seçim değiştiğinde
  maxSelection?: number; // Maksimum seçim sayısı
}

export default function MediaSelector({
  medias,
  initialSelectedMedias = [],
  onSelectionChange,
  maxSelection
}: MediaSelectorProps) {
  const [selectedMedias, setSelectedMedias] = useState<Media[]>(initialSelectedMedias);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSelectMedia = (newSelectedMedias: Media[]) => {
    let finalSelection = newSelectedMedias;
    
    // Maksimum seçim kontrolü
    if (maxSelection && newSelectedMedias.length > maxSelection) {
      finalSelection = newSelectedMedias.slice(0, maxSelection);
    }
    
    setSelectedMedias(finalSelection);
    onSelectionChange?.(finalSelection);
    setIsModalOpen(false);
  };

  const handleRemoveMedia = (mediaId: string) => {
    const newSelection = selectedMedias.filter(media => media.id !== mediaId);
    setSelectedMedias(newSelection);
    onSelectionChange?.(newSelection);
  };

  const handleClearAll = () => {
    setSelectedMedias([]);
    onSelectionChange?.([]);
  };

  return (
    <div className="space-y-4">
      {/* Kontrol Butonları */}
      <div className="flex gap-2">
        <Button 
          onClick={() => setIsModalOpen(true)}
          variant="outline"
        >
          Medya Seç
        </Button>
        
        {selectedMedias.length > 0 && (
          <Button 
            onClick={handleClearAll}
            variant="outline"
            className="text-red-600 hover:text-red-700"
          >
            Tümünü Temizle
          </Button>
        )}
        
        <span className="text-sm text-gray-500 flex items-center">
          {selectedMedias.length} medya seçildi
          {maxSelection && ` (Maksimum: ${maxSelection})`}
        </span>
      </div>

      {/* Seçili Medyalar */}
      {selectedMedias.length > 0 && (
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-3">Seçili Medyalar</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {selectedMedias.map((media) => (
              <div
                key={media.id}
                className="relative group border rounded-lg overflow-hidden"
              >
                {media.urls && media.urls[0] && (
                  <Image
                    src={media.urls[0]}
                    alt="Selected media"
                    width={150}
                    height={100}
                    className="object-cover w-full h-24"
                    unoptimized
                  />
                )}
                
                {/* Kaldırma Butonu */}
                <button
                  onClick={() => handleRemoveMedia(media.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boş Durum */}
      {selectedMedias.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-2">Henüz medya seçilmedi</p>
          <Button 
            onClick={() => setIsModalOpen(true)}
            variant="outline"
          >
            Medya Seç
          </Button>
        </div>
      )}

      {/* Medya Modal */}
      <MediaModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        medias={medias}
        onSelectMedia={handleSelectMedia}
        selectedMediaIds={selectedMedias.map(m => m.id)}
        isSelectionMode={true}
      />
    </div>
  );
}