'use client';

import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    onChange?.(selectedIds);
  }, [selectedIds, onChange]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-medium text-muted-foreground">Medya Seç</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {medias.map((media) => {
          const isSelected = selectedIds.includes(media.id);
          return (
            <div
              key={media.id}
              className={`relative rounded-lg overflow-hidden ring-2 transition-all duration-200 cursor-pointer ${
                isSelected ? 'ring-green-500' : 'ring-transparent'
              }`}
              onClick={() => toggleSelection(media.id)}
            >
              <Image
                src={media.urls[0]}
                alt="media"
                width={300}
                height={200}
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 left-2 bg-white/80 rounded p-1 shadow">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleSelection(media.id)}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
