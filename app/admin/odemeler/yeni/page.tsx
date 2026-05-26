'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function formatTL(n: number) {
  return n.toLocaleString('tr-TR') + ' TL'
}

type Project = { id: string; name: string }
type Owner = {
  id: string
  full_name: string
  unit_id: string
  unit_no: string
  unit_type: string
  unit_price: number
  total_paid: number
}

const SOURCES = ['Elden', 'WhatsApp Dekont', 'Banka']
const TYPES   = ['Peşinat', 'Taksit', 'Ara Ödeme', 'Ekstra', 'Aidat']

export default function TahsilatEklePage() {
  const router = useRouter()

  const [projects, setProjects]           = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [owners, setOwners]               = useState<Owner[]>([])
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)
  const [loadingOwners, setLoadingOwners] = useState(false)

  const [source, setSource] = useState('Elden')
  const [type,   setType]   = useState('Taksit')
  const [amount, setAmount] = useState('')
  const [note,   setNote]   = useState('')

  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  // Projeleri çek
  useEffect(() => {
    supabase
      .from('projects')
      .select('id, name')
      .eq('status', 'devam')
      .order('name')
      .then(({ data }) => setProjects(data ?? []))
  }, [])

  // Seçili projenin maliklerini çek
  useEffect(() => {
    if (!selectedProject) { setOwners([]); setSelectedOwner(null); return }
    setLoadingOwners(true)

    supabase
      .from('owners')
      .select('id, full_name, unit_id, units(unit_no, type, price)')
      .eq('project_id', selectedProject.id)
      .order('full_name')
      .then(async ({ data }) => {
        if (!data) { setLoadingOwners(false); return }

        const enriched: Owner[] = await Promise.all(
          data.map(async (o: any) => {
            const unit = Array.isArray(o.units) ? o.units[0] : o.units
            const { data: pmts } = await supabase
              .from('payments')
              .select('amount')
              .eq('owner_id', o.id)
              .eq('status', 'odendi')
            const total_paid = (pmts ?? []).reduce((s: number, p: any) => s + Number(p.amount ?? 0), 0)
            return {
              id:         o.id,
              full_name:  o.full_name,
              unit_id:    o.unit_id,
              unit_no:    unit?.unit_no  ?? '-',
              unit_type:  unit?.type     ?? '-',
              unit_price: Number(unit?.price ?? 0),
              total_paid,
            }
          })
        )
        setOwners(enriched)
        setSelectedOwner(null)
        setLoadingOwners(false)
      })
  }, [selectedProject])

  async function handleSave() {
    if (!selectedProject)  { setError('Lütfen bir proje seçin.'); return }
    if (!selectedOwner)    { setError('Lütfen bir malik seçin.'); return }
    const tutar = parseFloat(amount.replace(/[^\d,\.]/g, '').replace(',', '.'))
    if (!tutar || tutar <= 0) { setError('Geçerli bir tutar giriniz.'); return }

    setSaving(true)
    setError('')

    const { error: err } = await supabase.from('payments').insert({
      owner_id:   selectedOwner.id,
      unit_id:    selectedOwner.unit_id,
      project_id: selectedProject.id,
      amount:     tutar,
      paid_date:  new Date().toISOString().split('T')[0],
      status:     'odendi',
      source:     source,
      type:       type,
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

        {/* 1 — Proje Seç */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Proje Seç</p>
          <div className="space-y-2">
            {projects.length === 0 && (
              <p className="text-sm text-neutral-400 py-3 text-center">Yükleniyor...</p>
            )}
            {projects.map((p) => {
              const active = selectedProject?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all text-left ${
                    active ? 'border-primary-800 bg-primary-50' : 'border-neutral-100 bg-white hover:border-neutral-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary-100' : 'bg-neutral-100'}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
                      <rect x="14" y="14" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <span className={`text-sm font-medium flex-1 ${active ? 'text-primary-800' : 'text-neutral-700'}`}>{p.name}</span>
                  {active && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="#0A1F44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2 — Malik Seç */}
        {selectedProject && (
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Malik</p>
            {loadingOwners ? (
              <p className="text-sm text-neutral-400">Yükleniyor...</p>
            ) : owners.length === 0 ? (
              <p className="text-sm text-neutral-400">Bu projede henüz malik yok.</p>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {owners.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSelectedOwner(o)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      selectedOwner?.id === o.id
                        ? 'bg-primary-800 text-white border-primary-800'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {o.full_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3 — Malik Bilgi Kartı */}
        {selectedOwner && (
          <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-base text-primary-800">{selectedOwner.full_name}</p>
                <p className="text-xs text-primary-600 mt-0.5">
                  Daire {selectedOwner.unit_no} · {selectedOwner.unit_type}
                </p>
              </div>
              <div className="bg-white border border-primary-100 px-3 py-1.5 rounded-xl">
                <p className="text-xs font-semibold text-primary-800">Kalan {formatTL(remaining)}</p>
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

        {/* 4 — Tahsilat Kaynağı */}
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

        {/* 5 — Ödeme Türü */}
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

        {/* 6 — Tutar */}
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

        {/* 7 — Not */}
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
        <button
          onClick={handleSave}
          disabled={saving || success}
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 bg-primary-800 text-white font-bold text-base py-4 rounded-2xl disabled:opacity-60 transition-all active:scale-[0.98]"
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
  )
}
