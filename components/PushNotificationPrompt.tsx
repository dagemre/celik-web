'use client'

import { useEffect, useState } from 'react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64   = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData  = window.atob(base64)
  return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)))
}

export default function PushNotificationPrompt() {
  const [show,    setShow]    = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (Notification.permission === 'granted') return
    if (Notification.permission === 'denied')  return
    // localStorage'da "reddedildi" işareti varsa gösterme
    if (localStorage.getItem('push_declined')) return

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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-sm">
      <div className="bg-[#0A1F44] text-white rounded-2xl px-5 py-4 shadow-2xl flex items-start gap-4">
        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm mb-0.5">Bildirimler</p>
          <p className="text-white/70 text-xs leading-relaxed">
            Yeni duyurular ve ödeme hatırlatmaları için bildirim almak ister misiniz?
          </p>
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleAccept}
              disabled={loading}
              className="flex-1 bg-white text-[#0A1F44] text-xs font-bold py-2 rounded-xl hover:bg-white/90 disabled:opacity-60 transition-colors"
            >
              {loading ? '...' : 'Evet, açık olsun'}
            </button>
            <button
              onClick={handleDecline}
              className="flex-1 bg-white/10 text-white text-xs font-medium py-2 rounded-xl hover:bg-white/20 transition-colors"
            >
              Hayır, istemiyorum
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
