// app/account/layout.tsx
import Link from "next/link";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <aside className="w-64 border-r pr-4">
        <nav className="space-y-2">
          <Link href="/account/profile">👤 Profilim</Link>
          <Link href="/account/orders">📦 Siparişlerim</Link>
          <Link href="/account/addresses">🏠 Adreslerim</Link>
          <Link href="/account/favorites">❤️ Favorilerim</Link>
          <Link href="/account/coupons">🎟️ Kuponlarım</Link>
          <Link href="/account/security">🔒 Güvenlik</Link>
          <Link href="/api/auth/signout">🚪 Çıkış Yap</Link>
        </nav>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
