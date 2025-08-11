// app/actions/auth.ts
"use server";

import { z } from "zod";
import { auth } from "@/lib/auth";

const RegisterSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalı"),
  email: z.string().email("Geçerli bir e-posta gir"),
  password: z.string().min(6, "Şifre en az 6 karakter"),
});

export type RegisterResult = { success?: string; error?: string };

export async function registerUser(
  _prevState: RegisterResult,            // ← 1. parametre prevState
  formData: FormData                     // ← 2. parametre formData
): Promise<RegisterResult> {
  const data = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    password: String(formData.get("password") ?? ""),
  };

  const parsed = RegisterSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await auth.api.signUpEmail({ body: parsed.data });
    return { success: "Kayıt başarılı. Giriş yapabilirsiniz." };
  } catch (e: any) {
    if (e?.code === "P2002" || /unique|exists|already/i.test(e?.message ?? "")) {
      return { error: "Bu e-posta zaten kayıtlı." };
    }
    return { error: e?.message ?? "Kayıt sırasında bir hata oluştu." };
  }
}
