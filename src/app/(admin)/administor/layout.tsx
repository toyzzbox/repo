import "@/app/globals.css";
import Sidebar from "@/components/(backend)/Sidebar";
import Topbar from "@/components/(backend)/Topbar";

export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className="bg-gray-100 text-gray-900">
          <div className="">
            <div>
              <Topbar/>
            </div>
            {/* Örneğin bir admin sidebar */}
            <aside className="w-1/6 bg-gray-800  p-4">
              <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
              
    <Sidebar/>
            </aside>
  
            {/* Sayfa içeriği */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </body>
      </html>
    );
  }
  