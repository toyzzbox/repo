// src/actions/getSignedUrl.ts
"use server";

import { s3 } from "@/lib/s3"; // 🔁 tekrar oluşturmak yerine import
import { prisma } from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MediaType } from "@prisma/client";
import crypto from "crypto";

const ACCEPTED_TYPES: Record<string, MediaType> = {
  "image/jpeg": MediaType.image,
  "image/png": MediaType.image,
  "image/webp": MediaType.image,
  "image/gif": MediaType.image,
  "video/mp4": MediaType.video,
  "video/webm": MediaType.video,
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const generateFileName = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

export async function getSignedUrl(
  type: string,
  size: number,
  checksum: string
): Promise<
  | {
      success: {
        url: string;
        mediaId: string;
        urls: string[];
      };
    }
  | { failure: string }
> {
  const mediaType = ACCEPTED_TYPES[type];
  if (!mediaType) {
    return { failure: "Unsupported file type" };
  }

  if (size > MAX_FILE_SIZE) {
    return { failure: "File too large" };
  }

  const fileName = generateFileName();
  const bucket = process.env.NEXT_AWS_S3_BUCKET_NAME;

  if (!bucket) {
    return { failure: "Bucket name not configured" };
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileName,
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
  const publicUrl = `https://${bucket}.s3.amazonaws.com/${fileName}`;

  try {
    const media = await prisma.media.create({
      data: {
        type: mediaType,
        urls: [publicUrl],
      },
    });

    return {
      success: {
        url: signedUrl,
        mediaId: media.id,
        urls: media.urls,
      },
    };
  } catch (err) {
    console.error("❌ DB kayıt hatası:", err);
    return { failure: "Failed to save media to database" };
  }
}
