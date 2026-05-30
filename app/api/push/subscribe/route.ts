import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { subscription, label } = await req.json()
  if (!subscription?.endpoint) return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })

  await supabase.from('push_subscriptions').upsert({
    endpoint: subscription.endpoint,
    p256dh:   subscription.keys.p256dh,
    auth:     subscription.keys.auth,
    label:    label || null,
  }, { onConflict: 'endpoint' })

  return NextResponse.json({ success: true })
}

export async function DELETE(req: Request) {
  const { endpoint } = await req.json()
  if (!endpoint) return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 })
  await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint)
  return NextResponse.json({ success: true })
}
