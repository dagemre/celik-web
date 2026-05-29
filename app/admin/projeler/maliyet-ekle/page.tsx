'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function formatTL(n: number) {
  return n.toLocaleString('tr-TR') + ' TL'
}

type Project = { id: string; name: string }

const CATEGORIES = [
  { key: 'malzeme',      label: 'Malzeme',       color: 'bg-blue-100',   stroke: '#2563EB' },
  { key: 'iscilik',      label: 'İşçilik',        color: 'bg-green-100',  stroke: '#16A34A' },
  { key: 'alt_yuklenici', label: 'Alt Yüklenici', color: 'bg-purple-100', stroke: '#7C3AED' },
  { key: 'ekipman',      label: 'Ekipman',        color: 'bg-amber-100',  stroke: '#D97706' },
  { key: 'diger',        label: 'Diğer',          color: 'bg-neutral-100', stroke: '#888780' },
]

export default function MaliyetEklePage() {
  const router = useRouter()

  const [projects, setProjects]           = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [currentTotal, setCurrentTotal]   = useState<number | null>(null)

  const [category, setCategory] = useState('malzeme')
  const [amount, setAmount]     = useState('')
  const [description, setDesc]  = useState('')
  const [costDate, setCostDate] = useState(new Date().toISOString().split('T')[0])

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

  // Seçili projenin güncel maliyet toplamını çek
  useEffect(() => {
    if (!selectedProject) { setCurrentTotal(null); return }
    supabase
      .from('project_costs')
      .select('amount')
      .eq('project_id', selectedProject.id)
      .then(({ data }) => {
        const total = (data ?? []).reduce((s, r: any) => s + Number(r.amount), 0)
        setCurrentTotal(total)
      })
  }, [selectedProject])

  async function handleSave() {
    if (!selectedProject) { setError('Lütfen bir proje seçin.'); return }
    const tutar = parseFloat(amount.replace(/[^\d,\.]/g, '').replace(',', '.'))
    if (!tutar || tutar <= 0) { setError('Geçerli bir tutar giriniz.'); return }

    setSaving(true)
    setError('')

    const { error: err } = await supabase.from('project_costs').insert({
      project_id:  selectedProject.id,
      amount:      tutar,
      category,
      description: description || null,
      cost_date:   costDate,
    })

    setSaving(false)
    if (err) { setError('Hata: ' + err.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/admin/odemeler'), 1500)
  }

  const parsedAmount = parseFloat(amount.replace(/[^\d,\.]/g, '').replace(',', '.')) || 0
  const afterTotal   = currentTotal !== null ? currentTotal + parsedAmount : null

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
          <h1 className="font-bold text-xl text-primary-800">Proje Maliyeti Ekle</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Projeye ait gideri kayıt altına al.</p>
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
                  onClick={() => { setSelectedProject(p); setError('') }}
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

        {/* 2 — Güncel Maliyet Kartı */}
        {selectedProject && currentTotal !== null && (
          <div className="bg-danger-50 border border-danger-100 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-danger-100 rounded-xl flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="12" width="4" height="9" rx="1" fill="#A32D2D"/>
                  <rect x="10" y="7" width="4" height="14" rx="1" fill="#A32D2D"/>
                  <rect x="17" y="3" width="4" height="18" rx="1" fill="#A32D2D"/>
                </svg>
              </div>
              <p className="font-bold text-sm text-danger-800">{selectedProject.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-neutral-400 mb-1">Mevcut Maliyet</p>
                <p className="text-sm font-bold text-danger-700">{formatTL(currentTotal)}</p>
              </div>
              <div className="bg-white rounded-xl p-3">
                <p className="text-xs text-neutral-400 mb-1">Eklenince Toplam</p>
                <p className="text-sm font-bold text-primary-800">
                  {parsedAmount > 0 ? formatTL(afterTotal ?? 0) : '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 3 — Gider Kategorisi */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Gider Kategorisi</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c.key}
                onClick={() => setCategory(c.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  category === c.key
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4 — Tutar */}
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

        {/* 5 — Tarih */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Tarih</p>
          <input
            type="date"
            value={costDate}
            onChange={(e) => setCostDate(e.target.value)}
            className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm font-medium text-primary-800 outline-none focus:border-primary-400"
          />
        </div>

        {/* 6 — Açıklama */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Açıklama <span className="font-normal normal-case text-neutral-400">(opsiyonel)</span>
          </p>
          <textarea
            value={description}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Ör: Zemin kat döşeme malzemesi, vinç kiralama..."
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
            Maliyet kaydedildi! Yönlendiriliyor...
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
          ) : 'Maliyeti Kaydet'}
        </button>
      </div>

    </div>
  )
}
