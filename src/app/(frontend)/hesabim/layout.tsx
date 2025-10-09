"use client"
import { useState, ReactNode } from "react";
import { AccountSidebar } from "./Sidebar";

interface AccountLayoutProps {
  children: ReactNode;
}

export const AccountLayout = ({ children }: AccountLayoutProps) => {
  const [activeMenu, setActiveMenu] = useState("hesabim");

  const handleLogout = () => {
    console.log("Çıkış yapılıyor...");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AccountSidebar
        userName="MEHMET"
        membershipLevel="BLACK"
        activeMenu={activeMenu}
        onMenuChange={setActiveMenu}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AccountLayout;
