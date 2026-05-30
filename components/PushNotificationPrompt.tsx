'use client'

import { useEffect, useState } from 'react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64   = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData  = window.atob(base64)
  return Uint8Array.from(Array.from(rawData).map(c => c.charCodeAt(0)))
}

export default function PushNotificationPrompt() {
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (Notification.permission === 'denied') return
    if (localStorage.getItem('push_declined')) return

    // İzin verilmiş ama subscription yoksa otomatik tekrar dene (standalone'da çalışır)
    if (Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(async (reg) => {
        const existing = await reg.pushManager.getSubscription()
        if (!existing) {
          // Subscription yok — sessizce kaydet
          try {
            const sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            })
            await fetch('/api/push/subscribe', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ subscription: sub }),
            })
          } catch (_) {}
        }
      }).catch(() => {})
      return
    }

    const timer = setTimeout(() => setShow(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleAccept = async () => {
    setLoading(true)
    try {
      const perm = await Notification.requestPermission()
      if (perm !== 'granted') { setShow(false); return }

      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly:      true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      })

      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub }),
      })
    } catch (e) { console.error('Push subscribe error:', e) }
    setShow(false)
    setLoading(false)
  }

  const handleDecline = () => {
    localStorage.setItem('push_declined', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6">
      {/* Arka plan overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={handleDecline} />

      {/* Modal kutu */}
      <div className="relative bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
        {/* Üst renk bandı */}
        <div className="bg-[#0A1F44] px-6 pt-8 pb-6 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p className="text-white font-bold text-lg">Bildirimleri Aç</p>
          <p className="text-white/70 text-sm mt-1.5 leading-relaxed">
            Yeni duyurular ve ödeme hatırlatmaları için bildirim almak ister misiniz?
          </p>
        </div>

        {/* Alt butonlar */}
        <div className="px-6 py-5 flex flex-col gap-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="w-full bg-[#0A1F44] text-white font-bold py-3.5 rounded-2xl disabled:opacity-60 transition-colors text-sm"
          >
            {loading ? 'Lütfen bekleyin...' : 'Evet, bildirimleri aç'}
          </button>
          <button
            onClick={handleDecline}
            className="w-full bg-neutral-100 text-neutral-500 font-medium py-3.5 rounded-2xl text-sm"
          >
            Hayır, istemiyorum
          </button>
        </div>
      </div>
    </div>
  )
}
