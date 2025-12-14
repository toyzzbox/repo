"use client";

import { useSearchParams } from "next/navigation";

export default function ForbiddenClient() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold mb-4">403 – Yetkisiz Erişim</h1>
      {reason && <p className="text-gray-500">Sebep: {reason}</p>}
    </div>
  );
}
