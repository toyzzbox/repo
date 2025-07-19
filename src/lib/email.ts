import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  SES: {
    apiVersion: "2010-12-01",
    region: process.env.SES_REGION!,
  },
  accessKeyId: process.env.SES_ACCESS_KEY_ID,
  secretAccessKey: process.env.SES_SECRET_ACCESS_KEY,
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
    from: process.env.SES_FROM,
    to,
    subject,
    html,
  });

  return info;
}
