"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schema";
import { prisma } from "@/lib/prisma";

type LoginResult =
  | { success: string; error?: undefined }
  | { error: string; success?: undefined };

export const login = async (data: z.infer<typeof LoginSchema>): Promise<LoginResult> => {
  const validated = LoginSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Geçersiz giriş verileri" };
  }

  const { email, password } = validated.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return { error: "Kullanıcı bulunamadı veya şifre hatalı" };
  }

  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/hesabim",
    });

    if (response?.error) {
      return { error: "Geçersiz e-posta veya şifre" };
    }

    return { success: "Giriş başarılı!" };
  } catch {
    return { error: "Sunucu hatası: Giriş başarısız" };
  }
};
