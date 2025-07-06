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
  X,
} from "lucide-react";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const menuItems = [
    { href: "/administor", icon: <Home size={20} />, label: "Dashboard" },
    { href: "/administor/products", icon: <Package size={20} />, label: "Ürünler" },
    { href: "/administor/add-product", icon: <PlusCircle size={20} />, label: "Ürün Ekle" },
    { href: "/administor/categories", icon: <List size={20} />, label: "Kategoriler" },
    { href: "/administor/add-categories", icon: <PlusCircle size={20} />, label: "Kategori Ekle" },
    { href: "/administor/brands", icon: <Package size={20} />, label: "Marka" },
    { href: "/administor/add-brand", icon: <PlusCircle size={20} />, label: "Marka Ekle" },
    { href: "/administor/attribute", icon: <List size={20} />, label: "Nitelikler" },
    { href: "/administor/add-attribute", icon: <PlusCircle size={20} />, label: "Nitelik Ekle" },
    { href: "/administor/attribute-groups", icon: <List size={20} />, label: "Nitelik Grubu" },
    { href: "/administor/add-attribute-group", icon: <PlusCircle size={20} />, label: "Nitelik Grubu Ekle" },
    { href: "/administor/orders", icon: <List size={20} />, label: "Gelen Siparişlerim" },
    { href: "/administor/customers", icon: <Users size={20} />, label: "Müşteriler" },
    { href: "/administor/messages", icon: <MessageSquare size={20} />, label: "Mesajlar" },
    { href: "/administor/users", icon: <MessageSquare size={20} />, label: "Kullanıcılar" },
  ];

  const handleLinkClick = () => {
    // Mobilde link'e tıklandığında menüyü kapat
    if (window.innerWidth < 768) {
      setIsExpanded(false);
    }
  };

  return (
    <>
      {/* Hamburger Menü Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="md:hidden p-2 fixed top-4 left-4 z-50 bg-gray-800 text-white rounded-lg shadow-lg"
      >
        {isExpanded ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {isExpanded && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          bg-gray-800 text-white min-h-screen p-4 pt-16 md:pt-4
          fixed top-0 left-0 z-40 transition-all duration-300 ease-in-out
          ${isExpanded ? "w-64 translate-x-0" : "w-0 -translate-x-full"}
          md:w-64 md:translate-x-0
          overflow-x-hidden
        `}
      >
        <div className="flex flex-col gap-2">
          {menuItems.map(({ href, icon, label }) => (
            <Link
              key={label}
              href={href}
              onClick={handleLinkClick}
              className="flex items-center gap-3 hover:bg-gray-700 p-3 rounded-lg transition-colors duration-200"
            >
              {icon}
              <span className="text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
