"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";
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

    if (!files || files.length === 0) {
      return { success: false, error: "Yüklenecek dosya bulunamadı" };
    }

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

        // ✅ Optimize edilmiş resize + webp dönüşümü
        const webpBuffer = await sharp(Buffer.from(buffer))
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        if (!webpBuffer || webpBuffer.length === 0) {
          errors.push(`${file.name}: Dönüştürme başarısız`);
          continue;
        }

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
            urls: [publicUrl],
            type: MediaType.IMAGE, // ✅ Enum fix
            title: safeName.replace(/-/g, " "),
            altText: `${safeName} görseli`,
          },
        });

        created.push(media);
      } catch (fileError) {
        const errorMsg =
          fileError instanceof Error ? fileError.message : "Bilinmeyen hata";
        errors.push(`${file.name}: ${errorMsg}`);
        console.error(`File upload error for ${file.name}:`, fileError);
      }
    }

    if (created.length === 0) {
      return {
        success: false,
        error:
          errors.length > 0
            ? `Hiçbir dosya yüklenemedi. Hatalar: ${errors.join(", ")}`
            : "Dosya yükleme başarısız oldu",
      };
    }

    // ✅ En az 1 başarılı dosya varsa success döndür
    return {
      success: true,
      media: created,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";

    console.error("uploadMedia error:", error);

    return {
      success: false,
      error: `Yükleme başarısız: ${errorMessage}`,
    };
  }
}
