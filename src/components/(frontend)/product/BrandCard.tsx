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
      router.push(`/marka/${brand.slug}`);
    }
  };

  // 🔥 Doğru erişim yolu
  const imageUrl =
    brand.medias?.[0]?.media?.files?.[0]?.url ?? null;

  return (
    <div
      className="border rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition"
      onClick={handleClick}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          width={150}
          height={150}
          alt={brand.name}
          className="w-full h-16 object-contain rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center text-white">
          No Image Available
        </div>
      )}
    </div>
  );
};
