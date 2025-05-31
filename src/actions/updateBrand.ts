'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBrand(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const mediaIds = formData.getAll("mediaIds[]") as string[];

  if (!name) return { error: "İsim zorunludur." };

  await prisma.brand.update({
    where: { id },
    data: {
      name,
      description,
      medias: {
        set: mediaIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/admin/brands");
  return { success: true };
}
