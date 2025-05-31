'use client'

import React, { useState } from 'react';

type ProductImageGalleryProps = {
  images: string[];
  productName: string;
};

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(images?.[0]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        {selectedImage ? (
          <img
            src={selectedImage}
            alt={productName}
            className="rounded-lg w-full max-h-[400px] object-contain border"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image Available
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className={`h-20 w-20 object-cover rounded border cursor-pointer ${
                selectedImage === img ? 'border-orange-500 ring-2 ring-orange-400' : 'border-gray-300'
              }`}
              onClick={() => setSelectedImage(img)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
