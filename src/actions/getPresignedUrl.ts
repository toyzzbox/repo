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
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: key,
    ContentType: fileType,
  });

  const url = await getSignedUrl(s3, command, { expiresIn: 60 });
  const publicUrl = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;

  return { url, publicUrl };
}
