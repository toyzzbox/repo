export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body className="bg-gray-100 text-gray-900">
          <div className="min-h-screen flex">
            {/* Örneğin bir admin sidebar */}
            <aside className="w-64 bg-gray-800 text-white p-4">
              <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
              <nav>
                <ul className="space-y-2">
                  <li><a href="/admin" className="hover:underline">Dashboard</a></li>
                  <li><a href="/admin/users" className="hover:underline">Users</a></li>
                  <li><a href="/admin/settings" className="hover:underline">Settings</a></li>
                </ul>
              </nav>
            </aside>
  
            {/* Sayfa içeriği */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </body>
      </html>
    );
  }
  