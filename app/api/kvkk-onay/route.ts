import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { owner_id, email } = body

    // IP'yi sunucu tarafında güvenilir şekilde al
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0].trim() : (req.headers.get('x-real-ip') ?? 'bilinmiyor')

    const user_agent = req.headers.get('user-agent') ?? ''
    const now = new Date().toISOString()

    // 1. owners tablosunu güncelle
    if (owner_id) {
      await supabase
        .from('owners')
        .update({
          kvkk_onay: true,
          kvkk_onay_tarihi: now,
          kvkk_onay_ip: ip,
        })
        .eq('id', owner_id)
    }

    // 2. kvkk_log tablosuna denetim kaydı ekle (owner silinse bile log durur)
    await supabase.from('kvkk_log').insert({
      owner_id: owner_id ?? null,
      email:    email ?? null,
      onay:     true,
      ip_adresi: ip,
      user_agent,
    })

    return NextResponse.json({ success: true, ip, tarih: now })
  } catch (err) {
    console.error('KVKK onay hatası:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
