"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addAddress(_: any, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return;

  const data = {
    fullName: formData.get("fullName") as string,
    city: formData.get("city") as string,
    district: formData.get("district") as string,
    postalCode: formData.get("postalCode") as string,
    addressLine: formData.get("addressLine") as string,
    phone: formData.get("phone") as string,
  };

  await prisma.address.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/hesabim/addresses");
}
