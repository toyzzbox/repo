"use client";
import { useState, useTransition, useOptimistic } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import clsx from "clsx";
import { deleteMedias } from "@/actions/deleteMedias";

interface Media {
  id: string;
  urls: string[];
}

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  medias: Media[];
}

export default function MediaModal({ open, onClose, medias }: MediaModalProps) {
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  
  // useOptimistic düzeltmesi
  const [optimisticMedias, addOptimisticDelete] = useOptimistic(
    medias,
    (state: Media[], deletedIds: string[]) => {
      return state.filter((m) => !deletedIds.includes(m.id));
    }
  );

  const filtered = optimisticMedias.filter((m) =>
    m.urls[0]?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) return;
    
    startTransition(async () => {
      // Optimistic update
      addOptimisticDelete(selectedIds);
      
      try {
        // Server action'ı çağır
        await deleteMedias(selectedIds);
        // Başarılı olursa seçimleri temizle
        setSelectedIds([]);
      } catch (error) {
        // Hata durumunda kullanıcıya bilgi verilebilir
        console.error("Delete failed:", error);
        // Gerekirse optimistic update'i geri al
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[1400px] max-h-[90vh] overflow-y-auto p-0">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="p-6">
            <DialogTitle>Medya Yöneticisi</DialogTitle>
          </DialogHeader>
          
          {/* Sticky kontrol barı */}
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
              </div>
              <Input
                placeholder="Ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-1/3"
              />
            </div>
          </div>

          {/* Medya listesi */}
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
                    unoptimized // Eğer external URL'ler kullanıyorsanız
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