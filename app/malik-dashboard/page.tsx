'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import KVKKModal from '@/components/malik/KVKKModal'
import MalikNav from '@/components/malik/MalikNav'
import {
  getMalikBilgi,
  getMalikOdemeleri,
  getProjeeDuyurulari,
  getMalikEvraklari,
  hesaplaOdemeDurumu,
  formatOdemeTarihi,
  type MalikBilgi,
  type MalikOdeme,
  type MalikDuyuru,
  type MalikEvrak,
} from '@/lib/malik-data'

// ─── Defaults ──────────────────────────────────────────────────────────────────
const BOSH_MALIK: MalikBilgi = {
  id: '', full_name: '...', email: '', phone: '',
  unit_id: '', unit_no: '—', floor: 0, unit_type: '—', price: 0,
  gross_area: 0, net_area: 0,
  project_id: '', project_name: '—', project_slug: '', project_location: '—',
  project_status: 'devam', project_image_url: '', project_delivery_date: '', project_progress: 0,
}

function formatTL(n: number) { return n.toLocaleString('tr-TR') + ' TL' }

// ─── İnşaat aşamaları — progress'e göre hesaplanır ────────────────────────────
function getInsaatAsamalari(progress: number) {
  const ASAMALAR = [
    { no: 1, label: 'Temel',             tamamAt: 10 },
    { no: 2, label: 'Betonarme',         tamamAt: 25 },
    { no: 3, label: 'Duvarlar',          tamamAt: 40 },
    { no: 4, label: 'Elektrik\nTesisatı',tamamAt: 55 },
    { no: 5, label: 'Sıva',              tamamAt: 65 },
    { no: 6, label: 'Boya',              tamamAt: 78 },
    { no: 7, label: 'Peyzaj',            tamamAt: 90 },
    { no: 8, label: 'Teslim',            tamamAt: 100 },
  ]
  return ASAMALAR.map((a, i) => {
    if (progress >= a.tamamAt) return { ...a, status: 'done' as const }
    // Bir önceki tamamlandıysa bu aktif
    if (i === 0 || progress >= ASAMALAR[i - 1].tamamAt) return { ...a, status: 'active' as const }
    return { ...a, status: 'pending' as const }
  })
}

// Evrak türüne göre renk
function evrakRenk(type: string): { stroke: string; bg: string } {
  const map: Record<string, { stroke: string; bg: string }> = {
    'Resmi Belge': { stroke: '#2563EB', bg: '#EFF6FF' },
    'Proje':       { stroke: '#7C3AED', bg: '#F5F3FF' },
    'Sözleşme':    { stroke: '#D97706', bg: '#FFFBEB' },
    'Rapor':       { stroke: '#0891B2', bg: '#F0FDFA' },
    'Dekont':      { stroke: '#16A34A', bg: '#F0FDF4' },
  }
  return map[type] ?? { stroke: '#DC2626', bg: '#FEF2F2' }
}

// ─── Circular progress (hero) ──────────────────────────────────────────────────
function CircularProgress({ percent }: { percent: number }) {
  const r = 36, circ = 2 * Math.PI * r
  const dashOffset = circ - (percent / 100) * circ
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="8" />
      <circle cx="45" cy="45" r={r} fill="none" stroke="#22C55E" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={dashOffset} strokeLinecap="round" />
    </svg>
  )
}

// ─── Donut Chart (daire bilgilerim) ───────────────────────────────────────────
function DonutChart({ percent }: { percent: number }) {
  const r = 48, cx = 60, cy = 60, circ = 2 * Math.PI * r
  const segments = [
    { value: percent,       color: '#0A1F44' },
    { value: 100 - percent, color: '#E5E7EB' },
  ]
  let offset = 0
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {segments.map((seg, i) => {
        const dash = (seg.value / 100) * circ
        const rotate = (offset / 100) * 360 - 90
        offset += seg.value
        return (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="14"
            strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="butt"
            transform={`rotate(${rotate} ${cx} ${cy})`} />
        )
      })}
      <text x={cx} y={cy - 4} textAnchor="middle" fontSize="15" fontWeight="700" fill="#0A1F44">%{percent}</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="9" fill="#9CA3AF">ilerleme</text>
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MalikDashboardPage() {
  const router = useRouter()
  const [activePage, setActivePage] = useState('anasayfa')
  const [kvkkGoster, setKvkkGoster] = useState(false)

  const [malik, setMalik]         = useState<MalikBilgi>(BOSH_MALIK)
  const [odemeler, setOdemeler]   = useState<MalikOdeme[]>([])
  const [duyurular, setDuyurular] = useState<MalikDuyuru[]>([])
  const [evraklar, setEvraklar]   = useState<MalikEvrak[]>([])
  const [yuklendi, setYuklendi]   = useState(false)

  useEffect(() => {
    const onay = localStorage.getItem('kvkk_onay')
    if (!onay) setKvkkGoster(true)

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { router.replace('/malik-giris'); return }

      const bilgi = await getMalikBilgi(session.user.id)
      if (bilgi) {
        setMalik(bilgi)
        const [odeme, duyuru, evrak] = await Promise.all([
          getMalikOdemeleri(bilgi.id),
          getProjeeDuyurulari(bilgi.project_id),
          getMalikEvraklari(bilgi.project_id),
        ])
        setOdemeler(odeme)
        setDuyurular(duyuru)
        setEvraklar(evrak)
      }
      setYuklendi(true)
    })
  }, [router])

  const { toplamBorc, odenen, kalan, yuzdesi: paidPercent } = hesaplaOdemeDurumu(malik.price, odemeler)
  const initials = malik.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2)
  const asamalar = getInsaatAsamalari(malik.project_progress)

  return (
    <div className="flex h-screen bg-[#F4F6FA] overflow-hidden">

      {kvkkGoster && (
        <KVKKModal ownerEmail={malik.email} ownerId={undefined} onOnaylandi={() => setKvkkGoster(false)} />
      )}

      <MalikNav activePage={activePage} setActivePage={setActivePage} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── HEADER ──────────────────────────────────────────────── */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-5 gap-4 flex-shrink-0">
          <button className="md:hidden w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div className="flex-1">
            <h1 className="text-base font-bold text-[#0A1F44] leading-tight">Merhaba, {malik.full_name} 👋</h1>
            <p className="text-xs text-gray-400 mt-0.5">{malik.project_name}</p>
          </div>

          <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {duyurular.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {duyurular.length > 9 ? '9+' : duyurular.length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0A1F44] flex items-center justify-center text-white font-bold text-sm">
              {initials}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#0A1F44] leading-tight">{malik.full_name}</p>
              <p className="text-xs text-gray-400">Malik</p>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); router.replace('/malik-giris') }}
              className="text-gray-300 hover:text-gray-500 transition-colors ml-1"
              title="Çıkış Yap"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </header>

        {/* ── CONTENT ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="p-4 md:p-5 space-y-4">

            {/* ══ GENEL BAKIŞ ══════════════════════════════════════ */}
            {activePage === 'anasayfa' && <>

              {/* Hero Card */}
              <div className="rounded-3xl overflow-hidden">
                <div className="flex flex-col lg:flex-row" style={{ minHeight: 220 }}>

                  {/* Fotoğraf + overlay */}
                  <div className="relative flex-1" style={{ minHeight: 220 }}>
                    {malik.project_image_url
                      ? <img src={malik.project_image_url} alt={malik.project_name} className="absolute inset-0 w-full h-full object-cover" />
                      : <div className="absolute inset-0 bg-slate-700" />
                    }
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 lg:to-black/20 to-black/60" />

                    <div className="relative p-5 md:p-6 h-full flex flex-col justify-between" style={{ minHeight: 220 }}>
                      {/* Top */}
                      <div className="flex items-start justify-between">
                        <span className="inline-flex items-center gap-1.5 bg-green-500/90 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                          {malik.project_status === 'tamamlandi' ? 'Tamamlandı' : 'İnşaat Devam Ediyor'}
                        </span>
                        <button
                          onClick={() => setActivePage('daire')}
                          className="lg:hidden flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinejoin="round"/></svg>
                          Dairem
                        </button>
                      </div>

                      {/* Bottom */}
                      <div>
                        <h1 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight">
                          {malik.project_name.toUpperCase()}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1.5 mb-4">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <p className="text-white/70 text-sm">{malik.project_location}</p>
                        </div>

                        {/* Desktop: butonlar */}
                        <div className="hidden lg:flex gap-3">
                          <button onClick={() => setActivePage('daire')}
                            className="flex items-center gap-2 bg-white/15 backdrop-blur-sm hover:bg-white/25 text-white text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/20 transition-all">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinejoin="round"/></svg>
                            Dairem
                            <span className="text-white/60 text-xs font-normal">{malik.unit_type} · No:{malik.unit_no} · Kat:{malik.floor}</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                          <button onClick={() => setActivePage('daire')}
                            className="flex items-center gap-2 bg-white text-[#0A1F44] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
                            Projeyi İncele
                            <span className="text-gray-500 text-xs font-normal">Detayları Gör</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </button>
                        </div>

                        {/* Mobile: progress */}
                        <div className="lg:hidden">
                          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">Genel İlerleme</p>
                          <p className="text-white text-3xl font-black">%{malik.project_progress}</p>
                          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden mt-2 mb-3">
                            <div className="h-full bg-green-400 rounded-full" style={{ width: `${malik.project_progress}%` }} />
                          </div>
                          <div className="flex items-center gap-2">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round"/>
                              <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/>
                            </svg>
                            <p className="text-white/60 text-xs">Tahmini Teslim Tarihi</p>
                            <p className="text-white text-xs font-bold">{malik.project_delivery_date || 'Haziran 2027'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button onClick={() => setActivePage('daire')}
                      className="lg:hidden absolute bottom-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>

                  {/* Desktop: sağ panel */}
                  <div className="hidden lg:flex flex-col items-center justify-center bg-[#0A1F44] w-72 flex-shrink-0 p-6 gap-4">
                    <div className="text-center">
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Genel İlerleme</p>
                      <div className="relative inline-flex items-center justify-center">
                        <CircularProgress percent={malik.project_progress} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <p className="text-white text-2xl font-black leading-none">%{malik.project_progress}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-white/50 text-xs">
                        Proje {asamalar.length} aşamadan {asamalar.filter(s => s.status === 'done').length}. aşamada
                      </p>
                    </div>
                    <div className="w-full bg-white/8 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round"/>
                          <line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/>
                        </svg>
                        <p className="text-white/50 text-xs">Tahmini Teslim Tarihi</p>
                      </div>
                      <p className="text-white font-bold text-sm uppercase tracking-wide pl-5">
                        {malik.project_delivery_date || 'HAZİRAN 2027'}
                      </p>
                    </div>
                    <button className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 transition-all rounded-xl px-4 py-2.5 border border-white/15">
                      <span className="text-white text-sm font-semibold">Takvimi Gör</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* İnşaat Süreci */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-5">
                  <p className="text-sm font-bold text-[#0A1F44] uppercase tracking-wide">İnşaat Süreci</p>
                  <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0A1F44] transition-colors">
                    Detaylı Takvim
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                <div className="overflow-x-auto -mx-1 px-1">
                  <div className="flex items-start min-w-max gap-0">
                    {asamalar.map((step, i) => (
                      <div key={step.no} className="flex items-start">
                        <div className="flex flex-col items-center w-20 md:w-24">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                            step.status === 'done'   ? 'bg-green-500' :
                            step.status === 'active' ? 'bg-green-500 ring-4 ring-green-100' :
                            'bg-gray-100 border-2 border-gray-200'
                          }`}>
                            {step.status === 'done' ? (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                            ) : (
                              <span className={`text-sm font-bold ${step.status === 'active' ? 'text-white' : 'text-gray-400'}`}>{step.no}</span>
                            )}
                          </div>
                          <div className="mt-2 text-center px-1">
                            <p className="text-[11px] font-semibold text-[#0A1F44] leading-tight whitespace-pre-line">{step.label}</p>
                            <p className={`text-[10px] mt-0.5 font-medium ${
                              step.status === 'done'   ? 'text-gray-400' :
                              step.status === 'active' ? 'text-green-500' : 'text-gray-300'
                            }`}>
                              {step.status === 'done' ? 'Tamamlandı' : step.status === 'active' ? 'Devam Ediyor' : 'Bekliyor'}
                            </p>
                          </div>
                        </div>
                        {i < asamalar.length - 1 && (
                          <div className={`h-0.5 w-8 md:w-10 mt-5 flex-shrink-0 rounded-full ${
                            asamalar[i + 1].status !== 'pending' ? 'bg-green-400' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 kart: Son Güncelleme | Ödeme Durumu | Duyurular */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                {/* Ödeme Durumu */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-[#0A1F44]">Ödeme Durumu</p>
                    <button onClick={() => setActivePage('odemeler')} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#0A1F44] transition-colors">
                      Tüm Ödemeler
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Kalan Borç</p>
                  <p className="text-3xl font-black text-green-500 mb-3">{formatTL(kalan)}</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: `${paidPercent}%` }} />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div><p className="text-[10px] text-gray-400 mb-1">Toplam Borç</p><p className="text-xs font-bold text-[#0A1F44]">{formatTL(toplamBorc)}</p></div>
                    <div><p className="text-[10px] text-gray-400 mb-1">Ödenen</p><p className="text-xs font-bold text-green-500">{formatTL(odenen)}</p></div>
                    <div><p className="text-[10px] text-gray-400 mb-1">Kalan</p><p className="text-xs font-bold text-[#0A1F44]">{formatTL(kalan)}</p></div>
                  </div>
                  <button onClick={() => setActivePage('odemeler')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0A1F44] text-white text-sm font-semibold rounded-xl hover:bg-[#0d2755] transition-colors">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round"/></svg>
                    Ödeme Yap
                  </button>
                </div>

                {/* Son Ödemeler */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-[#0A1F44]">Son Ödemelerim</p>
                    <button onClick={() => setActivePage('odemeler')} className="text-xs text-gray-400 hover:text-[#0A1F44] transition-colors">Tümü →</button>
                  </div>
                  {odemeler.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">Henüz ödeme kaydı yok.</p>
                  ) : odemeler.slice(0, 3).map((p, i) => (
                    <div key={p.id} className={`flex items-center gap-3 py-3 ${i < Math.min(odemeler.length, 3) - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[#0A1F44]">{formatOdemeTarihi(p.paid_date)}</p>
                        <p className="text-xs text-gray-400">{p.source}</p>
                      </div>
                      <p className="text-sm font-bold text-green-500">{formatTL(p.amount)}</p>
                    </div>
                  ))}
                </div>

                {/* Duyurular */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:col-span-2 lg:col-span-1">
                  <p className="text-sm font-bold text-[#0A1F44] mb-4">Son Duyurular</p>
                  {duyurular.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">Henüz duyuru yok.</p>
                  ) : duyurular.slice(0, 3).map((ann, i) => (
                    <div key={ann.id} className={`flex items-start gap-3 py-3 ${i < Math.min(duyurular.length, 3) - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0A1F44] truncate">{ann.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{ann.content}</p>
                        <p className="text-[10px] text-gray-300 mt-0.5">{formatOdemeTarihi(ann.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daire Evrakları — mobile: gerçek veri */}
              <div className="lg:hidden bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-[#0A1F44]">Daire Evrakları</p>
                  <button onClick={() => setActivePage('belgeler')} className="text-xs text-gray-400 hover:text-[#0A1F44] transition-colors">Tüm Evraklar →</button>
                </div>
                {evraklar.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Henüz paylaşılan evrak yok.</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    {evraklar.slice(0, 8).map((doc, i) => {
                      const renk = evrakRenk(doc.type)
                      return (
                        <a key={i} href={doc.file_url ?? '#'} target="_blank" rel="noopener noreferrer"
                          className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-gray-50 transition-colors">
                          <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: renk.bg }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={renk.stroke} strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/>
                              <polyline points="14 2 14 8 20 8" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <p className="text-[9px] font-medium text-[#0A1F44] text-center leading-tight line-clamp-2">{doc.name}</p>
                          <div className="w-5 h-5 bg-gray-100 rounded-md flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round"/>
                              <polyline points="7 10 12 15 17 10" strokeLinecap="round"/>
                              <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/>
                            </svg>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Hızlı Erişim */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Hızlı Erişim</p>
                <div className="grid grid-cols-4 lg:grid-cols-5 gap-3">
                  {[
                    { label: 'Ödeme Yap',    bg: '#F0FDF4', iconBg: '#DCFCE7', stroke: '#16A34A', page: 'odemeler', icon: <><rect x="1" y="4" width="22" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round"/></> },
                    { label: 'Belgelerim',   bg: '#EFF6FF', iconBg: '#DBEAFE', stroke: '#2563EB', page: 'belgeler', icon: <><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/></> },
                    { label: 'Daire Bilgim', bg: '#F5F3FF', iconBg: '#EDE9FE', stroke: '#7C3AED', page: 'daire',    icon: <><rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round"/><rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round"/><rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round"/><rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round"/></> },
                    { label: 'Hesabım',      bg: '#FFF7ED', iconBg: '#FED7AA', stroke: '#EA580C', page: 'hesabim',  icon: <><circle cx="12" cy="8" r="4" strokeLinecap="round"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/></> },
                    { label: 'Ödemelerim',   bg: '#F0FDF4', iconBg: '#BBF7D0', stroke: '#059669', page: 'odemeler', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round"/><line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/></> },
                  ].map((item, i) => (
                    <button key={i} onClick={() => setActivePage(item.page)}
                      className={`flex flex-col items-center gap-2 py-4 px-2 rounded-2xl hover:opacity-80 transition-opacity ${i === 4 ? 'hidden lg:flex' : 'flex'}`}
                      style={{ background: item.bg }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: item.iconBg }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.stroke} strokeWidth="2">{item.icon}</svg>
                      </div>
                      <p className="text-xs font-semibold text-[#0A1F44] text-center leading-tight">{item.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </>}

            {/* ══ DAİRE BİLGİLERİM ════════════════════════════════ */}
            {activePage === 'daire' && <>
              <div>
                <h2 className="text-xl font-bold text-[#0A1F44]">Daire Bilgilerim</h2>
                <p className="text-sm text-gray-400 mt-1">Dairenize ait tüm bilgiler.</p>
              </div>

              {/* Proje Kartı + İlerleme */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {malik.project_image_url && (
                    <div className="h-48">
                      <img src={malik.project_image_url} alt={malik.project_name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="text-base font-bold text-[#0A1F44]">{malik.project_name}</h3>
                    <div className="flex items-center gap-1.5 mt-1 mb-4">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <p className="text-xs text-gray-400">{malik.project_location}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Proje Durumu</p>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${malik.project_status === 'tamamlandi' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                          {malik.project_status === 'tamamlandi' ? 'Tamamlandı' : 'Devam Ediyor'}
                        </span>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Daire Tipi</p>
                        <p className="text-sm font-bold text-[#0A1F44]">{malik.unit_type}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Daire No</p>
                        <p className="text-sm font-bold text-[#0A1F44]">{malik.unit_no}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-400 mb-1">Kat</p>
                        <p className="text-sm font-bold text-[#0A1F44]">{malik.floor}. Kat</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm font-bold text-[#0A1F44] mb-4">Proje İlerleme</p>
                  <div className="flex items-center gap-5">
                    <DonutChart percent={malik.project_progress} />
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="flex justify-between mb-1"><p className="text-xs text-gray-500">Tamamlanan</p><p className="text-xs font-bold text-[#0A1F44]">%{malik.project_progress}</p></div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-[#0A1F44] rounded-full" style={{ width: `${malik.project_progress}%` }} /></div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1"><p className="text-xs text-gray-500">Kalan</p><p className="text-xs font-bold text-[#0A1F44]">%{100 - malik.project_progress}</p></div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gray-200 rounded-full" style={{ width: `${100 - malik.project_progress}%` }} /></div>
                      </div>
                      <div className="pt-2 border-t border-gray-50">
                        <p className="text-xs text-gray-400">Tahmini Teslim</p>
                        <p className="text-sm font-bold text-[#0A1F44] mt-0.5">{malik.project_delivery_date || 'Haziran 2027'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Daire Detayları + Finansal */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm font-bold text-[#0A1F44] mb-4">Daire Detayları</p>
                  {[
                    { label: 'Daire Tipi',    value: malik.unit_type || '—' },
                    { label: 'Brüt Alan',     value: malik.gross_area ? `${malik.gross_area.toLocaleString('tr-TR')} m²` : '—' },
                    { label: 'Net Alan',      value: malik.net_area ? `${malik.net_area.toLocaleString('tr-TR')} m²` : '—' },
                    { label: 'Satış Bedeli',  value: malik.price ? formatTL(malik.price) : '—' },
                    { label: 'Daire No',      value: malik.unit_no || '—' },
                    { label: 'Kat',           value: malik.floor ? `${malik.floor}. Kat` : '—' },
                    { label: 'Teslim Tarihi', value: malik.project_delivery_date || '—' },
                  ].map((row, i, arr) => (
                    <div key={row.label} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <p className="text-xs text-gray-400">{row.label}</p>
                      <p className="text-sm font-semibold text-[#0A1F44]">{row.value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm font-bold text-[#0A1F44] mb-4">Finansal Bilgiler</p>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><p className="text-xs text-gray-400 mb-1">Toplam Bedel</p><p className="text-base font-bold text-[#0A1F44]">{formatTL(toplamBorc)}</p></div>
                    <div><p className="text-xs text-gray-400 mb-1">Ödenen Tutar</p><p className="text-base font-bold text-green-500">{formatTL(odenen)}</p></div>
                    <div><p className="text-xs text-gray-400 mb-1">Kalan Tutar</p><p className="text-base font-bold text-[#0A1F44]">{formatTL(kalan)}</p></div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Ödeme Oranı</p>
                      <div className="flex items-center gap-2">
                        <div className="relative w-9 h-9 flex-shrink-0">
                          <svg width="36" height="36" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#F3F4F6" strokeWidth="4"/>
                            <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="4"
                              strokeDasharray={`${paidPercent * 0.879} ${87.9}`} strokeLinecap="round" transform="rotate(-90 18 18)"/>
                          </svg>
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#0A1F44]">%{paidPercent}</span>
                        </div>
                        <p className="text-xs text-gray-400">tamamlandı</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setActivePage('odemeler')}
                    className="w-full flex items-center justify-between py-3 border-t border-gray-50 text-xs text-gray-400 hover:text-[#0A1F44] transition-colors">
                    Ödeme geçmişini görüntüle
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>

              {/* Belgeler — gerçek veri */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-[#0A1F44]">Dairenize Ait Belgeler</p>
                  <button onClick={() => setActivePage('belgeler')} className="text-xs text-gray-400 hover:text-[#0A1F44] transition-colors">Tümü →</button>
                </div>
                {evraklar.length === 0 ? (
                  <p className="text-sm text-gray-400 py-4 text-center">Admin henüz belge paylaşmadı.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {evraklar.slice(0, 4).map((doc, i) => {
                      const renk = evrakRenk(doc.type)
                      return (
                        <a key={i} href={doc.file_url ?? '#'} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2.5 p-3 border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: renk.bg }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={renk.stroke} strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/>
                              <polyline points="14 2 14 8 20 8" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#0A1F44] truncate">{doc.name}</p>
                            <p className="text-[10px] text-gray-400">{doc.type}</p>
                          </div>
                        </a>
                      )
                    })}
                  </div>
                )}
              </div>
            </>}

            {/* ══ ÖDEMELER ════════════════════════════════════════ */}
            {activePage === 'odemeler' && <>
              <div>
                <h2 className="text-xl font-bold text-[#0A1F44]">Ödemeler</h2>
                <p className="text-sm text-gray-400 mt-1">Ödeme geçmişiniz ve durum özeti.</p>
              </div>

              <div className="bg-[#0A1F44] rounded-2xl p-5">
                <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-3">Ödeme Durumu</p>
                <div className="flex gap-6 mb-3">
                  <div><p className="text-white/50 text-xs mb-1">Toplam Borç</p><p className="text-white font-bold">{formatTL(toplamBorc)}</p></div>
                  <div><p className="text-white/50 text-xs mb-1">Ödenen</p><p className="text-green-400 font-bold">{formatTL(odenen)}</p></div>
                  <div><p className="text-white/50 text-xs mb-1">Kalan</p><p className="text-white font-bold">{formatTL(kalan)}</p></div>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-green-400 rounded-full" style={{ width: `${paidPercent}%` }} />
                </div>
                <p className="text-white/40 text-xs mt-1.5 text-right">%{paidPercent} ödendi</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="text-sm font-bold text-[#0A1F44] mb-4">Ödeme Geçmişi</p>
                {odemeler.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">Henüz ödeme kaydı yok.</p>
                ) : odemeler.map((p, i) => (
                  <div key={p.id} className={`flex items-center gap-3 py-3 ${i < odemeler.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-[#0A1F44]">{formatOdemeTarihi(p.paid_date)}</p>
                      <p className="text-xs text-gray-400">{p.source}</p>
                    </div>
                    <p className="text-sm font-bold text-green-500">{formatTL(p.amount)}</p>
                  </div>
                ))}
              </div>
            </>}

            {/* ══ BELGELER ════════════════════════════════════════ */}
            {activePage === 'belgeler' && <>
              <div>
                <h2 className="text-xl font-bold text-[#0A1F44]">Belgeler</h2>
                <p className="text-sm text-gray-400 mt-1">Admin tarafından paylaşılan tüm belgeler.</p>
              </div>

              {evraklar.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" className="mx-auto mb-3">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p className="text-sm font-medium text-gray-400">Admin henüz belge paylaşmadı.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {evraklar.map((doc, i) => {
                      const renk = evrakRenk(doc.type)
                      return (
                        <a key={i} href={doc.file_url ?? '#'} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3.5 border border-gray-100 rounded-xl hover:border-gray-200 hover:bg-gray-50 transition-all">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: renk.bg }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={renk.stroke} strokeWidth="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/>
                              <polyline points="14 2 14 8 20 8" strokeLinecap="round"/>
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#0A1F44] truncate">{doc.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{doc.type} · {doc.folder} · {doc.file_size}</p>
                          </div>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round"/>
                            <polyline points="7 10 12 15 17 10" strokeLinecap="round"/>
                            <line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/>
                          </svg>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )}
            </>}

            {/* ══ HESABIM ═════════════════════════════════════════ */}
            {activePage === 'hesabim' && <>
              <div>
                <h2 className="text-xl font-bold text-[#0A1F44]">Hesabım</h2>
                <p className="text-sm text-gray-400 mt-1">Kişisel bilgileriniz.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-4 pb-5 mb-5 border-b border-gray-50">
                  <div className="w-16 h-16 rounded-full bg-[#0A1F44] flex items-center justify-center text-white text-2xl font-bold">{initials}</div>
                  <div>
                    <p className="text-lg font-bold text-[#0A1F44]">{malik.full_name}</p>
                    <p className="text-sm text-gray-400">Malik · {malik.project_name}</p>
                  </div>
                </div>
                {[
                  { label: 'Ad Soyad',   value: malik.full_name },
                  { label: 'Telefon',    value: malik.phone || '—' },
                  { label: 'E-posta',    value: malik.email || '—' },
                  { label: 'Daire',      value: `${malik.unit_type} · No:${malik.unit_no} · Kat:${malik.floor}` },
                  { label: 'Proje',      value: malik.project_name },
                  { label: 'Konum',      value: malik.project_location || '—' },
                ].map((row, i, arr) => (
                  <div key={row.label} className={`flex items-center justify-between py-3 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                    <p className="text-xs text-gray-400 flex-shrink-0 w-24">{row.label}</p>
                    <p className="text-sm font-semibold text-[#0A1F44] text-right">{row.value}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={async () => { await supabase.auth.signOut(); router.replace('/malik-giris') }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-red-50 border border-red-100 text-red-600 font-semibold text-sm rounded-2xl hover:bg-red-100 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/>
                </svg>
                Çıkış Yap
              </button>
            </>}

          </div>
        </div>
      </div>
    </div>
  )
}
