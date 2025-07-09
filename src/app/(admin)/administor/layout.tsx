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
      <div className="flex">
        <Sidebar />
        <main className="flex-1 min-h-screen bg-gray-100 text-gray-900 pt-16 md:pl-64">
          {children}
        </main>
      </div>
    </div>
  );
}
