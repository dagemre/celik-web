'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1.5" fill="#000000" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" fill="#000000" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" fill="#000000" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" fill="#000000" />
      </svg>
    ),
  },
  {
    href: '/admin/projeler',
    label: 'Projeler',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V9l9-6 9 6v12H3z" stroke="#000000" strokeWidth="1.8" strokeLinejoin="round" />
        <rect x="9" y="13" width="6" height="8" rx="1" fill="#000000" />
      </svg>
    ),
  },
  {
    href: '/admin/odemeler',
    label: 'Ödemeler',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#000000" strokeWidth="1.8" />
        <path d="M2 10h20" stroke="#000000" strokeWidth="1.8" />
        <rect x="5" y="13" width="4" height="2" rx="0.5" fill="#000000" />
      </svg>
    ),
  },
  {
    href: '/admin/vade-takibi',
    label: 'Vade Takibi',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#000000" strokeWidth="1.8" />
        <path d="M12 7v5l3 3" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/admin/evraklar',
    label: 'Evraklar',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#000000" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M14 2v6h6" stroke="#000000" strokeWidth="1.8" strokeLinejoin="round" />
        <path d="M8 13h8M8 17h5" stroke="#000000" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen bg-neutral-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-100 flex flex-col flex-shrink-0">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-800 rounded-xl flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 21V9l9-6 9 6v12H3z" fill="#FFFFFF" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm text-primary-800 leading-tight">Çelik Taahhüt</p>
              <p className="text-[10px] text-neutral-500 font-medium">Admin Paneli</p>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="px-6 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
              <span className="font-bold text-sm text-primary-800">ED</span>
            </div>
            <div>
              <p className="font-bold text-sm text-primary-800">Emre Dağ</p>
              <p className="text-[11px] text-neutral-500">Müteahhit</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary-800 text-white'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <span
                  className="flex-shrink-0"
                  style={{ filter: isActive ? 'brightness(0) invert(1)' : 'none' }}
                >
                  {item.icon}
                </span>
                <span className="font-medium text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Site linki */}
        <div className="px-3 py-4 border-t border-neutral-100">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-neutral-500 hover:bg-neutral-50 transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#888780" strokeWidth="1.8" />
              <path d="M2 12h20M12 3c-2 3-3 5.5-3 9s1 6 3 9M12 3c2 3 3 5.5 3 9s-1 6-3 9" stroke="#888780" strokeWidth="1.8" />
            </svg>
            <span className="text-sm font-medium">Siteye Git</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="ml-auto">
              <path d="M7 17L17 7M17 7H7M17 7v10" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </a>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
