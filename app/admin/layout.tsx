'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ── Sayfa başlıkları ──────────────────────────────────
const PAGE_INFO: Record<string, { title: string; subtitle: string }> = {
  '/admin':              { title: 'Hoş geldiniz, Emre Dağ', subtitle: 'Bugün senin için 3 önemli iş var.' },
  '/admin/projeler':     { title: 'Projeler',               subtitle: 'Tüm projelerinizi yönetin.' },
  '/admin/odemeler':     { title: 'Finansal Analiz',        subtitle: 'Proje bazlı gelir ve maliyet takibi.' },
  '/admin/vade-takibi':  { title: 'Vade Takibi',            subtitle: 'Vadesi yaklaşan ve geçmiş ödemeler.' },
  '/admin/evraklar':     { title: 'Evraklar',               subtitle: 'Proje belgelerinizi yönetin.' },
  '/admin/raporlar':     { title: 'Raporlar',               subtitle: 'Detaylı analizler ve istatistikler.' },
  '/admin/kisiler':      { title: 'Kişiler',                subtitle: 'Malik ve ekip yönetimi.' },
  '/admin/ayarlar':      { title: 'Ayarlar',                subtitle: 'Hesap ve uygulama ayarları.' },
}

// ── Sidebar nav ───────────────────────────────────────
const SIDEBAR_ITEMS = [
  {
    href: '/admin', label: 'Ana Sayfa', exact: true,
    icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 21V9l9-6 9 6v12H3z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><rect x="9" y="13" width="6" height="8" rx="1" fill={c}/></svg>,
  },
  {
    href: '/admin/projeler', label: 'Projeler', exact: false,
    icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke={c} strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke={c} strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke={c} strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke={c} strokeWidth="1.8"/></svg>,
  },
  {
    href: '/admin/odemeler', label: 'Ödemeler', exact: false,
    icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke={c} strokeWidth="1.8"/><path d="M2 10h20" stroke={c} strokeWidth="1.8"/><rect x="5" y="13" width="4" height="2" rx="0.5" fill={c}/></svg>,
  },
  {
    href: '/admin/evraklar', label: 'Evraklar', exact: false,
    icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 2v6h6M8 13h8M8 17h5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    href: '/admin/raporlar', label: 'Raporlar', exact: false,
    icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" fill={c}/><rect x="10" y="7" width="4" height="14" rx="1" fill={c}/><rect x="17" y="3" width="4" height="18" rx="1" fill={c}/></svg>,
  },
  {
    href: '/admin/kisiler', label: 'Kişiler', exact: false,
    icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
  {
    href: '/admin/ayarlar', label: 'Ayarlar', exact: false,
    icon: (c: string) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.8"/><path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={c} strokeWidth="1.8" strokeLinecap="round"/></svg>,
  },
]

// ── Mobil alt nav ─────────────────────────────────────
const BOTTOM_NAV = [
  {
    href: '/admin', label: 'Ana Sayfa', exact: true,
    icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 21V9l9-6 9 6v12H3z" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round"/><rect x="9" y="13" width="6" height="8" rx="1" fill={active ? '#0A1F44' : '#A5A49C'}/></svg>,
  },
  {
    href: '/admin/projeler', label: 'Projeler', exact: false,
    icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/></svg>,
  },
  {
    href: '/admin/odemeler', label: 'Ödemeler', exact: false,
    icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/><path d="M2 10h20" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/><rect x="5" y="13" width="4" height="2" rx="0.5" fill={active ? '#0A1F44' : '#A5A49C'}/></svg>,
  },
  {
    href: '/admin/evraklar', label: 'Evraklar', exact: false,
    icon: (active: boolean) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 2v6h6" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  },
]

function todayLabel() {
  return new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pageInfo = PAGE_INFO[pathname] ?? { title: 'Admin', subtitle: '' }

  function isActive(item: { href: string; exact: boolean }) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  return (
    <div className="bg-neutral-50 md:flex md:h-screen md:overflow-hidden">

      {/* ── Mobile overlay ───────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ══════════════ SIDEBAR ══════════════════ */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-44 bg-white border-r border-neutral-100
        flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-neutral-100 flex items-center justify-between">
          <img src="/icons/celik-logo.svg" alt="Çelik Taahhüt" className="h-8 w-auto" />
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const active = isActive(item)
            const color = active ? '#0A1F44' : '#888780'
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  active ? 'bg-primary-50' : 'hover:bg-neutral-50'
                }`}
              >
                <span className="flex-shrink-0">{item.icon(color)}</span>
                <span className={`text-sm font-medium ${active ? 'text-primary-800' : 'text-neutral-500'}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* Çıkış Yap */}
        <div className="px-3 py-4 border-t border-neutral-100">
          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-500 hover:bg-neutral-50 transition-colors w-full">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-medium">Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* ══════════════ RIGHT SIDE ═══════════════ */}
      <div className="flex-1 flex flex-col md:overflow-hidden min-w-0">

        {/* ── Desktop top header ─────────────────── */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-100 flex-shrink-0">
          {/* Left: page title */}
          <div>
            <h1 className="font-bold text-2xl text-primary-800 leading-tight">{pageInfo.title}</h1>
            {pageInfo.subtitle && (
              <p className="text-sm text-neutral-500 mt-0.5">{pageInfo.subtitle}</p>
            )}
          </div>
          {/* Right: date + bell + user */}
          <div className="flex items-center gap-4">
            {/* Date pill */}
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="17" rx="2" stroke="#888780" strokeWidth="1.8"/>
                <path d="M3 9h18M8 2v4M16 2v4" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span className="text-xs font-medium text-neutral-600">{todayLabel()}</span>
            </div>
            {/* Bell */}
            <div className="relative">
              <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</span>
            </div>
            {/* Avatar + name */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">ED</span>
              </div>
              <div>
                <p className="font-bold text-sm text-primary-800 leading-tight">Emre Dağ</p>
                <p className="text-[11px] text-neutral-500">Müteahhit</p>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M6 9l6 6 6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
        </header>

        {/* ── Mobile top header ──────────────────── */}
        <header
          className="md:hidden sticky top-0 z-30 bg-white border-b border-neutral-100 flex items-center px-4 gap-3"
          style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: '12px' }}
        >
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#0A1F44" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          {/* Logo */}
          <img src="/icons/celik-logo.svg" alt="Çelik" className="h-7 w-auto" />
          {/* Right side */}
          <div className="ml-auto flex items-center gap-2.5">
            {/* Bell */}
            <div className="relative">
              <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</span>
            </div>
            {/* Avatar + name */}
            <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">ED</span>
            </div>
            <div className="hidden sm:block">
              <p className="font-bold text-sm text-primary-800 leading-tight">Emre Dağ</p>
              <p className="text-[11px] text-neutral-500">Müteahhit</p>
            </div>
          </div>
        </header>

        {/* ── Content ───────────────────────────── */}
        <main className="flex-1 md:overflow-y-auto">
          <div className="pb-28 md:pb-6">
            {children}
          </div>
        </main>

        {/* ══════ Mobile bottom nav ══════════════ */}
        <nav
          className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-100"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex items-end h-16">
            {/* Ana Sayfa */}
            {BOTTOM_NAV.slice(0, 2).map((item) => {
              const active = isActive(item)
              return (
                <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2">
                  {item.icon(active)}
                  <span className={`text-[10px] font-medium ${active ? 'text-primary-800' : 'text-neutral-400'}`}>{item.label}</span>
                </Link>
              )
            })}

            {/* FAB — merkez + butonu */}
            <div className="flex-1 flex flex-col items-center justify-end pb-2 relative">
              <Link
                href="/admin"
                className="w-14 h-14 bg-primary-800 rounded-full flex items-center justify-center shadow-lg -mt-5"
                style={{ boxShadow: '0 4px 16px rgba(10,31,68,0.35)' }}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </Link>
            </div>

            {/* Ödemeler + Evraklar */}
            {BOTTOM_NAV.slice(2).map((item) => {
              const active = isActive(item)
              return (
                <Link key={item.href} href={item.href} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2">
                  {item.icon(active)}
                  <span className={`text-[10px] font-medium ${active ? 'text-primary-800' : 'text-neutral-400'}`}>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

      </div>
    </div>
  )
}
