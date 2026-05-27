import Link from 'next/link'
import FooterIletisim from './FooterIletisim'
import FooterPolicyBar from './FooterPolicyBar'

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

          {/* İletişim — dinamik, localStorage'dan okunan */}
          <FooterIletisim />
        </div>

        <FooterPolicyBar />
      </div>
    </footer>
  )
}
