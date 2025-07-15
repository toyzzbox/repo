'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";

type Props = {
  images: string[];
  productName: string;
  productGroupImages?: string[]; // Ürün grubuna ait diğer ürünlerin resimleri
  onGroupImageClick?: (imageUrl: string) => void; // Grup resmine tıklandığında çağrılacak fonksiyon
};

export default function ProductImageGallery({ images, productName, productGroupImages = [], onGroupImageClick }: Props) {
  // Aktif ürün resimleri + grup resimleri
  const allImages = [...images, ...productGroupImages];
  const [selectedImage, setSelectedImage] = useState(allImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Shadcn Modal Trigger */}
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-zoom-in">
            <AspectRatio ratio={16 / 9}>
              <img
                src={selectedImage}
                alt={productName}
                className="rounded-lg w-full h-full object-contain border transition-transform hover:scale-105 duration-200"
              />
            </AspectRatio>
          </div>
        </DialogTrigger>
        {/* Modal içeriği */}
        <DialogContent className="max-w-4xl p-0 bg-black">
          <img
            src={selectedImage}
            alt={productName}
            className="rounded-lg w-full h-[80vh] object-contain"
          />
        </DialogContent>
      </Dialog>

      {/* Thumbnail'lar */}
      <div className="flex gap-2 overflow-x-auto">
        {/* Aktif ürün resimleri */}
        {images.map((img, index) => (
          <img
            key={`current-${index}`}
            src={img}
            alt={`${productName} - Resim ${index + 1}`}
            onClick={() => setSelectedImage(img)}
            className={`h-20 w-20 object-cover rounded-md border cursor-pointer transition-all ${
              selectedImage === img
                ? 'border-orange-500 ring-2 ring-orange-400'
                : 'border-gray-300'
            }`}
          />
        ))}

        {/* Grup resimleri - farklı stil ile */}
        {productGroupImages.map((img, index) => (
          <div key={`group-${index}`} className="relative">
            <img
              src={img}
              alt={`Grup Ürünü - Resim ${index + 1}`}
              onClick={() => {
                if (onGroupImageClick) {
                  onGroupImageClick(img);
                } else {
                  setSelectedImage(img);
                }
              }}
              className={`h-20 w-20 object-cover rounded-md border cursor-pointer transition-all ${
                selectedImage === img
                  ? 'border-orange-500 ring-2 ring-orange-400'
                  : 'border-gray-300'
              }`}
            />
            {/* Grup göstergesi */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
          </div>
        ))}
      </div>
    </div>
  );
}