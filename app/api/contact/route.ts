import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { adSoyad, email, telefon, mesaj } = await req.json()

  if (!adSoyad || !email || !mesaj) {
    return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
  }

  try {
    await resend.emails.send({
      from: 'Mre Creative <onboarding@resend.dev>',
      to: 'dagemre@gmail.com',
      subject: `Yeni mesaj — ${adSoyad}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
          <h2 style="color:#0A1F44;margin-bottom:4px;">Mre Creative — Yeni Mesaj</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">celiktaahhut.com üzerinden gönderildi</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
          <table style="width:100%;font-size:14px;color:#333;">
            <tr><td style="padding:6px 0;font-weight:600;width:110px;">Ad Soyad</td><td>${adSoyad}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">E-posta</td><td><a href="mailto:${email}" style="color:#1E54C8;">${email}</a></td></tr>
            ${telefon ? `<tr><td style="padding:6px 0;font-weight:600;">Telefon</td><td>${telefon}</td></tr>` : ''}
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
          <p style="font-weight:600;margin-bottom:8px;">Mesaj</p>
          <p style="background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:14px;line-height:1.6;white-space:pre-wrap;">${mesaj}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Mail gönderilemedi' }, { status: 500 })
  }
}
