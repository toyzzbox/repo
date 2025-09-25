import { requireAuth } from "@/lib/session";

// Cache'i bypass et - her istekte yeni session kontrolü yap
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
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