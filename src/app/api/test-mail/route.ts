import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    await sendEmail(
      'mehmetonurtass@gmail.com', // Buraya kendi test mailinizi yazın
      'Test Maili',
      '<h1>Bu bir test mailidir</h1><p>SendGrid çalışıyor mu test ediyoruz.</p>'
    );
    return NextResponse.json({ success: true, message: 'Mail gönderildi!' });
  } catch (error: any) {
    console.error('Mail gönderme hatası:', error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
