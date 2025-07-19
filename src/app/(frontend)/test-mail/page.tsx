"use client";
import { useState, useTransition } from "react";
import { sendTestMail } from "@/actions/sendTestMail";

export default function MailForm() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(() => {
      sendTestMail(email).then((res) => {
        alert(res.success ? "Gönderildi!" : res.error);
      });
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button disabled={isPending}>Gönder</button>
    </form>
  );
}
