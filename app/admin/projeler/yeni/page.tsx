'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ── Sabitler ─────────────────────────────────────────────────────────────────
const TIP_OPTIONS    = ['Konut', 'Ticari']
const STATUS_OPTIONS = [
  { key: 'yakinda',    label: 'Planlama',      bg: 'bg-warning-50',  text: 'text-warning-700' },
  { key: 'devam',      label: 'Devam Ediyor',  bg: 'bg-success-50',  text: 'text-success-700' },
  { key: 'tamamlandi', label: 'Tamamlandı',    bg: 'bg-info-50',     text: 'text-info-700'    },
  { key: 'gecikmede',  label: 'Gecikmede',     bg: 'bg-danger-50',   text: 'text-danger-700'  },
]
const FEATURE_OPTIONS = [
  { key: 'kapali-otopark',    label: 'Kapalı Otopark'    },
  { key: 'acik-otopark',      label: 'Açık Otopark'      },
  { key: 'asansor',           label: 'Asansör'            },
  { key: 'guvenlik-kamerasi', label: 'Güvenlik Kamerası'  },
  { key: 'gorevli-guvenlik',  label: 'Görevli Güvenlik'   },
  { key: 'jenerator',         label: 'Jeneratör'          },
  { key: 'dogalgaz',          label: 'Doğalgaz'           },
  { key: 'kombili',           label: 'Bireysel Kombi'     },
  { key: 'merkezi-isitma',    label: 'Merkezi Isıtma'     },
  { key: 'interkom',          label: 'İnterkom / Diafon'  },
  { key: 'yangin-merdiveni',  label: 'Yangın Merdiveni'   },
  { key: 'teras',             label: 'Teras / Çatı Katı'  },
  { key: 'bahce',             label: 'Bahçe / Yeşil Alan' },
  { key: 'deprem-yalitim',    label: 'Deprem İzolatörü'   },
  { key: 'isı-yalitim',       label: 'Isı Yalıtımı'       },
  { key: 'ses-yalitim',       label: 'Ses Yalıtımı'       },
  { key: 'elektrikli-panjur', label: 'Elektrikli Panjür'  },
]

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

const inCls = "w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors placeholder:text-neutral-400"
const lblCls = "block text-xs font-medium text-neutral-500 mb-1.5"

// ── Kart bileşeni ─────────────────────────────────────────────────────────────
const Card = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
  <div className={`bg-white rounded-2xl border border-neutral-100 p-4 md:p-5 ${className}`}>
    <h2 className="font-bold text-base text-primary-800 mb-4">{title}</h2>
    {children}
  </div>
)

// ── Ana Sayfa ─────────────────────────────────────────────────────────────────
export default function ProjeEklePage() {
  const router = useRouter()

  const [name,         setName]         = useState('')
  const [district,     setDistrict]     = useState('')
  const [city,         setCity]         = useState('İstanbul')
  const [location,     setLocation]     = useState('')
  const [tip,          setTip]          = useState('Konut')
  const [status,       setStatus]       = useState('yakinda')
  const [floors,       setFloors]       = useState('')
  const [unitsCount,   setUnitsCount]   = useState('')
  const [area,         setArea]         = useState('')
  const [deliveryYear, setDeliveryYear] = useState('')
  const [progress,     setProgress]     = useState(0)
  const [description,  setDescription]  = useState('')
  const [features,     setFeatures]     = useState<string[]>([])
  const [saving,       setSaving]       = useState(false)
  const [error,        setError]        = useState('')

  const loc = [district, city].filter(Boolean).join(' / ') || 'Konum girilmedi'
  const st  = STATUS_OPTIONS.find(s => s.key === status) ?? STATUS_OPTIONS[0]

  function toggleFeature(key: string) {
    setFeatures(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key])
  }

  async function handleSave() {
    if (!name.trim())     { setError('Proje adı zorunlu.'); return }
    if (!district.trim()) { setError('İlçe zorunlu.'); return }
    setSaving(true); setError('')
    const slug = slugify(name.trim()) + '-' + Date.now().toString().slice(-4)
    const { error: err } = await supabase.from('projects').insert({
      name: name.trim(), slug,
      location: location.trim() || district.trim(),
      district: district.trim(),
      city: city.trim() || 'İstanbul',
      tip, status,
      floors:        floors      ? parseInt(floors)      : null,
      units_count:   unitsCount  ? parseInt(unitsCount)  : null,
      area:          area.trim() || null,
      delivery_year: deliveryYear.trim() || null,
      progress,
      description:   description.trim() || null,
      features:      features.length > 0 ? features : null,
    })
    setSaving(false)
    if (err) { setError('Hata: ' + err.message); return }
    router.push(`/admin/proje/${slug}`)
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">

      {/* ── Üst başlık (proje detay ile aynı stil) ── */}
      <div className="bg-white border-b border-neutral-100 px-4 md:px-6 pt-4 pb-0">

        {/* Breadcrumb + Kaydet butonu */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 text-sm min-w-0">
            <Link href="/admin/projeler" className="text-primary-500 font-medium hover:underline flex items-center gap-1 flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Projeler
            </Link>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M9 18l6-6-6-6" stroke="#D3D1C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-primary-800 font-semibold truncate">
              {name.trim() || 'Yeni Proje'}
            </span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-shrink-0 flex items-center gap-1.5 bg-primary-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-60 transition-colors ml-3">
            {saving
              ? <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg> Kaydediliyor</>
              : <><svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/><polyline points="17 21 17 13 7 13 7 21" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/><polyline points="7 3 7 8 15 8" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/></svg> Kaydet</>
            }
          </button>
        </div>

        {/* Proje bilgisi satırı — Mobil */}
        <div className="md:hidden flex gap-3 mb-4">
          <div className="w-[88px] h-[80px] rounded-xl bg-neutral-100 flex-shrink-0 flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 21V9l9-6 9 6v12H3z" stroke="#D3D1C7" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-primary-800 leading-tight mb-0.5">
              {name.trim() || <span className="text-neutral-400 font-normal">Proje adı giriniz...</span>}
            </h1>
            <p className="flex items-center gap-1 text-xs text-neutral-500 mb-2.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#888780"/></svg>
              {loc}
            </p>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${st.bg} ${st.text}`}>{st.label}</span>
              <span className="text-[10px] text-neutral-400">{tip}</span>
            </div>
          </div>
        </div>

        {/* Proje bilgisi satırı — Desktop */}
        <div className="hidden md:flex gap-5 mb-5">
          <div className="w-[180px] h-[130px] rounded-xl bg-neutral-100 flex-shrink-0 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none"><path d="M3 21V9l9-6 9 6v12H3z" stroke="#D3D1C7" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 min-w-0 py-1">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="font-bold text-2xl text-primary-800 leading-tight">
                {name.trim() || <span className="text-neutral-400 font-normal text-xl">Proje adı giriniz...</span>}
              </h1>
              <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-xl ${st.bg} ${st.text}`}>{st.label}</span>
            </div>
            <p className="flex items-center gap-1 text-sm text-neutral-500 mb-3">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#888780"/></svg>
              {loc}
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { l: 'Proje Tipi',    v: tip },
                { l: 'Daire Sayısı',  v: unitsCount || '—' },
                { l: 'İnşaat Alanı',  v: area ? `${area} m²` : '—' },
                { l: 'Teslim',        v: deliveryYear || '—' },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="text-[10px] text-neutral-400">{l}</p>
                  <p className="font-bold text-sm text-primary-800 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tab bar (tek tab: Genel Bakış) */}
        <div className="flex overflow-x-auto -mx-4 md:-mx-6 px-4 md:px-6 gap-0">
          <button className="flex-shrink-0 px-4 py-3 text-sm font-semibold border-b-2 border-primary-800 text-primary-800 whitespace-nowrap">
            Genel Bakış
          </button>
          {['Finansal', 'Daireler', 'Evraklar', 'Notlar'].map(t => (
            <button key={t} className="flex-shrink-0 px-4 py-3 text-sm font-semibold border-b-2 border-transparent text-neutral-400 whitespace-nowrap cursor-not-allowed" title="Önce projeyi kaydedin">
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── İçerik ── */}
      <div className="p-4 md:p-6">
        {error && (
          <div className="bg-danger-50 border border-danger-100 rounded-xl px-4 py-3 text-sm text-danger-700 mb-4">{error}</div>
        )}

        <div className="md:flex md:gap-5 md:items-start">
          {/* Sol kolon */}
          <div className="md:flex-1 space-y-4 min-w-0">

            {/* Proje Adı */}
            <Card title="Proje Adı">
              <input value={name} onChange={e => { setName(e.target.value); setError('') }}
                placeholder="Örn: Kemal Apartmanı" className={inCls} autoFocus />
            </Card>

            {/* Durum & Tip */}
            <Card title="Durum ve Tip">
              <label className={lblCls}>Proje Tipi</label>
              <div className="flex gap-2 mb-4">
                {TIP_OPTIONS.map(t => (
                  <button key={t} onClick={() => setTip(t)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${tip === t ? 'bg-primary-800 text-white border-primary-800' : 'bg-neutral-50 text-neutral-600 border-neutral-100 hover:border-primary-300'}`}>
                    {t}
                  </button>
                ))}
              </div>
              <label className={lblCls}>Durum</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUS_OPTIONS.map(s => (
                  <button key={s.key} onClick={() => setStatus(s.key)}
                    className={`py-2.5 rounded-xl text-sm font-medium border transition-colors ${status === s.key ? `${s.bg} ${s.text} border-transparent` : 'bg-neutral-50 text-neutral-600 border-neutral-100 hover:border-primary-300'}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Genel Bilgiler */}
            <Card title="Genel Bilgiler">
              <div className="space-y-3">
                <div>
                  <label className={lblCls}>İlçe <span className="text-danger-500">*</span></label>
                  <input value={district} onChange={e => { setDistrict(e.target.value); setError('') }}
                    placeholder="Örn: Avcılar" className={inCls} />
                </div>
                <div>
                  <label className={lblCls}>Şehir</label>
                  <input value={city} onChange={e => setCity(e.target.value)}
                    placeholder="İstanbul" className={inCls} />
                </div>
                <div>
                  <label className={lblCls}>Tam Adres / Sokak</label>
                  <input value={location} onChange={e => setLocation(e.target.value)}
                    placeholder="Örn: Türkçü Sok. No:6" className={inCls} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={lblCls}>Kat Sayısı</label>
                    <input type="number" value={floors} onChange={e => setFloors(e.target.value)}
                      placeholder="8" className={inCls} />
                  </div>
                  <div>
                    <label className={lblCls}>Daire Sayısı</label>
                    <input type="number" value={unitsCount} onChange={e => setUnitsCount(e.target.value)}
                      placeholder="24" className={inCls} />
                  </div>
                  <div>
                    <label className={lblCls}>İnşaat Alanı (m²)</label>
                    <input value={area} onChange={e => setArea(e.target.value)}
                      placeholder="850 m²" className={inCls} />
                  </div>
                  <div>
                    <label className={lblCls}>Teslim Yılı</label>
                    <input value={deliveryYear} onChange={e => setDeliveryYear(e.target.value)}
                      placeholder="2026" className={inCls} />
                  </div>
                </div>
                <div>
                  <label className={lblCls}>Açıklama</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)}
                    placeholder="Proje hakkında kısa bilgi..." rows={3}
                    className={inCls + ' resize-none'} />
                </div>
              </div>
            </Card>

            {/* İnşaat İlerlemesi */}
            <Card title="İnşaat İlerlemesi">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-neutral-500">Genel İlerleme</span>
                <span className="text-sm font-bold text-success-700">%{progress}</span>
              </div>
              <input type="range" min={0} max={100} value={progress}
                onChange={e => setProgress(Number(e.target.value))}
                className="w-full accent-[#0F6E56]" />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-neutral-400">%0</span>
                <span className="text-xs text-neutral-400">%100</span>
              </div>
            </Card>

          </div>

          {/* Sağ kolon — desktop */}
          <div className="hidden md:block md:w-[380px] space-y-4 flex-shrink-0">
            <Card title="Bina Özellikleri">
              <div className="grid grid-cols-2 gap-2">
                {FEATURE_OPTIONS.map(f => {
                  const on = features.includes(f.key)
                  return (
                    <button key={f.key} onClick={() => toggleFeature(f.key)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left border transition-colors text-sm ${on ? 'bg-primary-800 text-white border-primary-800' : 'bg-neutral-50 text-neutral-600 border-neutral-100 hover:border-primary-300'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${on ? 'bg-white' : 'bg-neutral-300'}`}/>
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>

          {/* Bina Özellikleri — mobil */}
          <div className="md:hidden mt-4">
            <Card title={`Bina Özellikleri (${features.length} seçildi)`}>
              <div className="grid grid-cols-2 gap-2">
                {FEATURE_OPTIONS.map(f => {
                  const on = features.includes(f.key)
                  return (
                    <button key={f.key} onClick={() => toggleFeature(f.key)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left border transition-colors text-sm ${on ? 'bg-primary-800 text-white border-primary-800' : 'bg-neutral-50 text-neutral-600 border-neutral-100 hover:border-primary-300'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${on ? 'bg-white' : 'bg-neutral-300'}`}/>
                      {f.label}
                    </button>
                  )
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
