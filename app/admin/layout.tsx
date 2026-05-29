'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminBottomNav from '@/components/admin/AdminBottomNav'
import AddToHomeScreen from '@/components/AddToHomeScreen'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [profileOpen,  setProfileOpen]  = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  // Dışarı tıklanınca kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="bg-neutral-50 md:flex md:h-screen md:overflow-hidden">

      {/* ── Sidebar (desktop + mobil drawer) ──── */}
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ── Sağ taraf ─────────────────────────── */}
      <div className="flex-1 flex flex-col md:overflow-hidden min-w-0">

        {/* Desktop top header — sadece kontroller */}
        <header className="hidden md:flex items-center justify-end px-6 py-3 bg-white border-b border-neutral-100 flex-shrink-0">
          <div className="flex items-center gap-4">
            {/* Bildirim */}
            <div className="relative">
              <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-700 rounded-full flex items-center justify-center text-white text-[10px] font-bold">3</span>
            </div>
            {/* Avatar + Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">ED</span>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm text-primary-800 leading-tight">Emre Dağ</p>
                  <p className="text-[11px] text-neutral-500">Müteahhit</p>
                </div>
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  className="transition-transform duration-200"
                  style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <path d="M6 9l6 6 6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              {/* Dropdown menü */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-2xl border border-neutral-100 shadow-lg overflow-hidden z-50">
                  <Link
                    href="/admin/ayarlar"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" stroke="#888780" strokeWidth="1.8"/>
                      <path d="M7 11V7a5 5 0 0110 0v4" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    <span className="text-sm font-medium text-neutral-700">Şifre Değiştir</span>
                  </Link>
                  <div className="border-t border-neutral-100" />
                  <Link
                    href="/admin/ayarlar"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="3" stroke="#888780" strokeWidth="1.8"/>
                      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    <span className="text-sm font-medium text-neutral-700">Ayarlar</span>
                  </Link>
                </div>
              )}
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

        {/* Anasayfaya ekle uyarısı (sadece mobil) */}
        <AddToHomeScreen />

      </div>
    </div>
  )
}
