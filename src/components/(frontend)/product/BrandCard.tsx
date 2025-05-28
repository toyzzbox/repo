"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Brand } from "@/types/brand";

type BrandCardProps = {
  brand: Brand
};

export const BrandCard: React.FC<BrandCardProps> = ({ brand }) => {
  const router = useRouter();

  const handleClick = () => {
    if (brand.slug) {
      router.push(`/brand/${brand.slug}`);
    }
  };

  // İlk medya içindeki ilk URL'i al
  const imageUrl = brand.medias?.[0]?.urls?.[0] ?? null;

  return (
    <div
      className="border rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
      onClick={handleClick}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={400}
          height={300}
          alt={brand.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center text-white">
          No Image Available
        </div>
      )}

      <div className="text-center mt-4">
        <h3 className="text-lg font-semibold">{brand.name}</h3>
      </div>
    </div>
  );
};
