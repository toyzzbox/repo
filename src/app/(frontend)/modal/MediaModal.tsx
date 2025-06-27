"use client";

import { useRef, useState, useTransition, useOptimistic } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import clsx from "clsx";
import { deleteMedias } from "@/actions/deleteMedias";
import { uploadMedia } from "@/actions/uploadMedia";

interface Media {
  id: string;
  urls: string[];
}

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  medias: Media[];
  selectedIds: string[];
  onSelectChange: (ids: string[]) => void;
}

export default function MediaModal({
  open,
  onClose,
  medias,
  selectedIds,
  onSelectChange,
}: MediaModalProps) {
  const [search, setSearch] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [optimisticMedias, updateOptimisticMedias] = useOptimistic(
    medias,
    (state: Media[], action: { type: "delete" | "add" | "replace"; payload: any }) => {
      if (action.type === "delete") {
        return state.filter((m) => !action.payload.includes(m.id));
      } else if (action.type === "add") {
        return [...state, action.payload];
      } else if (action.type === "replace") {
        return state.map((m) =>
          m.id === action.payload.tempId ? action.payload.realMedia : m
        );
      }
      return state;
    }
  );

  const filtered = optimisticMedias.filter((m) =>
    m.urls && m.urls[0] && m.urls[0].toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    onSelectChange(updated);
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const tempId = `temp-${Date.now()}`;

    startTransition(async () => {
      try {
        const formData = new FormData();
        Array.from(files).forEach((file) => {
          formData.append("files", file);
        });

        const tempMedia: Media = {
          id: tempId,
          urls: [URL.createObjectURL(files[0])],
        };
        updateOptimisticMedias({ type: "add", payload: tempMedia });

        const result = await uploadMedia(formData);
        if (result.success && result.media) {
          updateOptimisticMedias({
            type: "replace",
            payload: { tempId: tempMedia.id, realMedia: result.media },
          });
        } else {
          console.error("Upload failed:", result.error);
          updateOptimisticMedias({ type: "delete", payload: [tempMedia.id] });
        }
      } catch (error) {
        console.error("Upload error:", error);
        updateOptimisticMedias({ type: "delete", payload: [tempId] });
      } finally {
        setIsUploading(false);
        event.target.value = "";
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[1400px] max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6">
          <DialogTitle>Medya Yöneticisi</DialogTitle>
        </DialogHeader>

        <div className="sticky top-0 bg-white z-10 px-6 pb-4 pt-2 border-b flex justify-between items-center gap-2">
          <Button onClick={handleFileButtonClick} disabled={isUploading}>
            {isUploading ? "Yükleniyor..." : "Medya Ekle"}
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />

          <Input
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 p-6">
          {filtered.map((media) => (
            <div
              key={media.id}
              className={clsx(
                "border rounded overflow-hidden cursor-pointer relative transition-all",
                selectedIds.includes(media.id) && "ring-4 ring-orange-500"
              )}
              onClick={() => toggleSelect(media.id)}
            >
              {media.urls[0] && (
                <Image
                  src={media.urls[0]}
                  alt="media"
                  width={300}
                  height={200}
                  className="object-cover w-full h-48"
                  unoptimized
                />
              )}
              {selectedIds.includes(media.id) && (
                <div className="absolute top-2 right-2 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-orange-500 border border-orange-500">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
