"use server";

import { PrismaClient, MediaType } from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as generateSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
 
const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString("hex");

const acceptedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
];

const maxFileSize = 1024 * 1024 * 10;

export async function getSignedUrl(type: string, size: number, checksum: string) {
  if (!acceptedTypes.includes(type)) {
    return { failure: "Invalid file type" };
  }

  if (size > maxFileSize) {
    return { failure: "File too large" };
  }

  const fileName = generateFileName();
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.NEXT_AWS_S3_BUCKET_NAME!,
    Key: fileName,
    ContentType: type,
    ContentLength: size,
    ChecksumSHA256: checksum,
  });

  const signedURL = await generateSignedUrl(s3, putObjectCommand, {
    expiresIn: 60,
  });

  try {
    const cleanUrl = signedURL.split("?")[0];
    
    const mediaResult = await prisma.media.create({
      data: {
        type: type.startsWith("image") ? "image" : "video",  // Dosya türünü belirle
        fileUrl: cleanUrl,
        urls: [cleanUrl], // İlk URL'i urls array'ine ekliyoruz
        createdAt: new Date(),
      },
    });

    return { 
      success: { 
        url: signedURL, 
        mediaId: mediaResult.id,
        fileUrl: mediaResult.fileUrl,
        urls: mediaResult.urls
      } 
    };
  } catch (error) {
    console.error("Error while saving media to database:", error);
    return { failure: "Failed to save media to database" };
  }
}
// type CreateBrandArgs = {
//   slug: string;
//   name: string;
//   description: string;
//   mediaIds?: string[];  // Çoklu media ID'leri
//   urls?: string[];
// };

// export async function createBrand({ slug, name, description, mediaIds, urls }: CreateBrandArgs) {
//   try {
//     let allUrls: string[] = urls || [];

//     if (mediaIds && mediaIds.length > 0) {
//       // Tüm mediaları tek sorguda getir
//       const mediaRecords = await prisma.media.findMany({
//         where: { id: { in: mediaIds } },
//       });

//       // Tüm media URL'lerini topla
//       mediaRecords.forEach(media => {
//         if (media.fileUrl) allUrls.push(media.fileUrl);
//         allUrls.push(...media.urls);
//       });

//       // Marka oluştur ve mediaları ilişkilendir
//       const brand = await prisma.brand.create({
//         data: {
//           name,
//           slug,
//           description,
//           media: {
//             connect: mediaIds.map(id => ({ id })),
//           },
//           urls: [...new Set(allUrls)], // Tekrar edenleri temizle
//         },
//       });
//       return { success: "Brand created successfully!", brand };
//     }

//     // Media yoksa sadece marka oluştur
//     const brand = awaitprisma.brand.create({
//       data: {
//         slug,
//         name,
//         description,
//         urls: urls || [],
//       },
//     });

//     return { success: "Brand created successfully!", brand };
//   } catch (error) {
//     console.error("Error while creating brand:", error);
//     return { failure: "Error while creating brand" };
//   }
// }// 'use server';

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { MediaType } from "@prisma/client";
// import { nanoid } from "nanoid";
// import { prisma } from "@/lib/prisma";

// // Dönüş tipi
// type UploadMediaResult =
//   | { error: string; url?: undefined }
//   | { url: string; error: null };

// // AWS S3 client
// const s3 = new S3Client({
//   region: process.env.NEXT_AWS_S3_REGION!,
//   credentials: {
//     accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
//   },
// });

// export async function uploadMediaAction(
//   _prevState: UploadMediaResult,
//   formData: FormData
// ): Promise<UploadMediaResult> {
//   const file = formData.get("file") as File;

//   if (!file || file.size === 0) {
//     return { error: "Dosya gerekli" };
//   }

//   const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
//   if (file.size > MAX_FILE_SIZE) {
//     return { error: "Dosya boyutu çok büyük (maksimum 10MB)" };
//   }

//   const supportedTypes = [
//     "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp",
//     "video/mp4", "video/webm", "video/ogg", "video/avi"
//   ];

//   if (!supportedTypes.includes(file.type)) {
//     return { error: "Desteklenmeyen dosya tipi" };
//   }

//   try {
//     const { NEXT_AWS_S3_BUCKET_NAME, NEXT_AWS_S3_REGION, NEXT_AWS_S3_ACCESS_KEY_ID, NEXT_AWS_S3_SECRET_ACCESS_KEY } = process.env;

//     if (!NEXT_AWS_S3_BUCKET_NAME || !NEXT_AWS_S3_REGION || !NEXT_AWS_S3_ACCESS_KEY_ID || !NEXT_AWS_S3_SECRET_ACCESS_KEY) {
//       throw new Error("AWS yapılandırma eksik");
//     }

//     const fileBuffer = Buffer.from(await file.arrayBuffer());
//     const extension = file.name?.split(".").pop()?.toLowerCase() || "bin";
//     const fileName = `${nanoid()}.${extension}`;

//     const command = new PutObjectCommand({
//       Bucket: NEXT_AWS_S3_BUCKET_NAME,
//       Key: fileName,
//       Body: fileBuffer,
//       ContentType: file.type,
//     });

//     await s3.send(command);

//     const url = `https://${NEXT_AWS_S3_BUCKET_NAME}.s3.${NEXT_AWS_S3_REGION}.amazonaws.com/${fileName}`;

//     console.log("✅ Yüklenen dosya URL:", url); // 🔥 Log ekledik

//     try {
//       await prisma.media.create({
//         data: {
//           type: file.type.startsWith("image/") ? MediaType.image : MediaType.video,
//           urls: [url],
//         },
//       });
//     } catch (prismaError) {
//       console.error("❌ Prisma veritabanı hatası:", prismaError);
//       return { error: "Veritabanı kaydı oluşturulamadı" };
//     }

//     return { url, error: null };

//   } catch (err: any) {
//     console.error("❌ S3 yükleme hatası:", err);

//     if (err.name === "NetworkingError") {
//       return { error: "Ağ bağlantısı hatası" };
//     } else if (err.name === "CredentialsError") {
//       return { error: "AWS kimlik doğrulama hatası" };
//     } else if (err.name === "NoSuchBucket") {
//       return { error: "S3 bucket bulunamadı" };
//     }

//     return { error: "Yükleme sırasında bilinmeyen bir hata oluştu" };
//   }
// }
