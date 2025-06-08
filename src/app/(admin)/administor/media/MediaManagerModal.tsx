"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Media {
  id: string;
  urls: string[];
}

interface MediaManagerModalProps {
  medias: Media[];
  onSelect?: (media: Media) => void;
}

export default function MediaManagerModal({ medias, onSelect }: MediaManagerModalProps) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [localMedias, setLocalMedias] = useState<Media[]>(medias); // ✅ local state
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Orijinal prop değişirse localMedias güncellensin
  useEffect(() => {
    setLocalMedias(medias);
  }, [medias]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // Medya örneği oluştur
      const newMedia: Media = {
        id: `temp-${Date.now()}`, // geçici ID
        urls: [preview], // sadece preview
      };

      // Listeye ekle
      setLocalMedias((prev) => [...prev, newMedia]);

      // İsteğe bağlı olarak burada uploadToS3(file) yapılabilir
    }
  };

  const handleMediaClick = (media: Media) => {
    setSelectedId(media.id);
    onSelect?.(media);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Medya Yöneticisini Aç</Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl max-h-screen overflow-auto">
        <DialogTitle className="text-xl font-bold mb-2">Medya Yöneticisi</DialogTitle>

        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-muted-foreground">Medya ekle veya seç</p>
          <div>
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleFileChange}
              hidden
            />
            <Button
              variant="default"
              onClick={() => inputRef.current?.click()}
            >
              📤 Medya Ekle
            </Button>
          </div>
        </div>

        {previewUrl && (
          <div className="mb-4">
            <p className="text-sm mb-1 text-muted-foreground">Önizleme:</p>
            <Image
              src={previewUrl}
              alt="Preview"
              width={300}
              height={300}
              className="rounded border shadow-md object-contain"
            />
          </div>
        )}

        {localMedias.length === 0 ? (
          <p className="text-gray-500 text-sm">Henüz medya eklenmedi.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {localMedias.map((media) => (
              <button
                type="button"
                key={media.id}
                onClick={() => handleMediaClick(media)}
                className={cn(
                  "relative border rounded overflow-hidden shadow-sm transition focus:outline-none focus:ring-2 focus:ring-orange-400",
                  selectedId === media.id && "ring-2 ring-orange-500"
                )}
              >
                <Image
                  src={media.urls[0]}
                  alt="Medya"
                  width={400}
                  height={400}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1 truncate">
                  {media.urls[0].split("/").pop()}
                </div>
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
