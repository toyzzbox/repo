'use server';

import { z } from "zod";
import { RegisterSchema } from "@/schema";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Tipi burada net tanımlıyoruz
type ActionState = { error: string; success?: undefined } | { success: string; error?: undefined };

export const register = async (
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  const parsed = RegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Geçersiz form verisi." };
  }

  const { name, email, password } = parsed.data;

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return { error: "Bu e-posta zaten kayıtlı." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: "Kayıt başarılı. Giriş yapabilirsiniz." };
};