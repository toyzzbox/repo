'use client';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

interface Media {
  id: string;
  urls: string[];
}

interface MediaSelectorProps {
  medias: Media[];
  defaultSelected?: string[];
  onChange?: (selectedIds: string[]) => void;
}

export default function MediaSelector({
  medias,
  defaultSelected = [],
  onChange,
}: MediaSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelected);

  // 1️⃣ Sadece defaultSelected dışarıdan değişirse state'i güncelle
  useEffect(() => {
    setSelectedIds(defaultSelected);
  }, [defaultSelected]);

  // 2️⃣ onChange'i useCallback ile sarmalayalım ve bağımlılıklara ekleyelim
  useEffect(() => {
    if (onChange) {
      onChange(selectedIds);
    }
  }, [selectedIds, onChange]);

  // 3️⃣ toggleSelection fonksiyonunu useCallback ile optimize edelim
  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }, []);

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">Medya Seç</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {medias.map((media) => {
          const isSelected = selectedIds.includes(media.id);
          return (
            <div
              key={media.id}
              onClick={() => toggleSelection(media.id)}
              className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                isSelected ? 'border-green-500 ring-2 ring-green-200' : 'border-gray-300'
              }`}
            >
              <Image
                src={media.urls[0]}
                alt="Media"
                width={300}
                height={200}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 left-2 bg-white/80 rounded p-1 shadow">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => {
                    // Checkbox'tan gelen boolean değeri kullan
                    if (checked !== isSelected) {
                      toggleSelection(media.id);
                    }
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}