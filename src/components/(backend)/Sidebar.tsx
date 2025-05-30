"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { name: "Anasayfa", href: "/" },
  {
    name: "Ürünler",
    submenu: [
      { name: "Tüm Ürünler", href: "/products" },
      { name: "Ürün Ekle", href: "/products/new" },
    ],
  },
  {
    name: "Kategoriler",
    submenu: [
      { name: "Tüm Kategoriler", href: "/categories" },
      { name: "Kategori Ekle", href: "/categories/new" },
    ],
  },
  { name: "Ayarlar", href: "/settings" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (name: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  return (
    <>
      {/* Mobil üst bar */}
      <div className="lg:hidden p-4 flex justify-between items-center bg-gray-100">
        <h1 className="text-lg font-bold">ToyzzBox</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md z-40 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:block`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Panel</h2>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className="flex justify-between items-center w-full text-left text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
                  >
                    <span>{item.name}</span>
                    {openMenus[item.name] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openMenus[item.name] && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {item.submenu.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className="text-gray-600 hover:bg-gray-100 px-3 py-1 rounded text-sm"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded block"
                >
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
