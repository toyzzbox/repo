"use client";

import { createAuthClient } from "better-auth/react";

/**
 * BetterAuth Client (App Router)
 *
 * - baseURL: API route'umuz (route.ts → /api/auth/[...betterAuth])
 * - fetchOptions.credentials: "include" => cookie tabanlı session için şart
 * - callbackURL: Sosyal girişlerde dönüş adresi; gerekirse fonksiyon parametresiyle override edilir
 *
 * Notlar:
 * - Sunucu tarafında session almak için RSC’de `auth()` (src/lib/auth.ts) kullan.
 * - Bu client yalnızca tarayıcı tarafında kullanılmalı.
 */

// ---- Tekil instance (HMR/çoklu import güvenli) ----
let _client: ReturnType<typeof createAuthClient> | null = null;

// ---- Ana client ----
export const authClient =
  _client ??
  (_client = createAuthClient({
    baseURL: "/api/auth",
    fetchOptions: { credentials: "include" },
    // callbackURL: "/", // (opsiyonel) global default
  }));

// Kolaylık için bazı method ve hook'ları yeniden dışa aktar
export const { useSession, getSession, signIn, signOut } = authClient;

/* ===========================
   Yardımcı (helper) fonksiyonlar
   =========================== */

/** E-posta + şifre ile giriş */
export async function signInWithEmail(
  email: string,
  password: string,
  opts?: { callbackURL?: string }
) {
  return authClient.signIn.email({
    email,
    password,
    ...(opts?.callbackURL ? { callbackURL: opts.callbackURL } : {}),
  });
}

/** E-posta + şifre ile kayıt */
export async function signUpWithEmail(
  name: string,
  email: string,
  password: string
) {
  // Not: Signup sonrası otomatik login garanti değildir.
  return authClient.signUp.email({ name, email, password });
}

/** Google ile giriş (sosyal) */
export async function signInWithGoogle(callbackURL = "/") {
  return authClient.signIn.social({ provider: "google", callbackURL });
}

/** Çıkış (logout) — isim çakışmasın diye yardımcı fonksiyonu farklı adla verdik */
export async function logout() {
  return authClient.signOut();
}

/** Hata mesajını kullanıcı dostu hale getir */
export function normalizeAuthError(err: unknown): string {
  if (!err) return "Bilinmeyen hata.";
  if (typeof err === "string") return err;
  if (err instanceof Error) {
    if (/unique|already/i.test(err.message)) return "Bu e-posta zaten kayıtlı.";
    return err.message || "Bir hata oluştu.";
  }
  const anyErr = err as any;
  if (anyErr?.message) return String(anyErr.message);
  return "Bir hata oluştu.";
}
