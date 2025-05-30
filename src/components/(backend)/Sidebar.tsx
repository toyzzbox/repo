"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SidebarItem {
  title: string;
  subItems: string[];
}

const sidebarData: SidebarItem[] = [
  {
    title: "Ürünler",
    subItems: ["Yeni Ürünler", "İndirimdekiler", "Popüler"],
  },
  {
    title: "Kategoriler",
    subItems: ["Oyuncak", "Bebek", "Eğitici"],
  },
  {
    title: "Markalar",
    subItems: ["Lego", "Fisher-Price", "Play-Doh"],
  },
];

export default function Sidebar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleMenu = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <aside className="w-64 bg-gray-100 p-4 rounded-xl shadow">
      {sidebarData.map((item, index) => (
        <div key={item.title} className="mb-2">
          <button
            onClick={() => toggleMenu(index)}
            className="flex justify-between items-center w-full text-left font-medium text-gray-800 hover:text-black"
          >
            {item.title}
            {openIndex === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>

          {openIndex === index && (
            <ul className="mt-2 ml-2 space-y-1 text-sm text-gray-600">
              {item.subItems.map((sub) => (
                <li
                  key={sub}
                  className="hover:text-black cursor-pointer transition-colors"
                >
                  {sub}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </aside>
  );
}
