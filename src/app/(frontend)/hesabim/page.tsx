// src/app/(frontend)/hesabim/page.tsx
export const dynamic = "force-dynamic";
import { getSession } from "@/lib/session";
import { AccountPageClient } from "./AccountPageClient";

export default async function HesabimPage() {
  const session = await getSession();

  return <AccountPageClient session={session} />;
}