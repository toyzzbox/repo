"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schema";
import { prisma } from "@/lib/prisma";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  // Giriş verilerini doğrula
  const validatedData = LoginSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Geçersiz giriş verileri" };
  }

  const { email, password } = validatedData.data;

  // Kullanıcının varlığını kontrol et
  const userExists = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });

  if (!userExists || !userExists.password || !userExists.email) {
    return { error: "Kullanıcı bilgileri hatalı girildi" };
  }

  try {
    // Sunucu tarafında kimlik doğrulama
    await signIn("credentials", {
      email: userExists.email,
      password: password,
      redirect: false, // Yönlendirmeyi manuel olarak kontrol etmek için
    });

    return { success: "Kullanıcı başarıyla giriş yaptı" };
  }catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message === "CredentialsSignin") {
        return { error: "Geçersiz e-posta veya şifre" };
      } else {
        return { error: "Giriş sırasında bir hata oluştu" };
      }
    } else {
      return { error: "Bilinmeyen bir hata oluştu" };
    }
  }
};
