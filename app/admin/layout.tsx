'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminBottomNav from '@/components/admin/AdminBottomNav'

// ── Sayfa başlıkları ──────────────────────────────────
const PAGE_INFO: Record<string, { title: string; subtitle: string }> = {
  '/admin':             { title: 'Hoş geldiniz, Emre Dağ', subtitle: 'Bugün senin için 3 önemli iş var.' },
  '/admin/projeler':    { title: 'Projeler',               subtitle: 'Tüm projelerinizi yönetin.' },
  '/admin/odemeler':    { title: 'Finansal Analiz',        subtitle: 'Proje bazlı gelir ve maliyet takibi.' },
  '/admin/vade-takibi': { title: 'Vade Takibi',            subtitle: 'Vadesi yaklaşan ve geçmiş ödemeler.' },
  '/admin/evraklar':    { title: 'Evraklar',               subtitle: 'Proje belgelerinizi yönetin.' },
  '/admin/raporlar':    { title: 'Raporlar',               subtitle: 'Detaylı analizler ve istatistikler.' },
  '/admin/kisiler':     { title: 'Kişiler',                subtitle: 'Malik ve ekip yönetimi.' },
  '/admin/ayarlar':     { title: 'Ayarlar',                subtitle: 'Hesap ve uygulama ayarları.' },
}

function todayLabel() {
  return new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pageInfo = PAGE_INFO[pathname] ?? { title: 'Admin', subtitle: '' }

  return (
    <div className="bg-neutral-50 md:flex md:h-screen md:overflow-hidden">

      {/* ── Sidebar (desktop + mobil drawer) ──── */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Sağ taraf ─────────────────────────── */}
      <div className="flex-1 flex flex-col md:overflow-hidden min-w-0">

        {/* Desktop top header */}
        <header className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-100 flex-shrink-0">
          <div>
            <h1 className="font-bold text-2xl text-primary-800 leading-tight">{pageInfo.title}</h1>
            {pageInfo.subtitle && (
              <p className="text-sm text-neutral-500 mt-0.5">{pageInfo.subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            {/* Tarih */}
            <div className="flex items-center gap-2 bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="17" rx="2" stroke="#888780" strokeWidth="1.8"/>
                <path d="M3 9h18M8 2v4M16 2v4" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <span className="text-xs font-medium text-neutral-600">{todayLabel()}</span>
            </div>
            {/* Bildirim */}
            <div className="relative">
              <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</span>
            </div>
            {/* Avatar */}
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

        {/* Mobil top header */}
        <header
          className="md:hidden sticky top-0 z-30 bg-white border-b border-neutral-100 flex items-center px-4 gap-3"
          style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: '12px' }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="#0A1F44" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <img src="/icons/celik-logo.svg" alt="Çelik" className="h-7 w-auto" />
          <div className="ml-auto flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</span>
            </div>
            <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">ED</span>
            </div>
          </div>
        </header>

        {/* İçerik */}
        <main className="flex-1 md:overflow-y-auto">
          <div className="pb-28 md:pb-6">
            {children}
          </div>
        </main>

        {/* Mobil bottom nav */}
        <AdminBottomNav />

      </div>
    </div>
  )
}
