// src/app/(admin)/layout.tsx

import "@/app/globals.css";
import Sidebar from "@/components/(backend)/Sidebar";
import Topbar from "@/components/(backend)/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen">
      <Topbar />
      <div className="flex">
        <aside className="w-1/6">
          <Sidebar />
        </aside>
        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
