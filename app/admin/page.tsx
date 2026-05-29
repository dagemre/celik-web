'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ── Types ─────────────────────────────────────────────
type ProjectRow = {
  id: string
  slug: string
  name: string
  location: string | null
  district: string | null
  city: string | null
  status: string
  image_url: string | null
}

type PaymentRow = {
  project_id: string
  amount: number
  status: string
}

type DueOwnerRow = {
  id: string
  amount: number
  due_date: string
  status: string
  owners: { full_name: string } | null
  projects: { name: string; slug: string } | null
  units: { unit_no: string } | null
}

// ── Helpers ───────────────────────────────────────────
function formatTL(n: number) {
  return n.toLocaleString('tr-TR') + ' TL'
}
function formatCompact(n: number) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (n >= 1_000) return `₺${Math.round(n / 1_000)}K`
  return `₺${n}`
}
function projectLocation(p: ProjectRow) {
  if (p.district) return `${p.district} / ${p.city ?? 'İstanbul'}`
  return p.location ?? p.city ?? 'İstanbul'
}
function statusLabel(s: string) {
  if (s === 'devam')      return 'Devam Ediyor'
  if (s === 'tamamlandi') return 'Tamamlandı'
  return 'Planlama'
}
function daysDiff(dateStr: string) {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const due   = new Date(dateStr)
  const diff  = Math.round((due.getTime() - today.getTime()) / 86_400_000)
  if (diff < 0)  return { label: `${Math.abs(diff)} gün geçti`, isLate: true }
  if (diff === 0) return { label: 'Bugün!', isLate: true }
  return { label: `${diff} gün kaldı`, isLate: false }
}

// ── Status badge styles ───────────────────────────────
const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'Devam Ediyor': { bg: 'bg-success-50',  text: 'text-success-700' },
  'Tamamlandı':   { bg: 'bg-info-50',     text: 'text-info-700' },
  'Planlama':     { bg: 'bg-warning-50',  text: 'text-warning-700' },
}

const QUICK_ACTIONS = [
  { label: 'Tahsilat Ekle', href: '/admin/odemeler/yeni',  bg: 'bg-success-50', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#0F6E56" strokeWidth="1.8"/><path d="M2 10h20M12 14v-2m0 0v-2m0 2h-2m2 0h2" stroke="#0F6E56" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { label: 'Proje Ekle',    href: '/admin/projeler/yeni',  bg: 'bg-info-50',    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="#185FA5" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="#185FA5" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="#185FA5" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="#185FA5" strokeWidth="1.8"/></svg> },
  { label: 'Malik Ekle',    href: '/admin/kisiler/yeni',   bg: 'bg-purple-50',  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#7C3AED" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { label: 'Evrak Yükle',   href: '/admin/evraklar/yeni',  bg: 'bg-warning-50', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#BA7517" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 2v6h6M12 12v6M9 15l3-3 3 3" stroke="#BA7517" strokeWidth="1.8" strokeLinecap="round"/></svg> },
]

// ── Donut Chart ───────────────────────────────────────
function DonutChart({ tahsilatPct, kalanPct, sozlesmeBedeli, tahsilEdilen, tahsilEdilecek }: {
  tahsilatPct: number; kalanPct: number
  sozlesmeBedeli: number; tahsilEdilen: number; tahsilEdilecek: number
}) {
  const r = 68
  const circ = 2 * Math.PI * r
  const greenDash = (tahsilatPct / 100) * circ
  const navyDash  = (kalanPct   / 100) * circ
  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={r} fill="none" stroke="#0A1F44" strokeWidth="20"
            strokeDasharray={`${navyDash} ${circ - navyDash}`}
            strokeDashoffset={circ / 4 - greenDash}
          />
          <circle cx="80" cy="80" r={r} fill="none" stroke="#22C55E" strokeWidth="20"
            strokeDasharray={`${greenDash} ${circ - greenDash}`}
            strokeDashoffset={circ / 4}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-base text-primary-800">{formatCompact(sozlesmeBedeli)}</span>
          <span className="text-[10px] text-neutral-500 text-center leading-tight px-2">Toplam Tahsilat</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-neutral-500">Tahsil Edilen</p>
        <div className="flex items-baseline gap-2 mt-0.5 mb-4">
          <span className="font-bold text-sm text-primary-800">{formatTL(tahsilEdilen)}</span>
          <span className="text-xs font-bold text-success-700">%{tahsilatPct.toFixed(1)}</span>
        </div>
        <p className="text-xs text-neutral-500">Tahsil Edilecek</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-bold text-sm text-primary-800">{formatTL(tahsilEdilecek)}</span>
          <span className="text-xs font-bold text-neutral-500">%{kalanPct.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}

// ── Metric Card ───────────────────────────────────────
function MetricCard({ label, value, sub, subColor, iconBg, icon, href }: {
  label: string; value: string; sub: string; subColor: string
  iconBg: string; icon: React.ReactNode; href: string
}) {
  return (
    <Link href={href} className="bg-white rounded-2xl border border-neutral-100 p-4 hover:shadow-sm transition-shadow flex-1 min-w-0 block">
      <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-xs text-neutral-500 mb-1">{label}</p>
      <p className="font-bold text-2xl text-primary-800 leading-tight">{value}</p>
      <p className={`text-xs font-medium mt-1.5 ${subColor}`}>{sub}</p>
    </Link>
  )
}

// ── Icons ─────────────────────────────────────────────
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)
function SeeAll({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-1 text-info-600 text-sm font-medium hover:opacity-80">
      Tümünü gör
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M9 18l6-6-6-6" stroke="#185FA5" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </Link>
  )
}

// ── Skeleton ──────────────────────────────────────────
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-neutral-50 animate-pulse">
      <div className="w-12 h-12 rounded-xl bg-neutral-100 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-neutral-100 rounded w-2/3" />
        <div className="h-2.5 bg-neutral-100 rounded w-1/3" />
      </div>
      <div className="w-20 h-3 bg-neutral-100 rounded" />
    </div>
  )
}

// ════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [projects,   setProjects]   = useState<ProjectRow[]>([])
  const [payments,   setPayments]   = useState<PaymentRow[]>([])
  const [dueOwners,  setDueOwners]  = useState<DueOwnerRow[]>([])
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    async function fetchAll() {
      const sevenDaysLater = new Date()
      sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)
      const sevenDaysBefore = new Date()
      sevenDaysBefore.setDate(sevenDaysBefore.getDate() - 30) // 30 gün öncesine kadar gecikmiş ödemeleri göster

      const [projRes, payRes, dueRes] = await Promise.all([
        supabase
          .from('projects')
          .select('id, slug, name, location, district, city, status, image_url')
          .order('status', { ascending: true }),

        supabase
          .from('payments')
          .select('project_id, amount, status'),

        supabase
          .from('payments')
          .select('id, amount, due_date, status, owners(full_name), projects(name, slug), units(unit_no)')
          .neq('status', 'odendi')
          .gte('due_date', sevenDaysBefore.toISOString().split('T')[0])
          .lte('due_date', sevenDaysLater.toISOString().split('T')[0])
          .order('due_date', { ascending: true })
          .limit(5),
      ])

      if (projRes.data) setProjects(projRes.data)
      if (payRes.data)  setPayments(payRes.data)
      if (dueRes.data)  setDueOwners(dueRes.data as unknown as DueOwnerRow[])
      setLoading(false)
    }
    fetchAll()
  }, [])

  // ── Hesaplamalar ──────────────────────────────────────
  const tahsilEdilen   = payments.filter(p => p.status === 'odendi').reduce((s, p) => s + (p.amount ?? 0), 0)
  const sozlesmeBedeli = payments.reduce((s, p) => s + (p.amount ?? 0), 0)
  const tahsilEdilecek = sozlesmeBedeli - tahsilEdilen
  const tahsilatPct    = sozlesmeBedeli > 0 ? (tahsilEdilen / sozlesmeBedeli) * 100 : 0
  const kalanPct       = 100 - tahsilatPct
  const toplamProje    = projects.length
  const aktifProje     = projects.filter(p => p.status === 'devam').length

  // Proje başına tahsilat/toplam haritası
  const paymentMap = payments.reduce<Record<string, { tahsilat: number; toplam: number }>>((acc, p) => {
    if (!p.project_id) return acc
    if (!acc[p.project_id]) acc[p.project_id] = { tahsilat: 0, toplam: 0 }
    acc[p.project_id].toplam += p.amount ?? 0
    if (p.status === 'odendi') acc[p.project_id].tahsilat += p.amount ?? 0
    return acc
  }, {})

  // Devam eden projeler önce, sonra diğerleri — ilk 5
  const sortedProjects = [
    ...projects.filter(p => p.status === 'devam'),
    ...projects.filter(p => p.status !== 'devam'),
  ].slice(0, 5)

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">

      {/* Mobil selamlama */}
      <div className="md:hidden mb-4">
        <h1 className="font-bold text-xl text-primary-800">Hoş geldiniz, Emre Dağ</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          {aktifProje > 0 ? `${aktifProje} aktif proje devam ediyor.` : 'Tüm projeler listeleniyor.'}
        </p>
      </div>

      {/* ── 4 Metric cards ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MetricCard
          label="Sözleşme Bedeli"
          value={formatCompact(sozlesmeBedeli)}
          sub={`${toplamProje} proje toplamı`}
          subColor="text-info-600"
          iconBg="bg-info-50"
          href="/admin/odemeler"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#185FA5" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 2v6h6M8 13h8M8 17h5" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round"/></svg>}
        />
        <MetricCard
          label="Tahsil Edilecek"
          value={formatCompact(tahsilEdilecek)}
          sub={`%${kalanPct.toFixed(1)} kalan`}
          subColor="text-warning-700"
          iconBg="bg-warning-50"
          href="/admin/odemeler"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#BA7517" strokeWidth="1.8"/><path d="M2 10h20" stroke="#BA7517" strokeWidth="1.8"/><circle cx="12" cy="15" r="2" fill="#BA7517"/></svg>}
        />
        <MetricCard
          label="Tahsil Edilen"
          value={formatCompact(tahsilEdilen)}
          sub={`%${tahsilatPct.toFixed(1)} tamamlandı`}
          subColor="text-success-700"
          iconBg="bg-success-50"
          href="/admin/odemeler"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#0F6E56" strokeWidth="1.8"/><path d="M2 10h20" stroke="#0F6E56" strokeWidth="1.8"/><path d="M6 15l3 2 5-5" stroke="#0F6E56" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
        <MetricCard
          label="Aktif Proje"
          value={String(aktifProje)}
          sub={`${toplamProje} projeden`}
          subColor="text-danger-700"
          iconBg="bg-danger-50"
          href="/admin/projeler"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="#A32D2D" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="#A32D2D" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="#A32D2D" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="#A32D2D" strokeWidth="1.8"/></svg>}
        />
      </div>

      {/* ── 2 kolon layout ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 md:gap-5">

        {/* ── Sol kolon ──────────────────────────── */}
        <div className="space-y-4">

          {/* Projelerim */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-primary-800">Projelerim</h2>
              <SeeAll href="/admin/projeler" />
            </div>
            <div className="space-y-0">
              {loading ? (
                [1,2,3].map(i => <SkeletonRow key={i} />)
              ) : sortedProjects.length === 0 ? (
                <p className="text-sm text-neutral-400 py-6 text-center">Henüz proje eklenmemiş.</p>
              ) : (
                sortedProjects.map((p, i) => {
                  const label = statusLabel(p.status)
                  const s     = STATUS_STYLE[label] ?? { bg: 'bg-neutral-100', text: 'text-neutral-600' }
                  const pmt   = paymentMap[p.id] ?? { tahsilat: 0, toplam: 0 }
                  const loc   = projectLocation(p)
                  return (
                    <Link
                      key={p.id}
                      href={`/admin/proje/${p.slug}`}
                      className={`flex items-center gap-3 py-3 hover:bg-neutral-50 rounded-xl px-1 -mx-1 transition-colors ${i < sortedProjects.length - 1 ? 'border-b border-neutral-50' : ''}`}
                    >
                      {/* Thumbnail */}
                      <img
                        src={p.image_url ?? '/placeholder.jpg'}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        style={{ imageOrientation: 'from-image' }}
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=80' }}
                      />
                      {/* Name + location */}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-primary-800 truncate">{p.name}</p>
                        <p className="text-xs text-neutral-500 mt-0.5 truncate">{loc}</p>
                      </div>
                      {/* Amount */}
                      <div className="text-right flex-shrink-0 mr-2">
                        {pmt.toplam > 0 ? (
                          <>
                            <p className="font-bold text-sm text-primary-800">{formatTL(pmt.tahsilat)}</p>
                            <p className="text-[11px] text-neutral-400">/ {formatTL(pmt.toplam)}</p>
                          </>
                        ) : (
                          <p className="text-[11px] text-neutral-300 italic">Ödeme yok</p>
                        )}
                      </div>
                      {/* Badge */}
                      <span className={`${s.bg} ${s.text} text-[10px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 whitespace-nowrap`}>
                        {label}
                      </span>
                      <ArrowRight />
                    </Link>
                  )
                })
              )}
            </div>
            <Link
              href="/admin/projeler"
              className="mt-4 flex items-center justify-center gap-2 border border-neutral-100 rounded-xl py-3 text-sm font-medium text-primary-800 hover:bg-neutral-50 transition-colors"
            >
              Tüm Projeleri Gör
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="#0A1F44" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </Link>
          </div>

          {/* Hızlı İşlemler */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h2 className="font-bold text-base text-primary-800 mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-2 bg-neutral-50 hover:bg-neutral-100 rounded-2xl p-4 transition-colors"
                >
                  <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center`}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-medium text-primary-800 text-center leading-tight">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sağ kolon ──────────────────────────── */}
        <div className="space-y-4">

          {/* Ödemesi Yaklaşan Malikler */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-primary-800">Ödemesi Yaklaşan Malikler</h2>
              <SeeAll href="/admin/vade-takibi" />
            </div>
            <div className="space-y-0">
              {loading ? (
                [1,2].map(i => <SkeletonRow key={i} />)
              ) : dueOwners.length === 0 ? (
                <div className="py-8 text-center">
                  <svg className="mx-auto mb-2" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#D3D1C7" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3" strokeLinecap="round"/>
                  </svg>
                  <p className="text-sm text-neutral-400">Yaklaşan vade yok</p>
                </div>
              ) : (
                dueOwners.map((o, i) => {
                  const { label, isLate } = daysDiff(o.due_date)
                  return (
                    <div
                      key={o.id}
                      className={`flex items-center gap-3 py-3 ${i < dueOwners.length - 1 ? 'border-b border-neutral-50' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isLate ? 'bg-danger-50' : 'bg-warning-50'}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="8" r="4" stroke={isLate ? '#A32D2D' : '#BA7517'} strokeWidth="1.8"/>
                          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={isLate ? '#A32D2D' : '#BA7517'} strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-primary-800">{o.owners?.full_name ?? 'İsimsiz'}</p>
                        <p className="text-[11px] text-neutral-500 mt-0.5 truncate">
                          {o.projects?.name ?? '—'}{o.units?.unit_no ? ` · ${o.units.unit_no}` : ''}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-sm text-primary-800">{formatTL(o.amount)}</p>
                        <p className={`text-[11px] font-medium mt-0.5 ${isLate ? 'text-danger-700' : 'text-warning-700'}`}>{label}</p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Tahsilat Özeti */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h2 className="font-bold text-base text-primary-800 mb-4">Tahsilat Özeti</h2>
            <DonutChart
              tahsilatPct={tahsilatPct}
              kalanPct={kalanPct}
              sozlesmeBedeli={sozlesmeBedeli}
              tahsilEdilen={tahsilEdilen}
              tahsilEdilecek={tahsilEdilecek}
            />
          </div>

        </div>
      </div>
    </div>
  )
}
