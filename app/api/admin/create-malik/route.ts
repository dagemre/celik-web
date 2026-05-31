import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Bu route SUNUCU tarafında çalışır — service_role key güvendedir
export async function POST(request: Request) {
  const { email, password, phone } = await request.json()

  if (!password) {
    return NextResponse.json({ error: 'password zorunlu' }, { status: 400 })
  }

  // E-posta yoksa telefon numarasından otomatik üret
  const normalizedPhone = (phone || '').replace(/\D/g, '')
  const effectiveEmail = email?.trim()
    ? email.trim().toLowerCase()
    : `${normalizedPhone}@celikpanel.app`

  // Service role key kontrolü
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'BURAYA_YAPISTIR') {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY eksik — .env.local ve Vercel env vars kontrol et.' },
      { status: 500 }
    )
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: effectiveEmail,
    password,
    email_confirm: true,
    user_metadata: { role: 'malik' },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ auth_user_id: data.user.id, email: effectiveEmail })
}
