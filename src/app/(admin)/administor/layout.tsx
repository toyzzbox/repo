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
          <Topbar/>
        <div className="flex">

<div className="w-1/6">
<Sidebar/>
</div> <div className="flex-1">
{children}
</div>


</div>
        </div>
      </body>
    </html>
  );
}
