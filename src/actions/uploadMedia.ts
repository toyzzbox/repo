"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";

const s3Client = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.NEXT_AWS_S3_BUCKET_NAME!;
const CLOUDFRONT_DOMAIN = process.env.NEXT_CLOUDFRONT_DOMAIN; // Opsiyonel

interface UploadResult {
  success: boolean;
  media?: {
    id: string;
    urls: string[];
  };
  error?: string;
}

export async function uploadMedia(formData: FormData): Promise<UploadResult> {
  try {
    const files = formData.getAll("files") as File[];

    if (files.length === 0) {
      return { success: false, error: "No files provided" };
    }

    const uploadPromises = files.map(async (file) => {
      const fileExtension = file.name.split(".").pop();
      const fileName = `${randomUUID()}.${fileExtension}`;
      const key = `media/${fileName}`;

      const buffer = await file.arrayBuffer();

      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: new Uint8Array(buffer),
        ContentType: file.type,
      });

      await s3Client.send(command);

      const url = CLOUDFRONT_DOMAIN
        ? `https://${CLOUDFRONT_DOMAIN}/${key}`
        : `https://${BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${key}`;

      return url;
    });

    const urls = await Promise.all(uploadPromises);

    const savedMedia = await prisma.media.create({
      data: {
        id: randomUUID(),
        urls: urls,
        type: MediaType.image, // veya dinamik belirle
      },
    });

    return { success: true, media: savedMedia };

  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}
