import Sidebar from "@/components/(backend)/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <div className="flex min-h-screen">
          {/* Sidebar Alanı */}
          <aside className="w-1/4 h-screen fixed top-0 left-0 bg-white shadow-lg">
            <Sidebar />
          </aside>

          {/* Ana İçerik */}
          <main className="ml-[25%] w-3/4 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
