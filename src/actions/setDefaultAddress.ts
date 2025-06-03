// /src/actions/setDefaultAddress.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function setDefaultAddress(id: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return false;

  // Önce tüm adreslerde isDefault'u false yap
  await prisma.address.updateMany({
    where: { userId },
    data: { isDefault: false },
  });

  // Seçilen adresi varsayılan yap
  await prisma.address.update({
    where: { id },
    data: { isDefault: true },
  });

  revalidatePath("/hesabim/adreslerim");
  return true;
}
