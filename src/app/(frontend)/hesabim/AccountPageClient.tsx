// src/app/(frontend)/hesabim/AccountPageClient.tsx
"use client"

import { useState } from "react";
import { AccountSidebar } from "./Sidebar";


interface Session {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export const AccountPageClient = ({ session }: { session: Session | null }) => {
  const [activeMenu, setActiveMenu] = useState("hesabim");

  const handleLogout = () => {
    console.log("Çıkış yapılıyor...");
    // Logout fonksiyonunu buraya ekle
  };

  if (!session) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AccountSidebar
        userName={session.user.name || session.user.email || ""}
        membershipLevel="BLACK"
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold mb-6">
            Merhaba, {session.user.name || session.user.email} 👋
          </h1>
          {/* Diğer içerikler */}
        </div>
      </main>
    </div>
  );
};