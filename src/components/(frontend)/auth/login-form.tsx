"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signInWithEmail } from "@/lib/auth-client";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }

      toast.success("Giriş başarılı! Yönlendiriliyorsunuz...");
      setTimeout(() => router.push("/hesabim"), 1500);
    } catch (err: any) {
      toast.error(err?.message ?? "Bir hata oluştu");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Giriş Yap</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-green-500"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md
                       focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Şifrenizi girin"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Giriş Yapılıyor..." : "Giriş Yap"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Hesabınız yok mu?{" "}
        <a href="/register" className="text-green-600 hover:underline">
          Kayıt Olun
        </a>
      </p>
    </div>
  );
}
