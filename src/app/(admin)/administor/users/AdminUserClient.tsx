"use client";

import UserList from "@/components/(backend)/user/UserList";

export default function AdminUserClient({ users }: { users: any[] }) {
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Kullanıcı Listesi</h1>
      <UserList users={users} />
    </main>
  );
}
