'use client'

import Link from 'next/link'

// ── Helpers ──────────────────────────────────────────
function formatTL(n: number) {
  return n.toLocaleString('tr-TR') + ' TL'
}
function formatCompact(n: number) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (n >= 1_000) return `₺${Math.round(n / 1_000)}K`
  return `₺${n}`
}

// ── Mock data ─────────────────────────────────────────
const SUMMARY = {
  sozlesmeBedeli: 88_000_000,
  tahsilEdilecek: 24_800_000,
  tahsilEdilen:   63_250_000,
  projeMaliyeti:  15_800_000,
  toplamProje:    8,
  aktifProje:     6,
  tahsilatPct:    71.8,
  kalanPct:       28.2,
}

const PROJECTS = [
  { id: 'p1', name: 'Mutlu Apartman',      location: 'Avcılar / İstanbul',     tahsilat: 3_250_000, toplam: 4_750_000, status: 'Devam Ediyor', img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=120&q=80' },
  { id: 'p2', name: 'Pancarlı Sokak',      location: 'Bahçelievler / İstanbul', tahsilat: 4_100_000, toplam: 7_500_000, status: 'İnce İşçilik', img: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=120&q=80' },
  { id: 'p3', name: 'Bursalı Tahir Bey Sk.', location: 'Bahçelievler / İstanbul', tahsilat: 1_800_000, toplam: 5_500_000, status: 'Altyapı',      img: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=120&q=80' },
  { id: 'p4', name: 'Gülbahçe Konutları',  location: 'Gülbahçe / İstanbul',    tahsilat: 2_750_000, toplam: 6_000_000, status: 'Elektrik',    img: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=120&q=80' },
]

const DUE_OWNERS = [
  { id: 'd1', name: 'Emre Dağ',    project: 'Kemal Apartmanı',    unit: 'Daire 21', amount: 180_000, status: 'Geçmiş',    days: '5 gün geçti' },
  { id: 'd2', name: 'Mehmet Kaya', project: 'Kemal Apartmanı',    unit: 'Daire 23', amount: 95_000,  status: 'Geçmiş',    days: '8 gün geçti' },
  { id: 'd3', name: 'Ayşe Demir',  project: 'Gülbahçe Apartmanı', unit: 'Daire 14', amount: 125_000, status: 'Yaklaşıyor', days: '2 gün kaldı' },
  { id: 'd4', name: 'Fatma Şahin', project: 'Doğa Rezidans',      unit: 'Daire 17', amount: 80_000,  status: 'Yaklaşıyor', days: '4 gün kaldı' },
]

const QUICK_ACTIONS = [
  { label: 'Tahsilat Ekle', bg: 'bg-success-50', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#0F6E56" strokeWidth="1.8"/><path d="M2 10h20M12 14v-2m0 0v-2m0 2h-2m2 0h2" stroke="#0F6E56" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { label: 'Proje Ekle',    bg: 'bg-info-50',    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="#185FA5" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="#185FA5" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="#185FA5" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="#185FA5" strokeWidth="1.8"/></svg> },
  { label: 'Malik Ekle',   bg: 'bg-purple-50',  icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#7C3AED" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#7C3AED" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { label: 'Evrak Yükle',  bg: 'bg-warning-50', icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#BA7517" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 2v6h6M12 12v6M9 15l3-3 3 3" stroke="#BA7517" strokeWidth="1.8" strokeLinecap="round"/></svg> },
]

// ── Status badge styles ───────────────────────────────
const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  'Devam Ediyor': { bg: 'bg-success-50', text: 'text-success-700' },
  'Gecikmede':    { bg: 'bg-danger-50',  text: 'text-danger-700' },
  'Tamamlandı':   { bg: 'bg-info-50',    text: 'text-info-700' },
  'Planlama':     { bg: 'bg-warning-50', text: 'text-warning-700' },
  'İnce İşçilik': { bg: 'bg-warning-50', text: 'text-warning-700' },
  'Altyapı':      { bg: 'bg-info-50',    text: 'text-info-700' },
  'Elektrik':     { bg: 'bg-neutral-100', text: 'text-neutral-600' },
}

// ── Donut Chart ───────────────────────────────────────
function DonutChart() {
  const r = 68
  const circ = 2 * Math.PI * r
  const greenDash = (SUMMARY.tahsilatPct / 100) * circ
  const navyDash  = (SUMMARY.kalanPct   / 100) * circ
  return (
    <div className="flex items-center gap-5">
      <div className="relative flex-shrink-0" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          {/* Remaining (navy) */}
          <circle cx="80" cy="80" r={r} fill="none" stroke="#0A1F44" strokeWidth="20"
            strokeDasharray={`${navyDash} ${circ - navyDash}`}
            strokeDashoffset={circ / 4 - greenDash}
          />
          {/* Collected (green) */}
          <circle cx="80" cy="80" r={r} fill="none" stroke="#22C55E" strokeWidth="20"
            strokeDasharray={`${greenDash} ${circ - greenDash}`}
            strokeDashoffset={circ / 4}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-bold text-base text-primary-800">{formatCompact(SUMMARY.sozlesmeBedeli)}</span>
          <span className="text-[10px] text-neutral-500 text-center leading-tight px-2">Toplam Tahsilat</span>
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-neutral-500">Tahsil Edilen</p>
        <div className="flex items-baseline gap-2 mt-0.5 mb-4">
          <span className="font-bold text-sm text-primary-800">{formatTL(SUMMARY.tahsilEdilen)}</span>
          <span className="text-xs font-bold text-success-700">%{SUMMARY.tahsilatPct}</span>
        </div>
        <p className="text-xs text-neutral-500">Tahsil Edilecek</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="font-bold text-sm text-primary-800">{formatTL(SUMMARY.tahsilEdilecek)}</span>
          <span className="text-xs font-bold text-neutral-500">%{SUMMARY.kalanPct}</span>
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

// ── Arrow icon ────────────────────────────────────────
const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 18l6-6-6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// ── "Tümünü gör" link ─────────────────────────────────
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

// ════════════════════════════════════════════════════
export default function AdminDashboard() {
  const pendingDue   = DUE_OWNERS.filter((o) => o.status === 'Geçmiş')
  const pendingTotal = pendingDue.reduce((s, o) => s + o.amount, 0)

  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto">

      {/* Mobil selamlama (masaüstünde gizli — header'da gösteriliyor) */}
      <div className="md:hidden mb-4">
        <h1 className="font-bold text-xl text-primary-800">Hoş geldiniz, Emre Dağ</h1>
        <p className="text-sm text-neutral-500 mt-0.5">Bugün senin için 3 önemli iş var.</p>
      </div>

      {/* ── Alert banner ──────────────────────────── */}
      {pendingDue.length > 0 && (
        <Link
          href="/admin/vade-takibi"
          className="flex items-center gap-4 bg-danger-50 border border-danger-100 rounded-2xl px-5 py-4 mb-5 hover:bg-danger-100 transition-colors"
        >
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#A32D2D" strokeWidth="2"/>
              <path d="M12 8v4M12 16h.01" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-danger-700">{pendingDue.length} dekont onay bekliyor</p>
            <p className="text-xs text-danger-600 mt-0.5">Toplam {formatTL(pendingTotal)} onayında</p>
          </div>
          <div className="flex items-center gap-1.5 bg-primary-800 text-white px-4 py-2 rounded-xl flex-shrink-0">
            <span className="text-sm font-medium">İncele</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        </Link>
      )}

      {/* ── 4 Metric cards ────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MetricCard
          label="Sözleşme Bedeli"
          value={formatCompact(SUMMARY.sozlesmeBedeli)}
          sub={`${SUMMARY.toplamProje} proje toplamı`}
          subColor="text-info-600"
          iconBg="bg-info-50"
          href="/admin/odemeler"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#185FA5" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 2v6h6M8 13h8M8 17h5" stroke="#185FA5" strokeWidth="1.8" strokeLinecap="round"/></svg>}
        />
        <MetricCard
          label="Tahsil Edilecek"
          value={formatCompact(SUMMARY.tahsilEdilecek)}
          sub={`%${SUMMARY.kalanPct} kalan`}
          subColor="text-warning-700"
          iconBg="bg-warning-50"
          href="/admin/odemeler"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#BA7517" strokeWidth="1.8"/><path d="M2 10h20" stroke="#BA7517" strokeWidth="1.8"/><circle cx="12" cy="15" r="2" fill="#BA7517"/></svg>}
        />
        <MetricCard
          label="Tahsil Edilen"
          value={formatCompact(SUMMARY.tahsilEdilen)}
          sub={`%${SUMMARY.tahsilatPct} tamamlandı`}
          subColor="text-success-700"
          iconBg="bg-success-50"
          href="/admin/odemeler"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#0F6E56" strokeWidth="1.8"/><path d="M2 10h20" stroke="#0F6E56" strokeWidth="1.8"/><path d="M6 15l3 2 5-5" stroke="#0F6E56" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />
        <MetricCard
          label="Güncel Proje Maliyeti"
          value={formatCompact(SUMMARY.projeMaliyeti)}
          sub={`${SUMMARY.aktifProje} aktif proje`}
          subColor="text-danger-700"
          iconBg="bg-danger-50"
          href="/admin/odemeler"
          icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="#A32D2D" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="#A32D2D" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="#A32D2D" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="#A32D2D" strokeWidth="1.8"/></svg>}
        />
      </div>

      {/* ── 2 kolon layout ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 md:gap-5">

        {/* ── Sol kolon ───────────────────────────── */}
        <div className="space-y-4">

          {/* Projelerim */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-primary-800">Projelerim</h2>
              <SeeAll href="/admin/projeler" />
            </div>
            <div className="space-y-0">
              {PROJECTS.map((p, i) => {
                const s = STATUS_STYLE[p.status] ?? { bg: 'bg-neutral-100', text: 'text-neutral-600' }
                return (
                  <Link
                    key={p.id}
                    href="/admin/projeler"
                    className={`flex items-center gap-3 py-3 hover:bg-neutral-50 rounded-xl px-1 -mx-1 transition-colors ${i < PROJECTS.length - 1 ? 'border-b border-neutral-50' : ''}`}
                  >
                    {/* Thumbnail */}
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                      style={{ imageOrientation: 'from-image' }}
                    />
                    {/* Name + location */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-primary-800 truncate">{p.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5 truncate">{p.location}</p>
                    </div>
                    {/* Amount */}
                    <div className="text-right flex-shrink-0 mr-2">
                      <p className="font-bold text-sm text-primary-800">{formatTL(p.tahsilat)}</p>
                      <p className="text-[11px] text-neutral-400">/ {formatTL(p.toplam)}</p>
                    </div>
                    {/* Badge */}
                    <span className={`${s.bg} ${s.text} text-[10px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 whitespace-nowrap`}>
                      {p.status}
                    </span>
                    <ArrowRight />
                  </Link>
                )
              })}
            </div>
            {/* Tüm Projeleri Gör button */}
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
                <button
                  key={action.label}
                  className="flex flex-col items-center gap-2 bg-neutral-50 hover:bg-neutral-100 rounded-2xl p-4 transition-colors"
                >
                  <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center`}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-medium text-primary-800 text-center leading-tight">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* ── Sağ kolon ───────────────────────────── */}
        <div className="space-y-4">

          {/* Ödemesi Yaklaşan Malikler */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-primary-800">Ödemesi Yaklaşan Malikler</h2>
              <SeeAll href="/admin/vade-takibi" />
            </div>
            <div className="space-y-0">
              {DUE_OWNERS.map((o, i) => {
                const isLate = o.status === 'Geçmiş'
                return (
                  <div
                    key={o.id}
                    className={`flex items-center gap-3 py-3 ${i < DUE_OWNERS.length - 1 ? 'border-b border-neutral-50' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isLate ? 'bg-danger-50' : 'bg-warning-50'}`}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke={isLate ? '#A32D2D' : '#BA7517'} strokeWidth="1.8"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={isLate ? '#A32D2D' : '#BA7517'} strokeWidth="1.8" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-primary-800">{o.name}</p>
                      <p className="text-[11px] text-neutral-500 mt-0.5 truncate">{o.project} · {o.unit}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-bold text-sm text-primary-800">{formatTL(o.amount)}</p>
                      <p className={`text-[11px] font-medium mt-0.5 ${isLate ? 'text-danger-700' : 'text-warning-700'}`}>{o.days}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Tahsilat Özeti */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h2 className="font-bold text-base text-primary-800 mb-4">Tahsilat Özeti</h2>
            <DonutChart />
          </div>

        </div>
      </div>
    </div>
  )
}
