"use client";

import { useState } from "react";
import MediaModalButton from "./MediaModalButton";

interface Media {
  id: string;
  urls: string[];
}

export default function MediaModalButtonWrapper({
  initialMedias,
}: {
  initialMedias: Media[];
}) {
  const [medias, setMedias] = useState<Media[]>(initialMedias);
  const [selectedMedias, setSelectedMedias] = useState<Media[]>([]);

  return (
    <MediaModalButton
      medias={medias}
      selectedMedias={selectedMedias}
      onSelectedMediasChange={setSelectedMedias}
      onMediasChange={setMedias}
    />
  );
}
