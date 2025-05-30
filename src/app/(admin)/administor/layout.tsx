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
      <Sidebar/>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </body>
      </html>
    );
  }
  