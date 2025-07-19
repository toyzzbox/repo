// src/components/SendTestMailForm.tsx
"use client";

import { useTransition, useState } from "react";
import { sendTestMail } from "@/actions/sendTestMail";

export default function SendTestMailForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await sendTestMail(email);
      setStatus(res.success ? "✅ Mail gönderildi!" : `❌ Hata: ${res.error}`);
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="email"
        required
        placeholder="E-posta adresi"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-4 py-2 rounded w-full"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {isPending ? "Gönderiliyor..." : "Test Mail Gönder"}
      </button>
      {status && <p className="text-sm mt-2">{status}</p>}
    </form>
  );
}
