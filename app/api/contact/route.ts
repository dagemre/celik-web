import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// HTML özel karakterlerini escape et — XSS önlemi
function escapeHtml(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(req: Request) {
  const body = await req.json()
  const { adSoyad, email, telefon, mesaj } = body

  if (!adSoyad || !email || !mesaj) {
    return NextResponse.json({ error: 'Eksik alan' }, { status: 400 })
  }

  // Basit e-posta format kontrolü
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Geçersiz e-posta.' }, { status: 400 })
  }

  // Uzunluk sınırı
  if (mesaj.length > 2000 || adSoyad.length > 100) {
    return NextResponse.json({ error: 'Çok uzun içerik.' }, { status: 400 })
  }

  const safe = {
    adSoyad: escapeHtml(adSoyad),
    email:   escapeHtml(email),
    telefon: escapeHtml(telefon),
    mesaj:   escapeHtml(mesaj),
  }

  try {
    await resend.emails.send({
      from: 'Çelik İnşaat <onboarding@resend.dev>',
      to: ['dagemre@gmail.com', 'snrclk@hotmail.com.tr'],
      subject: `Yeni mesaj — ${safe.adSoyad}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
          <h2 style="color:#0A1F44;margin-bottom:4px;">Çelik İnşaat — Yeni Mesaj</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">celiktaahhut.com üzerinden gönderildi</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
          <table style="width:100%;font-size:14px;color:#333;">
            <tr><td style="padding:6px 0;font-weight:600;width:110px;">Ad Soyad</td><td>${safe.adSoyad}</td></tr>
            <tr><td style="padding:6px 0;font-weight:600;">E-posta</td><td><a href="mailto:${safe.email}" style="color:#1E54C8;">${safe.email}</a></td></tr>
            ${safe.telefon ? `<tr><td style="padding:6px 0;font-weight:600;">Telefon</td><td>${safe.telefon}</td></tr>` : ''}
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
          <p style="font-weight:600;margin-bottom:8px;">Mesaj</p>
          <p style="background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:14px;line-height:1.6;white-space:pre-wrap;">${safe.mesaj}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Mail gönderilemedi' }, { status: 500 })
  }
}
