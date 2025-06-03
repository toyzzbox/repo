"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full flex items-center px-2 py-1.5 text-sm hover:bg-gray-100 rounded-sm"
    >
      <LogOut className="mr-2 h-4 w-4" />
      <span>Çıkış Yap</span>
    </button>
  );
}
