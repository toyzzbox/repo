"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { logout } from "@/lib/logout";

interface UserMenuClientProps {
  session: any; // Session tipinizi buraya koyun (örn: Session | null)
}

export default function UserMenuClient({ session }: UserMenuClientProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="relative z-60 overflow-visible">
      {/* Tetikleyici */}
      <div
        onClick={toggleOpen}
        className="p-2 flex items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-gray-700"
      >
        <User className="w-5 h-5" />
        {session ? session.user?.name || "Hesabım" : "Giriş Yap"}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-[200px] bg-white shadow-md rounded-md overflow-visible text-sm flex flex-col cursor-pointer z-60">
          {session ? (
            <>
              <Link href="/orders">
                <div className="px-4 py-2 hover:bg-gray-100" onClick={toggleOpen}>
                  Siparişlerim
                </div>
              </Link>
              <Link href="/admin">
                <div className="px-4 py-2 hover:bg-gray-100" onClick={toggleOpen}>
                  Admin Yönetimi
                </div>
              </Link>
              <hr />
              <div
                className="px-4 py-2 hover:bg-gray-100"
                onClick={() => {
                  toggleOpen();
                  logout();
                }}
              >
                Çıkış Yap
              </div>
            </>
          ) : (
            <div className="flex flex-col px-4 py-2 gap-2">
              <Link href="/login">
                <button
                  onClick={toggleOpen}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2 rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200"
                >
                  Giriş Yap
                </button>
              </Link>

              <Link href="/register">
                <button
                  onClick={toggleOpen}
                  className="w-full border border-orange-500 text-orange-500 font-semibold py-2 rounded-lg hover:bg-orange-50 transition-all duration-200"
                >
                  Üye Ol
                </button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={toggleOpen}
          className="fixed inset-0 bg-black/20 z-50"
        />
      )}
    </div>
  );
}
