"use server";

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getS3SignedUrl } from "@aws-sdk/s3-request-presigner"; // 👈 burada isim değiştirildi

const s3 = new S3Client({
  region: process.env.NEXT_AWS_S3_REGION!,
  credentials: {
    accessKeyId: process.env.NEXT_AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.NEXT_AWS_S3_SECRET_ACCESS_KEY!,
  },
});

export async function getSignedUrl(fileName: string, fileType: string) {
  const bucket = process.env.NEXT_AWS_S3_BUCKET_NAME!;
  const region = process.env.NEXT_AWS_S3_REGION!;
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: fileType,
  });

  const url = await getS3SignedUrl(s3, command, { expiresIn: 60 }); // 👈 burada da yeni ismi kullandık
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

  return { url, publicUrl };
}
