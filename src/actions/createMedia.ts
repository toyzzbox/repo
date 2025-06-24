"use server";

import { prisma } from "@/lib/prisma";
import { MediaType } from '@prisma/client';

export async function createMedia(urls: string[]) {
  const media = await prisma.media.create({
    data: {
      urls,
      type: MediaType.image, // veya MediaType.video
    },
  });

  return media;
}
