'use client';
import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';

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
  const [selectedIds, setSelectedIds] = useState<string[]>(
    () => [...defaultSelected]
  );

  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current?.(selectedIds);
  }, [selectedIds]);

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
          const url = media.urls?.[0];
          if (!url) return null; // 👈 hatalı url varsa atla

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
                src={url}
                alt="Media"
                width={300}
                height={200}
                className="w-full h-32 object-cover"
              />
              <div 
                className="absolute top-2 left-2 bg-white/80 rounded p-1 shadow"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelection(media.id)}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
