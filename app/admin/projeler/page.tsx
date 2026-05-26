'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────────
type Project = {
  id: string
  name: string
  slug: string
  location: string
  district: string
  city: string
  tip: string
  status: string
  units_count: number
  progress: number
  image_url: string
  delivery_date: string | null
  delivery_year: string | null
  created_at: string
}

// ── Constants ──────────────────────────────────────────────────────────────────
const STATUS_LABEL: Record<string, string> = {
  devam:      'Devam Ediyor',
  tamamlandi: 'Tamamlandı',
  yakinda:    'Planlama',
  gecikmede:  'Gecikmede',
}
const STATUS_STYLE: Record<string, { bg: string; text: string; barColor: string; pct: string }> = {
  devam:      { bg: 'bg-success-50', text: 'text-success-700', barColor: '#0F6E56', pct: 'text-success-700' },
  tamamlandi: { bg: 'bg-info-50',    text: 'text-info-700',    barColor: '#155A9E', pct: 'text-info-700'    },
  yakinda:    { bg: 'bg-warning-50', text: 'text-warning-700', barColor: '#BA7517', pct: 'text-warning-700' },
  gecikmede:  { bg: 'bg-danger-50',  text: 'text-danger-700',  barColor: '#A32D2D', pct: 'text-danger-700'  },
}
const DURUM_OPTIONS = ['Tümü', 'Devam Ediyor', 'Gecikmede', 'Planlama', 'Tamamlandı']
const DURUM_KEY: Record<string, string> = {
  'Devam Ediyor': 'devam', 'Gecikmede': 'gecikmede', 'Planlama': 'yakinda', 'Tamamlandı': 'tamamlandi',
}
const SORT_OPTIONS = ['Varsayılan', 'A–Z', 'Z–A', 'İlerleme ↑', 'İlerleme ↓']
const PER_PAGE = 6

// ── Helpers ────────────────────────────────────────────────────────────────────
function fmt(d: string | null | undefined): string {
  if (!d) return '—'
  if (/^\d{4}$/.test(d)) return d
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
}
function st(status: string) { return STATUS_STYLE[status] ?? STATUS_STYLE['devam'] }

// ── Mini SVGs ──────────────────────────────────────────────────────────────────
const ChevRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="#A5A49C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
const ChevDown = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
    <path d="M6 9l6 6 6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
  </svg>
)
const PinIco = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#888780" />
  </svg>
)
const BldIco = ({ sz = 24 }: { sz?: number }) => (
  <svg width={sz} height={sz} viewBox="0 0 24 24" fill="none">
    <path d="M3 21V9l9-6 9 6v12H3z" stroke="#D3D1C7" strokeWidth="1.5" strokeLinejoin="round" />
    <rect x="9" y="14" width="2.5" height="4" rx="0.5" fill="#D3D1C7" />
    <rect x="12.5" y="14" width="2.5" height="4" rx="0.5" fill="#D3D1C7" />
  </svg>
)

// ── Mobile Card ────────────────────────────────────────────────────────────────
function MobileCard({ p }: { p: Project }) {
  const s   = st(p.status)
  const lbl = STATUS_LABEL[p.status] ?? p.status
  const loc = [p.district, p.city].filter(Boolean).join(' / ') || p.location
  const end = p.delivery_date || p.delivery_year

  return (
    <Link href={`/admin/proje/${p.slug}`}>
      <div className="bg-white rounded-2xl border border-neutral-100 p-4 flex gap-3 hover:shadow-md transition-shadow active:bg-neutral-50 cursor-pointer">
        {/* Görsel */}
        <div className="flex-shrink-0 w-[88px] h-[108px] rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center">
          {p.image_url
            ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" style={{ imageOrientation: 'from-image' }} />
            : <BldIco />}
        </div>

        {/* İçerik */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-sm text-primary-800 leading-snug line-clamp-2">{p.name}</h3>
            <span className={`flex-shrink-0 ${s.bg} ${s.text} text-[10px] font-bold px-2 py-0.5 rounded-lg`}>{lbl}</span>
          </div>
          <p className="flex items-center gap-1 text-xs text-neutral-500 mb-3"><PinIco />{loc}</p>

          {/* 3 stat */}
          <div className="grid grid-cols-3 gap-x-2">
            {[
              { l: 'Daire Sayısı', v: String(p.units_count ?? '—')  },
              { l: 'Bitiş Plan.',  v: fmt(end)                       },
              { l: 'İlerleme',     v: `%${p.progress ?? 0}`, c: true },
            ].map(({ l, v, c }) => (
              <div key={l}>
                <p className="text-[9px] text-neutral-400 leading-tight whitespace-nowrap">{l}</p>
                <p className={`font-bold text-[11px] mt-0.5 ${c ? s.pct : 'text-primary-800'}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center self-center ml-1"><ChevRight /></div>
      </div>
    </Link>
  )
}

// ── Desktop Table ──────────────────────────────────────────────────────────────
function DesktopTable({ projects }: { projects: Project[] }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-neutral-100 bg-neutral-50/60">
            {['Proje', 'Lokasyon', 'Daire Sayısı', 'Başlangıç', 'Bitiş Plan.', 'İlerleme', 'Durum', ''].map((col, i) => (
              <th key={i} className={`px-4 py-3.5 text-xs font-semibold text-neutral-500 whitespace-nowrap ${i === 2 ? 'text-center' : ''}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((p, idx) => {
            const s   = st(p.status)
            const lbl = STATUS_LABEL[p.status] ?? p.status
            const loc = [p.district, p.city].filter(Boolean).join(' / ') || p.location
            const end = p.delivery_date || p.delivery_year
            return (
              <tr key={p.id}
                className={`hover:bg-neutral-50/80 transition-colors cursor-pointer ${idx < projects.length - 1 ? 'border-b border-neutral-50' : ''}`}>

                {/* Proje */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 flex items-center justify-center">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" style={{ imageOrientation: 'from-image' }} />
                        : <BldIco sz={20} />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-primary-800 whitespace-nowrap">{p.name}</p>
                      <p className="flex items-center gap-1 text-xs text-neutral-500 mt-0.5"><PinIco />{loc}</p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3.5 text-sm text-neutral-600 whitespace-nowrap">{loc}</td>
                <td className="px-4 py-3.5 text-sm font-bold text-primary-800 text-center">{p.units_count ?? '—'}</td>
                <td className="px-4 py-3.5 text-sm text-neutral-600 whitespace-nowrap">{fmt(p.created_at)}</td>
                <td className="px-4 py-3.5 text-sm text-neutral-600 whitespace-nowrap">{fmt(end)}</td>

                {/* İlerleme */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5" style={{ minWidth: 110 }}>
                    <span className={`text-sm font-bold ${s.pct} w-9 text-right flex-shrink-0`}>%{p.progress ?? 0}</span>
                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.progress ?? 0}%`, backgroundColor: s.barColor }} />
                    </div>
                  </div>
                </td>

                {/* Durum */}
                <td className="px-4 py-3.5">
                  <span className={`${s.bg} ${s.text} text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap`}>{lbl}</span>
                </td>

                {/* Ok */}
                <td className="px-4 py-3.5">
                  <Link href={`/admin/proje/${p.slug}`} onClick={e => e.stopPropagation()}>
                    <div className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors">
                      <ChevRight />
                    </div>
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── Pagination ─────────────────────────────────────────────────────────────────
function Pager({ cur, total, set }: { cur: number; total: number; set: (n: number) => void }) {
  if (total <= 1) return null
  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button onClick={() => set(Math.max(1, cur - 1))} disabled={cur === 1}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-100 bg-white text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <button key={n} onClick={() => set(n)}
          className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-medium transition-colors ${n === cur
            ? 'bg-primary-800 text-white shadow-sm'
            : 'border border-neutral-100 bg-white text-neutral-600 hover:bg-neutral-50'}`}>
          {n}
        </button>
      ))}
      <button onClick={() => set(Math.min(total, cur + 1))} disabled={cur === total}
        className="w-9 h-9 flex items-center justify-center rounded-xl border border-neutral-100 bg-white text-neutral-500 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </button>
    </div>
  )
}

// ── Desktop filter dropdown ────────────────────────────────────────────────────
function FDrop({ icon, label, value, onChange, options, minW = 'min-w-[150px]' }: {
  icon: React.ReactNode; label: string; value: string
  onChange: (v: string) => void; options: string[]; minW?: string
}) {
  // Calculate indent based on label length + icon width
  const indent = 24 + label.length * 6.5 + 8
  return (
    <div className={`relative ${minW}`}>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
        {icon}
        <span className="text-[10px] text-neutral-400 whitespace-nowrap">{label}</span>
      </div>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-white border border-neutral-100 rounded-xl pr-8 py-2.5 text-sm text-primary-800 outline-none appearance-none cursor-pointer"
        style={{ paddingLeft: `${indent}px` }}>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"><ChevDown /></div>
    </div>
  )
}

// ── Mobile filter dropdown ─────────────────────────────────────────────────────
function MDrop({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]
}) {
  return (
    <div className="relative bg-white border border-neutral-100 rounded-xl overflow-hidden">
      <span className="pointer-events-none absolute left-3 top-[7px] text-[9px] text-neutral-400 z-10 select-none">{label}</span>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-transparent pl-3 pr-7 pt-[22px] pb-2 text-xs font-semibold text-primary-800 outline-none appearance-none cursor-pointer leading-none">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function AdminProjelerPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [search, setSearch]     = useState('')
  const [tab, setTab]           = useState<'devam' | 'tamamlanan'>('devam')
  const [durum, setDurum]       = useState('Tümü')
  const [lokasyon, setLokasyon] = useState('Tümü')
  const [sort, setSort]         = useState('Varsayılan')
  const [page, setPage]         = useState(1)

  useEffect(() => {
    supabase
      .from('projects')
      .select('id,name,slug,location,district,city,tip,status,units_count,progress,image_url,delivery_date,delivery_year,created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) setError(error.message)
        else setProjects(data || [])
        setLoading(false)
      })
  }, [])

  const devamList  = projects.filter(p => p.status !== 'tamamlandi')
  const tamList    = projects.filter(p => p.status === 'tamamlandi')
  const base       = tab === 'devam' ? devamList : tamList

  const lokOpts = useMemo(() => {
    const s = new Set<string>()
    projects.forEach(p => {
      const l = [p.district, p.city].filter(Boolean).join(' / ') || p.location
      if (l) s.add(l)
    })
    return ['Tümü', ...Array.from(s).sort()]
  }, [projects])

  const filtered = useMemo(() => {
    let r = base.filter(p => {
      const loc = [p.district, p.city].filter(Boolean).join(' / ') || p.location
      const q   = search.toLowerCase()
      return (
        (!search || p.name.toLowerCase().includes(q) || loc.toLowerCase().includes(q)) &&
        (durum    === 'Tümü' || p.status === (DURUM_KEY[durum] ?? durum)) &&
        (lokasyon === 'Tümü' || loc === lokasyon)
      )
    })
    if (sort === 'A–Z')        r = [...r].sort((a, b) => a.name.localeCompare(b.name, 'tr'))
    if (sort === 'Z–A')        r = [...r].sort((a, b) => b.name.localeCompare(a.name, 'tr'))
    if (sort === 'İlerleme ↑') r = [...r].sort((a, b) => (a.progress ?? 0) - (b.progress ?? 0))
    if (sort === 'İlerleme ↓') r = [...r].sort((a, b) => (b.progress ?? 0) - (a.progress ?? 0))
    return r
  }, [base, search, durum, lokasyon, sort])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paged      = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const go = (fn: (v: string) => void) => (v: string) => { fn(v); setPage(1) }
  const cycleSort = () => { setSort(SORT_OPTIONS[(SORT_OPTIONS.indexOf(sort) + 1) % SORT_OPTIONS.length]); setPage(1) }
  const sortActive = sort !== 'Varsayılan'

  // ── Shared icons for filter dropdowns ────────────────────────────────────
  const IcoFilter = <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
  const IcoPin    = <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#888780" /></svg>
  const IcoCal    = <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="17" rx="2" stroke="#888780" strokeWidth="1.8" /><path d="M3 9h18M8 2v4M16 2v4" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" /></svg>

  return (
    <div className="p-4 md:p-6">

      {/* ── Başlık ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-5 md:mb-6">
        <div>
          <h1 className="font-bold text-2xl md:text-[28px] text-primary-800 leading-tight">Projeler</h1>
          <p className="text-xs md:text-sm text-neutral-500 mt-1">
            Tüm projelerinizi görüntüleyebilir, detaylarına ulaşabilir ve yönetebilirsiniz.
          </p>
        </div>
        <button className="flex-shrink-0 flex items-center gap-2 bg-primary-800 text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-primary-700 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <span className="hidden sm:inline">Yeni Proje Ekle</span>
          <span className="sm:hidden">Ekle</span>
        </button>
      </div>

      {/* ── Filtreler — Desktop ─────────────────────────────────────────── */}
      <div className="hidden md:flex items-center gap-2.5 mb-5">
        {/* Arama */}
        <div className="flex-1 min-w-[180px] bg-white border border-neutral-100 rounded-xl px-3.5 flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#888780" strokeWidth="1.8" />
            <path d="M16.5 16.5l4 4" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Proje ara..."
            className="flex-1 py-2.5 text-sm text-primary-800 outline-none bg-transparent placeholder:text-neutral-400" />
        </div>

        <FDrop icon={IcoFilter} label="Durum"             value={durum}    onChange={go(setDurum)}    options={DURUM_OPTIONS} minW="min-w-[175px]" />
        <FDrop icon={IcoPin}    label="Lokasyon"          value={lokasyon} onChange={go(setLokasyon)} options={lokOpts}       minW="min-w-[170px]" />
        <FDrop icon={IcoCal}    label="Başlangıç Tarihi"  value="Tümü"     onChange={() => {}}         options={['Tümü']}     minW="min-w-[185px]" />
        <FDrop icon={IcoCal}    label="Bitiş Tarihi"      value="Tümü"     onChange={() => {}}         options={['Tümü']}     minW="min-w-[165px]" />

        {/* Sıralama */}
        <button onClick={cycleSort}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${sortActive ? 'bg-primary-50 border-primary-200 text-primary-800' : 'bg-white border-neutral-100 text-neutral-600 hover:bg-neutral-50'}`}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {sortActive ? sort : 'Sıralama'}
        </button>
      </div>

      {/* ── Filtreler — Mobil ───────────────────────────────────────────── */}
      <div className="md:hidden space-y-2.5 mb-5">
        {/* Satır 1: Arama */}
        <div className="bg-white border border-neutral-100 rounded-xl px-3.5 flex items-center gap-2">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#888780" strokeWidth="1.8" />
            <path d="M16.5 16.5l4 4" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="Proje ara..."
            className="flex-1 py-3 text-sm text-primary-800 outline-none bg-transparent placeholder:text-neutral-400" />
        </div>

        {/* Satır 2: Durum + Lokasyon */}
        <div className="grid grid-cols-2 gap-2.5">
          <MDrop label="Durum"    value={durum}    onChange={go(setDurum)}    options={DURUM_OPTIONS} />
          <MDrop label="Lokasyon" value={lokasyon} onChange={go(setLokasyon)} options={lokOpts} />
        </div>

        {/* Satır 3: Başlangıç + Bitiş + Sıralama */}
        <div className="grid grid-cols-[1fr_1fr_auto] gap-2.5">
          <MDrop label="Başlangıç Tarihi" value="Tümü" onChange={() => {}} options={['Tümü']} />
          <MDrop label="Bitiş Tarihi"     value="Tümü" onChange={() => {}} options={['Tümü']} />
          <button onClick={cycleSort}
            className={`flex items-center gap-1.5 px-3.5 rounded-xl border text-xs font-semibold whitespace-nowrap transition-colors self-stretch ${sortActive ? 'bg-primary-50 border-primary-200 text-primary-800' : 'bg-white border-neutral-100 text-neutral-600'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Sıralama
          </button>
        </div>
      </div>

      {/* ── Tab'lar ─────────────────────────────────────────────────────── */}
      <div className="flex border-b border-neutral-100 mb-5">
        {([
          { key: 'devam',      label: `Devam Eden Projeler (${devamList.length})`  },
          { key: 'tamamlanan', label: `Tamamlanan Projeler (${tamList.length})` },
        ] as const).map(({ key, label }) => (
          <button key={key} onClick={() => { setTab(key); setPage(1) }}
            className={`px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${tab === key
              ? 'border-primary-800 text-primary-800'
              : 'border-transparent text-neutral-500 hover:text-primary-700'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* ── İçerik ──────────────────────────────────────────────────────── */}

      {/* Yükleniyor */}
      {loading && (
        <>
          <div className="md:hidden space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-4 flex gap-3 animate-pulse">
                <div className="w-[88px] h-[108px] rounded-xl bg-neutral-100 flex-shrink-0" />
                <div className="flex-1 space-y-2.5 py-1">
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  <div className="h-8 bg-neutral-100 rounded" />
                </div>
              </div>
            ))}
          </div>
          <div className="hidden md:block bg-white rounded-2xl border border-neutral-100 overflow-hidden">
            <div className="h-12 bg-neutral-50 border-b border-neutral-100 animate-pulse" />
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-[68px] flex items-center gap-4 px-4 border-b border-neutral-50 last:border-b-0 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 flex-shrink-0" />
                <div className="flex-1 h-4 bg-neutral-100 rounded" />
                <div className="w-28 h-4 bg-neutral-100 rounded" />
                <div className="w-20 h-3 bg-neutral-100 rounded" />
              </div>
            ))}
          </div>
        </>
      )}

      {/* Hata */}
      {error && (
        <div className="bg-danger-50 border border-danger-100 rounded-xl p-4 text-danger-700 text-sm">{error}</div>
      )}

      {/* Boş durum */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center py-20">
          <BldIco sz={48} />
          <p className="text-neutral-400 font-medium mt-3">Proje bulunamadı</p>
          {(search || durum !== 'Tümü' || lokasyon !== 'Tümü') && (
            <button onClick={() => { setSearch(''); setDurum('Tümü'); setLokasyon('Tümü'); setPage(1) }}
              className="mt-3 text-sm text-primary-800 underline underline-offset-2">
              Filtreleri temizle
            </button>
          )}
        </div>
      )}

      {/* Veriler */}
      {!loading && !error && paged.length > 0 && (
        <>
          {/* Mobil: kart listesi */}
          <div className="md:hidden space-y-3">
            {paged.map(p => <MobileCard key={p.id} p={p} />)}
          </div>
          {/* Desktop: tablo */}
          <div className="hidden md:block">
            <DesktopTable projects={paged} />
          </div>
          {/* Sayfalama */}
          <Pager cur={page} total={totalPages} set={setPage} />
        </>
      )}
    </div>
  )
}
