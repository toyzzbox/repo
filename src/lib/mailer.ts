import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "email-smtp.eu-central-1.amazonaws.com", // Bölgeye göre değişir
  port: 587,
  secure: false,
  auth: {
    user: process.env.SES_SMTP_USER,
    pass: process.env.SES_SMTP_PASS,
  },
});