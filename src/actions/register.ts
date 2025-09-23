// actions/register.ts
"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Validation schema
const RegisterSchema = z.object({
  name: z.string().min(2, "Ad en az 2 karakter olmalı").max(100, "Ad çok uzun"),
  email: z.string().email("Geçerli bir email adresi girin").toLowerCase(),
  password: z.string().min(6, "Şifre en az 6 karakter olmalı"),
  confirmPassword: z.string().min(6, "Şifre tekrar en az 6 karakter olmalı"),
  terms: z.literal("on", { 
    errorMap: () => ({ message: "Kullanım şartlarını kabul etmelisiniz" })
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"],
});

// Helper functions
async function getClientInfo() {
  const headersList = await headers();
  const forwarded = headersList.get("x-forwarded-for");
  const realIP = headersList.get("x-real-ip");
  const cfIP = headersList.get("cf-connecting-ip");
  
  return {
    ipAddress: (forwarded?.split(",")[0] || realIP || cfIP || "unknown").trim(),
    userAgent: headersList.get("user-agent") || "unknown",
  };
}

async function checkRateLimit(email: string, ipAddress: string): Promise<boolean> {
  const last15Minutes = new Date(Date.now() - 15 * 60 * 1000);
  
  const recentAttempts = await prisma.loginAttempt.count({
    where: {
      OR: [
        { email: email.toLowerCase() },
        { ipAddress }
      ],
      success: false,
      createdAt: { gte: last15Minutes },
    },
  });

  return recentAttempts < 5; // Max 5 failed attempts per 15 minutes
}

async function recordLoginAttempt(
  email: string,
  success: boolean,
  ipAddress: string,
  userAgent: string,
  userId?: string,
  reason?: string
) {
  await prisma.loginAttempt.create({
    data: {
      email: email.toLowerCase(),
      userId: userId || null,
      ipAddress,
      userAgent,
      success,
      reason: reason || null,
    },
  });
}

// Main register action
export async function registerUser(
  prevState: { success: boolean; message: string },
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  
  const { ipAddress, userAgent } = await getClientInfo();

  try {
    // Extract and validate form data
    const rawData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      terms: formData.get("terms") as string,
    };

    const validatedData = RegisterSchema.parse(rawData);

    // Rate limiting check
    const isAllowed = await checkRateLimit(validatedData.email, ipAddress);
    if (!isAllowed) {
      await recordLoginAttempt(
        validatedData.email,
        false,
        ipAddress,
        userAgent,
        undefined,
        "Rate limit exceeded during registration"
      );
      return {
        success: false,
        message: "Çok fazla deneme. 15 dakika sonra tekrar deneyin.",
      };
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      await recordLoginAttempt(
        validatedData.email,
        false,
        ipAddress,
        userAgent,
        undefined,
        "Email already exists"
      );
      return {
        success: false,
        message: "Bu email adresi zaten kayıtlı",
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user with transaction
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          role: "USER",
          emailVerified: true, // Şimdilik true olarak ayarlıyoruz
        },
      });

      // Record successful registration attempt
      await recordLoginAttempt(
        validatedData.email,
        true,
        ipAddress,
        userAgent,
        newUser.id,
        "Registration successful"
      );

      return newUser;
    });

    // Başarılı kayıt sonrası login sayfasına yönlendir
    redirect("/login?message=registration-success");

  } catch (error) {
    console.error("Register error:", error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return {
        success: false,
        message: firstError.message,
      };
    }

    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return {
        success: false,
        message: "Bu email adresi zaten kayıtlı",
      };
    }

    // Generic error
    return {
      success: false,
      message: "Bir hata oluştu. Lütfen tekrar deneyin.",
    };
  }
}