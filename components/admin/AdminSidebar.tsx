'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SIDEBAR_ITEMS = [
  {
    href: '/admin', label: 'Ana Sayfa', exact: true,
    icon: (c: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V9l9-6 9 6v12H3z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
        <rect x="9" y="13" width="6" height="8" rx="1" fill={c}/>
      </svg>
    ),
  },
  {
    href: '/admin/projeler', label: 'Projeler', exact: false,
    icon: (c: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={c} strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={c} strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={c} strokeWidth="1.8"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke={c} strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    href: '/admin/odemeler', label: 'Ödemeler', exact: false,
    icon: (c: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke={c} strokeWidth="1.8"/>
        <path d="M2 10h20" stroke={c} strokeWidth="1.8"/>
        <rect x="5" y="13" width="4" height="2" rx="0.5" fill={c}/>
      </svg>
    ),
  },
  {
    href: '/admin/evraklar', label: 'Evraklar', exact: false,
    icon: (c: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={c} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M14 2v6h6M8 13h8M8 17h5" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/admin/raporlar', label: 'Raporlar', exact: false,
    icon: (c: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" fill={c}/>
        <rect x="10" y="7" width="4" height="14" rx="1" fill={c}/>
        <rect x="17" y="3" width="4" height="18" rx="1" fill={c}/>
      </svg>
    ),
  },
  {
    href: '/admin/kisiler', label: 'Kişiler', exact: false,
    icon: (c: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={c} strokeWidth="1.8"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    href: '/admin/ayarlar', label: 'Ayarlar', exact: false,
    icon: (c: string) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke={c} strokeWidth="1.8"/>
        <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke={c} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
]

type Props = {
  open: boolean
  onClose: () => void
}

export default function AdminSidebar({ open, onClose }: Props) {
  const pathname = usePathname()

  function isActive(item: { href: string; exact: boolean }) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Overlay (mobil) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50
        w-44 bg-white border-r border-neutral-100
        flex flex-col transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>

        {/* Logo */}
        <div className="px-5 py-5 border-b border-neutral-100 flex items-center justify-between">
          <img src="/icons/celik-logo.svg" alt="Çelik Taahhüt" className="h-8 w-auto" />
          <button className="md:hidden" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const active = isActive(item)
            const color = active ? '#0A1F44' : '#888780'
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
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
    </>
  )
}
