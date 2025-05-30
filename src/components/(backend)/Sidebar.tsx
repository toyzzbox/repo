"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  Package,
  PlusCircle,
  List,
  Users,
  MessageSquare,
  Menu,
} from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { href: "/", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/", icon: <Package size={20} />, label: "Ürünler" },
    { href: "/", icon: <PlusCircle size={20} />, label: "Ürün Ekle" },
    { href: "/", icon: <List size={20} />, label: "Kategoriler" },
    { href: "/", icon: <PlusCircle size={20} />, label: "Kategori Ekle" },
    { href: "/", icon: <Package size={20} />, label: "Marka" },
    { href: "/", icon: <PlusCircle size={20} />, label: "Marka Ekle" },
    { href: "/", icon: <List size={20} />, label: "Nitelikler" },
    { href: "/", icon: <PlusCircle size={20} />, label: "Nitelik Ekle" },
    { href: "/", icon: <List size={20} />, label: "Nitelik Grubu" },
    { href: "/", icon: <PlusCircle size={20} />, label: "Nitelik Grubu Ekle" },
    { href: "/", icon: <List size={20} />, label: "Gelen Siparişlerim" },
    { href: "/", icon: <Users size={20} />, label: "Müşteriler" },
    { href: "/", icon: <MessageSquare size={20} />, label: "Mesajlar" },
  ];

  return (
    <>
      {/* Menü toggle düğmesi */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden p-2 fixed top-4 left-4 z-50 bg-gray-800 text-white rounded"
      >
        <Menu />
      </button>

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-800 text-white min-h-screen p-4 pt-16 md:pt-4
          fixed top-0 left-0 z-40 transition-all duration-300
          ${isExpanded ? "w-64" : "w-16"}
          md:w-64
        `}
      >
        <div className="flex flex-col gap-4">
          {menuItems.map(({ href, icon, label }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded transition"
            >
              {icon}
              <span
                className={`
                  text-sm transition-opacity duration-200
                  ${isExpanded ? "opacity-100" : "opacity-0 md:opacity-100"}
                  ${isExpanded ? "inline" : "hidden md:inline"}
                `}
              >
                {label}
              </span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
