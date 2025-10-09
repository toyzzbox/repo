// src/app/(frontend)/hesabim/page.tsx
import { getSession } from "@/lib/auth";
import { AccountPageClient } from "./AccountPageClient";

export default async function HesabimPage() {
  const session = await getSession();

  return <AccountPageClient session={session} />;
}