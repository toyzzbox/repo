import Sidebar from "@/components/(backend)/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <div className="min-h-screen flex">
          <aside className="w-1/4">
            <Sidebar />
          </aside>
          <main className="w-3/4 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
