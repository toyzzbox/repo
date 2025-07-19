import nodemailer from "nodemailer";
import { SESClient, SendRawEmailCommand } from "@aws-sdk/client-ses";

// Amazon SES client'ı oluştur
const ses = new SESClient({
  region: process.env.SES_REGION!,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
  },
});

// Nodemailer transport ayarı
export const transporter = nodemailer.createTransport({
  SES: { ses, aws: { SendRawEmailCommand } },
});

// Mail gönderme fonksiyonu
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const info = await transporter.sendMail({
    from: process.env.SES_FROM!,
    to,
    subject,
    html,
  });

  return info;
}
