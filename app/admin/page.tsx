'use client'

import Link from 'next/link'

// --- helpers ---
function formatTL(amount: number) {
  return amount.toLocaleString('tr-TR') + ' ₺'
}
function formatCompactTL(amount: number) {
  if (amount >= 1_000_000) return `₺${(amount / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (amount >= 1_000) return `₺${Math.round(amount / 1_000)}K`
  return `₺${amount}`
}
function todayLabel() {
  return new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// --- mock data (Supabase'e taşınacak) ---
const SUMMARY = {
  sozlesmeBedeli: 27_150_000,
  tahsilEdilen: 18_430_000,
  tahsilEdilecek: 8_720_000,
  projemaliyeti: 15_850_000,
  toplamProje: 22,
  devamEden: 4,
  receivablePercent: 68,
  remainingPercent: 32,
}

const PROJECTS = [
  { id: 'ap1', name: 'Kemal Apartman', location: 'Avcılar / İstanbul', status: 'Devam Ediyor', progress: 72, endDate: 'Nis 2026' },
  { id: 'ap2', name: 'Gülbahçe Apartmanı', location: 'Beylikdüzü / İstanbul', status: 'Devam Ediyor', progress: 58, endDate: 'Haz 2026' },
  { id: 'ap3', name: 'Doğa Rezidans', location: 'Başakşehir / İstanbul', status: 'Gecikmede', progress: 45, endDate: 'Oca 2026' },
  { id: 'ap4', name: 'Yazgan Konutları', location: 'Esenyurt / İstanbul', status: 'Devam Ediyor', progress: 83, endDate: 'Mar 2026' },
]

const DUE_OWNERS = [
  { id: 'd1', name: 'Emre Dağ', project: 'Kemal Apartman', unit: 'Daire 21', amount: 180_000, status: 'Geçmiş', days: '5 gün geçti' },
  { id: 'd2', name: 'Mehmet Kaya', project: 'Kemal Apartman', unit: 'Daire 23', amount: 95_000, status: 'Geçmiş', days: '8 gün geçti' },
  { id: 'd3', name: 'Ayşe Demir', project: 'Gülbahçe Apartmanı', unit: 'Daire 14', amount: 125_000, status: 'Yaklaşıyor', days: '2 gün kaldı' },
  { id: 'd4', name: 'Fatma Şahin', project: 'Doğa Rezidans', unit: 'Daire 17', amount: 80_000, status: 'Yaklaşıyor', days: '4 gün kaldı' },
]

const STATUS_STYLE: Record<string, { bg: string; text: string; bar: string }> = {
  'Devam Ediyor': { bg: 'bg-success-50', text: 'text-success-700', bar: '#0F6E56' },
  'Gecikmede':    { bg: 'bg-danger-50',  text: 'text-danger-700',  bar: '#A32D2D' },
  'Tamamlandı':   { bg: 'bg-info-50',    text: 'text-info-700',    bar: '#185FA5' },
  'Planlama':     { bg: 'bg-warning-50', text: 'text-warning-700', bar: '#BA7517' },
}

// --- MetricCard ---
function MetricCard({
  label, value, subtitle, variant, href,
}: {
  label: string; value: string; subtitle: string; variant: 'info' | 'success' | 'warning' | 'danger'; href: string
}) {
  const colors = {
    info:    { bg: 'bg-info-50',    text: 'text-info-600',    icon: '#185FA5' },
    success: { bg: 'bg-success-50', text: 'text-success-700', icon: '#0F6E56' },
    warning: { bg: 'bg-warning-50', text: 'text-warning-700', icon: '#BA7517' },
    danger:  { bg: 'bg-danger-50',  text: 'text-danger-700',  icon: '#A32D2D' },
  }[variant]
  return (
    <Link href={href} className="bg-white rounded-2xl border border-neutral-100 p-4 hover:shadow-sm transition-shadow flex-1 min-w-0">
      <div className={`w-9 h-9 ${colors.bg} rounded-xl flex items-center justify-center mb-3`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" stroke={colors.icon} strokeWidth="1.8" />
          <path d="M2 10h20" stroke={colors.icon} strokeWidth="1.8" />
          <rect x="5" y="13" width="4" height="2" rx="0.5" fill={colors.icon} />
        </svg>
      </div>
      <p className="text-xs text-neutral-500 font-medium mb-1">{label}</p>
      <p className="font-bold text-xl text-primary-800">{value}</p>
      <p className={`text-xs font-medium mt-1 ${colors.text}`}>{subtitle}</p>
    </Link>
  )
}

// --- DonutChart (SVG) ---
function DonutChart({ percent, value, label }: { percent: number; value: string; label: string }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const dash = (percent / 100) * circ
  return (
    <div className="relative w-32 h-32 flex-shrink-0">
      <svg width="128" height="128" viewBox="0 0 128 128">
        <circle cx="64" cy="64" r={r} fill="none" stroke="#EDECE8" strokeWidth="18" />
        <circle
          cx="64" cy="64" r={r} fill="none"
          stroke="#0A1F44" strokeWidth="18"
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeDashoffset={circ / 4}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-bold text-sm text-primary-800">{value}</span>
        <span className="text-[9px] text-neutral-500 text-center px-2 leading-tight">{label}</span>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const pendingDue = DUE_OWNERS.filter((o) => o.status === 'Geçmiş')
  const pendingTotal = pendingDue.reduce((s, o) => s + o.amount, 0)

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-primary-800">Hoş geldiniz, Emre Dağ</h1>
          <p className="text-sm text-neutral-500 mt-1">{todayLabel()}</p>
        </div>
        {pendingDue.length > 0 && (
          <Link
            href="/admin/vade-takibi"
            className="flex items-center gap-3 bg-danger-50 border border-danger-100 rounded-xl px-4 py-3 hover:bg-danger-100 transition-colors"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#A32D2D" strokeWidth="2" />
                <path d="M12 8v4M12 16h.01" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm text-danger-700">{pendingDue.length} vadesi geçmiş ödeme</p>
              <p className="text-xs text-danger-600">Toplam {formatTL(pendingTotal)}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="ml-2">
              <path d="M9 18l6-6-6-6" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        )}
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <MetricCard label="Sözleşme Bedeli" value={formatCompactTL(SUMMARY.sozlesmeBedeli)} subtitle={`${SUMMARY.toplamProje} proje toplamı`} variant="info" href="/admin/odemeler" />
        <MetricCard label="Tahsil Edilecek"  value={formatCompactTL(SUMMARY.tahsilEdilecek)} subtitle={`%${SUMMARY.remainingPercent} kalan`} variant="warning" href="/admin/odemeler" />
        <MetricCard label="Tahsil Edilen"    value={formatCompactTL(SUMMARY.tahsilEdilen)} subtitle={`%${SUMMARY.receivablePercent} tamamlandı`} variant="success" href="/admin/odemeler" />
        <MetricCard label="Proje Maliyeti"   value={formatCompactTL(SUMMARY.projemaliyeti)} subtitle={`${SUMMARY.devamEden} aktif proje`} variant="danger" href="/admin/odemeler" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol kolon: Projeler + Vade */}
        <div className="lg:col-span-2 space-y-4">
          {/* Projelerim */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-primary-800">Devam Eden Projeler</h2>
              <Link href="/admin/projeler" className="flex items-center gap-1 text-info-600 text-sm font-medium hover:underline">
                Tümünü gör
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
            <div className="space-y-3">
              {PROJECTS.map((p) => {
                const s = STATUS_STYLE[p.status] ?? STATUS_STYLE['Devam Ediyor']
                return (
                  <Link key={p.id} href="/admin/projeler" className="flex items-center gap-4 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 rounded-xl px-2 -mx-2 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-primary-800 truncate">{p.name}</span>
                        <span className={`${s.bg} ${s.text} text-[10px] font-medium px-2 py-0.5 rounded-lg flex-shrink-0`}>{p.status}</span>
                      </div>
                      <p className="text-xs text-neutral-500 mb-2">{p.location}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: s.bar }} />
                        </div>
                        <span className="text-xs font-bold text-primary-800 flex-shrink-0">%{p.progress}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-neutral-500">Bitiş</p>
                      <p className="font-bold text-sm text-primary-800">{p.endDate}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Vadesi Yaklaşan */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-primary-800">Vade Takibi</h2>
              <Link href="/admin/vade-takibi" className="flex items-center gap-1 text-info-600 text-sm font-medium hover:underline">
                Tümünü gör
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18l6-6-6-6" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Link>
            </div>
            <div className="space-y-0">
              {DUE_OWNERS.map((o, i) => {
                const isLate = o.status === 'Geçmiş'
                return (
                  <div key={o.id} className={`flex items-center gap-3 py-3 ${i < DUE_OWNERS.length - 1 ? 'border-b border-neutral-50' : ''}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isLate ? 'bg-danger-50' : 'bg-warning-50'}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke={isLate ? '#A32D2D' : '#BA7517'} strokeWidth="1.8" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={isLate ? '#A32D2D' : '#BA7517'} strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-primary-800">{o.name}</p>
                      <p className="text-xs text-neutral-500">{o.project} · {o.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-primary-800">{formatTL(o.amount)}</p>
                      <p className={`text-[11px] font-medium ${isLate ? 'text-danger-700' : 'text-warning-700'}`}>{o.days}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sağ kolon: Tahsilat özeti + Hızlı işlemler */}
        <div className="space-y-4">
          {/* Tahsilat Özeti */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h2 className="font-bold text-base text-primary-800 mb-4">Tahsilat Özeti</h2>
            <div className="flex items-center gap-4">
              <DonutChart percent={SUMMARY.receivablePercent} value={formatCompactTL(SUMMARY.sozlesmeBedeli)} label="Toplam Tahsilat" />
              <div className="flex-1">
                <p className="text-xs text-neutral-500">Tahsil Edilen</p>
                <div className="flex items-baseline gap-1 mt-0.5 mb-3">
                  <p className="font-bold text-sm text-primary-800">{formatTL(SUMMARY.tahsilEdilen)}</p>
                  <p className="text-xs font-medium text-success-700">%{SUMMARY.receivablePercent}</p>
                </div>
                <p className="text-xs text-neutral-500">Tahsil Edilecek</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <p className="font-bold text-sm text-primary-800">{formatTL(SUMMARY.tahsilEdilecek)}</p>
                  <p className="text-xs font-medium text-neutral-500">%{SUMMARY.remainingPercent}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hızlı İşlemler */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h2 className="font-bold text-base text-primary-800 mb-4">Hızlı İşlemler</h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Proje Ekle',   bg: 'bg-info-50',    icon: '#185FA5', href: '/admin/projeler' },
                { label: 'Evrak Ekle',   bg: 'bg-warning-50', icon: '#BA7517', href: '/admin/evraklar' },
                { label: 'Vade Gör',     bg: 'bg-danger-50',  icon: '#A32D2D', href: '/admin/vade-takibi' },
                { label: 'Finansal',     bg: 'bg-success-50', icon: '#0F6E56', href: '/admin/odemeler' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="bg-neutral-50 hover:bg-neutral-100 rounded-xl p-3 flex flex-col items-center gap-2 transition-colors"
                >
                  <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 21V9l9-6 9 6v12H3z" stroke={item.icon} strokeWidth="1.8" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-primary-800 text-center">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Özet İstatistik */}
          <div className="bg-primary-800 rounded-2xl p-5 text-white">
            <p className="text-xs font-medium text-primary-100 mb-1">Toplam Proje</p>
            <p className="font-bold text-3xl mb-3">{SUMMARY.toplamProje}</p>
            <div className="flex gap-4">
              <div>
                <p className="text-[11px] text-primary-100">Devam Eden</p>
                <p className="font-bold text-lg">{SUMMARY.devamEden}</p>
              </div>
              <div>
                <p className="text-[11px] text-primary-100">Tamamlanan</p>
                <p className="font-bold text-lg">{SUMMARY.toplamProje - SUMMARY.devamEden}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
