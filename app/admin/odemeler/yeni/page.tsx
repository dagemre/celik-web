'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function formatTL(n: number) {
  return n.toLocaleString('tr-TR') + ' TL'
}

function getInitials(name: string) {
  const parts = name.trim().split(' ')
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = ['#185FA5', '#0F6E56', '#BA7517', '#5B21B6', '#0A1F44', '#0E7490']
function getAvatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

type Owner = {
  id: string
  full_name: string
  unit_id: string | null
  unit_no: string
  unit_type: string
  unit_price: number
  total_paid: number
  project_id: string
  project_name: string
}

const SOURCES = ['Elden', 'WhatsApp Dekont', 'Banka']
const TYPES   = ['Peşinat', 'Taksit', 'Ara Ödeme', 'Ekstra', 'Aidat']

export default function TahsilatEklePage() {
  const router = useRouter()

  const [owners, setOwners]               = useState<Owner[]>([])
  const [loadingOwners, setLoadingOwners] = useState(true)
  const [search, setSearch]               = useState('')
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)

  const [source, setSource] = useState('Elden')
  const [type,   setType]   = useState('Taksit')
  const [amount, setAmount] = useState('')
  const [note,   setNote]   = useState('')

  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  // Tüm owners + projeler tek sorguda yükle
  useEffect(() => {
    Promise.all([
      supabase
        .from('owners')
        .select(`
          id, full_name, project_id, unit_id,
          units(unit_no, type, price),
          payments(amount, status)
        `)
        .order('full_name'),
      supabase
        .from('projects')
        .select('id, name'),
    ]).then(([{ data: ownersData }, { data: projectsData }]) => {
      const projs = projectsData ?? []
      const enriched: Owner[] = (ownersData ?? []).map((o: any) => {
        const unit      = Array.isArray(o.units) ? o.units[0] : o.units
        const paidTotal = (o.payments ?? [])
          .filter((p: any) => p.status === 'odendi')
          .reduce((s: number, p: any) => s + Number(p.amount ?? 0), 0)
        const proj = projs.find((p: any) => p.id === o.project_id)
        return {
          id:           o.id,
          full_name:    o.full_name,
          unit_id:      o.unit_id ?? null,
          unit_no:      unit?.unit_no  ?? '-',
          unit_type:    unit?.type     ?? '-',
          unit_price:   Number(unit?.price ?? 0),
          total_paid:   paidTotal,
          project_id:   o.project_id ?? '',
          project_name: proj?.name    ?? '-',
        }
      })
      setOwners(enriched)
      setLoadingOwners(false)
    })
  }, [])

  const filteredOwners = search.trim()
    ? owners.filter((o) =>
        o.full_name.toLowerCase().includes(search.toLowerCase()) ||
        o.project_name.toLowerCase().includes(search.toLowerCase()) ||
        o.unit_no.toLowerCase().includes(search.toLowerCase())
      )
    : owners

  async function handleSave() {
    if (!selectedOwner) { setError('Lütfen bir malik seçin.'); return }
    const tutar = parseFloat(amount.replace(/[^\d,\.]/g, '').replace(',', '.'))
    if (!tutar || tutar <= 0) { setError('Geçerli bir tutar giriniz.'); return }

    setSaving(true)
    setError('')

    const { error: err } = await supabase.from('payments').insert({
      owner_id:    selectedOwner.id,
      unit_id:     selectedOwner.unit_id,
      project_id:  selectedOwner.project_id,
      amount:      tutar,
      paid_date:   new Date().toISOString().split('T')[0],
      status:      'odendi',
      source,
      type,
      description: note || null,
    })

    setSaving(false)
    if (err) { setError('Hata: ' + err.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/admin/odemeler'), 1500)
  }

  const parsedAmount = parseFloat(amount.replace(/[^\d,\.]/g, '').replace(',', '.')) || 0
  const remaining    = selectedOwner ? selectedOwner.unit_price - selectedOwner.total_paid : 0
  const afterPayment = selectedOwner ? remaining - parsedAmount : 0

  return (
    <div className="min-h-screen bg-neutral-50 pb-36">

      {/* Başlık */}
      <div className="bg-white border-b border-neutral-100 px-5 pt-5 pb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0A1F44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <h1 className="font-bold text-xl text-primary-800">Tahsilat Ekle</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Elden alınan veya gelen dekontları hızlıca işle.</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-6 max-w-lg mx-auto">

        {/* 1 — Malik Seç */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Malik</p>

          {/* Arama */}
          <div className="relative mb-3">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#A5A49C" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" stroke="#A5A49C" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedOwner(null) }}
              placeholder="İsim, proje veya daire ara..."
              className="w-full bg-white border border-neutral-200 rounded-2xl pl-9 pr-4 py-3 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
            />
          </div>

          {loadingOwners ? (
            <div className="flex items-center justify-center py-8 gap-2">
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#D3D1C7" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#0A1F44" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <span className="text-sm text-neutral-400">Yükleniyor...</span>
            </div>
          ) : filteredOwners.length === 0 ? (
            <p className="text-sm text-neutral-400 text-center py-6">Malik bulunamadı.</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-0.5">
              {filteredOwners.map((o) => {
                const active = selectedOwner?.id === o.id
                const color  = getAvatarColor(o.full_name)
                return (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOwner(o)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all text-left ${
                      active
                        ? 'border-primary-800 bg-primary-50'
                        : 'border-neutral-100 bg-white hover:border-neutral-200'
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: active ? '#0A1F44' : color }}
                    >
                      {getInitials(o.full_name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${active ? 'text-primary-800' : 'text-neutral-700'}`}>
                        {o.full_name}
                      </p>
                      <p className="text-xs text-neutral-400 truncate">
                        {o.project_name} · Daire {o.unit_no}
                      </p>
                    </div>
                    {active && (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                        <polyline points="20 6 9 17 4 12" stroke="#0A1F44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* 2 — Seçili Malik Bilgi Kartı */}
        {selectedOwner && (
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-base text-primary-800">{selectedOwner.full_name}</p>
                <p className="text-xs text-primary-600 mt-0.5">
                  {selectedOwner.project_name} · Daire {selectedOwner.unit_no} · {selectedOwner.unit_type}
                </p>
              </div>
              <div className="bg-white border border-primary-100 px-3 py-1.5 rounded-xl flex-shrink-0">
                <p className="text-xs font-semibold text-primary-800">Kalan {formatTL(Math.max(0, remaining))}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Toplam Borç', value: formatTL(selectedOwner.unit_price), color: 'text-neutral-700' },
                { label: 'Ödenen',      value: formatTL(selectedOwner.total_paid),  color: 'text-success-700' },
                { label: 'Sonrası',     value: formatTL(Math.max(0, afterPayment)), color: 'text-primary-800' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl p-3">
                  <p className="text-xs text-neutral-400 mb-1">{stat.label}</p>
                  <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3 — Tahsilat Kaynağı */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Tahsilat Kaynağı</p>
          <div className="flex gap-2">
            {SOURCES.map((s) => (
              <button
                key={s}
                onClick={() => setSource(s)}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-medium border transition-all ${
                  source === s
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 4 — Ödeme Türü */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Ne Ödemesi?</p>
          <div className="flex gap-2 flex-wrap">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  type === t
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 5 — Tutar */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Tutar</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold text-lg pointer-events-none">₺</span>
            <input
              type="number"
              inputMode="numeric"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError('') }}
              placeholder="0"
              className="w-full bg-white border border-neutral-200 rounded-2xl pl-10 pr-4 py-4 text-xl font-bold text-primary-800 outline-none focus:border-primary-400 placeholder:text-neutral-300"
            />
          </div>
        </div>

        {/* 6 — Not */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Not <span className="font-normal normal-case text-neutral-400">(opsiyonel)</span>
          </p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Açıklama ekle..."
            rows={2}
            className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300 resize-none"
          />
        </div>

        {/* Hata / Başarı */}
        {error && (
          <div className="bg-danger-50 border border-danger-100 rounded-2xl px-4 py-3 text-sm text-danger-700">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-success-50 border border-success-100 rounded-2xl px-4 py-3 text-sm text-success-700 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Tahsilat kaydedildi! Yönlendiriliyor...
          </div>
        )}

      </div>

      {/* Kaydet — sabit alt */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 pt-3"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <div className="max-w-lg mx-auto">
          <button
            onClick={handleSave}
            disabled={saving || success}
            className="w-full flex items-center justify-center gap-2 bg-primary-800 text-white font-bold text-base py-4 rounded-2xl disabled:opacity-60 transition-all active:scale-[0.98]"
          >
            {saving ? (
              <>
                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                </svg>
                Kaydediliyor...
              </>
            ) : 'Tahsilatı Kaydet'}
          </button>
        </div>
      </div>

    </div>
  )
}
