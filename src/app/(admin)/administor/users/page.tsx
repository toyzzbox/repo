import UserList from "@/components/(backend)/user/UserList";
import { prisma } from "@/lib/prisma";

export default async function AdminUserPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kullanıcı Listesi</h1>
      <UserList users={users} />
    </main>
  );
}
