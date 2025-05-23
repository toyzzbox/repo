'use server';

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { MediaType } from "@prisma/client";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma"; // Prisma client'ınızın path'ini kontrol edin

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
  
  if (!file || file.size === 0) {
    return { error: "Dosya gerekli" };
  }

  // Dosya boyutu kontrolü (örnek: 10MB limit)
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Dosya boyutu çok büyük (maksimum 10MB)" };
  }

  // Desteklenen dosya tiplerini kontrol et
  const supportedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'video/mp4', 'video/webm', 'video/ogg', 'video/avi'
  ];
  
  if (!supportedTypes.includes(file.type)) {
    return { error: "Desteklenmeyen dosya tipi" };
  }

  try {
    // Environment değişkenlerini kontrol et
    if (!process.env.NEXT_AWS_S3_BUCKET_NAME || 
        !process.env.NEXT_AWS_S3_REGION ||
        !process.env.NEXT_AWS_S3_ACCESS_KEY_ID ||
        !process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY) {
      throw new Error("AWS yapılandırma değişkenleri eksik");
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    
    if (!fileExtension) {
      return { error: "Geçersiz dosya uzantısı" };
    }

    const fileName = `${nanoid()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      // ACL yerine bucket policy kullanmanız önerilir
      // ACL: "public-read", 
    });

    await s3.send(command);

    const url = `https://${process.env.NEXT_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_AWS_S3_REGION}.amazonaws.com/${fileName}`;

    // Prisma işlemini try-catch içine al
    try {
      await prisma.media.create({
        data: {
          type: file.type.startsWith("image/") ? MediaType.image : MediaType.video,
          urls: [url],
        },
      });
    } catch (prismaError) {
      console.error("Prisma veritabanı hatası:", prismaError);
      // S3'e yüklenen dosyayı silmek isteyebilirsiniz
      return { error: "Veritabanı kaydı oluşturulamadı" };
    }

    return { url, error: null };
    
  } catch (err: any) {
    console.error("S3 yükleme hatası:", err);
    
    // Hata tipine göre daha detaylı mesaj ver
    if (err.name === 'NetworkingError') {
      return { error: "Ağ bağlantısı hatası" };
    } else if (err.name === 'CredentialsError') {
      return { error: "AWS kimlik doğrulama hatası" };
    } else if (err.name === 'NoSuchBucket') {
      return { error: "S3 bucket bulunamadı" };
    }
    
    return { error: "Yükleme sırasında hata oluştu" };
  }
}