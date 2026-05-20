import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Çelik Taahhüt İnşaat | Geleceğe Değer Katan Yapılar',
  description: 'Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. — 2009\'dan bu yana İstanbul\'da güvenli, kaliteli ve yenilikçi inşaat projeleri. Gayrimenkul, inşaat taahhüt ve proje tasarım hizmetleri.',
  keywords: 'inşaat, taahhüt, gayrimenkul, konut, İstanbul, Bakırköy, Avcılar, yapı',
  openGraph: {
    title: 'Çelik Taahhüt İnşaat',
    description: 'Geleceğe değer katan yapılar üretiyoruz.',
    url: 'https://celiktaahhut.com',
    siteName: 'Çelik Taahhüt İnşaat',
    locale: 'tr_TR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
