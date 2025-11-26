"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  CreditCard,
  ShoppingBag,
  Heart,
  MessageSquare,
  Store,
  Settings,
  Lock,
  HelpCircle,
  ChevronDown,
  LogOut,
  X
} from "lucide-react";

export const AccountSidebar = ({
  userName = "KULLANICI",
  membershipLevel = "BLACK",
  activeMenu,
  onMenuChange,
  onLogout,
  isOpen,
  onClose,
}) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  const menuItems = [
    { id: "hesabim", label: "Hesabım", icon: <User size={20} />, href: "/hesabim" },
    { id: "kart-programi", label: "Kart Programı", icon: <CreditCard size={20} />, badge: "0 Puan", href: "/hesabim/kart-programi" },
    { id: "siparislerim", label: "Siparişlerim", icon: <ShoppingBag size={20} />, href: "/hesabim/siparislerim" },
    { id: "favorilerim", label: "Favorilerim", icon: <Heart size={20} />, href: "/hesabim/favorilerim" },
    { id: "iletisim", label: "İletişim Tercihlerim", icon: <MessageSquare size={20} />, href: "/iletisim" },
    { id: "magaza", label: "Favori Mağazam", icon: <Store size={20} />, href: "/hesabim/magaza" },
    {
      id: "ayarlar",
      label: "Hesap Ayarları",
      icon: <Settings size={20} />,
      hasSubmenu: true,
      submenuItems: [
        { id: "kisisel-bilgiler", label: "Kişisel Bilgiler", href: "/hesabim/ayarlar/kisisel-bilgiler" },
        { id: "adres-bilgileri", label: "Adres Bilgileri", href: "/hesabim/ayarlar/adres-bilgileri" },
      ],
    },
    { id: "sifre", label: "Şifre Değiştir", icon: <Lock size={20} />, href: "/hesabim/sifre" },
    { id: "yardim", label: "Yardıma mı İhtiyacınız Var?", icon: <HelpCircle size={20} />, href: "/yardim" },
  ];

  const toggleSubmenu = (id: string) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <>
      {/* Mobil arkaplan karartması */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 p-6 z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:w-80 md:static
        `}
      >
        {/* Mobil Kapatma Butonu */}
        <button
          className="absolute top-4 right-4 md:hidden"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        {/* Welcome */}
        <div className="mb-8 mt-6 md:mt-0">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-[10px] leading-tight">
              Toyzz Box
              <br />
              {membershipLevel}
            </div>
            <div>
              <h2 className="font-semibold text-lg">HOŞ GELDİN {userName}</h2>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              {item.hasSubmenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      activeMenu === item.id
                        ? "bg-gray-100 text-black font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        expandedMenus.includes(item.id) ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expandedMenus.includes(item.id) && item.submenuItems && (
                    <div className="ml-11 mt-1 space-y-1">
                      {item.submenuItems.map((sub) => (
                        <Link
                          key={sub.id}
                          href={sub.href}
                          onClick={() => onMenuChange(sub.id)}
                          className={`block px-4 py-2 text-sm rounded-lg transition-colors ${
                            activeMenu === sub.id
                              ? "bg-gray-100 text-black font-medium"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href || "#"}
                  onClick={() => onMenuChange(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                    activeMenu === item.id
                      ? "bg-gray-100 text-black font-medium"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm">{item.label}</span>
                  </div>
                  {item.badge && <span className="text-xs text-gray-500">{item.badge}</span>}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full mt-8 px-4 py-3 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut size={18} />
          Çıkış yap
        </button>
      </aside>
    </>
  );
};
