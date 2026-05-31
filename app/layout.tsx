import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SLEX5N13T8"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SLEX5N13T8');
          `}
        </Script>
      </head>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
        <ServiceWorkerRegister />
        <PushNotificationPrompt />
      </body>
    </html>
  )
}
