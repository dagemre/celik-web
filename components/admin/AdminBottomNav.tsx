'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BOTTOM_NAV = [
  {
    href: '/admin', label: 'Ana Sayfa', exact: true,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V9l9-6 9 6v12H3z" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round"/>
        <rect x="9" y="13" width="6" height="8" rx="1" fill={active ? '#0A1F44' : '#A5A49C'}/>
      </svg>
    ),
  },
  {
    href: '/admin/projeler', label: 'Projeler', exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
        <rect x="14" y="3" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
        <rect x="3" y="14" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
        <rect x="14" y="14" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
      </svg>
    ),
  },
  {
    href: '/admin/odemeler', label: 'Ödemeler', exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
        <path d="M2 10h20" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
        <rect x="5" y="13" width="4" height="2" rx="0.5" fill={active ? '#0A1F44' : '#A5A49C'}/>
      </svg>
    ),
  },
  {
    href: '/admin/evraklar', label: 'Evraklar', exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M14 2v6h6" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function AdminBottomNav() {
  const pathname = usePathname()

  function isActive(item: { href: string; exact: boolean }) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-neutral-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-end h-16">

        {/* Sol 2 item */}
        {BOTTOM_NAV.slice(0, 2).map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
            >
              {item.icon(active)}
              <span className={`text-[10px] font-medium ${active ? 'text-primary-800' : 'text-neutral-400'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}

        {/* Merkez FAB */}
        <div className="flex-1 flex flex-col items-center justify-end pb-2">
          <Link
            href="/admin"
            className="w-14 h-14 bg-primary-800 rounded-full flex items-center justify-center -mt-5"
            style={{ boxShadow: '0 4px 16px rgba(10,31,68,0.35)' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </Link>
        </div>

        {/* Sağ 2 item */}
        {BOTTOM_NAV.slice(2).map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
            >
              {item.icon(active)}
              <span className={`text-[10px] font-medium ${active ? 'text-primary-800' : 'text-neutral-400'}`}>
                {item.label}
              </span>
            </Link>
          )
        })}

      </div>
    </nav>
  )
}
