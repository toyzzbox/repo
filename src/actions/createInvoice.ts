'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// ✅ Zod ile doğrulama şeması
const invoiceSchema = z.object({
  userId: z.string().min(1, 'Kullanıcı ID gerekli'),
  orderId: z.string().optional(), // isteğe bağlı ilişki
  type: z.enum(['INDIVIDUAL', 'CORPORATE']),

  // Bireysel alanlar
  fullName: z.string().optional(),
  tcNumber: z.string().optional(),

  // Kurumsal alanlar
  companyName: z.string().optional(),
  taxOffice: z.string().optional(),
  taxNumber: z.string().optional(),

  // Ortak alanlar
  addressLine: z.string().min(3, 'Adres gerekli'),
  city: z.string().min(2, 'Şehir gerekli'),
  district: z.string().min(2, 'İlçe gerekli'),
  postalCode: z.string().optional(),
  email: z.string().email('Geçerli e-posta girin').optional(),
  phone: z.string().optional(),
});

export async function createInvoiceAction(formData: FormData) {
  try {
    // Form verilerini al
    const rawData = Object.fromEntries(formData.entries());

    // Zod doğrulaması
    const validated = invoiceSchema.parse({
      ...rawData,
      type: rawData.type as 'INDIVIDUAL' | 'CORPORATE',
    });

    // 💡 Tip bazlı alan kontrolü
    if (validated.type === 'INDIVIDUAL') {
      if (!validated.fullName || !validated.tcNumber) {
        throw new Error('Bireysel faturalar için isim ve TC kimlik numarası zorunludur.');
      }
    }

    if (validated.type === 'CORPORATE') {
      if (!validated.companyName || !validated.taxNumber || !validated.taxOffice) {
        throw new Error('Kurumsal faturalar için şirket adı, vergi no ve vergi dairesi zorunludur.');
      }
    }

    // 🧾 Prisma ile fatura oluştur
    const invoice = await prisma.invoice.create({
      data: {
        userId: validated.userId,
        type: validated.type,
        fullName: validated.fullName,
        tcNumber: validated.tcNumber,
        companyName: validated.companyName,
        taxOffice: validated.taxOffice,
        taxNumber: validated.taxNumber,
        addressLine: validated.addressLine,
        city: validated.city,
        district: validated.district,
        postalCode: validated.postalCode,
        email: validated.email,
        phone: validated.phone,
      },
    });

    // Eğer bir orderId verilmişse, ilişkilendir
    if (validated.orderId) {
      await prisma.order.update({
        where: { id: validated.orderId },
        data: { invoiceId: invoice.id },
      });
    }

    revalidatePath('/account/invoices'); // örnek cache yenileme yolu
    return { success: true, invoice };
  } catch (error: any) {
    console.error('❌ createInvoiceAction error:', error);
    return { success: false, message: error.message || 'Fatura oluşturulamadı.' };
  }
}
