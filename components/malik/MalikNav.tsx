'use client'

import Link from 'next/link'

type Props = {
  activePage: string
  setActivePage: (page: string) => void
}

type NavItem = {
  key: string
  label: string
  href?: string
  icon: (active: boolean) => React.ReactNode
  mobileIcon: (active: boolean) => React.ReactNode
}

const NAV_ITEMS: NavItem[] = [
  {
    key: 'anasayfa',
    label: 'Ana Sayfa',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V9l9-6 9 6v12H3z" stroke={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinejoin="round" fill={active ? 'rgba(255,255,255,0.15)' : 'none'} />
        <rect x="9" y="13" width="6" height="8" rx="1" fill={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} />
      </svg>
    ),
    mobileIcon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V9l9-6 9 6v12H3z" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round" />
        <rect x="9" y="13" width="6" height="8" rx="1" fill={active ? '#0A1F44' : '#A5A49C'} />
      </svg>
    ),
  },
  {
    key: 'daire',
    label: 'Daire Bilgilerim',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    mobileIcon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" />
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'odemeler',
    label: 'Ödemeler',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="4" width="22" height="16" rx="2" stroke={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" />
        <line x1="1" y1="10" x2="23" y2="10" stroke={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    mobileIcon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="4" width="22" height="16" rx="2" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" />
        <line x1="1" y1="10" x2="23" y2="10" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'belgeler',
    label: 'Belgeler',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinejoin="round" fill={active ? 'rgba(255,255,255,0.15)' : 'none'} />
      </svg>
    ),
    mobileIcon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'odeme-yap',
    label: 'Ödeme Yap',
    href: '/malik-dashboard/odeme-yap',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" stroke={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" fill={active ? 'rgba(255,255,255,0.15)' : 'none'} />
        <path d="M12 6v2M12 16v2M8.5 8.5l1.5 1.5M14 14l1.5 1.5M6 12h2M16 12h2M8.5 15.5l1.5-1.5M14 10l1.5-1.5" stroke={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="12" r="3" stroke={active ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"/>
      </svg>
    ),
    mobileIcon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="6" width="22" height="13" rx="2" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" />
        <path d="M1 10h22" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M5 14h4M15 14h4" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 2v4M9 3l3-1 3 1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function MalikNav({ activePage, setActivePage }: Props) {
  return (
    <>
      {/* ── DESKTOP SIDEBAR (md ve üzeri) ────────────────────────────── */}
      <aside className="hidden md:flex flex-col flex-shrink-0 w-44 bg-[#0A1F44] h-screen sticky top-0">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-center">
          <Link href="/malik-dashboard">
            <img src="/icons/celik-logo.svg" alt="Çelik Taahhüt" className="h-14 w-auto brightness-0 invert" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = activePage === item.key
            const cls = `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
              active ? 'bg-white/15' : 'hover:bg-white/8 hover:text-white/80'
            }`
            const inner = (
              <>
                <span className={`flex-shrink-0 ${active ? 'opacity-100' : 'opacity-60'}`}>
                  {item.icon(active)}
                </span>
                <span className={`${active ? 'text-white font-semibold' : 'text-white/55 font-medium'}`}>
                  {item.label}
                </span>
              </>
            )
            if (item.href) {
              return (
                <Link key={item.key} href={item.href} className={cls}>
                  {inner}
                </Link>
              )
            }
            return (
              <button key={item.key} onClick={() => setActivePage(item.key)} className={cls}>
                {inner}
              </button>
            )
          })}
        </nav>

        {/* Destek */}
        <div className="mx-3 mb-4 p-3 bg-white/8 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
              </svg>
            </div>
            <p className="text-white/50 text-xs">Destek Hattı</p>
          </div>
          <a href="tel:+902124210288" className="text-white font-bold text-sm">+90 (212) 421 02 88</a>
          <p className="text-white/40 text-[10px] mt-1 leading-4">Hafta içi 09:00–18:00</p>
        </div>

      </aside>

      {/* ── MOBİL BOTTOM NAV (md altı) ──────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-end h-16">
          {NAV_ITEMS.map((item) => {
            const active = activePage === item.key
            const inner = (
              <>
                {item.mobileIcon(active)}
                <span className={`text-[10px] font-medium ${active ? 'text-[#0A1F44]' : 'text-neutral-400'}`}>
                  {item.label === 'Daire Bilgilerim' ? 'Daire' : item.label === 'Ödeme Yap' ? 'Ödeme' : item.label}
                </span>
              </>
            )
            if (item.href) {
              return (
                <Link key={item.key} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2">
                  {inner}
                </Link>
              )
            }
            return (
              <button key={item.key} onClick={() => setActivePage(item.key)} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2">
                {inner}
              </button>
            )
          })}
        </div>
      </nav>
    </>
  )
}
