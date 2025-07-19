// src/actions/sendTestMail.ts
"use server";

import { sendEmail } from "@/lib/email";

export async function sendTestMail(to: string) {
  try {
    const result = await sendEmail({
      to,
      subject: "Amazon SES Test Mail",
      html: `
        <h1>Merhaba!</h1>
        <p>Bu e-posta Amazon SES ve Server Action ile gönderildi.</p>
      `,
    });

    return { success: true, result };
  } catch (err) {
    console.error("Mail gönderme hatası:", err);
    return { success: false, error: (err as Error).message };
  }
}
