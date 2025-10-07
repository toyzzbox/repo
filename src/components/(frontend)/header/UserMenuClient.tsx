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
    <div className="relative z-30">
      {/* Dropdown tetikleyici */}
      <div
        onClick={toggleOpen}
        className="p-2 flex items-center gap-1 rounded-full cursor-pointer hover:shadow-md transition text-gray-700"
      >
        <User className="w-5 h-5" />
        {session ? session.user?.name || "Hesabım" : "Giriş Yap"}
      </div>

      {/* Dropdown içeriği */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-[170px] bg-white shadow-md rounded-md overflow-hidden text-sm flex flex-col cursor-pointer">
          {session ? (
            <>
              <Link href="/orders">
                <div
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={toggleOpen}
                >
                  Siparişlerim
                </div>
              </Link>
              <Link href="/admin">
                <div
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={toggleOpen}
                >
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
            <>
              <Link href="/login">
                <div
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={toggleOpen}
                >
                  Login
                </div>
              </Link>
              <Link href="/register">
                <div
                  className="px-4 py-2 hover:bg-gray-100"
                  onClick={toggleOpen}
                >
                  Register
                </div>
              </Link>
            </>
          )}
        </div>
      )}

      {/* Tıklayınca dropdown kapanması için overlay */}
      {isOpen && (
        <div
          onClick={toggleOpen}
          className="fixed inset-0 bg-black/20 z-20"
        />
      )}
    </div>
  );
}
