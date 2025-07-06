"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Home,
  Package,
  PlusCircle,
  List,
  Users,
  MessageSquare,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Body scroll kilitleme (mobile)
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isExpanded]);

  const menuItems = [
    { href: "/administor", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/administor/products", icon: <Package size={20} />, label: "Ürünler" },
    { href: "/administor/add-product", icon: <PlusCircle size={20} />, label: "Ürün Ekle" },
    { href: "/administor/categories", icon: <List size={20} />, label: "Kategoriler" },
    { href: "/administor/add-categories", icon: <PlusCircle size={20} />, label: "Kategori Ekle" },
    { href: "/administor/brands", icon: <Package size={20} />, label: "Marka" },
    { href: "/administor/add-brand", icon: <PlusCircle size={20} />, label: "Marka Ekle" },
    { href: "/administor/attribute", icon: <List size={20} />, label: "Nitelikler" },
    { href: "/administor", icon: <PlusCircle size={20} />, label: "Nitelik Ekle" },
    { href: "/administor", icon: <List size={20} />, label: "Nitelik Grubu" },
    { href: "/administor", icon: <PlusCircle size={20} />, label: "Nitelik Grubu Ekle" },
    { href: "/administor/orders", icon: <List size={20} />, label: "Gelen Siparişlerim" },
    { href: "/administor/customers", icon: <Users size={20} />, label: "Müşteriler" },
    { href: "/administor/messages", icon: <MessageSquare size={20} />, label: "Mesajlar" },
    { href: "/administor/users", icon: <MessageSquare size={20} />, label: "Kullanıcılar" },
  ];

  return (
    <>
      {/* Hamburger Button (mobile only) */}
      <button
        onClick={() => setIsExpanded(true)}
        className="md:hidden p-2 fixed top-4 left-4 z-50 bg-gray-800 text-white rounded"
        aria-label="Menüyü Aç"
      >
        <Menu />
      </button>

      {/* Overlay (mobile only) */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-800 text-white min-h-screen p-4 pt-16 md:pt-4
          fixed top-0 left-0 z-50 transition-transform duration-300
          transform
          ${isExpanded ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          w-64
        `}
        aria-label="Sidebar"
      >
        {/* Close Button (mobile only) */}
        <button
          onClick={() => setIsExpanded(false)}
          className="md:hidden mb-4"
          aria-label="Menüyü Kapat"
        >
          <X />
        </button>

        <div className="flex flex-col gap-4">
          {menuItems.map(({ href, icon, label }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 hover:bg-gray-700 p-2 rounded transition"
              onClick={() => setIsExpanded(false)} // mobile'da linke basınca menü kapansın
            >
              {icon}
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
