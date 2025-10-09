"use client";

import { useState } from "react";
import { AccountSidebar } from "./Sidebar";

export default function AccountPageClient({ session, children }: any) {
  const [activeMenu, setActiveMenu] = useState("hesabim");

  const handleLogout = () => console.log("Çıkış yapılıyor...");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AccountSidebar
        userName={session.user?.name || session.user?.email || "KULLANICI"}
        membershipLevel="BLACK"
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
