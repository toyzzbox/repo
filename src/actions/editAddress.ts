"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function editAddress(_: any, formData: FormData) {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { success: false };

  const id = formData.get("id") as string;

  await prisma.address.update({
    where: { id, userId },
    data: {
      fullName: formData.get("fullName") as string,
      city: formData.get("city") as string,
      district: formData.get("district") as string,
      postalCode: formData.get("postalCode") as string,
      addressLine: formData.get("addressLine") as string,
      phone: formData.get("phone") as string,
    },
  });

  revalidatePath("/hesabim/addresses");

  return { success: true };
}
