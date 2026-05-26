import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#071628]">
      <div className="max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="grid lg:grid-cols-5 gap-10 pb-10 border-b border-white/10">

          {/* Marka */}
          <div className="lg:col-span-2">
            <img
              src="/celik-logo.svg"
              alt="Çelik Taahhüt İnşaat"
              className="h-10 w-auto brightness-0 invert mb-5"
            />
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Modern mühendislik çözümleri ve kaliteli işçilikle yaşam alanlarını geleceğe taşıyoruz.
            </p>
            <div className="flex gap-2.5 mt-6">
              {[
                { label: 'f', href: '#' },
                { label: 'in', href: 'https://www.instagram.com/celiktaahhut/' },
                { label: 'yt', href: '#' },
              ].map((s) => (
                <a key={s.label} href={s.href}
                  target={s.href !== '#' ? '_blank' : undefined}
                  rel={s.href !== '#' ? 'noopener noreferrer' : undefined}
                  className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded flex items-center justify-center text-white/70 text-xs font-bold transition-colors">
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Kurumsal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Kurumsal</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Hakkımızda', href: '/hakkimizda' },
                { label: 'Vizyon & Misyon', href: '/hakkimizda' },
                { label: 'Yönetim', href: '/hakkimizda' },
                { label: 'Kariyer', href: '/iletisim' },
                { label: 'İletişim', href: '/iletisim' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Projelerimiz */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Projelerimiz</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Devam Eden Projeler', href: '/projeler' },
                { label: 'Tamamlanan Projeler', href: '/projeler' },
                { label: 'Gelecek Projeler', href: '/projeler' },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-white/50 hover:text-white text-sm transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">İletişim</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-white/50 text-sm">
                <svg width="15" height="15" className="mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                Zeytinlik Mahallesi Türkçü Sokak<br />Kayalı Apt. B Blok No: 6 D: 4<br />Bakırköy / İstanbul
              </li>
              <li>
                <a href="tel:+902124210288" className="flex items-center gap-2.5 text-white/50 hover:text-white text-sm transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +90 (212) 421 02 88
                </a>
              </li>
              <li>
                <a href="tel:+905322723033" className="flex items-center gap-2.5 text-white/50 hover:text-white text-sm transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  +90 (532) 272 30 33
                </a>
              </li>
              <li>
                <a href="mailto:snrclk@hotmail.com.tr" className="flex items-center gap-2.5 text-white/50 hover:text-white text-sm transition-colors">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
                  </svg>
                  snrclk@hotmail.com.tr
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Alt bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
          <p>© 2024 Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. Tüm hakları saklıdır.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition-colors">KVKK</a>
            <a href="#" className="hover:text-white transition-colors">Çerez Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
