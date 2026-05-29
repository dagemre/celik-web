'use client'

import { useEffect } from 'react'

export default function ManifestOverride({ href }: { href: string }) {
  useEffect(() => {
    // Mevcut manifest link'ini bul veya yeni oluştur
    let link = document.querySelector<HTMLLinkElement>('link[rel="manifest"]')
    if (!link) {
      link = document.createElement('link')
      link.rel = 'manifest'
      document.head.appendChild(link)
    }
    link.href = href
  }, [href])

  return null
}
