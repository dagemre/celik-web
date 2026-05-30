import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
  const { ad, eposta, telefon, sirket, projeTuru, projeYeri, alan, asamasi, detay } = body

  if (!ad || !eposta || !telefon) {
    return NextResponse.json({ error: 'Ad, e-posta ve telefon zorunludur.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eposta)) {
    return NextResponse.json({ error: 'Geçersiz e-posta.' }, { status: 400 })
  }

  const s = {
    ad:        escapeHtml(ad),
    eposta:    escapeHtml(eposta),
    telefon:   escapeHtml(telefon),
    sirket:    escapeHtml(sirket),
    projeTuru: escapeHtml(projeTuru),
    projeYeri: escapeHtml(projeYeri),
    alan:      escapeHtml(alan),
    asamasi:   escapeHtml(asamasi),
    detay:     escapeHtml(detay),
  }

  const row = (label: string, val: string) => val
    ? `<tr><td style="padding:6px 0;font-weight:600;width:140px;vertical-align:top;">${label}</td><td style="color:#444;">${val}</td></tr>`
    : ''

  try {
    await resend.emails.send({
      from: 'Çelik İnşaat <onboarding@resend.dev>',
      to: ['dagemre@gmail.com', 'snrclk@hotmail.com.tr'],
      subject: `Yeni teklif talebi — ${s.ad}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f9f9f9;border-radius:12px;">
          <h2 style="color:#0A1F44;margin-bottom:4px;">Çelik İnşaat — Yeni Teklif Talebi</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">celiktaahhut.com/teklif-al üzerinden gönderildi</p>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
          <h3 style="color:#0A1F44;font-size:14px;margin-bottom:8px;">İletişim Bilgileri</h3>
          <table style="width:100%;font-size:14px;color:#333;">
            ${row('Ad Soyad', s.ad)}
            ${row('E-posta', `<a href="mailto:${s.eposta}" style="color:#1E54C8;">${s.eposta}</a>`)}
            ${row('Telefon', s.telefon)}
            ${row('Şirket/Kurum', s.sirket)}
          </table>
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
          <h3 style="color:#0A1F44;font-size:14px;margin-bottom:8px;">Proje Bilgileri</h3>
          <table style="width:100%;font-size:14px;color:#333;">
            ${row('Proje Türü', s.projeTuru)}
            ${row('Proje Yeri', s.projeYeri)}
            ${row('Alan (m²)', s.alan)}
            ${row('Proje Aşaması', s.asamasi)}
          </table>
          ${s.detay ? `
          <hr style="border:none;border-top:1px solid #e5e5e5;margin:16px 0;" />
          <h3 style="color:#0A1F44;font-size:14px;margin-bottom:8px;">Proje Detayları</h3>
          <p style="background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:14px;line-height:1.6;white-space:pre-wrap;font-size:14px;">${s.detay}</p>
          ` : ''}
        </div>
      `,
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Mail gönderilemedi' }, { status: 500 })
  }
}
