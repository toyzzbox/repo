'use server';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { Prisma, MediaType } from "@prisma/client";
import { nanoid } from "nanoid";

// Dönüş tipi: Başarılıysa URL, hata varsa mesaj içerir
type UploadMediaResult =
  | { error: string; url?: undefined }
  | { url: string; error: null };

// AWS S3 yapılandırması
const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

// Server Action
export async function uploadMediaAction(
  _prevState: UploadMediaResult,
  formData: FormData
): Promise<UploadMediaResult> {
  const file = formData.get("file") as File;

  if (!file) {
    return { error: "Dosya gerekli" };
  }

  try {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const fileName = `${nanoid()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      ACL: "public-read",
    });

    await s3.send(command);

    const url = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${fileName}`;

    await prisma.media.create({
      data: {
        type: file.type.includes("image") ? MediaType.image : MediaType.video,
        urls: [url],
      },
    });

    return { url, error: null };
  } catch (err: any) {
    console.error("S3 veya Prisma hatası:", err);
    return { error: "Yükleme sırasında hata oluştu" };
  }
}
