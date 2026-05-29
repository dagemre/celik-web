'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function formatTL(n: number) { return n.toLocaleString('tr-TR') + ' ₺' }
function formatCompactTL(n: number) {
  if (n >= 1_000_000) return `₺${(n / 1_000_000).toFixed(1).replace('.', ',')}M`
  if (n >= 1_000) return `₺${Math.round(n / 1_000)}K`
  return `₺${n}`
}

type ProjectFinance = {
  id: string
  name: string
  location: string
  status: string
  tahsilat: number
  maliyet: number
}

const CATEGORY_LABELS: Record<string, string> = {
  malzeme:      'Malzeme Giderleri',
  iscilik:      'İşçilik Giderleri',
  alt_yuklenici: 'Alt Yüklenici',
  ekipman:      'Ekipman',
  diger:        'Diğer',
}
const CATEGORY_COLORS: Record<string, string> = {
  malzeme:      '#185FA5',
  iscilik:      '#0F6E56',
  alt_yuklenici: '#BA7517',
  ekipman:      '#7C3AED',
  diger:        '#A32D2D',
}

export default function AdminOdemelerPage() {
  const [projeler, setProjeler] = useState<ProjectFinance[]>([])
  const [costsByCategory, setCostsByCategory] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)

      // Tüm projeler
      const { data: projects } = await supabase
        .from('projects')
        .select('id, name, location, district, city, status')
        .order('name')

      if (!projects) { setLoading(false); return }

      // Tüm ödemeler (odendi)
      const { data: payments } = await supabase
        .from('payments')
        .select('project_id, amount')
        .eq('status', 'odendi')

      // Tüm maliyet kayıtları
      const { data: costs } = await supabase
        .from('project_costs')
        .select('project_id, amount, category')

      // Her projeye tahsilat ve maliyet topla
      const payMap: Record<string, number> = {}
      for (const p of payments ?? []) {
        payMap[p.project_id] = (payMap[p.project_id] ?? 0) + Number(p.amount)
      }

      const costMap: Record<string, number> = {}
      const catMap:  Record<string, number> = {}
      for (const c of costs ?? []) {
        costMap[c.project_id] = (costMap[c.project_id] ?? 0) + Number(c.amount)
        catMap[c.category] = (catMap[c.category] ?? 0) + Number(c.amount)
      }

      const enriched: ProjectFinance[] = projects.map((p) => ({
        id:       p.id,
        name:     p.name,
        location: p.district ? `${p.district} / ${p.city ?? 'İstanbul'}` : (p.location ?? 'İstanbul'),
        status:   p.status,
        tahsilat: payMap[p.id] ?? 0,
        maliyet:  costMap[p.id] ?? 0,
      }))

      // Sadece en az 1 veri olan projeleri öne al, sıfır olanları da göster
      enriched.sort((a, b) => (b.tahsilat + b.maliyet) - (a.tahsilat + a.maliyet))

      setProjeler(enriched)
      setCostsByCategory(catMap)
      setLoading(false)
    }

    fetchData()
  }, [])

  const tahsilat = projeler.reduce((s, p) => s + p.tahsilat, 0)
  const maliyet  = projeler.reduce((s, p) => s + p.maliyet, 0)
  const kar      = tahsilat - maliyet
  const karPct   = tahsilat > 0 ? Math.round((kar / tahsilat) * 100) : 0

  const totalCatAmount = Object.values(costsByCategory).reduce((s, v) => s + v, 0)

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-primary-800">Finansal Analiz</h1>
          <p className="text-sm text-neutral-500 mt-1">Proje bazlı tahsilat ve maliyet takibi.</p>
        </div>
        <Link
          href="/admin/odemeler/yeni"
          className="flex items-center gap-2 bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Tahsilat Ekle
        </Link>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4 md:mb-6">
        {[
          { label: 'Toplam Tahsilat', value: formatCompactTL(tahsilat), sub: 'Tüm projeler', color: 'text-success-700', strokeColor: '#0F6E56', bg: 'bg-success-50' },
          { label: 'Toplam Maliyet',  value: formatCompactTL(maliyet),  sub: 'Kayıtlı giderler', color: 'text-danger-700', strokeColor: '#A32D2D', bg: 'bg-danger-50' },
          { label: 'Net Kâr',         value: formatCompactTL(kar),      sub: `%${karPct} kârlılık`, color: kar >= 0 ? 'text-success-700' : 'text-danger-700', strokeColor: kar >= 0 ? '#0F6E56' : '#A32D2D', bg: kar >= 0 ? 'bg-success-50' : 'bg-danger-50' },
          { label: 'Aktif Proje',     value: `${projeler.filter(p => p.status === 'devam').length}`, sub: `${projeler.length} toplam proje`, color: 'text-info-600', strokeColor: '#185FA5', bg: 'bg-info-50' },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-neutral-100 p-4">
            <div className={`w-8 h-8 ${c.bg} rounded-xl flex items-center justify-center mb-3`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="5" width="20" height="14" rx="2" stroke={c.strokeColor} strokeWidth="1.8"/>
                <path d="M2 10h20" stroke={c.strokeColor} strokeWidth="1.8"/>
              </svg>
            </div>
            <p className="text-xs text-neutral-500 mb-1">{c.label}</p>
            <p className="font-bold text-xl text-primary-800">{loading ? '—' : c.value}</p>
            <p className={`text-xs font-medium mt-1 ${c.color}`}>{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Proje Listesi */}
        <div className="lg:col-span-2">
          <h2 className="font-bold text-base text-primary-800 mb-3">Proje Bazlı Özet</h2>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-4 animate-pulse">
                  <div className="h-4 bg-neutral-100 rounded w-40 mb-2"/>
                  <div className="h-3 bg-neutral-100 rounded w-24 mb-4"/>
                  <div className="grid grid-cols-3 gap-2">
                    {[1,2,3].map(j => <div key={j} className="h-12 bg-neutral-50 rounded-xl"/>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && projeler.length === 0 && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-8 text-center">
              <p className="text-neutral-400 text-sm">Henüz veri yok.</p>
            </div>
          )}

          <div className="space-y-3">
            {!loading && projeler.map((p) => {
              const pKar = p.tahsilat - p.maliyet
              const pKarPct = p.tahsilat > 0 ? Math.round((pKar / p.tahsilat) * 100) : 0
              const tahsilatPct = tahsilat > 0 ? Math.round((p.tahsilat / tahsilat) * 100) : 0
              const hasData = p.tahsilat > 0 || p.maliyet > 0
              if (!hasData) return null
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-neutral-100 p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-base text-primary-800">{p.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{p.location}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${pKar >= 0 ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
                      {p.tahsilat > 0 ? `%${pKarPct} kâr` : 'Gider var'}
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
                  {tahsilat > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-primary-800" style={{ width: `${tahsilatPct}%` }}/>
                      </div>
                      <span className="text-[11px] text-neutral-500">%{tahsilatPct} pay</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Veri olmayan projeler için küçük not */}
          {!loading && projeler.filter(p => p.tahsilat === 0 && p.maliyet === 0).length > 0 && (
            <p className="text-xs text-neutral-400 mt-3 text-center">
              + {projeler.filter(p => p.tahsilat === 0 && p.maliyet === 0).length} projede henüz kayıt yok
            </p>
          )}
        </div>

        {/* Sağ kolon */}
        <div className="space-y-4">

          {/* Maliyet Dağılımı */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5">
            <h2 className="font-bold text-base text-primary-800 mb-4">Maliyet Dağılımı</h2>
            {totalCatAmount === 0 ? (
              <p className="text-sm text-neutral-400 text-center py-4">Henüz maliyet kaydı yok.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(costsByCategory)
                  .sort((a, b) => b[1] - a[1])
                  .map(([cat, amt]) => {
                    const pct = Math.round((amt / totalCatAmount) * 100)
                    return (
                      <div key={cat}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-neutral-600">{CATEGORY_LABELS[cat] ?? cat}</span>
                          <span className="text-xs font-bold text-primary-800">%{pct}</span>
                        </div>
                        <div className="h-2 bg-neutral-100 rounded-full overflow-hidden mb-1">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: CATEGORY_COLORS[cat] ?? '#888780' }}/>
                        </div>
                        <p className="text-[11px] text-neutral-400">{formatTL(amt)}</p>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Net Kârlılık Özeti */}
          <div className="bg-primary-800 rounded-2xl p-5 text-white">
            <p className="text-xs font-medium opacity-70 mb-1">Net Kârlılık Özeti</p>
            <p className="font-bold text-2xl mb-4">{loading ? '—' : formatCompactTL(kar)}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Tahsilat</span>
                <span className="font-bold">{loading ? '—' : formatCompactTL(tahsilat)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Maliyet</span>
                <span className="font-bold text-danger-200">−{loading ? '—' : formatCompactTL(maliyet)}</span>
              </div>
              <div className="border-t border-white/20 pt-2 flex justify-between text-sm">
                <span className="font-bold">Net Kâr</span>
                <span className={`font-bold ${kar >= 0 ? 'text-success-200' : 'text-danger-200'}`}>
                  {loading ? '—' : formatCompactTL(kar)}
                </span>
              </div>
            </div>
          </div>

          {/* Hızlı Erişim */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-4">
            <p className="text-xs font-semibold text-neutral-500 mb-3">Hızlı Erişim</p>
            <div className="space-y-2">
              <Link href="/admin/odemeler/yeni" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="w-7 h-7 bg-success-50 rounded-lg flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0F6E56" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <span className="text-sm text-neutral-700">Tahsilat Ekle</span>
              </Link>
              <Link href="/admin/projeler/maliyet-ekle" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="w-7 h-7 bg-danger-50 rounded-lg flex items-center justify-center">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="12" width="4" height="9" rx="1" fill="#A32D2D"/>
                    <rect x="10" y="7" width="4" height="14" rx="1" fill="#A32D2D"/>
                    <rect x="17" y="3" width="4" height="18" rx="1" fill="#A32D2D"/>
                  </svg>
                </div>
                <span className="text-sm text-neutral-700">Maliyet Ekle</span>
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
