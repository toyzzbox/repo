"use client"

import React, { useState, useEffect } from 'react';
import { ChevronDown, Star } from 'lucide-react';
import { getMegaMenuCategories } from '@/actions/categoryMenu';

interface SubItem {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

interface Subcategory {
  id: string;
  title: string;
  slug: string;
  description: string;
  productCount: number;
  items: SubItem[];
}

interface Category {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string | null;
  productCount?: number;
  subcategories: Subcategory[];
}

const MegaMenu: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  // Server action ile kategorileri çek
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data: Category[] = await getMegaMenuCategories();
        setCategories(data);
      } catch (error) {
        console.error('MegaMenu fetch error:', error);
      }
    };

    fetchCategories();
  }, []);

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
          <button className="px-6 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg">
            Fırsatlar
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
                  {/* Oyuncaklar full width */}
                  <div className="col-span-12 grid grid-cols-5 gap-8">
                    {category.subcategories.map((subcat, index) => (
                      <div key={index} className="space-y-4">
                        <h3 className="font-bold text-gray-900 border-b-2 border-blue-200 pb-3 mb-4">
                          {subcat.title}
                        </h3>
                        <ul className="space-y-3">
                          {subcat.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <button className="text-gray-600 hover:text-blue-600 transition-colors text-left hover:font-medium block w-full">
                                {item.name} ({item.productCount})
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default MegaMenu;
