"use client"

import React, { useState } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import Link from 'next/link';

// Prisma tiplerini yansıtan interface'ler
interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
  children?: Category[];
}

// Mega menu için dönüştürülmüş tip
interface MegaMenuCategory {
  id: string;
  name: string;
  subcategories: {
    title: string;
    items: string[];
    slug: string;
  }[];
  featured?: {
    title: string;
    subtitle: string;
    items: any[];
  };
}

interface MegaMenuProps {
  initialCategories: Category[];
}

const MegaMenu: React.FC<MegaMenuProps> = ({ initialCategories }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Prisma kategorilerini mega menu formatına dönüştür
  const transformCategories = (prismaCategories: Category[]): MegaMenuCategory[] => {
    return prismaCategories.map(parent => {
      const subcategories = parent.children?.map(child => ({
        title: child.name,
        slug: child.slug, // ✅ slug eklendi
        items: child.children?.map(grandchild => grandchild.name) || []
      })) || [];
  
      return {
        id: parent.id,
        name: parent.name,
        subcategories,
        featured: undefined
      };
    });
  };

  const categories = transformCategories(initialCategories);

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center space-x-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="relative"
              onMouseEnter={() => setActiveMenu(category.id)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className="flex items-center space-x-2 px-6 py-4 hover:bg-blue-50 hover:text-orange-600 transition-all duration-200 rounded-lg group">
                <span className="text-sm font-medium whitespace-nowrap">{category.name}</span>
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
            </div>
          ))}
          
          <div className="flex-1" />
          <button className="px-6 py-4 font-bold rounded-lg transition-all duration-200">
            <Link href="/brands">Markalar
            </Link>
          </button>
          <button className="px-6 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg">
          <Link href="/brands">Fırsatlar
            </Link>
          </button>
     
        </div>
      </div>

      {/* Desktop Mega Menu */}
      {activeMenu && (
        <div
          className="absolute top-full left-0 w-full bg-white shadow-2xl border-t z-50"
          onMouseEnter={() => setActiveMenu(activeMenu)}
          onMouseLeave={() => setActiveMenu(null)}
        >
          <div className="max-w-7xl mx-auto px-6 py-12">
            {categories
              .filter(cat => cat.id === activeMenu)
              .map((category) => (
                <div key={category.id} className="grid grid-cols-12 gap-12">
                  {/* Categories Grid */}
                  <div className={`${category.subcategories.length === 0 ? 'col-span-12' : category.featured ? 'col-span-8' : 'col-span-12'} grid gap-8`}
                       style={{ gridTemplateColumns: `repeat(${Math.min(category.subcategories.length, 5)}, minmax(0, 1fr))` }}>
                    {category.subcategories.map((subcat, index) => (
                      <div key={index} className="space-y-4">
              
                        <h3 className="font-bold text-gray-900 pb-3 mb-4">
  <Link
   href={`/categories/${subcat.slug}`}
    className="hover:text-blue-600 transition-colors"
  >
    {subcat.title}
  </Link>
</h3>
                        <ul className="space-y-3">
                          {subcat.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <button className="text-gray-600 hover:text-blue-600 transition-colors text-left hover:font-medium block w-full">
                                {item}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* Featured Section */}
                  {category.featured && (
                    <div className="col-span-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl p-8">
                      <h3 className="font-bold text-gray-900 text-2xl mb-2">
                        {category.featured.title}
                      </h3>
                      <p className="text-gray-600 mb-6">{category.featured.subtitle}</p>
                      
                      <div className="space-y-4">
                        {category.featured.items.map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer group">
                            <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                              {item.image}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900 mb-1">{item.name}</div>
                              <div className="flex items-center space-x-2 mb-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm font-medium">{item.rating}</span>
                                </div>
                                <span className="text-xs text-gray-500">({item.reviews} değerlendirme)</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {item.originalPrice && (
                                  <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                                )}
                                <span className="font-bold text-blue-600">{item.discountPrice}</span>
                                <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full font-medium">
                                  {item.discount}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <button className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg">
                        Tüm Ürünleri Keşfet
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MegaMenu;