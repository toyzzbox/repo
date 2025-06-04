import "@/app/globals.css";
import Sidebar from "@/components/(backend)/Sidebar";
import Topbar from "@/components/(backend)/Topbar";

export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="tr">
        <body className="bg-gray-100 text-gray-900">
          <div className="">
            <div>
              <Topbar/>
            </div>
            <div className="flex min-h-screen">
          <aside className="w-1/6 bg-gray-800 p-4 text-white">
            <Sidebar />
          </aside>

          <main className="flex-1 p-6">{children}</main>
          </div>
          </div>
        </body>
      </html>
    );
  }
  