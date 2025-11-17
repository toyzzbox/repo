"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Category } from "@/types/category";
import { getCategoryPath } from "@/utils/getCategoryPath";

type CategoryCardProps = {
  category: Category;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const router = useRouter();

  const handleClick = () => {
    if (category.slug) {
      const path = getCategoryPath(category);
      router.push(`/categories/${path}`);
    }
  };

  // ✔️ DOĞRU YOL → İlk medya → İlk variant → cdnUrl
  const imageUrl =
    category.medias?.[0]?.variants?.[0]?.cdnUrl ?? null;

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl flex-shrink-0">
        <div className="w-full h-40 relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              fill
              alt={category.name}
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-white/70">No Image</span>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div className="p-4 flex-grow flex items-start">
        <h3 className="text-base font-bold text-gray-900 line-clamp-2">
          {category.name}
        </h3>
      </div>
    </div>
  );
};
