"use server";

import { prisma } from "@/lib/prisma";

export async function createMedia(urls: string[]) {
  const media = await prisma.media.create({
    data: { urls },
  });
  return media;
}
