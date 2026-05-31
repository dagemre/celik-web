import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Bu route SUNUCU tarafında çalışır — service_role key güvendedir
export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'email ve password zorunlu' }, { status: 400 })
  }

  // Service role key kontrolü
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY === 'BURAYA_YAPISTIR') {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY eksik — .env.local dosyasına ekle ve sunucuyu yeniden başlat.' }, { status: 500 })
  }

  // Service role key ile admin client — sadece server'da kullanılır
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: email.toLowerCase().trim(),
    password,
    email_confirm: true, // e-posta onayı gerektirmez, direkt aktif
    user_metadata: { role: 'malik' },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ auth_user_id: data.user.id })
}
