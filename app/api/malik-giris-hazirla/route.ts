import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Telefon numarasından sadece rakamları al
function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export async function POST(request: Request) {
  const { phone } = await request.json()
  if (!phone) return NextResponse.json({ error: 'Telefon numarası zorunlu.' }, { status: 400 })

  const normalized = normalizePhone(phone)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Telefon numarasına göre malik bul (normalize edilmiş haliyle karşılaştır)
  const { data, error } = await supabase
    .from('owners')
    .select('email, full_name, auth_user_id')
    .eq('phone', normalized)
    .not('auth_user_id', 'is', null)
    .single()

  if (error || !data) {
    return NextResponse.json(
      { error: 'Bu telefon numarasına kayıtlı malik bulunamadı.' },
      { status: 404 }
    )
  }

  if (!data.email) {
    return NextResponse.json(
      { error: 'Bu hesap için e-posta tanımlanmamış. Yöneticinizle iletişime geçin.' },
      { status: 400 }
    )
  }

  // Güvenlik: sadece email'i döndür (şifre vb. bilgi yok)
  return NextResponse.json({ email: data.email, full_name: data.full_name })
}
