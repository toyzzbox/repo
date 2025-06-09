"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { useState, useEffect } from "react";

interface Media {
  id: string;
  urls: string[];
}

interface MediaSelectorProps {
  medias: Media[];
  defaultSelected?: string[];
}

export default function MediaSelector({
  medias,
  defaultSelected = [],
}: MediaSelectorProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelected);

  const handleToggle = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-2">
      <Label className="font-medium block">Medya</Label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {medias.map((media) => (
          <label
            key={media.id}
            className="relative group rounded border hover:ring-2 ring-orange-500 cursor-pointer overflow-hidden"
          >
            <input
              type="checkbox"
              name="mediaIds[]"
              value={media.id}
              checked={selectedIds.includes(media.id)}
              onChange={() => handleToggle(media.id)}
              className="sr-only"
            />
            <div className="absolute top-2 left-2 z-10 bg-white p-1 rounded shadow">
              <Checkbox
                checked={selectedIds.includes(media.id)}
                onCheckedChange={() => handleToggle(media.id)}
              />
            </div>
            <Image
              src={media.urls[0]}
              alt="Media"
              width={300}
              height={200}
              className="w-full h-32 object-cover"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
