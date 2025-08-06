// app/actions/auth.ts
"use server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

// Validation schema
const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
})

type RegisterFormData = z.infer<typeof registerSchema>

export async function registerUser(formData: FormData) {
  try {
    // Form data'yı parse et
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    }

    // Validation
    const validatedData = registerSchema.parse(rawData)

    // Kullanıcının zaten var olup olmadığını kontrol et
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return {
        error: "Bu email adresi ile zaten bir hesap mevcut"
      }
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(validatedData.password, 12)

    // Kullanıcıyı oluştur
    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        name: validatedData.name,
        // Better-auth için gerekli alanlar
      }
    })

    // Better-auth ile session oluştur
    await auth.api.signUpEmail({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
      }
    })

    revalidatePath("/")
    
    return {
      success: "Hesap başarıyla oluşturuldu!",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    }

  } catch (error) {
    console.error("Register error:", error)
    
    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0].message
      }
    }

    return {
      error: "Bir hata oluştu. Lütfen tekrar deneyin."
    }
  }
}

// Login action (bonus)
export async function loginUser(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email ve şifre gerekli" }
    }

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      }
    })

    if (result.user) {
      revalidatePath("/")
      redirect("/dashboard") // Başarılı login sonrası yönlendirme
    }

    return { error: "Geçersiz email veya şifre" }

  } catch (error) {
    console.error("Login error:", error)
    return { error: "Giriş yapılırken bir hata oluştu" }
  }
}