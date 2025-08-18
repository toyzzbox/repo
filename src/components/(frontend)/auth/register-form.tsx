"use client";

import { registerUser } from "@/actions/register";
import { useActionState } from "react";

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, {
    success: false,
    message: "",
  });

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-xl font-bold mb-4">Kayıt Ol</h1>

      <form action={formAction} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Adınız"
          className="border rounded w-full p-2"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border rounded w-full p-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          required
          className="border rounded w-full p-2"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isPending ? "Kaydediliyor..." : "Kayıt Ol"}
        </button>
      </form>

      {state.message && (
        <p
          className={`mt-4 ${
            state.success ? "text-green-600" : "text-red-500"
          }`}
        >
          {state.message}
        </p>
      )}
    </div>
  );
}
