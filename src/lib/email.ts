import nodemailer from "nodemailer";
import { SESv2Client } from "@aws-sdk/client-sesv2";

const ses = new SESv2Client({
  region: process.env.SES_REGION!,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY_ID!,
    secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
  },
});

export const transporter = nodemailer.createTransport({
  SES: { ses },
});

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
