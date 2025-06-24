"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

interface Media {
  id: string;
  urls: string[]; // ilk url’i kullanacağız
}

interface MediaModalProps {
  open: boolean;
  onClose: () => void;
  medias: Media[];
}

export default function MediaModal({ open, onClose, medias }: MediaModalProps) {
  const [search, setSearch] = useState("");

  const filteredMedias = medias.filter((media) =>
    media.urls[0]?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Medya Yöneticisi</DialogTitle>
        </DialogHeader>

        {/* 🔘 Üst Butonlar */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex gap-2">
            <Button onClick={() => console.log("Ekle")}>Ekle</Button>
            <Button variant="destructive" onClick={() => console.log("Sil")}>Sil</Button>
          </div>
          <Input
            placeholder="Medya ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
        </div>

        {/* 🖼️ Medya Listesi */}
        <div className="grid grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto">
          {filteredMedias.map((media) => (
            <div key={media.id} className="border rounded-md overflow-hidden">
              <Image
                src={media.urls[0]}
                alt="Media"
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
          {filteredMedias.length === 0 && (
            <p className="col-span-3 text-center text-gray-500">Hiçbir medya bulunamadı.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
