"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";

interface Media {
  id: string;
  urls: string[];
}

interface MediaManagerModalProps {
  medias: Media[];
}

export default function MediaManagerModal({ medias }: MediaManagerModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Medya Yöneticisini Aç</Button>
      </DialogTrigger>

      <DialogContent className="max-w-5xl max-h-screen overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Medya Yöneticisi</h2>
          <Button variant="default" disabled>
            📤 Medya Ekle (yakında)
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {medias.map((media) => (
            <div
              key={media.id}
              className="border rounded overflow-hidden shadow-sm hover:shadow-md transition"
            >
              <Image
                src={media.urls[0]}
                alt="Medya"
                width={400}
                height={400}
                className="w-full h-48 object-cover"
              />
              <div className="p-2 text-sm text-gray-500 truncate">
                {media.urls[0]}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
