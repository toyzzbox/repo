"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Category } from "@/types/category";


type CategoryCardProps = {
  category: Category
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const router = useRouter();

  const handleClick = () => {
    if (category.slug) {
      router.push(`/category/${category.slug}`);
    }
  };

  // İlk medya içindeki ilk URL'i al
  const imageUrl = category.medias?.[0]?.urls?.[0] ?? null;

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
          alt={category.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      ) : (
        <div className="w-full h-48 bg-gray-300 rounded-t-lg flex items-center justify-center text-white">
          No Image Available
        </div>
      )}

      <div className="text-center mt-4">
        <h3 className="text-lg font-semibold">{category.name}</h3>
      </div>
    </div>
  );
};
