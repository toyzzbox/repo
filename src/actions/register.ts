"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";
import { RegisterSchema } from "@/schema";
import { prisma } from "@/lib/prisma";

export const register = async (data: z.infer<typeof RegisterSchema>) => {
  try {
    const result = RegisterSchema.safeParse(data);
    if (!result.success) {
      return { error: "Validation failed", details: result.error.flatten() };
    }

    const { email, name, password, passwordConfirmation } = result.data;

    if (password !== passwordConfirmation) {
      return { error: "Şifreler uyuşmuyor" };
    }

    const lowerCaseEmail = email.trim().toLowerCase();

    const userExist = await prisma.user.findUnique({
      where: { email: lowerCaseEmail },
    });

    if (userExist) {
      return { error: "Bu e-posta zaten kayıtlı." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email: lowerCaseEmail,
        password: hashedPassword,
        name,
      },
    });

    return { success: "Kayıt başarılı, şimdi giriş yapabilirsiniz." };
  } catch (error) {
    console.error(error);
    return { error: "Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin." };
  }
};
