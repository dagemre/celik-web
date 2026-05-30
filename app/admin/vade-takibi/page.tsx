'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function formatTL(n: number) { return n.toLocaleString('tr-TR') + ' ₺' }

type DueOwner = {
  id: string; name: string; project: string; unit: string
  dueDate: string; amount: number; status: 'Geçmiş' | 'Yaklaşıyor'; days: string
}

// Bugüne göre "Geçmiş" / "Yaklaşıyor" hesapla (14 günden uzaksa gösterme)
function computeStatus(dueDateStr: string): { status: 'Geçmiş' | 'Yaklaşıyor'; days: string } | null {
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const due   = new Date(dueDateStr); due.setHours(0, 0, 0, 0)
  const diff  = Math.round((due.getTime() - today.getTime()) / 86_400_000)
  if (diff < 0)    return { status: 'Geçmiş',    days: `${Math.abs(diff)} gün geçti` }
  if (diff <= 14)  return { status: 'Yaklaşıyor', days: diff === 0 ? 'Bugün!' : `${diff} gün kaldı` }
  return null
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
}

export default function AdminVadeTakibiPage() {
  const [owners,  setOwners]  = useState<DueOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [filter,  setFilter]  = useState<'Tümü' | 'Geçmiş' | 'Yaklaşıyor'>('Tümü')
  const [search,  setSearch]  = useState('')

  useEffect(() => {
    supabase
      .from('payments')
      .select('id, amount, due_date, owners(full_name), units(unit_no), projects(name)')
      .neq('status', 'odendi')
      .not('due_date', 'is', null)
      .order('due_date', { ascending: true })
      .then(({ data }) => {
        if (!data) { setLoading(false); return }
        const result: DueOwner[] = []
        ;(data as any[]).forEach((p) => {
          if (!p.due_date) return
          const computed = computeStatus(p.due_date)
          if (!computed) return // 14 günden uzak, listede gösterme

          const ownerName   = (Array.isArray(p.owners) ? p.owners[0] : p.owners)?.full_name ?? 'Bilinmiyor'
          const unitNo      = (Array.isArray(p.units)  ? p.units[0]  : p.units)?.unit_no  ?? null
          const projectName = (Array.isArray(p.projects) ? p.projects[0] : p.projects)?.name ?? '—'

          result.push({
            id:      p.id,
            name:    ownerName,
            project: projectName,
            unit:    unitNo ? `Daire ${unitNo}` : '—',
            dueDate: formatDate(p.due_date),
            amount:  Number(p.amount),
            ...computed,
          })
        })
        setOwners(result)
        setLoading(false)
      })
  }, [])

  const gecmis      = owners.filter(o => o.status === 'Geçmiş')
  const yaklasan    = owners.filter(o => o.status === 'Yaklaşıyor')
  const gecmisTop   = gecmis.reduce((s, o) => s + o.amount, 0)
  const yaklasinTop = yaklasan.reduce((s, o) => s + o.amount, 0)

  const visible = owners.filter(o => {
    const matchFilter = filter === 'Tümü' || o.status === filter
    const matchSearch = o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.project.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-primary-800">Vade Takibi</h1>
        <p className="text-sm text-neutral-500 mt-1">Vadesi yaklaşan ve geçmiş malik ödemeleri (önümüzdeki 14 gün).</p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        <div className="bg-danger-50 border border-danger-100 rounded-2xl p-4">
          <p className="text-xs font-medium text-danger-700 mb-1">Vadesi Geçmiş</p>
          <p className="font-bold text-2xl text-danger-700">{loading ? '—' : gecmis.length} kişi</p>
          <p className="text-xs text-danger-600 mt-1">{loading ? '—' : formatTL(gecmisTop)}</p>
        </div>
        <div className="bg-warning-50 border border-warning-100 rounded-2xl p-4">
          <p className="text-xs font-medium text-warning-700 mb-1">Yaklaşan Vade</p>
          <p className="font-bold text-2xl text-warning-700">{loading ? '—' : yaklasan.length} kişi</p>
          <p className="text-xs text-warning-600 mt-1">{loading ? '—' : formatTL(yaklasinTop)}</p>
        </div>
        <div className="bg-white border border-neutral-100 rounded-2xl p-4">
          <p className="text-xs font-medium text-neutral-500 mb-1">Toplam Risk</p>
          <p className="font-bold text-2xl text-primary-800">{loading ? '—' : formatTL(gecmisTop + yaklasinTop)}</p>
          <p className="text-xs text-neutral-400 mt-1">{loading ? '—' : `${owners.length} ödeme`}</p>
        </div>
      </div>

      {/* Arama + Filtre */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 bg-white border border-neutral-100 rounded-xl px-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#888780" strokeWidth="1.8" />
            <path d="M16.5 16.5l4 4" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Malik veya proje ara..."
            className="flex-1 py-2.5 text-sm text-primary-800 outline-none bg-transparent placeholder:text-neutral-400"
          />
        </div>
        <div className="flex gap-1 bg-white border border-neutral-100 rounded-xl p-1">
          {(['Tümü', 'Geçmiş', 'Yaklaşıyor'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f
                  ? f === 'Geçmiş' ? 'bg-danger-700 text-white'
                    : f === 'Yaklaşıyor' ? 'bg-warning-700 text-white'
                    : 'bg-primary-800 text-white'
                  : 'text-neutral-500 hover:text-primary-800'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-neutral-100 rounded-2xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-100 rounded w-1/3" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, j) => <div key={j} className="h-14 bg-neutral-100 rounded-xl" />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Liste */}
      {!loading && (
        <div className="space-y-3">
          {visible.length === 0 && (
            <div className="flex flex-col items-center py-16">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#D3D1C7" strokeWidth="1.5" />
                <path d="M12 7v5l3 3" stroke="#D3D1C7" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-neutral-400 font-medium mt-3">
                {owners.length === 0 ? 'Yaklaşan veya geçmiş vade yok 🎉' : 'Kayıt bulunamadı'}
              </p>
            </div>
          )}
          {visible.map((owner) => {
            const isLate = owner.status === 'Geçmiş'
            return (
              <div key={owner.id} className="bg-white rounded-2xl border border-neutral-100 p-4">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${isLate ? 'bg-danger-50' : 'bg-warning-50'}`}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="8" r="4" stroke={isLate ? '#A32D2D' : '#BA7517'} strokeWidth="1.8" />
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={isLate ? '#A32D2D' : '#BA7517'} strokeWidth="1.8" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-primary-800">{owner.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{owner.project} · {owner.unit}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${isLate ? 'bg-danger-50 text-danger-700' : 'bg-warning-50 text-warning-700'}`}>
                    {owner.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-neutral-50 rounded-xl p-3">
                    <p className="text-[10px] text-neutral-400">Vade Tarihi</p>
                    <p className="font-bold text-sm text-primary-800 mt-0.5">{owner.dueDate}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-3">
                    <p className="text-[10px] text-neutral-400">Durum</p>
                    <p className={`font-bold text-sm mt-0.5 ${isLate ? 'text-danger-700' : 'text-warning-700'}`}>{owner.days}</p>
                  </div>
                  <div className="bg-neutral-50 rounded-xl p-3">
                    <p className="text-[10px] text-neutral-400">Tutar</p>
                    <p className="font-bold text-sm text-primary-800 mt-0.5">{formatTL(owner.amount)}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
