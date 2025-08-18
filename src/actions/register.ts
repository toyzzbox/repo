import { bcrypt } from 'bcryptjs';
"use server";

import { prisma } from "@/lib/prisma";



export async function registerUser(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, message: "Email ve şifre zorunludur" };
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return { success: false, message: "Bu email zaten kayıtlı" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    return { success: true, message: "Kayıt başarılı!" };
  } catch (err) {
    return { success: false, message: "Bir hata oluştu" };
  }
}
