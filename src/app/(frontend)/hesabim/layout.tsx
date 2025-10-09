// src/app/(frontend)/hesabim/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session"; // session dosyasından import et

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