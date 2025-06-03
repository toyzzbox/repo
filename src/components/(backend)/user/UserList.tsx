"use client";

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function UserList({ users }: { users: User[] }) {
  return (
    <div className="overflow-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <th className="px-6 py-4">Ad Soyad</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Kayıt Tarihi</th>
          </tr>
        </thead>
        <tbody className="text-sm text-gray-600">
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-6 py-4">{user.name}</td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
