"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schema";
import { prisma } from "@/lib/prisma";

/**
 * Kullanıcı giriş işlemi
 */
export const login = async (data: z.infer<typeof LoginSchema>) => {
  // 1. Form verisini Zod ile doğrula
  const validated = LoginSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Geçersiz giriş verileri" };
  }

  const { email, password } = validated.data;

  // 2. Kullanıcı veritabanında var mı kontrol et
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return { error: "Kullanıcı bulunamadı veya şifre hatalı" };
  }

  // 3. Giriş yapmayı dene
  try {
    const response = await signIn("credentials", {
      email,
      password,
      redirect: false, // yönlendirmeyi client tarafında yapacağız
    });

    if (response?.error) {
      return { error: "Geçersiz e-posta veya şifre" };
    }

    return { success: "Kullanıcı başarıyla giriş yaptı" };
  } catch (error: unknown) {
    return { error: "Sunucu hatası: Giriş işlemi başarısız" };
  }
};
