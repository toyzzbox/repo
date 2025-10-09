// src/app/(frontend)/hesabim/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth"; // kendi auth fonksiyonun

export default async function HesabimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect("/login");
  }

  return <>{children}</>;
}