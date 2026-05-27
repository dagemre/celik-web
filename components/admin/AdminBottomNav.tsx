'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const FAB_ACTIONS = [
  {
    label: 'Tahsilat Ekle',
    href: '/admin/odemeler/yeni',
    bg: 'bg-green-50',
    iconBg: 'bg-green-100',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Proje Ekle',
    href: '/admin/projeler/yeni',
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    ),
  },
  {
    label: 'Evrak Ekle',
    href: '/admin/evraklar/yeni',
    bg: 'bg-amber-50',
    iconBg: 'bg-amber-100',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"/>
        <path d="M14 2v6h6M8 13h8M8 17h5"/>
      </svg>
    ),
  },
  {
    label: 'Malik Ekle',
    href: '/admin/kisiler/yeni',
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
  },
]

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
    href: '/admin/kisiler', label: 'Malikler', exact: false,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinecap="round"/>
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
  const [fabOpen, setFabOpen] = useState(false)

  function isActive(item: { href: string; exact: boolean }) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  return (
    <>
      {/* FAB Popup */}
      {fabOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setFabOpen(false)}
        />
      )}

      {fabOpen && (
        <div
          className="fixed left-0 right-0 z-50 bg-white rounded-t-3xl px-5 pt-5 pb-10 shadow-2xl"
          style={{ bottom: 'calc(64px + env(safe-area-inset-bottom))' }}
        >
          {/* Tutma çubuğu */}
          <div className="w-10 h-1 bg-neutral-200 rounded-full mx-auto mb-5" />

          <div className="flex flex-col gap-1">
            {FAB_ACTIONS.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                onClick={() => setFabOpen(false)}
                className="flex items-center gap-4 px-3 py-3.5 rounded-2xl active:bg-neutral-50 transition-colors"
              >
                <div className={`w-14 h-14 ${action.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  {action.icon}
                </div>
                <span className="text-lg font-semibold text-[#0A1F44]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Nav */}
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
            <button
              onClick={() => setFabOpen(!fabOpen)}
              className="w-14 h-14 bg-primary-800 rounded-full flex items-center justify-center -mt-5 transition-transform active:scale-95"
              style={{ boxShadow: '0 4px 16px rgba(10,31,68,0.35)' }}
            >
              <svg
                width="26" height="26" viewBox="0 0 24 24" fill="none"
                className="transition-transform duration-200"
                style={{ transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
              >
                <path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
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
    </>
  )
}
