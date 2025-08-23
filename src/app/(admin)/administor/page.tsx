import { requireAuth } from "@/lib/session";

export default async function DashboardPage() {
  // Giriş yapmış kullanıcı gerekli
  const session = await requireAuth();
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">
        Hoş geldin, {session.user.name}!
      </h1>
      <p>Dashboard içeriği...</p>
    </div>
  );
}