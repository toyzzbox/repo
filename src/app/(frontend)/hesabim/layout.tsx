// src/app/(frontend)/hesabim/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AccountLayoutClient from "./AccountPageClient";

export default async function HesabimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server tarafında session kontrolü
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Session’ı client layout’a aktar
  return (
    <AccountLayoutClient
      userName={session.user.name || session.user.email || ""}
    >
      {children}
    </AccountLayoutClient>
  );
}
