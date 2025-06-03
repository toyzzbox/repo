// app/account/components/AccountSidebar.tsx
import Link from "next/link";
import clsx from "clsx";

type Props = {
  activePath: string;
};

const links = [
  { href: "/hesabim/profile", label: "Profilim", icon: "👤" },
  { href: "/hesabim/orders", label: "Siparişlerim", icon: "📦" },
  { href: "/hesabim/addresses", label: "Adreslerim", icon: "🏠" },
  { href: "/hesabim/favorites", label: "Favorilerim", icon: "❤️" },
  { href: "/hesabim/coupons", label: "Kuponlarım", icon: "🎟️" },
  { href: "/hesabim/security", label: "Güvenlik", icon: "🔒" },
  { href: "/api/auth/signout", label: "Çıkış Yap", icon: "🚪" },
];

export default function AccountSidebar({ activePath }: Props) {
  return (
    <aside className="w-64 border-r pr-4">
      <h2 className="text-xl font-bold mb-6">Hesabım</h2>
      <nav className="space-y-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
              activePath === link.href
                ? "bg-gray-100 text-black"
                : "text-gray-600 hover:bg-gray-50 hover:text-black"
            )}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
