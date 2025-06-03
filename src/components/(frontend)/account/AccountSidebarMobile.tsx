"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { href: "/hesabim/profile", label: "Profilim", icon: "👤" },
  { href: "/hesabim/orders", label: "Siparişlerim", icon: "📦" },
  { href: "/hesabim/addresses", label: "Adreslerim", icon: "🏠" },
  { href: "/hesabim/favorites", label: "Favorilerim", icon: "❤️" },
  { href: "/hesabim/coupons", label: "Kuponlarım", icon: "🎟️" },
  { href: "/hesabim/security", label: "Güvenlik", icon: "🔒" },
  { href: "/api/auth/signout", label: "Çıkış Yap", icon: "🚪" },
];

export default function AccountSidebarMobile() {
  const pathname = usePathname();

  return (
    <div className="md:hidden mb-4">
      <Sheet>
        <SheetTrigger className="flex items-center gap-2 text-sm px-4 py-2 bg-gray-100 rounded-md w-full">
          <Menu className="w-4 h-4" />
          Menü
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-4">
          <h2 className="text-lg font-bold mb-4">Hesap Menüsü</h2>
          <nav className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-gray-200 text-black"
                    : "text-gray-600 hover:bg-gray-100 hover:text-black"
                )}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}
