// app/actions/auth.ts
"use server"

import { auth } from "@/lib/auth"
import { z } from "zod"
import { revalidatePath } from "next/cache"

const registerSchema = z.object({
  email: z.string().email("Geçerli bir email adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır"),
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
})

type RegisterFormData = z.infer<typeof registerSchema>

export async function registerUser(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      name: formData.get("name") as string,
    }

    const validatedData = registerSchema.parse(rawData)

    // 🧠 Sadece BetterAuth üzerinden kayıt
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
    }

  } catch (error: any) {
    console.error("Register error:", error)

    if (error instanceof z.ZodError) {
      return {
        error: error.errors[0].message
      }
    }

    if (error?.statusCode === 422) {
      return {
        error: "Bu e-posta ile zaten bir kullanıcı var."
      }
    }

    return {
      error: "Kayıt sırasında bir hata oluştu."
    }
  }
}

