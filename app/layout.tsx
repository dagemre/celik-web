import type { Metadata, Viewport } from 'next'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'

export const metadata: Metadata = {
  title: 'Çelik Taahhüt İnşaat | Geleceğe Değer Katan Yapılar',
  description: 'Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. — 2009\'dan bu yana İstanbul\'da güvenli, kaliteli ve yenilikçi inşaat projeleri. Gayrimenkul, inşaat taahhüt ve proje tasarım hizmetleri.',
  keywords: 'inşaat, taahhüt, gayrimenkul, konut, İstanbul, Bakırköy, Avcılar, yapı',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Çelik İnşaat',
  },
  openGraph: {
    title: 'Çelik Taahhüt İnşaat',
    description: 'Geleceğe değer katan yapılar üretiyoruz.',
    url: 'https://celiktaahhut.com',
    siteName: 'Çelik Taahhüt İnşaat',
    locale: 'tr_TR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0A1F44',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/pwa-icon-192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/pwa-icon-512.png" />
      </head>
      <body><LayoutWrapper>{children}</LayoutWrapper></body>
    </html>
  )
}
