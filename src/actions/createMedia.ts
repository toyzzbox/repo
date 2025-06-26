"use server";

import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";

interface CreateMediaInput {
  urls: string[];
  type: MediaType;
}

export async function createMedia({ urls, type }: CreateMediaInput) {
  try {
    const media = await prisma.media.create({
      data: {
        type,
        urls,
      },
    });

    return { success: media };
  } catch (error) {
    console.error("createMedia error:", error);
    return { failure: "Media could not be created" };
  }
}
