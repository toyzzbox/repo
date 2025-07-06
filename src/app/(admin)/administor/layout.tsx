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
      <div className="flex min-h-screen">

          <Sidebar />

        <main className="flex-1 p-6 bg-gray-100 text-gray-900">{children}</main>
      </div>
    </div>
  );
}
