'use client'

import { useState } from 'react'

function formatTL(n: number) { return n.toLocaleString('tr-TR') + ' ₺' }
function formatCompactTL(n: number) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (n >= 1_000) return `₺${Math.round(n / 1_000)}K`
  return `₺${n}`
}

type ProjectFinance = {
  id: string; name: string; location: string
  status: 'devam' | 'tamamlandi'
  tahsilat: number; maliyet: number; masraf: number
}

const PROJELER: ProjectFinance[] = [
  { id: 'ap1', name: 'Kemal Apartman',     location: 'Avcılar / İstanbul',    status: 'devam',      tahsilat: 4_750_000, maliyet: 2_800_000, masraf: 350_000 },
  { id: 'ap2', name: 'Gülbahçe Apartmanı', location: 'Beylikdüzü / İstanbul', status: 'devam',      tahsilat: 7_200_000, maliyet: 4_200_000, masraf: 620_000 },
  { id: 'ap3', name: 'Doğa Rezidans',      location: 'Başakşehir / İstanbul', status: 'devam',      tahsilat: 6_900_000, maliyet: 3_900_000, masraf: 480_000 },
  { id: 'ap4', name: 'Yazgan Konutları',   location: 'Esenyurt / İstanbul',   status: 'devam',      tahsilat: 8_300_000, maliyet: 4_900_000, masraf: 700_000 },
  { id: 'c1',  name: 'Doğa Park Evleri',   location: 'Beylikdüzü / İstanbul', status: 'tamamlandi', tahsilat: 9_200_000, maliyet: 5_800_000, masraf: 210_000 },
  { id: 'c2',  name: 'Yıldız Apartmanı',   location: 'Esenyurt / İstanbul',   status: 'tamamlandi', tahsilat: 5_070_000, maliyet: 3_140_000, masraf: 0 },
]

const MALIYET_ITEMS = [
  { label: 'Malzeme Giderleri',  pct: 48, color: '#185FA5' },
  { label: 'İşçilik Giderleri',  pct: 28, color: '#0F6E56' },
  { label: 'Alt Yüklenici',       pct: 14, color: '#BA7517' },
  { label: 'Diğer Maliyetler',    pct: 10, color: '#A32D2D' },
]

type Tab = 'devam' | 'tamamlandi'

export default function AdminOdemelerPage() {
  const [tab, setTab] = useState<Tab>('devam')

  const visible = PROJELER.filter((p) => p.status === tab)
  const tahsilat = visible.reduce((s, p) => s + p.tahsilat, 0)
  const maliyet  = visible.reduce((s, p) => s + p.maliyet, 0)
  const masraf   = visible.reduce((s, p) => s + p.masraf, 0)
  const kar      = tahsilat - maliyet - masraf
  const karPct   = tahsilat > 0 ? Math.round((kar / tahsilat) * 100) : 0

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-primary-800">Finansal Analiz</h1>
        <p className="text-sm text-neutral-500 mt-1">Proje bazlı gelir, maliyet ve kârlılık takibi.</p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 md:mb-6">
        {[
          { label: 'Toplam Tahsilat', value: formatCompactTL(tahsilat), sub: 'Tahsil edilen', color: 'text-success-700', bg: 'bg-success-50' },
          { label: 'Toplam Maliyet',  value: formatCompactTL(maliyet),  sub: 'İnşaat maliyeti', color: 'text-danger-700',  bg: 'bg-danger-50' },
          { label: 'Toplam Masraf',   value: formatCompactTL(masraf),   sub: 'Ek giderler',     color: 'text-warning-700', bg: 'bg-warning-50' },
          { label: 'Net Kâr',         value: formatCompactTL(kar),      sub: `%${karPct} kârlılık`, color: kar >= 0 ? 'text-success-700' : 'text-danger-700', bg: kar >= 0 ? 'bg-success-50' : 'bg-danger-50' },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-neutral-100 p-4">
            <div className={`w-8 h-8 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke={c.bg.includes('success') ? '#0F6E56' : c.bg.includes('danger') ? '#A32D2D' : c.bg.includes('warning') ? '#BA7517' : '#185FA5'} strokeWidth="1.8" />
                <path d="M2 10h20" stroke={c.bg.includes('success') ? '#0F6E56' : c.bg.includes('danger') ? '#A32D2D' : c.bg.includes('warning') ? '#BA7517' : '#185FA5'} strokeWidth="1.8" />
              </svg>
            </div>
            <p className="text-xs text-neutral-500 mb-1">{c.label}</p>
            <p className="font-bold text-xl text-primary-800">{c.value}</p>
            <p className={`text-xs font-medium mt-1 ${c.color}`}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Proje Listesi */}
        <div className="lg:col-span-2">
          {/* Tab */}
          <div className="flex border-b border-neutral-100 mb-4">
            {(['devam', 'tamamlandi'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === t ? 'border-primary-800 text-primary-800' : 'border-transparent text-neutral-500 hover:text-primary-800'
                }`}
              >
                {t === 'devam' ? 'Devam Eden' : 'Tamamlanan'}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {visible.map((p) => {
              const pKar = p.tahsilat - p.maliyet - p.masraf
              const pKarPct = p.tahsilat > 0 ? Math.round((pKar / p.tahsilat) * 100) : 0
              const tahsilatPct = Math.round((p.tahsilat / (tahsilat || 1)) * 100)
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-neutral-100 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-base text-primary-800">{p.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{p.location}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${pKar >= 0 ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
                      %{pKarPct} kâr
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-neutral-50 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400">Tahsilat</p>
                      <p className="font-bold text-sm text-success-700 mt-0.5">{formatTL(p.tahsilat)}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400">Maliyet</p>
                      <p className="font-bold text-sm text-danger-700 mt-0.5">{formatTL(p.maliyet)}</p>
                    </div>
                    <div className="bg-neutral-50 rounded-xl p-3">
                      <p className="text-[10px] text-neutral-400">Net Kâr</p>
                      <p className={`font-bold text-sm mt-0.5 ${pKar >= 0 ? 'text-success-700' : 'text-danger-700'}`}>{formatTL(pKar)}</p>
                    </div>
                  </div>
                  {/* Tahsilat bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-primary-800" style={{ width: `${tahsilatPct}%` }} />
                    </div>
                    <span className="text-[11px] text-neutral-500">%{tahsilatPct} pay</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Maliyet Dağılımı */}
        <div>
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h2 className="font-bold text-base text-primary-800 mb-4">Maliyet Dağılımı</h2>
            <div className="space-y-3">
              {MALIYET_ITEMS.map((item) => {
                const amount = Math.round(maliyet * item.pct / 100)
                return (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-neutral-600">{item.label}</span>
                      <span className="text-xs font-bold text-primary-800">%{item.pct}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-1">
                      <div className="h-full rounded-full" style={{ width: `${item.pct}%`, backgroundColor: item.color }} />
                    </div>
                    <p className="text-[11px] text-neutral-400">{formatTL(amount)}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Özet kutusu */}
          <div className="bg-primary-800 rounded-2xl p-5 mt-4 text-white">
            <p className="text-xs font-medium opacity-70 mb-1">Net Kârlılık Özeti</p>
            <p className="font-bold text-2xl mb-4">{formatCompactTL(kar)}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Tahsilat</span>
                <span className="font-bold">{formatCompactTL(tahsilat)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Maliyet</span>
                <span className="font-bold text-danger-200">−{formatCompactTL(maliyet)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Masraf</span>
                <span className="font-bold text-warning-200">−{formatCompactTL(masraf)}</span>
              </div>
              <div className="border-t border-white/20 pt-2 flex justify-between text-sm">
                <span className="font-bold">Net Kâr</span>
                <span className={`font-bold ${kar >= 0 ? 'text-success-200' : 'text-danger-200'}`}>{formatCompactTL(kar)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
