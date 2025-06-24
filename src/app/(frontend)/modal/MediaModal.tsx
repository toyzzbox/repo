"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

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

  const filtered = medias.filter((m) =>
    m.urls[0]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
<DialogContent className="w-[1400px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Medya Yöneticisi</DialogTitle>
        </DialogHeader>

        <div className="flex justify-between items-center gap-2 mb-4">
          <div className="flex gap-2">
            <Button onClick={() => console.log("Ekle")}>Ekle</Button>
            <Button variant="destructive" onClick={() => console.log("Sil")}>Sil</Button>
          </div>
          <Input
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          {filtered.map((media) => (
            <div key={media.id} className="border rounded overflow-hidden">
              <Image
                src={media.urls[0]}
                alt="media"
                width={300}
                height={200}
                className="object-cover w-full h-48"
              />
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-3 text-center text-gray-500">Sonuç bulunamadı.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
