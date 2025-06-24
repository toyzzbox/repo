// src/actions/deleteMedias.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function deleteMedias(mediaIds: string[]) {
  try {
    await prisma.media.deleteMany({
      where: {
        id: { in: mediaIds },
      },
    });
    return { success: true };
  } catch (error) {
    console.error("Medya silme hatası:", error);
    return { success: false };
  }
}
