'use client'

import Link from 'next/link'

type Props = {
  activePage: string
  setActivePage: (page: string) => void
}

const SIDEBAR_ITEMS = [
  {
    key: 'anasayfa',
    label: 'Genel Bakış',
    mobileLabel: 'Genel Bakış',
    showMobile: true,
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinejoin="round"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
        <polyline points="9 22 9 12 15 12 15 22"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    mobileIcon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
          stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" strokeLinejoin="round" />
        <polyline points="9 22 9 12 15 12 15 22"
          stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'proje-takibi',
    label: 'Proje Takibi',
    mobileLabel: 'Proje',
    showMobile: true,
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
        <rect x="14" y="3" width="7" height="7" rx="1"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
        <rect x="3" y="14" width="7" height="7" rx="1"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
        <rect x="14" y="14" width="7" height="7" rx="1"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
      </svg>
    ),
    mobileIcon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    key: 'santiye',
    label: 'Şantiye Galerisi',
    mobileLabel: 'Şantiye',
    showMobile: true,
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
        <circle cx="12" cy="13" r="4"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" />
      </svg>
    ),
    mobileIcon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
          stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" />
        <circle cx="12" cy="13" r="4" stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    key: 'odemeler',
    label: 'Ödemeler',
    mobileLabel: 'Ödemeler',
    showMobile: true,
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="4" width="22" height="16" rx="2"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
        <line x1="1" y1="10" x2="23" y2="10"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    mobileIcon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="1" y="4" width="22" height="16" rx="2" stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" />
        <line x1="1" y1="10" x2="23" y2="10" stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'belgeler',
    label: 'Belgeler',
    mobileLabel: 'Belgeler',
    showMobile: false,
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinejoin="round"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
      </svg>
    ),
    mobileIcon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"
          stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    key: 'duyurular',
    label: 'Duyurular',
    mobileLabel: 'Duyurular',
    showMobile: false,
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
        <path d="M13.73 21a2 2 0 0 1-3.46 0"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    mobileIcon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
          stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0"
          stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'hesabim',
    label: 'Hesabım',
    mobileLabel: 'Hesabım',
    showMobile: false,
    icon: (a: boolean) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8"
          fill={a ? 'rgba(255,255,255,0.18)' : 'none'} />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
          stroke={a ? '#ffffff' : 'rgba(255,255,255,0.5)'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    mobileIcon: (a: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={a ? '#0A1F44' : '#9CA3AF'} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

const MOBILE_ITEMS = SIDEBAR_ITEMS.filter(i => i.showMobile)

export default function MalikNav({ activePage, setActivePage }: Props) {
  const isMobileMore = ['belgeler', 'duyurular', 'hesabim'].includes(activePage)

  return (
    <>
      {/* ── DESKTOP SIDEBAR ─────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col flex-shrink-0 w-52 bg-[#0A1F44] h-screen sticky top-0">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-center">
          <Link href="/malik-dashboard">
            <img src="/icons/celik-logo.svg" alt="Çelik İnşaat" className="h-14 w-auto brightness-0 invert" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const active = activePage === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                  active ? 'bg-white/15' : 'hover:bg-white/8'
                }`}
              >
                <span className={`flex-shrink-0 ${active ? 'opacity-100' : 'opacity-55'}`}>
                  {item.icon(active)}
                </span>
                <span className={active ? 'text-white font-semibold' : 'text-white/55 font-medium'}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </nav>

        {/* Destek Hattı */}
        <div className="mx-3 mb-4 p-3 bg-white/8 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z" />
              </svg>
            </div>
            <p className="text-white/50 text-xs">Destek Hattı</p>
          </div>
          <a href="tel:+902124210288" className="text-white font-bold text-sm">+90 (212) 421 02 88</a>
          <p className="text-white/40 text-[10px] mt-1 leading-4">Hafta içi 09:00–18:00</p>
        </div>
      </aside>

      {/* ── MOBİL BOTTOM NAV ────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-end h-16">
          {MOBILE_ITEMS.map((item) => {
            const active = activePage === item.key
            return (
              <button
                key={item.key}
                onClick={() => setActivePage(item.key)}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
              >
                {item.mobileIcon(active)}
                <span className={`text-[10px] font-medium ${active ? 'text-[#0A1F44]' : 'text-neutral-400'}`}>
                  {item.mobileLabel}
                </span>
              </button>
            )
          })}

          {/* Daha Fazlası */}
          <button
            onClick={() => setActivePage(isMobileMore ? activePage : 'belgeler')}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="5" cy="12" r="1.5" fill={isMobileMore ? '#0A1F44' : '#9CA3AF'} />
              <circle cx="12" cy="12" r="1.5" fill={isMobileMore ? '#0A1F44' : '#9CA3AF'} />
              <circle cx="19" cy="12" r="1.5" fill={isMobileMore ? '#0A1F44' : '#9CA3AF'} />
            </svg>
            <span className={`text-[10px] font-medium ${isMobileMore ? 'text-[#0A1F44]' : 'text-neutral-400'}`}>
              Daha Fazlası
            </span>
          </button>
        </div>
      </nav>
    </>
  )
}
