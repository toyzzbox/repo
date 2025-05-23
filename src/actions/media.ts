'use server';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { MediaType } from "@prisma/client";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";

// Dönüş tipi
type UploadMediaResult =
  | { error: string; url?: undefined }
  | { url: string; error: null };

// AWS S3 client
const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export async function uploadMediaAction(
  _prevState: UploadMediaResult,
  formData: FormData
): Promise<UploadMediaResult> {
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "Dosya gerekli" };
  }

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Dosya boyutu çok büyük (maksimum 10MB)" };
  }

  const supportedTypes = [
    "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
    "video/mp4", "video/webm", "video/ogg", "video/avi"
  ];

  if (!supportedTypes.includes(file.type)) {
    return { error: "Desteklenmeyen dosya tipi" };
  }

  try {
    const { NEXT_AWS_S3_BUCKET_NAME, NEXT_AWS_S3_REGION, NEXT_AWS_S3_ACCESS_KEY_ID, NEXT_AWS_S3_SECRET_ACCESS_KEY } = process.env;

    if (!NEXT_AWS_S3_BUCKET_NAME || !NEXT_AWS_S3_REGION || !NEXT_AWS_S3_ACCESS_KEY_ID || !NEXT_AWS_S3_SECRET_ACCESS_KEY) {
      throw new Error("AWS yapılandırma eksik");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name?.split(".").pop()?.toLowerCase() || "bin";
    const fileName = `${nanoid()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: NEXT_AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
    });

    await s3.send(command);

    const url = `https://${NEXT_AWS_S3_BUCKET_NAME}.s3.${NEXT_AWS_S3_REGION}.amazonaws.com/${fileName}`;

    console.log("✅ Yüklenen dosya URL:", url); // 🔥 Log ekledik

    try {
      await prisma.media.create({
        data: {
          type: file.type.startsWith("image/") ? MediaType.image : MediaType.video,
          urls: [url],
        },
      });
    } catch (prismaError) {
      console.error("❌ Prisma veritabanı hatası:", prismaError);
      return { error: "Veritabanı kaydı oluşturulamadı" };
    }

    return { url, error: null };

  } catch (err: any) {
    console.error("❌ S3 yükleme hatası:", err);

    if (err.name === "NetworkingError") {
      return { error: "Ağ bağlantısı hatası" };
    } else if (err.name === "CredentialsError") {
      return { error: "AWS kimlik doğrulama hatası" };
    } else if (err.name === "NoSuchBucket") {
      return { error: "S3 bucket bulunamadı" };
    }

    return { error: "Yükleme sırasında bilinmeyen bir hata oluştu" };
  }
}
