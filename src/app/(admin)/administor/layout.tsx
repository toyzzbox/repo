// app/(admin)/layout.tsx

import Sidebar from "@/components/(backend)/Sidebar";
import Topbar from "@/components/(backend)/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Topbar />
      <div>
      <Sidebar />
      <main className="min-h-screen bg-gray-100 text-gray-900 md:pl-64 pt-16 md:pt-0">
        {children}
      </main>
    </div>
    </div>
  );
}
