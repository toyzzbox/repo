// app/account/layout.tsx
import AccountSidebar from "@/components/(frontend)/account/AccountSidebar";
import { notFound } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Aktif segment bilgisi route’lardan alınabilir
  // Bu örnekte segment bilgisini alıp Sidebar’a prop geçiyoruz
  const pathname = "/hesabim"; // Buraya dinamik çözüm yazılabilir

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 flex gap-6">
      <AccountSidebar activePath={pathname} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
