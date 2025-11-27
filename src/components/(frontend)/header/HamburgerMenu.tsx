"use client";

import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';
import Link from 'next/link';

// Type definitions
type Category = {
  id: string;
  name: string;
  slug: string;
  children: Category[];
};

interface HamburgerMenuProps {
  categories: Category[];
}

export default function HamburgerMenu({ categories = [] }: HamburgerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuStack, setMenuStack] = useState<Category[]>([]);
  
  const currentMenu = menuStack[menuStack.length - 1];
  const currentCategories = currentMenu?.children || categories || [];
  const isMainMenu = menuStack.length === 0;

  const handleCategoryClick = (category: Category) => {
    if (category.children?.length > 0) {
      setMenuStack((prev) => [...prev, category]);
    } else {
      // Router navigation burada yapılacak
      console.log(`Navigating to: /categories/${category.slug}`);
      // router.push(`/categories/${category.slug}`);
      
      // Menüyü kapat ve reset yap
      setIsMenuOpen(false);
      setMenuStack([]);
    }
  };

  const handleBack = () => {
    setMenuStack((prev) => prev.slice(0, -1));
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      setMenuStack([]);
    }
  };

  const getMenuTitle = () => {
    if (currentMenu) {
      return currentMenu.name;
    }
    return "Kategoriler";
  };

  return (
    <div className="relative">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200"
          aria-label="Menüyü aç/kapat"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* Sliding Menu */}
      <div className={`
        fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Menu Header */}
        <div className="bg-gray-100 p-4 flex items-center justify-between">
          {!isMainMenu && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200 mr-2"
              aria-label="Geri git"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <h2 className="text-lg font-semibold flex-1 truncate">
            {getMenuTitle()}
          </h2>
          <button
            onClick={toggleMenu}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200"
            aria-label="Menüyü kapat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-2" role="navigation" aria-label="Kategori menüsü">
            {currentCategories.length > 0 ? (
              currentCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0 text-left"
                >
                  <span className="text-gray-800 font-medium">
                    {category.name}
                  </span>
                  <Link href="/firsatlar">Fırsatlar</Link>
                  {category.children?.length > 0 && (
                    <ChevronRight size={18} className="text-gray-400" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>Bu kategoride alt kategori bulunmuyor.</p>
              </div>
            )}
          </nav>
        </div>

        {/* Menu Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="text-sm text-gray-600 text-center">
            {currentCategories.length} kategori
          </div>
          {!isMainMenu && currentMenu && (
            <div className="text-xs text-gray-500 text-center mt-1">
              {currentMenu.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}