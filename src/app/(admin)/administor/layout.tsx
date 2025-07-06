import Topbar from "@/components/(backend)/Topbar";
import Sidebar from "@/components/(backend)/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Topbar />
      <div className="flex min-h-screen pt-14"> {/* pt-14 topbar yüksekliği kadar padding */}
        <Sidebar />
        <main className="flex-1 p-6 bg-gray-100 text-gray-900">{children}</main>
      </div>
    </div>
  );
}
