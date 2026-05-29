'use client'

import { useState, useEffect } from 'react'

// iOS'ta "anasayfaya ekle" göstermek için tip tanımı
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function AddToHomeScreen() {
  const [show, setShow] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    // Zaten yüklenmiş mi? (standalone mod = zaten eklenmiş)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    if (isStandalone) return

    // Daha önce kapatıldı mı?
    const dismissed = sessionStorage.getItem('pwa-banner-dismissed')
    if (dismissed) return

    // iOS tespiti
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent)
    const isMobile = ios || /android/i.test(navigator.userAgent)

    if (!isMobile) return

    setIsIOS(ios)

    if (ios) {
      // iOS'ta beforeinstallprompt yok — doğrudan göster
      setShow(true)
    } else {
      // Android: beforeinstallprompt bekle
      const handler = (e: Event) => {
        e.preventDefault()
        setDeferredPrompt(e as BeforeInstallPromptEvent)
        setShow(true)
      }
      window.addEventListener('beforeinstallprompt', handler)
      return () => window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShow(false)
      }
      setDeferredPrompt(null)
    }
  }

  const handleDismiss = () => {
    setShow(false)
    sessionStorage.setItem('pwa-banner-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 safe-area-bottom">
      <div className="bg-primary-800 rounded-2xl shadow-2xl p-4 flex items-start gap-3">
        {/* İkon */}
        <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center">
          <img src="/pwa-icon-192.png" alt="Çelik İnşaat" className="w-10 h-10 rounded-lg object-contain" />
        </div>

        {/* Metin */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-bold text-sm leading-tight">Uygulamayı Ana Ekrana Ekle</p>
          {isIOS ? (
            <p className="text-white/75 text-xs mt-1 leading-snug">
              Safari'de{' '}
              <span className="inline-flex items-center gap-0.5">
                {/* Share ikonu */}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="inline">
                  <path d="M8.59 5.59L12 2l3.41 3.59M12 2v13M5 9H3a1 1 0 00-1 1v10a1 1 0 001 1h18a1 1 0 001-1V10a1 1 0 00-1-1h-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              {' '}Paylaş'a dokunup{' '}
              <strong className="text-white">"Ana Ekrana Ekle"</strong> seçin.
            </p>
          ) : (
            <p className="text-white/75 text-xs mt-1 leading-snug">
              Daha hızlı erişim için ana ekrana ekleyin.
            </p>
          )}
        </div>

        {/* Butonlar */}
        <div className="flex-shrink-0 flex flex-col gap-2 items-end">
          {/* Kapat */}
          <button
            onClick={handleDismiss}
            className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Android: Yükle butonu */}
          {!isIOS && deferredPrompt && (
            <button
              onClick={handleInstall}
              className="bg-white text-primary-800 text-xs font-bold px-3 py-1.5 rounded-lg"
            >
              Ekle
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
