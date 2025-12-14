"use server";

import { prisma } from "@/lib/prisma";
import { MediaType, VariantType } from "@prisma/client";

interface CreateMediaInput {
  urls: string[];     // bunları MediaVariant.cdnUrl olarak kaydedeceğiz
  type: MediaType;
  title?: string;
  description?: string;
  altText?: string;
  metadata?: Record<string, any>;
}

export async function createMedia({
  urls,
  type,
  title,
  description,
  altText,
  metadata,
}: CreateMediaInput) {
  try {
    if (!urls?.length) {
      return { failure: "En az 1 URL gerekli." };
    }

    const media = await prisma.media.create({
      data: {
        type,
        title,
        description,
        altText,
        metadata: metadata ?? undefined,

        // ✅ urls artık MediaVariant olarak yazılıyor
        variants: {
          create: urls.map((cdnUrl) => ({
            cdnUrl,
            key: cdnUrl,            // şimdilik key yoksa url’i key gibi sakla
            type: VariantType.ORIGINAL, // VariantType enum’unda ORIGINAL yoksa aşağıya bak
            format: undefined,
            width: undefined,
            height: undefined,
            size: undefined,
          })),
        },
      },
      include: {
        variants: true,
      },
    });

    return { success: media };
  } catch (error) {
    console.error("createMedia error:", error);
    return { failure: "Media could not be created" };
  }
}
