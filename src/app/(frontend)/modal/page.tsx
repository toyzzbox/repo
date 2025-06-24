"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import MediaModal from "./MediaModal";

const dummyMedias = [
  {
    id: "1",
    urls: ["https://via.placeholder.com/300x200.png?text=Image+1"],
  },
  {
    id: "2",
    urls: ["https://via.placeholder.com/300x200.png?text=Image+2"],
  },
  {
    id: "3",
    urls: ["https://via.placeholder.com/300x200.png?text=Image+3"],
  },
];

export default function MediaModalExample() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Medya Yöneticisini Aç</Button>
      <MediaModal open={open} onClose={() => setOpen(false)} medias={dummyMedias} />
    </div>
  );
}
