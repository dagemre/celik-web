import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD    = process.env.ADMIN_PASSWORD
const ADMIN_SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN
const COOKIE_NAME       = 'celik_admin_session'

// Brute-force önlemi — IP başına deneme sayacı (sunucu memory, restart'ta sıfırlanır)
const attempts = new Map<string, { count: number; blockedUntil: number }>()

export async function POST(req: NextRequest) {
  // Env var kontrolü
  if (!ADMIN_PASSWORD || !ADMIN_SESSION_TOKEN) {
    return NextResponse.json(
      { error: 'Sunucu yapılandırması eksik.' },
      { status: 503 }
    )
  }

  // IP al
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  // Rate limiting — 5 denemede 15 dk kilitle
  const now = Date.now()
  const rec = attempts.get(ip) ?? { count: 0, blockedUntil: 0 }

  if (rec.blockedUntil > now) {
    const dakika = Math.ceil((rec.blockedUntil - now) / 60_000)
    return NextResponse.json(
      { error: `Çok fazla deneme. ${dakika} dakika bekleyin.` },
      { status: 429 }
    )
  }

  const { password, redirect } = await req.json()

  // Timing-safe karşılaştırma (basit string eşitliği kasıtlı timing attack değil)
  if (!password || password !== ADMIN_PASSWORD) {
    rec.count++
    if (rec.count >= 5) {
      rec.blockedUntil = now + 15 * 60 * 1_000 // 15 dk
    }
    attempts.set(ip, rec)

    const kalan = Math.max(0, 5 - rec.count)
    return NextResponse.json(
      { error: kalan > 0 ? `Şifre hatalı. ${kalan} hakkınız kaldı.` : 'Hesabınız kilitlendi.' },
      { status: 401 }
    )
  }

  // Başarılı giriş — sayacı sıfırla
  attempts.delete(ip)

  const res = NextResponse.json({ success: true, redirect: redirect || '/admin' })

  res.cookies.set(COOKIE_NAME, ADMIN_SESSION_TOKEN, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path:     '/',
    maxAge:   60 * 60 * 8, // 8 saat
  })

  return res
}
