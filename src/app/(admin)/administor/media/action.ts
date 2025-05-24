"use server";

import { PrismaClient } from "@prisma/client";
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

const maxFileSize = 1024 * 1024 * 10; // 10MB

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
        type: type.startsWith("image") ? "image" : "video",
        urls: [cleanUrl], // sadece array olarak kayıt ediyoruz
      },
    });

    return {
      success: {
        url: signedURL,           // S3 PUT için imzalı URL
        mediaId: mediaResult.id,  // Veritabanına kaydedilen medya ID'si
        urls: mediaResult.urls,   // Array olarak döndürüyoruz
      },
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
// }