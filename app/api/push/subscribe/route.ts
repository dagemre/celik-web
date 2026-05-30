import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  try {
    const { subscription, label } = await req.json()
    if (!subscription?.endpoint) return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })

    // Önce varsa sil, sonra yeniden ekle (upsert yerine güvenli yol)
    await supabase.from('push_subscriptions').delete().eq('endpoint', subscription.endpoint)

    const { error } = await supabase.from('push_subscriptions').insert({
      endpoint: subscription.endpoint,
      p256dh:   subscription.keys.p256dh,
      auth:     subscription.keys.auth,
      label:    label || null,
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Subscribe route error:', e)
    return NextResponse.json({ error: e?.message || 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const { endpoint } = await req.json()
  if (!endpoint) return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
  return NextResponse.json({ success: true })
}
