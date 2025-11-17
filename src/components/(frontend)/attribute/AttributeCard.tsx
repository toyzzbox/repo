"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Attribute } from "@/types/attribute";

type AttributeCardProps = {
  attribute: Attribute;
};

export const AttributeCard: React.FC<AttributeCardProps> = ({ attribute }) => {
  const router = useRouter();

  const handleClick = () => {
    if (attribute.slug) {
      router.push(`/attribute/${attribute.slug}`);
    }
  };

  // 🔥 variant bulundu → resmi doğru al
  const imageUrl =
    attribute.medias?.[0]?.variants?.[0]?.cdnUrl ?? null;

  return (
    <div
      className="border border-gray-200 rounded-lg shadow-md p-4 cursor-pointer transition-colors duration-300 hover:border-orange-500 group"
      onClick={handleClick}
    >
      {imageUrl ? (
        <div className="overflow-hidden rounded-t-lg">
          <Image
            src={imageUrl}
            width={150}
            height={70}
            alt={attribute.name}
            className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-90"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center text-white">
          No Image Available
        </div>
      )}

      <div className="mt-3 text-center">
        <h3 className="font-semibold">{attribute.name}</h3>
      </div>
    </div>
  );
};
