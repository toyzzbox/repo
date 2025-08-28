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
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState } from "react";

interface Media {
  id: string;
  urls: string[];
}

interface MediaModalButtonProps {
  medias: Media[];
  selectedMedias: Media[];
  onSelectedMediasChange: (selectedMedias: Media[]) => void;
  onMediasChange?: (updated: Media[]) => void; // ✅ ? ile opsiyonel yapıldı
}

interface SortableMediaItemProps {
  media: Media;
  index: number;
  onRemove: (id: string) => void;
}

function SortableMediaItem({ media, index, onRemove }: SortableMediaItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    width: '120px',
    height: '90px',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative border rounded overflow-hidden transition-all hover:scale-105 ${
        isDragging ? 'z-50 rotate-3 shadow-2xl' : 'shadow-md'
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-move w-full h-full"
      >
        <Image
          src={media.urls[0]}
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
        style={{ pointerEvents: 'auto', touchAction: 'none' }}
      >
        ×
      </button>

      <div className="absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded p-1">
        <svg width="12" height="12" viewBox="0 0 12 12">
          <circle cx="3" cy="3" r="1" fill="currentColor" />
          <circle cx="9" cy="3" r="1" fill="currentColor" />
          <circle cx="3" cy="9" r="1" fill="currentColor" />
          <circle cx="9" cy="9" r="1" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}

export default function MediaModalButton({
  medias,
  selectedMedias,
  onSelectedMediasChange,
  onMediasChange,
}: MediaModalButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const removeMedia = (mediaId: string) => {
    const updated = selectedMedias.filter((m) => m.id !== mediaId);
    onSelectedMediasChange(updated);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = selectedMedias.findIndex((item) => item.id === active.id);
      const newIndex = selectedMedias.findIndex((item) => item.id === over?.id);
      const reordered = arrayMove(selectedMedias, oldIndex, newIndex);
      onSelectedMediasChange(reordered);
    }
  };

  const handleSelectedMediasChange = (medias: Media[]) => {
    onSelectedMediasChange(medias);
  };

  const handleNewMediaUploaded = (newItems: Media[]) => {
    const updated = [...newItems, ...medias];
    onMediasChange?.(updated); 
  };

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

      <MediaModal
        open={isModalOpen}
        onClose={handleCloseModal}
        medias={medias}
        onSelectedMediasChange={handleSelectedMediasChange}
        selectedMediaIds={selectedMedias.map((m) => m.id)}
        onNewMediaUploaded={handleNewMediaUploaded} // ✅ Yeni medya geldiğinde ekle
      />

      {/* ✅ Form'a sıralı şekilde medya bilgilerini yolla */}
      {selectedMedias.map((media, index) => (
        <div key={media.id}>
          <input type="hidden" name={`mediaIds[${index}].id`} value={media.id} />
          <input type="hidden" name={`mediaIds[${index}].order`} value={index} />
        </div>
      ))}
    </div>
  );
}
