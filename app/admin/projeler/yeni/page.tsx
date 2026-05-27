'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const TIP_OPTIONS    = ['Konut', 'Ticari']
const STATUS_OPTIONS = [
  { key: 'devam',      label: 'Devam Ediyor' },
  { key: 'yakinda',    label: 'Planlama'     },
  { key: 'tamamlandi', label: 'Tamamlandı'   },
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export default function ProjeEklePage() {
  const router = useRouter()

  const [name,         setName]         = useState('')
  const [location,     setLocation]     = useState('')
  const [district,     setDistrict]     = useState('')
  const [city,         setCity]         = useState('İstanbul')
  const [tip,          setTip]          = useState('Konut')
  const [status,       setStatus]       = useState('yakinda')
  const [floors,       setFloors]       = useState('')
  const [unitsCount,   setUnitsCount]   = useState('')
  const [area,         setArea]         = useState('')
  const [deliveryYear, setDeliveryYear] = useState('')
  const [progress,     setProgress]     = useState('0')
  const [description,  setDescription]  = useState('')

  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSave() {
    if (!name.trim())     { setError('Proje adı zorunlu.'); return }
    if (!location.trim()) { setError('Konum zorunlu.'); return }
    if (!district.trim()) { setError('İlçe zorunlu.'); return }

    setSaving(true)
    setError('')

    const slug = slugify(name.trim()) + '-' + Date.now().toString().slice(-4)

    const { error: err } = await supabase.from('projects').insert({
      name:          name.trim(),
      slug,
      location:      location.trim(),
      district:      district.trim(),
      city:          city.trim() || 'İstanbul',
      tip,
      status,
      floors:        floors     ? parseInt(floors)     : null,
      units_count:   unitsCount ? parseInt(unitsCount) : null,
      area:          area.trim() || null,
      delivery_year: deliveryYear.trim() || null,
      progress:      parseInt(progress) || 0,
      description:   description.trim() || null,
    })

    setSaving(false)
    if (err) { setError('Hata: ' + err.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/admin/projeler'), 1500)
  }

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
          <h1 className="font-bold text-xl text-primary-800">Proje Ekle</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Yeni inşaat projesini sisteme kaydet.</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-6 max-w-lg mx-auto">

        {/* Proje Adı */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Proje Adı</p>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder="Örn: Kemal Apartmanı"
            className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-base font-medium text-primary-800 outline-none focus:border-primary-400 placeholder:text-neutral-300"
          />
        </div>

        {/* Tip */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Proje Tipi</p>
          <div className="flex gap-2">
            {TIP_OPTIONS.map((t) => (
              <button
                key={t}
                onClick={() => setTip(t)}
                className={`flex-1 py-3 rounded-2xl text-sm font-semibold border transition-all ${
                  tip === t
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Durum */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Durum</p>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s.key}
                onClick={() => setStatus(s.key)}
                className={`flex-1 py-2.5 rounded-2xl text-sm font-medium border transition-all ${
                  status === s.key
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Konum */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Konum</p>
          <div className="space-y-2">
            <input
              type="text"
              value={district}
              onChange={(e) => { setDistrict(e.target.value); setError('') }}
              placeholder="İlçe — Örn: Avcılar"
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
            />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Şehir — Örn: İstanbul"
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
            />
            <input
              type="text"
              value={location}
              onChange={(e) => { setLocation(e.target.value); setError('') }}
              placeholder="Tam adres / sokak — Örn: Türkçü Sok. No:6"
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
            />
          </div>
        </div>

        {/* Rakamlar */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Proje Detayları</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Kat Sayısı',     value: floors,       setter: setFloors,       placeholder: 'Örn: 8',    type: 'number' },
              { label: 'Daire Sayısı',   value: unitsCount,   setter: setUnitsCount,   placeholder: 'Örn: 24',   type: 'number' },
              { label: 'Brüt m²',        value: area,         setter: setArea,         placeholder: 'Örn: 120',  type: 'text'   },
              { label: 'Teslim Yılı',    value: deliveryYear, setter: setDeliveryYear, placeholder: 'Örn: 2026', type: 'text'   },
            ].map((f) => (
              <div key={f.label} className="bg-white border border-neutral-200 rounded-2xl px-4 py-3">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">{f.label}</p>
                <input
                  type={f.type}
                  inputMode={f.type === 'number' ? 'numeric' : 'text'}
                  value={f.value}
                  onChange={(e) => f.setter(e.target.value)}
                  placeholder={f.placeholder}
                  className="w-full text-base font-bold text-primary-800 outline-none placeholder:text-neutral-300 placeholder:font-normal"
                />
              </div>
            ))}
          </div>
        </div>

        {/* İlerleme */}
        <div>
          <div className="flex justify-between mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">İnşaat İlerlemesi</p>
            <span className="text-sm font-bold text-primary-800">%{progress}</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            className="w-full accent-primary-800"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-neutral-400">0%</span>
            <span className="text-xs text-neutral-400">100%</span>
          </div>
        </div>

        {/* Açıklama */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            Açıklama <span className="font-normal normal-case text-neutral-400">(opsiyonel)</span>
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Proje hakkında kısa bilgi..."
            rows={3}
            className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300 resize-none"
          />
        </div>

        {/* Hata / Başarı */}
        {error && (
          <div className="bg-danger-50 border border-danger-100 rounded-2xl px-4 py-3 text-sm text-danger-700">{error}</div>
        )}
        {success && (
          <div className="bg-success-50 border border-success-100 rounded-2xl px-4 py-3 text-sm text-success-700 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Proje kaydedildi! Yönlendiriliyor...
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
          ) : 'Projeyi Kaydet'}
        </button>
      </div>

    </div>
  )
}
