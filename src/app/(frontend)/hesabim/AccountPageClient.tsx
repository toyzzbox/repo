// src/app/(frontend)/hesabim/layout-client.tsx
"use client";

import { useState } from "react";
import { AccountSidebar } from "./Sidebar";

export default function AccountLayoutClient({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const [activeMenu, setActiveMenu] = useState("hesabim");

  const handleLogout = () => {
    console.log("Çıkış yapılıyor...");
    // logout endpoint çağrısı yapılabilir
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AccountSidebar
        userName={userName}
        membershipLevel="BLACK"
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
