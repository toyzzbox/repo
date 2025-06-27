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
  onSelectMedia?: (selectedMedias: Media[]) => void; // Seçili medyaları döndürmek için
  selectedMediaIds?: string[]; // Önceden seçili medyalar
  isSelectionMode?: boolean; // Seçim modu aktif mi?
}

export default function MediaModal({ 
  open, 
  onClose, 
  medias, 
  onSelectMedia,
  selectedMediaIds = [],
  isSelectionMode = false 
}: MediaModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedMediaIds);
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
    setSelectedIds((prev) => {
      const newSelection = prev.includes(id) 
        ? prev.filter((i) => i !== id) 
        : [...prev, id];
      return newSelection;
    });
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    startTransition(async () => {
      updateOptimisticMedias({ type: "delete", payload: selectedIds });
      try {
        await deleteMedias(selectedIds);
        setSelectedIds([]);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    });
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
        console.log("Upload result:", result);

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

  const handleConfirmSelection = () => {
    if (onSelectMedia && isSelectionMode) {
      const selectedMedias = optimisticMedias.filter(media => 
        selectedIds.includes(media.id)
      );
      onSelectMedia(selectedMedias);
    }
    onClose();
  };

  const handleClose = () => {
    if (isSelectionMode) {
      setSelectedIds(selectedMediaIds); // Seçimi sıfırla
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[1400px] max-h-[90vh] overflow-y-auto p-0">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6">
            <DialogTitle>
              {isSelectionMode ? "Medya Seç" : "Medya Yöneticisi"}
            </DialogTitle>
          </DialogHeader>

          {/* Kontrol Bar */}
          <div className="sticky top-0 bg-white z-10 px-6 pb-4 pt-2 border-b">
            <div className="flex justify-between items-center gap-2">
              <div className="flex gap-2">
                {!isSelectionMode && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={selectedIds.length === 0 || isPending}
                    >
                      {isPending ? "Siliniyor..." : `Sil (${selectedIds.length})`}
                    </Button>

                    <Button
                      variant="default"
                      disabled={isUploading}
                      onClick={handleFileButtonClick}
                    >
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
                  </>
                )}

                {isSelectionMode && (
                  <Button
                    variant="default"
                    onClick={handleConfirmSelection}
                    disabled={selectedIds.length === 0}
                  >
                    Seç ({selectedIds.length})
                  </Button>
                )}
              </div>

              <Input
                placeholder="Ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-1/3"
              />
            </div>
          </div>

          {/* Medya Listesi */}
          <div className="grid grid-cols-3 gap-4 p-6">
            {filtered.map((media) => (
              <div
                key={media.id}
                className={clsx(
                  "border rounded overflow-hidden cursor-pointer relative transition-all hover:shadow-lg",
                  selectedIds.includes(media.id) && "ring-4 ring-blue-500"
                )}
                onClick={() => toggleSelect(media.id)}
              >
                {media.urls && media.urls[0] && (
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
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-3 text-center text-gray-500 py-8">
                Sonuç bulunamadı.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}