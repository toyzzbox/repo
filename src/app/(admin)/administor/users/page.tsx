import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import AdminUserClient from "./AdminUserClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUserPage() {
  let users: any[] = [];

  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    console.error("Admin users fetch failed:", e);
    users = [];
  }

  return (
    <Suspense fallback={null}>
      <AdminUserClient users={JSON.parse(JSON.stringify(users))} />
    </Suspense>
  );
}
