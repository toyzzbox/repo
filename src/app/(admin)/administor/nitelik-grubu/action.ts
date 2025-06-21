"use server";

import { prisma } from "@/lib/prisma";





export async function createAttribute(previousState: unknown,formData: FormData) {
  try {
    const name = formData.get("name")?.toString(); // Güvenli dönüşüm


    // İsim ve grup ID'sinin boş olup olmadığını kontrol et
    if (!name ) {
      return "İsim ve grup ID'si zorunludur.";
    }

    // Yeni attribute oluştur
    await prisma.attributeGroup.create({
      data: {
        name,

      },
    });

    return "Attribute başarıyla oluşturuldu.";
  } catch (error: any) {
    console.error("Error creating attribute:", error.message);
    return "Bir hata oluştu: " + error.message;
  }
}
