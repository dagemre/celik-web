'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navLinks = [
  { label: 'Ana Sayfa', href: '/' },
  { label: 'Projelerimiz', href: '/projeler' },
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Hizmetlerimiz', href: '/hizmetler' },
  { label: 'Kalite ve Güvenlik', href: '/kalite-guvenlik' },
  { label: 'İletişim', href: '/iletisim' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Anasayfada scroll'a göre şeffaf, diğer sayfalarda hep lacivert
  const isHome = pathname === '/'
  const bgClass = isHome
    ? scrolled ? 'bg-[#0A1F44] shadow-lg' : 'bg-transparent'
    : 'bg-[#0A1F44]'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img
            src="/celik-logo.svg"
            alt="Çelik Taahhüt İnşaat"
            className="h-14 w-auto brightness-0 invert"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-10">
          {navLinks.map((link) => {
            const active = pathname === link.href
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? 'text-white border-b-2 border-white pb-0.5'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Sağ — telefon + buton */}
        <div className="hidden xl:flex items-center gap-5">
          <a href="tel:+902124210288" className="flex items-center gap-2 text-white/90 hover:text-white text-sm transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            +90 (212) 421 02 88
          </a>
          <Link
            href="/teklif-al"
            className="border border-white text-white text-sm font-semibold px-5 py-2 rounded hover:bg-white hover:text-[#0A1F44] transition-all"
          >
            Teklif Alın
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="xl:hidden text-white">
          {menuOpen
            ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/><line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/></svg>
            : <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/><line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/><line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round"/></svg>
          }
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden bg-[#0A1F44] border-t border-white/10 px-6 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block text-white/90 hover:text-white py-3 text-sm font-medium border-b border-white/10 last:border-0"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/iletisim"
            className="mt-4 block border border-white text-white text-sm font-semibold px-5 py-3 rounded text-center hover:bg-white hover:text-[#0A1F44] transition-all"
          >
            Teklif Alın
          </Link>
        </div>
      )}
    </header>
  )
}
