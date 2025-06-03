// app/hesabim/layout.tsx

import AccountSidebar from "@/components/(frontend)/account/AccountSidebar";
import AccountSidebarMobile from "@/components/(frontend)/account/AccountSidebarMobile";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Not: activePath dinamik alınmak istenirse, server bileşende URL segmenti parse edilebilir.
  const pathname = "/hesabim"; // İstersen bunu bir prop olarak route'dan çekebilirim.

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Mobil Menü */}
      <AccountSidebarMobile />

      <div className="flex gap-6">
        {/* Masaüstü Sidebar */}
        <div className="hidden md:block">
          <AccountSidebar activePath={pathname} />
        </div>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
