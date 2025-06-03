"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteAddress(id: string) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return false;

  await prisma.address.deleteMany({
    where: {
      id,
      userId,
    },
  });

  revalidatePath("/hesabim/addresses");
  return true;
}
