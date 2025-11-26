"use client";

import { useState } from "react";
import { AccountSidebar } from "./Sidebar";
import { Menu } from "lucide-react";

export default function AccountPageClient({ session, children }: any) {
  const [activeMenu, setActiveMenu] = useState("hesabim");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => console.log("Çıkış yapılıyor...");

  return (
    <div className="flex min-h-screen bg-gray-50 relative">

      {/* Mobil Menü Butonu */}
      <button
        className="md:hidden p-3 fixed top-4 left-4 z-50 bg-white shadow rounded-lg"
        onClick={() => setIsSidebarOpen(true)}
      >
        <Menu size={24} />
      </button>

      {/* Sidebar */}
      <AccountSidebar
        userName={session.user?.name || session.user?.email || "KULLANICI"}
        membershipLevel="BLACK"
        activeMenu={activeMenu}
        onMenuChange={(id) => {
          setActiveMenu(id);
          setIsSidebarOpen(false); // mobilde menü seçilince kapansın
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* İçerik */}
      <main className="flex-1 p-6 md:ml-80">{children}</main>
    </div>
  );
}
