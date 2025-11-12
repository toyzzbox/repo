"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { MediaType, VariantType } from "@prisma/client";
import slugify from "slugify";
import sharp from "sharp";

const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.NEXT_AWS_S3_BUCKET_NAME!;
const REGION = process.env.NEXT_AWS_S3_REGION!;

interface Media {
  id: string;
  urls: string[];
  type: MediaType;
}

type UploadResult =
  | { success: true; media: Media[]; errors?: string[] }
  | { success: false; error: string };

export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  try {
    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0)
      return { success: false, error: "Yüklenecek dosya bulunamadı" };

    const created: Media[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const ext = file.name.split(".").pop()?.toLowerCase();
        if (!["png", "jpg", "jpeg", "webp"].includes(ext || "")) {
          errors.push(`${file.name}: Geçersiz dosya formatı`);
          continue;
        }

        const baseName = file.name.replace(/\.[^/.]+$/, "");
        const safeName = slugify(baseName, { lower: true, strict: true });
        const finalFileName = `${safeName}-${Date.now()}.webp`;
        const key = `uploads/${finalFileName}`;
        const buffer = await file.arrayBuffer();

        const webpBuffer = await sharp(Buffer.from(buffer))
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        const command = new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: webpBuffer,
          ContentType: "image/webp",
        });
        await s3.send(command);

        const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

        const media = await prisma.media.create({
          data: {
            type: MediaType.IMAGE,
            title: safeName.replace(/-/g, " "),
            altText: `${safeName} görseli`,
            variants: {
              create: {
                key: "main",
                cdnUrl: publicUrl,
                format: "webp",
                type: VariantType.ORIGINAL,
              },
            },
          },
          include: {
            variants: true,
          },
        });

        created.push({
          id: media.id,
          urls: media.variants.map((v) => v.cdnUrl),
          type: media.type,
        });
      } catch (fileError) {
        const msg =
          fileError instanceof Error ? fileError.message : "Bilinmeyen hata";
        errors.push(`${file.name}: ${msg}`);
      }
    }

    if (created.length === 0)
      return { success: false, error: `Yükleme başarısız: ${errors.join(", ")}` };

    return {
      success: true,
      media: created,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu",
    };
  }
}
