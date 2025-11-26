"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useEffect, useState } from "react";

type MediaVariant = {
  id: string;
  key: string;
  cdnUrl: string;
  type: string;
};

type Media = {
  id: string;
  title?: string | null;
  variants: MediaVariant[];
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (media: Media) => void;
}

export default function BannerMediaModal({ open, onClose, onSelect }: Props) {
  const [medias, setMedias] = useState<Media[]>([]);

  useEffect(() => {
    if (!open) return;

    fetch("http://localhost:3001/media") // ✅ Media API endpoint’in
      .then((res) => res.json())
      .then(setMedias);
  }, [open]);

  const getPreview = (media: Media) =>
    media.variants.find((v) => v.type === "WEBP")?.cdnUrl ||
    media.variants.find((v) => v.type === "OG_IMAGE")?.cdnUrl ||
    media.variants.find((v) => v.type === "ORIGINAL")?.cdnUrl;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Banner Görseli Seç</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[70vh] overflow-y-auto">
          {medias.map((media) => {
            const preview = getPreview(media);
            return (
              <button
                key={media.id}
                onClick={() => {
                  onSelect(media);
                  onClose();
                }}
                className="relative border rounded overflow-hidden hover:ring-2 hover:ring-primary"
              >
                {preview && (
                  <Image
                    src={preview}
                    alt="banner"
                    width={300}
                    height={200}
                    className="object-cover w-full h-32"
                  />
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
