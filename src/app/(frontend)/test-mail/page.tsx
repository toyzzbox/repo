"use client";

import { useState } from "react";

export default function TestMailPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Gönderiliyor...");

    try {
      const res = await fetch("/api/send-test-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) setStatus("Mail gönderildi!");
      else setStatus("Hata: " + data.error);
    } catch (err) {
      setStatus("Hata: " + (err as any).message);
    }
  };

  return (
    <div className="p-4">
      <h1>Test Mail Gönder</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Mail adresi"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Gönder
        </button>
      </form>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}
