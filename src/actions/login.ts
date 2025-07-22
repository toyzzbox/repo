"use server";

import * as z from "zod";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schema";
import { prisma } from "@/lib/prisma";

export const login = async (data: z.infer<typeof LoginSchema>) => {
  const validatedData = LoginSchema.safeParse(data);
  if (!validatedData.success) {
    return { error: "Geçersiz giriş verileri" };
  }

  const { email, password } = validatedData.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !user.password) {
    return { error: "Kullanıcı bulunamadı veya şifre eksik" };
  }

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { error: "Geçersiz e-posta veya şifre" };
    }

    return { success: "Kullanıcı başarıyla giriş yaptı" };
  } catch (error: unknown) {
    return { error: "Sunucu hatası: Giriş işlemi başarısız" };
  }
};


    if (result?.error) {
      return { error: "Geçersiz e-posta veya şifre" };
    }

    return { success: "Kullanıcı başarıyla giriş yaptı" };
  } catch (error: unknown) {
    return { error: "Sunucu hatası: Giriş işlemi başarısız" };
  }
};
