// app/actions/login.ts
"use server";

import { signIn } from "@/auth"; // App Router uyumlu
import { AuthError } from "next-auth";
import * as z from "zod";
import { LoginSchema } from "@/schema";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validated = LoginSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Geçersiz form verisi" };
  }

  try {
    await signIn("credentials", {
      email: validated.data.email,
      password: validated.data.password,
      redirect: false, // client yönlendirmesi
    });

    return { success: true };
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "E-posta veya şifre hatalı" };
    }

    return { error: "Giriş sırasında beklenmeyen bir hata oluştu" };
  }
};
