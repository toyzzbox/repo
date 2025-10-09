import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AccountLayoutClient from "./AccountPageClient";

export default async function HesabimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) redirect("/login");

  return (
    <AccountLayoutClient session={session}>
      {children}
    </AccountLayoutClient>
  );
}
