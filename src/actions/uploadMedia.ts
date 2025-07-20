"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";
import slugify from "slugify";
import sharp from "sharp"; // ✅ WebP dönüşümü için

const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.NEXT_AWS_S3_BUCKET_NAME!;
const REGION = process.env.NEXT_AWS_S3_REGION!;

export async function uploadMedia(formData: FormData) {
  try {
    const files = formData.getAll("files") as File[];
    if (!files || files.length === 0) {
      return { success: false, error: "No files provided" };
    }

    const created: Media[] = [];

    for (const file of files) {
      const baseName = file.name.replace(/\.[^/.]+$/, "");
      const safeName = slugify(baseName, { lower: true, strict: true });
      const finalFileName = `${safeName}.webp`; // ✅ WebP format
      const key = `uploads/${finalFileName}`;

      const buffer = await file.arrayBuffer();
      const webpBuffer = await sharp(Buffer.from(buffer))
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
          urls: [publicUrl],
          type: MediaType.image, // WebP olduğundan image sabit
        },
      });

      created.push(media);
    }

    return { success: true, media: created };

  } catch (error) {
    console.error("uploadMedia error:", error instanceof Error ? error.message : error);
    return { success: false, error: "Upload failed" };
  }
}

