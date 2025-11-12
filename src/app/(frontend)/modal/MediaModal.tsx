"use client";

import {
  useRef,
  useState,
  useTransition,
  useOptimistic,
  useEffect,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import clsx from "clsx";
import { deleteMedias } from "@/actions/deleteMedias";
import { uploadMedia } from "@/actions/uploadMedia";

/* -----------------------------
   ✅ SEO uyumlu slugify fonksiyonu
----------------------------- */
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

interface Media {
  id: string;
  urls: string[];
}

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  medias: Media[];
  onSelectedMediasChange?: (selectedMedias: Media[]) => void;
  onNewMediaUploaded?: (newMedias: Media[]) => void;
  selectedMediaIds?: string[];
}

export default function MediaModal({
  open,
  onClose,
  medias,
  onSelectedMediasChange,
  onNewMediaUploaded,
  selectedMediaIds = [],
}: MediaModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(selectedMediaIds);
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* -----------------------------
     ✅ Modal açık/kapalı değişince seçimleri yenile
  ----------------------------- */
  useEffect(() => {
    setSelectedIds(selectedMediaIds);
  }, [selectedMediaIds]);

  useEffect(() => {
    if (open) setSelectedIds(selectedMediaIds);
  }, [open, selectedMediaIds]);

  /* -----------------------------
     ✅ Optimistik medya state
  ----------------------------- */
  const [optimisticMedias, updateOptimisticMedias] = useOptimistic(
    medias,
    (
      state: Media[],
      action: { type: "delete" | "add" | "replace"; payload: any }
    ) => {
      if (action.type === "delete") {
        return state.filter((m) => !action.payload.includes(m.id));
      } else if (action.type === "add") {
        return [action.payload, ...state];
      } else if (action.type === "replace") {
        return state.map((m) =>
          m.id === action.payload.tempId ? action.payload.realMedia : m
        );
      }
      return state;
    }
  );

  /* -----------------------------
     ✅ Arama filtresi
  ----------------------------- */
  const filtered = optimisticMedias.filter(
    (m) =>
      Array.isArray(m.urls) &&
      m.urls[0] &&
      m.urls[0].toLowerCase().includes(search.toLowerCase())
  );

  /* -----------------------------
     ✅ Medya seçme / kaldırma
  ----------------------------- */
  const toggleSelect = (id: string) => {
    const newSelectedIds = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelectedIds);

    if (onSelectedMediasChange) {
      const selectedMedias = optimisticMedias
        .filter((media) => newSelectedIds.includes(media.id))
        .map((m) => ({
          id: m.id,
          urls: Array.isArray(m.urls) ? m.urls : [],
        }));
      onSelectedMediasChange(selectedMedias);
    }
  };

  /* -----------------------------
     ✅ Medya silme
  ----------------------------- */
  const handleDelete = async () => {
    if (selectedIds.length === 0) return;

    startTransition(async () => {
      updateOptimisticMedias({ type: "delete", payload: selectedIds });
      try {
        await deleteMedias(selectedIds);
        const remainingSelectedIds = selectedIds.filter(
          (id) => !optimisticMedias.some((media) => media.id === id)
        );
        setSelectedIds(remainingSelectedIds);

        if (onSelectedMediasChange) {
          const remainingSelectedMedias = optimisticMedias
            .filter((media) => remainingSelectedIds.includes(media.id))
            .map((m) => ({
              id: m.id,
              urls: Array.isArray(m.urls) ? m.urls : [],
            }));
          onSelectedMediasChange(remainingSelectedMedias);
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    });
  };

  /* -----------------------------
     ✅ Seçimi onayla
  ----------------------------- */
  const handleConfirmSelection = () => {
    if (onSelectedMediasChange) {
      const selectedMedias = optimisticMedias
        .filter((media) => selectedIds.includes(media.id))
        .map((m) => ({
          id: m.id,
          urls: Array.isArray(m.urls) ? m.urls : [],
        }));
      onSelectedMediasChange(selectedMedias);
    }
    onClose();
  };

  /* -----------------------------
     ✅ Dosya yükleme işlemleri
  ----------------------------- */
  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    startTransition(async () => {
      const tempMedias: Media[] = [];

      try {
        const formData = new FormData();

        Array.from(files).forEach((file, index) => {
          const ext = file.name.split(".").pop();
          const base = file.name.replace(/\.[^/.]+$/, "");
          const newName = slugify(base) + "." + ext;

          const renamedFile = new File([file], newName, {
            type: file.type,
          });

          formData.append("files", renamedFile);

          const tempMedia: Media = {
            id: `temp-${Date.now()}-${index}`,
            urls: [URL.createObjectURL(file)],
          };

          tempMedias.push(tempMedia);
          updateOptimisticMedias({ type: "add", payload: tempMedia });
        });

        const result = await uploadMedia(formData);

        if (result.success && result.media) {
          result.media.forEach((realMedia, index) => {
            if (tempMedias[index]) {
              updateOptimisticMedias({
                type: "replace",
                payload: {
                  tempId: tempMedias[index].id,
                  realMedia: {
                    id: realMedia.id,
                    urls: Array.isArray(realMedia.urls)
                      ? realMedia.urls
                      : [],
                  },
                },
              });
            }
          });

          if (onNewMediaUploaded && result.media?.length) {
            const normalized = result.media.map((m: any) => ({
              id: m.id,
              urls: Array.isArray(m.urls) ? m.urls : [],
            }));
            onNewMediaUploaded(normalized);
          }

          alert(`✅ ${result.media.length} dosya başarıyla yüklendi`);
        } else {
          console.error("Upload failed:", result.error);
          alert(`❌ ${result.error}`);
        }
      } catch (error) {
        console.error("Upload error:", error);
        alert("❌ Yükleme sırasında bir hata oluştu");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    });
  };

  /* -----------------------------
     ✅ UI
  ----------------------------- */
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[1400px] max-h-[90vh] overflow-y-auto p-0">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6">
            <DialogTitle>Medya Yöneticisi</DialogTitle>
          </DialogHeader>

          {/* Üst kontrol barı */}
          <div className="sticky top-0 bg-white z-10 px-6 pb-4 pt-2 border-b">
            <div className="flex justify-between items-center gap-2">
              <div className="flex gap-2">
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
              </div>

              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Ara..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64"
                />

                {selectedIds.length > 0 && (
                  <Button onClick={handleConfirmSelection} variant="outline">
                    Seçimi Onayla ({selectedIds.length})
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Medya grid */}
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
                {Array.isArray(media.urls) && media.urls[0] && (
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
            {filtered.length === 0 && (
              <div className="col-span-3 text-center text-gray-500">
                Sonuç bulunamadı.
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
