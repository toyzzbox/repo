"use client";

import { Button } from "@/components/ui/button";
import MediaModal from "./MediaModal";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

interface Media {
  id: string;
  urls: string[];
}

interface MediaModalButtonProps {
  medias: Media[];
  selectedMedias: Media[];
  onSelectedMediasChange: (selectedMedias: Media[]) => void;
  onMediasChange?: (updated: Media[]) => void;
}

interface SortableMediaItemProps {
  media: Media;
  index: number;
  onRemove: (id: string) => void;
}

/* -----------------------------
   ✅ Sürüklenebilir medya kutusu
----------------------------- */
function SortableMediaItem({ media, index, onRemove }: SortableMediaItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: media.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: "120px",
    height: "90px",
  };

  const imageUrl = Array.isArray(media.urls) && media.urls.length > 0
    ? media.urls[0].replace(/[{}]/g, "")
    : "/no-image.png"; // ✅ fallback

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border rounded overflow-hidden transition-all hover:scale-105 ${
        isDragging ? "z-50 rotate-3 shadow-2xl" : "shadow-md"
      }`}
    >
      <div {...attributes} {...listeners} className="cursor-move w-full h-full">
        <Image
          src={imageUrl}
          alt="Selected media"
          width={120}
          height={90}
          className="object-cover w-full h-full pointer-events-none"
          unoptimized
        />
      </div>

      <div className="absolute top-1 left-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md">
        {index + 1}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove(media.id);
        }}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors shadow-md z-20 cursor-pointer"
        style={{ pointerEvents: "auto", touchAction: "none" }}
      >
        ×
      </button>
    </div>
  );
}

/* -----------------------------
   ✅ Ana Bileşen
----------------------------- */
export default function MediaModalButton({
  medias,
  selectedMedias,
  onSelectedMediasChange,
  onMediasChange,
}: MediaModalButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // DnD Sensörleri
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /* -----------------------------
     ✅ Modal Aç / Kapat
  ----------------------------- */
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  /* -----------------------------
     ✅ Medya Silme
  ----------------------------- */
  const removeMedia = (mediaId: string) => {
    const updated = selectedMedias.filter((m) => m.id !== mediaId);
    onSelectedMediasChange(updated);
  };

  /* -----------------------------
     ✅ Sürükle-bırak sıralama
  ----------------------------- */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = selectedMedias.findIndex((item) => item.id === active.id);
    const newIndex = selectedMedias.findIndex((item) => item.id === over.id);
    const reordered = arrayMove(selectedMedias, oldIndex, newIndex);
    onSelectedMediasChange(reordered);
  };

  /* -----------------------------
     ✅ Modal’dan Seçilen Medyaları Alma
  ----------------------------- */
  const handleSelectedMediasChange = (incoming: Media[]) => {
    const normalized = incoming.map((m) => ({
      id: m.id,
      urls: Array.isArray(m.urls) ? m.urls : [],
    }));
    onSelectedMediasChange(normalized);
  };

  /* -----------------------------
     ✅ Yeni Upload Edilen Medyaları Listeye Ekleme
  ----------------------------- */
  const handleNewMediaUploaded = (newItems: Media[]) => {
    const normalized = newItems.map((m) => ({
      id: m.id,
      urls: Array.isArray(m.urls) ? m.urls : [],
    }));
    const updated = [...normalized, ...medias];
    onMediasChange?.(updated);
  };

  /* -----------------------------
     ✅ UI
  ----------------------------- */
  return (
    <div className="space-y-4">
      <Button onClick={handleOpenModal}>Medya Seç</Button>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Seçili Medyalar ({selectedMedias.length})
        </h3>

        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg min-h-[120px] bg-gray-50">
          {selectedMedias.length === 0 ? (
            <div className="flex items-center justify-center w-full h-full text-gray-500 text-sm">
              Seçilen medyalar burada görünecek ve sürükleyerek sıralayabilirsiniz
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedMedias.map((media) => media.id)}
                strategy={horizontalListSortingStrategy}
              >
                <div className="flex flex-wrap gap-2">
                  {selectedMedias.map((media, index) => (
                    <SortableMediaItem
                      key={media.id}
                      media={media}
                      index={index}
                      onRemove={removeMedia}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* ✅ Modal */}
      <MediaModal
        open={isModalOpen}
        onClose={handleCloseModal}
        medias={medias}
        onSelectedMediasChange={handleSelectedMediasChange}
        selectedMediaIds={selectedMedias.map((m) => m.id)}
        onNewMediaUploaded={handleNewMediaUploaded}
      />

      {/* ✅ Form hidden alanları */}
      {selectedMedias.map((media, index) => (
  <div key={media.id}>
    <input type="hidden" name="mediaIds[]" value={media.id} />
    <input type="hidden" name="mediaOrders[]" value={index} />
  </div>
))}
    </div>
  );
}
