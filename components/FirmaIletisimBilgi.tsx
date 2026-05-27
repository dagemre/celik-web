'use client'

import { useState, useEffect } from 'react'
import { getFirmaConfig, FirmaConfig, DEFAULT_FIRMA, FIRMA_CHANGED_EVENT } from '@/lib/firma-config'

// Footer ve İletişim sayfasında kullanılan,
// localStorage'dan okuyan dinamik iletişim bilgisi bileşeni.

export function useFirmaConfig() {
  const [config, setConfig] = useState<FirmaConfig>(DEFAULT_FIRMA)

  useEffect(() => {
    setConfig(getFirmaConfig())
    const handler = () => setConfig(getFirmaConfig())
    window.addEventListener(FIRMA_CHANGED_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(FIRMA_CHANGED_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  return config
}
