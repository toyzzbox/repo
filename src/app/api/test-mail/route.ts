import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/mailer";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ success: false, error: "Email gerekli" });
    }

    await sendEmail(
      email,
      "Test Maili",
      `<h1>Bu bir test mailidir</h1><p>SendGrid ile mail gönderimi başarılı!</p>`
    );

    return NextResponse.json({ success: true, message: "Mail gönderildi!" });
  } catch (error: any) {
    console.error("Mail gönderme hatası:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
