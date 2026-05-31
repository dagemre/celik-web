import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  // Admin oturumu kontrolü
  const cookieStore = await cookies()
  const session = cookieStore.get('celik_admin_session')
  if (!session || session.value !== process.env.ADMIN_SESSION_TOKEN) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
  }

  const { email, password, phone } = await request.json()

  if (!password) {
    return NextResponse.json({ error: 'password zorunlu' }, { status: 400 })
  }

  const normalizedPhone = (phone || '').replace(/\D/g, '')
  const effectiveEmail = email?.trim()
    ? email.trim().toLowerCase()
    : `${normalizedPhone}@celikpanel.app`

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  console.log('[create-malik] key set:', !!key, '| key length:', key?.length ?? 0)

  if (!key || key === 'BURAYA_YAPISTIR') {
    console.log('[create-malik] HATA: SERVICE_ROLE_KEY eksik')
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY eksik' }, { status: 500 })
  }

  const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key)

  console.log('[create-malik] createUser çağrılıyor:', effectiveEmail)
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: effectiveEmail,
    password,
    email_confirm: true,
    user_metadata: { role: 'malik' },
  })

  if (error) {
    console.log('[create-malik] SUPABASE HATA:', error.message)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  console.log('[create-malik] BAŞARILI user id:', data.user.id)
  return NextResponse.json({ auth_user_id: data.user.id, email: effectiveEmail })
}
