"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface Media {
  id: string;
  urls: string[];
}

interface MediaModalButtonProps {
  medias: Media[];
  onSelect: (selected: Media[]) => void;
}

export default function MediaModalButton({ medias, onSelect }: MediaModalButtonProps) {
  const [open, setOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const selectedMedias = medias.filter((m) => selectedIds.includes(m.id));
    onSelect(selectedMedias);
    setOpen(false);
  };

  return (
    <>
      <button
        className="bg-orange-500 text-white px-4 py-2 rounded"
        onClick={() => setOpen(true)}
      >
        Medya Seç
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {medias.map((media) =>
              media.urls.map((url, idx) => (
                <div
                  key={media.id + idx}
                  onClick={() => toggleSelect(media.id)}
                  className={`cursor-pointer border-4 ${
                    selectedIds.includes(media.id)
                      ? "border-orange-500"
                      : "border-transparent"
                  }`}
                >
                  <Image
                    src={url}
                    alt="Media"
                    width={200}
                    height={200}
                    className="rounded-md object-cover"
                  />
                </div>
              ))
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={handleConfirm}
            >
              Onayla
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
