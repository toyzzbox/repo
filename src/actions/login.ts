// app/actions/login.ts
"use server";

import { signIn } from "@/auth"; // App Router uyumlu
import * as z from "zod";
import { LoginSchema } from "@/schema";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validated = LoginSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Geçersiz form verisi" };
  }

  const { email, password } = validated.data;

  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return { error: "E-posta veya şifre hatalı" };
  }

  return { success: true };
};
