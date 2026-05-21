'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MALIK = {
  name: 'Emre Dağ',
  email: 'dagemre@gmail.com',
  projectName: 'Mutlu Apartman',
  location: 'İstanbul / Avcılar / Merkez Mah.',
  block: 'A',
  unitNumber: 5,
  floor: 3,
  status: 'Devam Ediyor',
  totalDebt: 500000,
  paid: 300000,
  progress: 63,
  imageUri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
}

const RECENT_PAYMENTS = [
  { id: '1', date: '04.05.2026', method: 'Havale', amount: 300000, status: 'approved' },
  { id: '2', date: '01.03.2026', method: 'Havale', amount: 50000, status: 'approved' },
  { id: '3', date: '15.01.2026', method: 'Havale', amount: 50000, status: 'approved' },
]

const TECHNICAL_DOCS = [
  { id: '1', title: 'Kat Planları', size: '2.4 MB' },
  { id: '2', title: 'Cephe Görselleri', size: '3.1 MB' },
  { id: '3', title: 'Elektrik Projesi', size: '1.8 MB' },
]

const ANNOUNCEMENTS = [
  { id: '1', title: 'Aidat Ödemeleri Hakkında', summary: 'Mayıs ayı aidat ödemelerinizin 10.05.2026 tarihine kadar yapılması rica olunur.', date: '02.05.2026' },
  { id: '2', title: 'Genel Bakım Çalışması', summary: '15.05.2026 tarihinde bina genelinde bakım çalışması yapılacaktır.', date: '28.04.2026' },
]

function formatTL(n: number) {
  return n.toLocaleString('tr-TR') + ' TL'
}

// ─── Donut Chart (SVG) ────────────────────────────────────────────────────────
function DonutChart({ percent }: { percent: number }) {
  const r = 48
  const cx = 60
  const cy = 60
  const circ = 2 * Math.PI * r

  const segments = [
    { value: 63, color: '#0A1F44' },
    { value: 27, color: '#22C55E' },
    { value: 10, color: '#D1D5DB' },
  ]

  let offset = 0
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {segments.map((seg, i) => {
        const dash = (seg.value / 100) * circ
        const gap = circ - dash
        const rotate = (offset / 100) * 360 - 90
        offset += seg.value
        return (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="14"
            strokeDasharray={`${dash} ${gap}`}
            strokeLinecap="butt"
            transform={`rotate(${rotate} ${cx} ${cy})`}
          />
        )
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15" fontWeight="700" fill="#0A1F44">%{percent}</text>
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MalikDashboardPage() {
  const router = useRouter()
  const [activePage, setActivePage] = useState('anasayfa')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const remaining = MALIK.totalDebt - MALIK.paid
  const paidPercent = Math.round((MALIK.paid / MALIK.totalDebt) * 100)

  const sidebarLinks = [
    { key: 'anasayfa', label: 'Ana Sayfa', icon: <IcHome /> },
    { key: 'projelerim', label: 'Projelerim', icon: <IcBuilding /> },
    { key: 'odemeler', label: 'Ödemeler', icon: <IcCard /> },
    { key: 'teknik', label: 'Teknik Çizimler', icon: <IcDoc /> },
    { key: 'daire', label: 'Daire Bilgilerim', icon: <IcGrid /> },
    { key: 'bildirimler', label: 'Bildirimler', icon: <IcBell /> },
    { key: 'belgeler', label: 'Belgeler', icon: <IcFolder /> },
    { key: 'ayarlar', label: 'Ayarlar', icon: <IcSettings /> },
  ]

  return (
    <div className="flex h-screen bg-[#F4F6FA] overflow-hidden font-sans">

      {/* ── LEFT SIDEBAR ──────────────────────────────────────────────── */}
      <aside className={`
        fixed lg:static z-40 h-full w-[220px] bg-[#0A1F44] flex flex-col flex-shrink-0
        transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center justify-center px-5 py-5 border-b border-white/10">
          <img
            src="/celik-logo.svg"
            alt="Çelik Taahhüt İnşaat"
            className="h-14 w-auto brightness-0 invert"
          />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => { setActivePage(link.key); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left ${
                activePage === link.key
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-white/55 hover:bg-white/8 hover:text-white/80 font-medium'
              }`}
            >
              <span className={activePage === link.key ? 'opacity-100' : 'opacity-60'}>{link.icon}</span>
              {link.label}
            </button>
          ))}
        </nav>

        {/* Destek Hattı */}
        <div className="mx-3 mb-4 p-3 bg-white/8 rounded-xl border border-white/10">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-7 h-7 bg-[#22C55E]/20 rounded-lg flex items-center justify-center">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p className="text-white/60 text-xs">Destek Hattı</p>
          </div>
          <a href="tel:+902124210288" className="text-white font-bold text-sm">+90 (212) 421 02 88</a>
          <p className="text-white/40 text-xs mt-1">Hafta içi 09:00 – 18:00 saatleri arasında hizmet vermekteyiz.</p>
        </div>
      </aside>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── RIGHT SIDE ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-5 gap-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-400 hover:text-gray-700">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" strokeLinecap="round"/>
              <line x1="3" y1="12" x2="21" y2="12" strokeLinecap="round"/>
              <line x1="3" y1="18" x2="21" y2="18" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="flex-1">
            <h1 className="text-base font-bold text-[#0A1F44] leading-tight">Merhaba, {MALIK.name}</h1>
            <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-0.5">
              {MALIK.projectName}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/>
            </svg>
            <input placeholder="Arama yapın..." className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder:text-gray-400" />
          </div>

          {/* Bell */}
          <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
          </button>

          {/* User */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0A1F44] flex items-center justify-center text-white font-bold text-sm">
              {MALIK.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#0A1F44] leading-tight">{MALIK.name}</p>
              <p className="text-xs text-gray-400">Malik</p>
            </div>
            <button onClick={() => router.push('/malik-giris')} className="text-gray-300 hover:text-gray-500 transition-colors ml-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </header>

        {/* ── CONTENT ─────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex gap-5 p-5 min-h-full">

            {/* ── CENTER COLUMN ──────────────────────────────── */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">

              {/* ÖDEME DURUMU */}
              <div className="bg-[#0A1F44] rounded-2xl p-5 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute -right-2 -bottom-10 w-24 h-24 rounded-full bg-white/5" />

                <div className="flex items-center justify-between mb-4 relative">
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Ödeme Durumu</p>
                  <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                <div className="flex gap-8 mb-5 relative">
                  <div>
                    <p className="text-white/50 text-xs mb-1">Toplam Borç</p>
                    <p className="text-white font-bold text-xl">{formatTL(MALIK.totalDebt)}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">Ödenen</p>
                    <p className="text-[#22C55E] font-bold text-xl">{formatTL(MALIK.paid)}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-xs mb-1">Kalan Borç</p>
                    <p className="text-white font-bold text-xl">{formatTL(remaining)}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="relative mb-3">
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#22C55E] rounded-full transition-all"
                      style={{ width: `${paidPercent}%` }}
                    />
                  </div>
                  <p className="text-white/50 text-xs mt-1.5 text-right">%{paidPercent} ödendi</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-white/60 text-xs">Ödemeleriniz düzenli, teşekkür ederiz.</p>
                </div>
              </div>

              {/* PROJE KARTI */}
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-64 h-44 sm:h-auto flex-shrink-0">
                    <img
                      src={MALIK.imageUri}
                      alt={MALIK.projectName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-5">
                    <h2 className="text-lg font-bold text-[#0A1F44]">{MALIK.projectName}</h2>
                    <div className="flex items-center gap-1.5 mt-1 mb-4">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <p className="text-xs text-gray-400">{MALIK.location}</p>
                    </div>

                    <div className="flex gap-5 flex-wrap">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Proje Durumu</p>
                        <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-lg">Devam Ediyor</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Blok</p>
                        <p className="text-sm font-bold text-[#0A1F44]">{MALIK.block} Blok</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Daire No</p>
                        <p className="text-sm font-bold text-[#0A1F44]">{MALIK.unitNumber}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Kat</p>
                        <p className="text-sm font-bold text-[#0A1F44]">{MALIK.floor}</p>
                      </div>
                    </div>

                    <button className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#0A1F44] hover:text-blue-600 transition-colors">
                      Proje detayına git
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* HIZLI AKSİYONLAR */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: 'Ödeme\nGeçmişim', bg: 'bg-blue-50', iconBg: 'bg-blue-100', icon: <IcDoc color="#2563EB" /> },
                    { label: 'Ödeme\nYap', bg: 'bg-green-50', iconBg: 'bg-green-100', icon: <IcCard color="#16A34A" /> },
                    { label: 'Teknik\nÇizimler', bg: 'bg-purple-50', iconBg: 'bg-purple-100', icon: <IcFolder color="#7C3AED" /> },
                    { label: 'Daire\nBilgileim', bg: 'bg-amber-50', iconBg: 'bg-amber-100', icon: <IcInfo color="#D97706" /> },
                  ].map((item, i) => (
                    <button key={i} className={`flex flex-col items-center gap-2.5 py-4 px-2 rounded-xl ${item.bg} hover:opacity-80 transition-opacity`}>
                      <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center`}>
                        {item.icon}
                      </div>
                      <p className="text-xs font-semibold text-[#0A1F44] text-center whitespace-pre-line leading-tight">{item.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* DUYURULAR */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-7 h-7 bg-[#0A1F44]/8 rounded-lg flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="text-sm font-bold text-[#0A1F44]">Duyurular</p>
                </div>
                <div className="flex flex-col gap-0">
                  {ANNOUNCEMENTS.map((ann, i) => (
                    <button key={ann.id} className={`flex items-center gap-3 py-3.5 hover:bg-gray-50 -mx-2 px-2 rounded-xl transition-colors text-left ${i < ANNOUNCEMENTS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0A1F44] flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0A1F44] truncate">{ann.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate">{ann.summary}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <p className="text-xs text-gray-400">{ann.date}</p>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* ── RIGHT COLUMN ───────────────────────────────── */}
            <div className="hidden xl:flex flex-col gap-4 w-96 flex-shrink-0">

              {/* Son Ödemelerim */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-[#0A1F44]">Son Ödemelerim</p>
                  <button className="text-xs text-gray-400 hover:text-[#0A1F44] transition-colors flex items-center gap-1">
                    Tümü
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-0">
                  {RECENT_PAYMENTS.map((p, i) => (
                    <div key={p.id} className={`flex items-center gap-3 py-3 ${i < RECENT_PAYMENTS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5">
                          <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0A1F44]">{p.date}</p>
                        <p className="text-xs text-gray-400">{p.method}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-[#22C55E]">{formatTL(p.amount)}</p>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Teknik Çizimler */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-[#0A1F44]">Teknik Çizimler</p>
                  <button className="text-xs text-gray-400 hover:text-[#0A1F44] transition-colors flex items-center gap-1">
                    Tümü
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <div className="flex flex-col gap-0">
                  {TECHNICAL_DOCS.map((doc, i) => (
                    <div key={doc.id} className={`flex items-center gap-3 py-3 ${i < TECHNICAL_DOCS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0A1F44] truncate">{doc.title}</p>
                        <p className="text-xs text-gray-400">PDF · {doc.size}</p>
                      </div>
                      <button className="text-gray-300 hover:text-[#0A1F44] transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round" strokeLinejoin="round"/>
                          <polyline points="7 10 12 15 17 10" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Proje İlerleme */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-[#0A1F44]">Proje İlerleme Durumu</p>
                  <button className="text-xs text-gray-400 hover:text-[#0A1F44] transition-colors flex items-center gap-1">
                    Detaylı Rapor
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <DonutChart percent={MALIK.progress} />
                  <div className="flex-1 flex flex-col gap-2.5">
                    {[
                      { label: 'Tamamlanan İşler', value: 63, color: 'bg-[#0A1F44]' },
                      { label: 'Devam Eden İşler', value: 27, color: 'bg-[#22C55E]' },
                      { label: 'Planlanan İşler', value: 10, color: 'bg-gray-200' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between mb-1">
                          <p className="text-xs text-gray-500">{item.label}</p>
                          <p className="text-xs font-bold text-[#0A1F44]">%{item.value}</p>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IcHome() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IcBuilding() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IcCard({ color = 'currentColor' }: { color?: string }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round"/></svg>
}
function IcDoc({ color = 'currentColor' }: { color?: string }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/></svg>
}
function IcFolder({ color = 'currentColor' }: { color?: string }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IcInfo({ color = 'currentColor' }: { color?: string }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round"/><line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round"/></svg>
}
function IcGrid() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IcBell() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function IcSettings() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
