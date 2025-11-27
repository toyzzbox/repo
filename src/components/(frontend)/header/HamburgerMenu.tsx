"use client";

import React, { useState } from "react";
import { ChevronRight, ChevronLeft, Menu, X } from "lucide-react";
import Link from "next/link";

type Category = {
  id: string;
  name: string;
  slug: string;
  children: Category[];
};

interface HamburgerMenuProps {
  categories: Category[];
}

// ✅ Fırsatlar kontrol helper'ı
const isOpportunity = (category: Category) =>
  category.slug === "firsatlar";

export default function HamburgerMenu({ categories = [] }: HamburgerMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuStack, setMenuStack] = useState<Category[]>([]);

  const currentMenu = menuStack[menuStack.length - 1];

  // ✅ Fırsatlar sadece ANA MENÜDE görünür
  const currentCategories = (currentMenu?.children || categories || []).filter(
    (category) => !(menuStack.length > 0 && isOpportunity(category))
  );

  const isMainMenu = menuStack.length === 0;

  // ✅ Tıklama yönetimi + özel fırsatlar yönlendirme
  const handleCategoryClick = (category: Category) => {
    if (isOpportunity(category)) {
      window.location.href = "/firsatlar"; // ✅ özel sayfa
      setIsMenuOpen(false);
      setMenuStack([]);
      return;
    }

    if (category.children?.length > 0) {
      setMenuStack((prev) => [...prev, category]);
    } else {
      window.location.href = `/categories/${category.slug}`;
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
    return currentMenu ? currentMenu.name : "Kategoriler";
  };

  return (
    <div className="relative">
      {/* ✅ HEADER TOGGLE */}
      <header className="p-4 flex justify-between items-center">
        <button
          onClick={toggleMenu}
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200"
          aria-label="Menüyü aç/kapat"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* ✅ OVERLAY */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={toggleMenu}
          aria-hidden="true"
        />
      )}

      {/* ✅ SLIDING MENU */}
      <div
        className={`
        fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out
        ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* ✅ MENU HEADER */}
        <div className="bg-gray-100 p-4 flex items-center justify-between">
          {!isMainMenu && (
            <button
              onClick={handleBack}
              className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors duration-200 mr-2"
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
          >
            <X size={20} />
          </button>
        </div>

        {/* ✅ MENU CONTENT */}
        <div className="flex-1 overflow-y-auto">
          <nav className="py-2">
            {currentCategories.length > 0 ? (
              currentCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className={`w-full px-6 py-4 flex items-center justify-between transition-colors duration-200 border-b border-gray-100 last:border-b-0 text-left
                    ${
                      isOpportunity(category)
                        ? "bg-red-50 hover:bg-red-100 text-red-600 font-bold"
                        : "hover:bg-gray-50 text-gray-800 font-medium"
                    }
                  `}
                >
                  {/* ✅ SOL TARAF */}
                  <span className="flex items-center gap-2">
                    {category.name}

                    {isOpportunity(category) && (
                      <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full">
                        🔥
                      </span>
                    )}
                  </span>

                  {/* ✅ SAĞ TARAF (SADECE NORMAL KATEGORİLER) */}
                  {!isOpportunity(category) &&
                    category.children?.length > 0 && (
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

        {/* ✅ FOOTER */}
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
