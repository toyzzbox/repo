"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "@/lib/prisma";
import { MediaType } from "@prisma/client";
import slugify from "slugify";

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
      const fileExtension = file.name.split(".").pop() || "bin";

      // ✅ Orijinal dosya adını slugify et (Türkçe karakterler dahil temizler)
      const baseName = file.name.replace(`.${fileExtension}`, "");
      const safeName = slugify(baseName, { lower: true, strict: true });

      // ✅ Timestamp ekle (overwrite riskini sıfırlar)
      const timestamp = Date.now();

      // ✅ Final dosya ismi: anlamlı + timestamp + uzantı
      const finalFileName = `${safeName}-${timestamp}.${fileExtension}`;

      // ✅ S3 key
      const key = `uploads/${finalFileName}`;

      // ✅ File buffer
      const buffer = await file.arrayBuffer();

      // ✅ Upload to S3
      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: new Uint8Array(buffer),
        ContentType: file.type,
      });

      await s3.send(command);

      // ✅ Public URL
      const publicUrl = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;

      // ✅ Kaydı DB'ye yaz
      const media = await prisma.media.create({
        data: {
          urls: [publicUrl],
          type: file.type.startsWith("video") ? MediaType.video : MediaType.image,
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
