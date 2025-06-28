"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MediaModal from "./MediaModal";

interface Media {
  id: string;
  urls: string[];
}

export default function MediaModalButton({ medias }: { medias: Media[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Medya Modalını Aç</Button>
      <MediaModal open={open} onClose={() => setOpen(false)} medias={medias} />
    </>
  );
}
