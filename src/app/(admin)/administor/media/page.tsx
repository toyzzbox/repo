import { Suspense } from "react";
import MediaPageClient from "./MediaPageClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function MediaPage() {
  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Medya Yükle</h1>

      <Suspense fallback={<div>Yükleniyor...</div>}>
        <MediaPageClient />
      </Suspense>
    </main>
  );
}
