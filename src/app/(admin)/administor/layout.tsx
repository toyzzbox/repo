import Topbar from "@/components/(backend)/Topbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
    

      <div className="flex-1 flex flex-col">
        <Topbar /> {/* Topbar üst kısmı */}
        <main className="flex-1 p-6 bg-gray-100 text-gray-900">
          {children} {/* İçerik buraya gelir */}
        </main>
      </div>
    </div>
  );
}
