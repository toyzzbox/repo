"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export async function getPresignedUrl(fileName: string, fileType: string) {
  const bucket = process.env.NEXT_AWS_S3_BUCKET_NAME;
  const region = process.env.NEXT_AWS_S3_REGION;

  console.log("📦 BUCKET:", bucket);
  console.log("📍 REGION:", region);

  if (!bucket || !region) {
    throw new Error("S3 bucket or region is not configured");
  }

  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });

  // ✅ public URL doğru şekilde oluşturuluyor:
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  console.log("🌍 publicUrl:", publicUrl);

  return {
    url,        // PUT için kullanılan presigned URL
    publicUrl,  // S3’ten erişilebilir görsel URL’si (next/image için)
  };
}
