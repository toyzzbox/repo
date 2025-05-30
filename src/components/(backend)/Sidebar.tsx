"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { name: "Anasayfa", href: "/" },
  { name: "Ürünler", href: "/products" },
  { name: "Kategoriler", href: "/categories" },
  { name: "Ayarlar", href: "/settings" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobil için üst bar ve menü ikonu */}
      <div className="lg:hidden p-4 flex justify-between items-center bg-gray-100">
        <h1 className="text-lg font-bold">ToyzzBox</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (mobilde toggle, büyük ekranda sabit) */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r shadow-md z-40 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 lg:static lg:block`}
      >
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Panel</h2>
        </div>
        <nav className="flex flex-col p-4 gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
