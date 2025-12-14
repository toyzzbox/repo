"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function NotFoundClient() {
  const sp = useSearchParams();
  const from = sp.get("from");

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">404 – Sayfa bulunamadı</h1>
      {from ? <p className="text-sm text-muted-foreground mb-6">Kaynak: {from}</p> : null}

      <Link href="/" className="underline">
        Ana sayfaya dön
      </Link>
    </main>
  );
}
