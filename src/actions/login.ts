"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schema";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

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

  // 2. Kullanıcı veritabanında var mı kontrol et (opsiyonel - signIn zaten kontrol ediyor)
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return { error: "Kullanıcı bulunamadı veya şifre hatalı" };
  }

  // 3. Giriş yapmayı dene
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/hesabim", // Session açıldıktan sonra yönlendirilecek sayfa
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Geçersiz e-posta veya şifre" };
        default:
          return { error: "Bir hata oluştu" };
      }
    }
    throw error;
  }
};

/**
 * Alternatif: Yönlendirme yapmadan login
 */
export const loginWithoutRedirect = async (data: z.infer<typeof LoginSchema>) => {
  const validated = LoginSchema.safeParse(data);
  if (!validated.success) {
    return { error: "Geçersiz giriş verileri" };
  }

  const { email, password } = validated.data;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // NextAuth v5'te redirect: false kullanıldığında
    // başarılı login sonrası null dönüyor
    if (result === null) {
      return { success: "Giriş başarılı" };
    }

    return { error: "Giriş başarısız" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Geçersiz e-posta veya şifre" };
        default:
          return { error: "Bir hata oluştu" };
      }
    }
    return { error: "Sunucu hatası" };
  }
};