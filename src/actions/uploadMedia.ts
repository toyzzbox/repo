"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";

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

    const urls: string[] = [];

    for (const file of files) {
      const key = `uploads/${Date.now()}-${file.name}`;
      const buffer = await file.arrayBuffer();

      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: new Uint8Array(buffer),
        ContentType: file.type,
      });

      await s3.send(command);

      const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
      urls.push(publicUrl);
    }

    const created = await prisma.media.create({
      data: {
        urls,
        type: MediaType.image, // veya file.type.startsWith("video") ? MediaType.video : MediaType.image
      },
    });

    return { success: true, media: created };

  } catch (error) {
    console.error("uploadMedia error:", error);
    return { success: false, error: "Upload failed" };
  }
}
