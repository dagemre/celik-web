'use client'

import { useState, useEffect } from 'react'

export default function PushTestPage() {
  const [log, setLog] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (msg: string) => setLog(prev => [...prev, `${new Date().toLocaleTimeString()} — ${msg}`])

  useEffect(() => {
    addLog(`PushManager var mı: ${'PushManager' in window}`)
    addLog(`ServiceWorker var mı: ${'serviceWorker' in navigator}`)
    addLog(`Notification izni: ${Notification.permission}`)
    addLog(`VAPID KEY: ${process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? '✅ var (' + process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY.slice(0, 10) + '...)' : '❌ YOK'}`)
    addLog(`Standalone mod: ${window.matchMedia('(display-mode: standalone)').matches}`)
  }, [])

  const handleTest = async () => {
    setLoading(true)
    try {
      // 1. İzin iste
      addLog('İzin isteniyor...')
      const perm = await Notification.requestPermission()
      addLog(`İzin sonucu: ${perm}`)
      if (perm !== 'granted') { setLoading(false); return }

      // 2. SW bekle
      addLog('Service Worker bekleniyor...')
      const reg = await navigator.serviceWorker.ready
      addLog(`SW scope: ${reg.scope}`)

      // 3. Mevcut subscription
      const existing = await reg.pushManager.getSubscription()
      addLog(`Mevcut subscription: ${existing ? '✅ var' : '❌ yok'}`)

      if (existing) {
        addLog(`Endpoint: ${existing.endpoint.slice(0, 40)}...`)
      }

      // 4. Subscribe
      addLog('Subscribe deneniyor...')
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      if (!vapidKey) { addLog('❌ VAPID KEY YOK — env variable eksik!'); setLoading(false); return }

      const padding = '='.repeat((4 - vapidKey.length % 4) % 4)
      const base64 = (vapidKey + padding).replace(/-/g, '+').replace(/_/g, '/')
      const rawData = window.atob(base64)
      const key = Uint8Array.from(Array.from(rawData).map(c => c.charCodeAt(0)))

      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key })
      addLog(`✅ Subscribe başarılı: ${sub.endpoint.slice(0, 40)}...`)

      // 5. API'ye gönder
      addLog('Supabase\'e kaydediliyor...')
      const res = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub, label: 'test' }),
      })
      const data = await res.json()
      addLog(`API cevabı: ${JSON.stringify(data)}`)

    } catch (e: any) {
      addLog(`❌ HATA: ${e?.message || e}`)
    }
    setLoading(false)
  }

  const handleSend = async () => {
    setLoading(true)
    addLog('Test bildirimi gönderiliyor...')
    try {
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test Bildirimi', body: 'Bu bir test mesajıdır.', url: '/admin' }),
      })
      const data = await res.json()
      addLog(`Gönderim sonucu: ${JSON.stringify(data)}`)
    } catch (e: any) {
      addLog(`❌ HATA: ${e?.message || e}`)
    }
    setLoading(false)
  }

  return (
    <div className="p-5 max-w-xl mx-auto">
      <h1 className="font-bold text-xl text-primary-800 mb-4">Push Bildirim Debug</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleTest}
          disabled={loading}
          className="flex-1 bg-primary-800 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50"
        >
          {loading ? 'Çalışıyor...' : '1. Subscribe Testi'}
        </button>
        <button
          onClick={handleSend}
          disabled={loading}
          className="flex-1 bg-success-700 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50"
        >
          2. Bildirim Gönder
        </button>
      </div>

      <div className="bg-neutral-900 rounded-2xl p-4 font-mono text-xs text-green-400 space-y-1 min-h-[300px]">
        {log.length === 0 && <p className="text-neutral-500">Loglar burada görünecek...</p>}
        {log.map((l, i) => <p key={i}>{l}</p>)}
      </div>

      <button
        onClick={() => setLog([])}
        className="mt-3 text-xs text-neutral-400 underline"
      >
        Temizle
      </button>
    </div>
  )
}
