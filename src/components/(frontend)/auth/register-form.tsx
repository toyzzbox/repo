"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { registerUser } from "@/actions/auth";
import { RegisterResult } from "@/actions/register";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700
                 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {pending ? "Hesap Oluşturuluyor..." : "Hesap Oluştur"}
    </button>
  );
}

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction] = useActionState<RegisterResult, FormData>(
    registerUser,
    { }
  );

  useEffect(() => {
    if (state?.success) {
      const t = setTimeout(() => router.push("/login"), 1500);
      return () => clearTimeout(t);
    }
  }, [state?.success, router]);

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Hesap Oluştur</h2>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Ad Soyad
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Adınızı giriniz"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Şifre
          </label>
          <input
            type="password"
            id="password"
            name="password"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="En az 6 karakter"
          />
        </div>

        {state?.error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{state.error}</div>
        )}
        {state?.success && (
          <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md">{state.success}</div>
        )}

        <SubmitButton />
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Zaten hesabınız var mı?{" "}
        <a href="/login" className="text-blue-600 hover:underline">Giriş yapın</a>
      </p>
    </div>
  );
}
