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

  const imageUrl = category.medias?.[0]?.urls?.[0] ?? null;

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden border border-gray-100 h-full flex flex-col"
      onClick={handleClick}
    >
      {/* Premium Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
      
      {/* Image Container */}
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
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="text-center z-10">
                <div className="w-12 h-12 mx-auto mb-2 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <p className="text-xs text-white/80 font-medium">Kategori</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Corner Badge */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5">
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-grow flex flex-col">
        {/* Category Info */}
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-100">
            <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-1.5"></span>
            Popüler
          </span>
          <div className="text-xs text-gray-500 font-medium">
            {/* Ürün sayısı varsa göster */}
            {category.productCount && (
              <span>{category.productCount} Ürün</span>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="flex-grow flex items-start">
          <h3 className="text-base font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300 leading-tight line-clamp-2">
            {category.name}
          </h3>
        </div>

        {/* Action Area */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span className="text-xs text-gray-600 font-medium">4.8</span>
            </div>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700">
              <span className="text-xs font-semibold mr-1">Keşfet</span>
              <svg className="w-3 h-3 transform group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
    </div>
  );
};