"use server";
import { sendEmail } from "@/lib/email";

export async function sendTestMail(to: string) {
  try {
    await sendEmail({
      to,
      subject: "Amazon SES Test Mail",
      html: "<h1>Selam!</h1><p>Bu bir test e-postasıdır.</p>",
    });

    return { success: true };
  } catch (err) {
    console.error("Mail gönderim hatası:", err);
    return { success: false, error: (err as Error).message };
  }
}
