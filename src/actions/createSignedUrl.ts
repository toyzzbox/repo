"use server";

import { s3 } from "@/lib/s3";
import { prisma } from "@/lib/prisma";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { MediaType, VariantType } from "@prisma/client";
import crypto from "crypto";


const ACCEPTED_TYPES: Record<string, MediaType> = {
  "image/jpeg": MediaType.IMAGE,
  "image/png": MediaType.IMAGE,
  "image/webp": MediaType.IMAGE,
  "image/gif": MediaType.IMAGE,
  "video/mp4": MediaType.VIDEO,
  "video/webm": MediaType.VIDEO,
};

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

export async function createSignedUrl(type: string, size: number, checksum: string) {
  const mediaType = ACCEPTED_TYPES[type];
  if (!mediaType) return { failure: "Unsupported file type" };
  if (size > MAX_FILE_SIZE) return { failure: "File too large" };

  const bucket = process.env.NEXT_AWS_S3_BUCKET_NAME;
  if (!bucket) return { failure: "Bucket not configured" };

  const region = process.env.NEXT_AWS_REGION || "eu-north-1";

  const key = generateFileName();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

  // ✅ Region'lı public URL (daha doğru)
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  try {
    const media = await prisma.media.create({
      data: {
        type: mediaType,

        // ✅ urls yerine variants oluşturuyoruz
        variants: {
          create: [
            {
              key,               // S3 object key
              cdnUrl: publicUrl, // Şimdilik direkt S3 public URL
              type: VariantType.ORIGINAL, // ⚠️ sende farklı olabilir
              format: type.split("/")[1], // jpeg/png/webp/mp4...
              size,
            },
          ],
        },
      },
      include: {
        variants: true,
      },
    });

    return {
      success: {
        url: signedUrl,
        mediaId: media.id,
        // Eskiden urls dönüyordun; şimdi variant url dön
        cdnUrl: media.variants[0]?.cdnUrl ?? publicUrl,
        key,
      },
    };
  } catch (error) {
    console.error("DB error:", error);
    return { failure: "Failed to save media" };
  }
}
