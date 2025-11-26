"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import BannerMediaModal from "./BannerMediaModal";

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

export default function BannerMediaPicker({
  value,
  onChange,
}: {
  value?: Media | null;
  onChange: (media: Media) => void;
}) {
  const [open, setOpen] = useState(false);

  const preview =
    value?.variants.find((v) => v.type === "WEBP")?.cdnUrl ||
    value?.variants.find((v) => v.type === "OG_IMAGE")?.cdnUrl ||
    value?.variants.find((v) => v.type === "ORIGINAL")?.cdnUrl;

  return (
    <div className="space-y-3">
      <Button type="button" onClick={() => setOpen(true)}>
        Banner Görseli Seç
      </Button>

      {preview ? (
        <div className="relative h-48 rounded-lg overflow-hidden border">
          <Image src={preview} alt="banner" fill className="object-cover" />
        </div>
      ) : (
        <div className="h-48 border rounded-lg flex items-center justify-center text-sm text-gray-500">
          Henüz görsel seçilmedi
        </div>
      )}

      <BannerMediaModal
        open={open}
        onClose={() => setOpen(false)}
        onSelect={(media) => onChange(media)}
      />
    </div>
  );
}
