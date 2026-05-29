'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────────
type Project = {
  id: string; name: string; slug: string
  location: string; district: string; city: string
  tip: string; status: string; floors: number
  units_count: number; area: string
  delivery_date: string | null; delivery_year: string | null
  progress: number; image_url: string; description: string
  features: string[] | null
}
type Tab = 'genel' | 'finansal' | 'daireler' | 'evraklar' | 'malikler' | 'notlar' | 'ayarlar'
type EditKey = 'bilgiler' | 'ozellikler' | 'ilerleme' | 'konum' | null
type NearbyPlace = { label: string; desc: string }
type DaireDurum = 'satildi' | 'musait' | 'rezerve'
type DaireItem = { id: number; katNo: number; no: number; tip: string; brut: number; durum: DaireDurum; malik?: string }
type DaireForm  = { tip: string; brut: string; malik: string }
type TahsilatItem = { id: string; ad: string; tutar: number; tarih: string }
type KalemItem    = { id: string; label: string; tutar: number; tarih: string; color: string }

// ── Sabit veriler ──────────────────────────────────────────────────────────────
const FINANSAL = { sozlesme: 18_000_000, tahsilEdilecek: 3_500_000, tahsilEdilen: 2_000_000, maliyet: 170_000 }

const MALIYET_KALEMLERI = [
  { label: 'İnşaat İşleri',       color: '#3B82F6', butce: 12_000_000, gerceklesen: 8_950_000 },
  { label: 'Malzeme Giderleri',   color: '#22C55E', butce:  6_500_000, gerceklesen: 4_650_000 },
  { label: 'İşçilik Giderleri',   color: '#F59E0B', butce:  3_200_000, gerceklesen: 2_450_000 },
  { label: 'Elektrik - Mekanik',  color: '#6B7280', butce:  1_500_000, gerceklesen: 1_050_000 },
  { label: 'Proje - Danışmanlık', color: '#8B5CF6', butce:    800_000, gerceklesen:   620_000 },
  { label: 'Diğer Giderler',      color: '#EF4444', butce:    750_000, gerceklesen:   520_000 },
]

const KALEM_RENKLER = ['#3B82F6','#22C55E','#F59E0B','#6B7280','#8B5CF6','#EF4444','#06B6D4','#F97316']

const INIT_TAHSILATLAR: TahsilatItem[] = []

const INIT_KALEMLER: KalemItem[] = []

const MASRAFLAR = [
  { aciklama: 'Malzeme Giderleri - Çimento Alımı - 50 Ton',          tutar: 125_000, tarih: '24.05.2026', kategori: 'Malzeme', katBg: 'bg-warning-50',  katText: 'text-warning-700' },
  { aciklama: 'Resmi Harç ve Ruhsat - Ruhsat ve Harç Ödemesi',       tutar:  45_000, tarih: '20.05.2026', kategori: 'Resmi',   katBg: 'bg-info-50',     katText: 'text-info-700'    },
]

const MALIKLER_ODEMELER = [
  { name: 'Emre Dağ',     toplam: 1_500_000, odenen: 500_000   },
  { name: 'Ahmet Yılmaz', toplam: 1_200_000, odenen: 1_200_000 },
  { name: 'Mehmet Kaya',  toplam: 1_000_000, odenen: 300_000   },
  { name: 'Ayşe Demir',   toplam: 1_000_000, odenen: 0         },
  { name: 'Fatma Şahin',  toplam:   800_000, odenen: 0         },
]

const getKatLabel = (n: number) => n === 1 ? '1. Kat (Zemin)' : `${n}. Kat`

const INITIAL_DAIRELER: DaireItem[] = [
  // Kat 1 (Zemin)
  { id:1,  katNo:1, no:1,  tip:'Dükkan', brut:110, durum:'satildi', malik:'Market Express' },
  { id:2,  katNo:1, no:2,  tip:'Dükkan', brut:95,  durum:'musait'                          },
  { id:3,  katNo:1, no:3,  tip:'2+1',    brut:90,  durum:'satildi', malik:'Emre Dağ'       },
  { id:4,  katNo:1, no:4,  tip:'3+1',    brut:120, durum:'satildi', malik:'Ahmet Yılmaz'   },
  // Kat 2
  { id:5,  katNo:2, no:5,  tip:'2+1',    brut:90,  durum:'satildi', malik:'Mehmet Kaya'    },
  { id:6,  katNo:2, no:6,  tip:'2+1',    brut:90,  durum:'satildi', malik:'Ayşe Demir'     },
  { id:7,  katNo:2, no:7,  tip:'3+1',    brut:105, durum:'satildi', malik:'Fatma Şahin'    },
  { id:8,  katNo:2, no:8,  tip:'3+1',    brut:105, durum:'musait'                          },
  // Kat 3
  { id:9,  katNo:3, no:9,  tip:'1+1',    brut:65,  durum:'satildi', malik:'Emre Dağ'       },
  { id:10, katNo:3, no:10, tip:'1+1',    brut:65,  durum:'satildi', malik:'Ahmet Yılmaz'   },
  { id:11, katNo:3, no:11, tip:'2+1',    brut:85,  durum:'satildi', malik:'Mehmet Kaya'    },
  { id:12, katNo:3, no:12, tip:'2+1',    brut:85,  durum:'musait'                          },
  // Kat 4
  { id:13, katNo:4, no:13, tip:'2+1',    brut:90,  durum:'satildi', malik:'Ayşe Demir'     },
  { id:14, katNo:4, no:14, tip:'2+1',    brut:90,  durum:'satildi', malik:'Fatma Şahin'    },
  { id:15, katNo:4, no:15, tip:'3+1',    brut:110, durum:'musait'                          },
  { id:16, katNo:4, no:16, tip:'3+1',    brut:110, durum:'musait'                          },
  // Kat 5
  { id:17, katNo:5, no:17, tip:'2+1',    brut:90,  durum:'satildi', malik:'Emre Dağ'       },
  { id:18, katNo:5, no:18, tip:'2+1',    brut:90,  durum:'satildi', malik:'Ahmet Yılmaz'   },
  { id:19, katNo:5, no:19, tip:'3+1',    brut:115, durum:'satildi', malik:'Mehmet Kaya'    },
  { id:20, katNo:5, no:20, tip:'3+1',    brut:115, durum:'musait'                          },
  // Kat 6
  { id:21, katNo:6, no:21, tip:'2+1',    brut:90,  durum:'rezerve'                         },
  { id:22, katNo:6, no:22, tip:'2+1',    brut:90,  durum:'musait'                          },
  { id:23, katNo:6, no:23, tip:'3+1',    brut:120, durum:'musait'                          },
  { id:24, katNo:6, no:24, tip:'3+1',    brut:120, durum:'rezerve'                         },
]

// Anahtarlar yeni/page.tsx ile aynı (kebab-case) — Supabase features sütunuyla eşleşmeli
const FEATURES = [
  { key: 'kapali-otopark',    label: 'Kapalı Otopark',       icon: '/icons/bina-otopark.svg'    },
  { key: 'acik-otopark',      label: 'Açık Otopark',          icon: '/icons/car.svg'             },
  { key: 'asansor',           label: 'Asansör',               icon: '/icons/elevator.svg'        },
  { key: 'guvenlik-kamerasi', label: 'Güvenlik Kamerası',     icon: '/icons/camera-security.svg' },
  { key: 'gorevli-guvenlik',  label: 'Görevli Güvenlik',      icon: '/icons/security.svg'        },
  { key: 'jenerator',         label: 'Jeneratör',             icon: '/icons/generator.svg'       },
  { key: 'dogalgaz',          label: 'Doğalgaz',              icon: '/icons/bina-klima.svg'      },
  { key: 'kombili',           label: 'Bireysel Kombi',         icon: '/icons/home-roof.svg'       },
  { key: 'merkezi-isitma',    label: 'Merkezi Isıtma',        icon: '/icons/home-roof.svg'       },
  { key: 'interkom',          label: 'İnterkom / Diafon',     icon: '/icons/bell.svg'            },
  { key: 'yangin-merdiveni',  label: 'Yangın Merdiveni',      icon: '/icons/building.svg'        },
  { key: 'teras',             label: 'Teras / Çatı Katı',     icon: '/icons/bina-balkon.svg'     },
  { key: 'bahce',             label: 'Bahçe / Yeşil Alan',    icon: '/icons/tree.svg'            },
  { key: 'deprem-yalitim',    label: 'Deprem İzolatörü',       icon: '/icons/building.svg'        },
  { key: 'isı-yalitim',       label: 'Isı Yalıtımı',          icon: '/icons/bina-yerden.svg'     },
  { key: 'ses-yalitim',       label: 'Ses Yalıtımı',          icon: '/icons/bina-depo.svg'       },
  { key: 'elektrikli-panjur', label: 'Elektrikli Panjür',     icon: '/icons/bina-yon.svg'        },
]

const PHASES = [
  { label: 'Temel Kazı',        done: true  },
  { label: 'Betonarme',         done: true  },
  { label: 'Duvar Örme',        done: true  },
  { label: 'Elektrik Tesisatı', done: false },
  { label: 'İç Sıva',           done: false },
  { label: 'Dış Cephe',         done: false },
  { label: 'İç Mekan',          done: false },
  { label: 'Peyzaj',            done: false },
]

const STATUS_STYLE: Record<string, { bg: string; text: string; label: string }> = {
  devam:      { bg: 'bg-success-50', text: 'text-success-700', label: 'Devam Ediyor' },
  tamamlandi: { bg: 'bg-info-50',    text: 'text-info-700',    label: 'Tamamlandı'   },
  yakinda:    { bg: 'bg-warning-50', text: 'text-warning-700', label: 'Planlama'     },
  gecikmede:  { bg: 'bg-danger-50',  text: 'text-danger-700',  label: 'Gecikmede'    },
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const tl = (n: number) => new Intl.NumberFormat('tr-TR').format(n) + ' TL'
const fmtDate = (d?: string | null) => {
  if (!d) return '—'
  if (/^\d{4}$/.test(d)) return d
  return new Date(d).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
}

// ── Küçük bileşenler ───────────────────────────────────────────────────────────
const EditBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}
    className="flex items-center gap-1.5 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 transition-colors flex-shrink-0">
    <img src="/icons/edit.svg" alt="" width={13} height={13} />
    Düzenle
  </button>
)

const Card = ({ title, onEdit, children, className = '' }: {
  title: string; onEdit?: () => void; children: React.ReactNode; className?: string
}) => (
  <div className={`bg-white rounded-2xl border border-neutral-100 p-4 md:p-5 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-bold text-base text-primary-800">{title}</h2>
      {onEdit && <EditBtn onClick={onEdit} />}
    </div>
    {children}
  </div>
)

// ── Modal ──────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, onSave, saveLabel = 'Kaydet', saving = false, children }: {
  title: string; onClose: () => void; onSave?: () => void
  saveLabel?: string; saving?: boolean; children: React.ReactNode
}) => (
  <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={onClose}>
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-2xl px-5 pt-4 pb-10 md:pb-6 max-h-[85vh] overflow-y-auto"
      onClick={e => e.stopPropagation()}>
      <div className="mx-auto w-10 h-1 bg-neutral-200 rounded-full mb-4 md:hidden" />
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-lg text-primary-800">{title}</h3>
        <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {children}
      {onSave && (
        <button onClick={onSave} disabled={saving}
          className="mt-5 w-full bg-primary-800 text-white py-3 rounded-xl font-semibold text-sm hover:bg-primary-700 disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
          {saving && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>}
          {saveLabel}
        </button>
      )}
    </div>
  </div>
)

// ── Finansal Kartlar (Genel Bakış tab için küçük sidebar versiyonu) ─────────────
const FinansalKartlar = () => (
  <Card title="Finansal Özet">
    <div className="grid grid-cols-2 gap-3">
      {[
        { label: 'Sözleşme Bedeli',      v: FINANSAL.sozlesme,       icon: '/icons/document.svg', color: 'text-primary-800' },
        { label: 'Tahsil Edilecek',      v: FINANSAL.tahsilEdilecek, icon: '/icons/wallet.svg',   color: 'text-warning-700' },
        { label: 'Tahsil Edilen',        v: FINANSAL.tahsilEdilen,   icon: '/icons/card.svg',     color: 'text-success-700' },
        { label: 'Güncel Proje Maliyeti', v: FINANSAL.maliyet,       icon: '/icons/building.svg', color: 'text-danger-700'  },
      ].map(c => (
        <div key={c.label} className="bg-neutral-50 rounded-xl p-3 md:p-4">
          <img src={c.icon} alt="" width={26} height={26} className="mb-2.5 opacity-75" />
          <p className="text-[11px] text-neutral-500 mb-1 leading-tight">{c.label}</p>
          <p className={`font-bold text-sm md:text-base ${c.color} leading-tight`}>{tl(c.v)}</p>
        </div>
      ))}
    </div>
  </Card>
)

// ── Genel Bilgiler ─────────────────────────────────────────────────────────────
const GenelBilgilerKart = ({ project, onEdit }: { project: Project; onEdit: () => void }) => {
  const loc = [project.district, project.city].filter(Boolean).join(' / ') || project.location
  const st  = STATUS_STYLE[project.status] ?? STATUS_STYLE['devam']
  const rows = [
    { l: 'Proje Adı',           v: project.name,                    badge: false },
    { l: 'Toplam İnşaat Alanı', v: project.area || '—',             badge: false },
    { l: 'Lokasyon',            v: loc,                             badge: false },
    { l: 'Daire Sayısı',        v: String(project.units_count),     badge: false },
    { l: 'Kat Sayısı',          v: project.floors ? `${project.floors} Kat` : '—', badge: false },
    { l: 'Proje Tipi',          v: project.tip,                     badge: false },
    { l: 'Teslim Tarihi',       v: fmtDate(project.delivery_date || project.delivery_year), badge: false },
    { l: 'Arsa Alanı',          v: '1.250 m²',                      badge: false },
    { l: 'Durum',               v: st.label,                        badge: true, badgeClass: `${st.bg} ${st.text}` },
  ]
  return (
    <Card title="Genel Bilgiler" onEdit={onEdit}>
      <div className="md:hidden divide-y divide-neutral-50">
        {rows.map(r => (
          <div key={r.l} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0">
            <span className="text-sm text-neutral-500">{r.l}</span>
            {r.badge
              ? <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${r.badgeClass}`}>{r.v}</span>
              : <span className="text-sm font-semibold text-primary-800 text-right max-w-[55%]">{r.v}</span>
            }
          </div>
        ))}
      </div>
      <div className="hidden md:grid md:grid-cols-2 md:gap-x-8 divide-y divide-neutral-50">
        {rows.map((r, i) => (
          <div key={r.l} className={`flex items-center justify-between py-2.5 ${i < 2 ? 'pt-0' : ''} ${i >= rows.length - 2 ? 'pb-0' : ''}`}>
            <span className="text-sm text-neutral-500 flex-shrink-0">{r.l}</span>
            {r.badge
              ? <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${r.badgeClass}`}>{r.v}</span>
              : <span className="text-sm font-semibold text-primary-800 text-right">{r.v}</span>
            }
          </div>
        ))}
      </div>
    </Card>
  )
}

const GenelBilgilerModal = ({ project, onClose, onSaved }: {
  project: Project; onClose: () => void; onSaved: (updates: Partial<Project>) => void
}) => {
  const [name,     setName]     = useState(project.name)
  const [district, setDistrict] = useState(project.district || '')
  const [city,     setCity]     = useState(project.city || '')
  const [area,     setArea]     = useState(project.area || '')
  const [units,    setUnits]    = useState(String(project.units_count || ''))
  const [floors,   setFloors]   = useState(String(project.floors || ''))
  const [delivery, setDelivery] = useState(project.delivery_year || project.delivery_date || '')
  const [tip,      setTip]      = useState(project.tip || 'Konut')
  const [saving,   setSaving]   = useState(false)

  const inputCls = "w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2.5 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors"
  const lbl      = (t: string) => <label className="block text-xs text-neutral-500 mb-1.5 font-medium">{t}</label>

  const handleSave = async () => {
    if (!name.trim()) return
    setSaving(true)
    const updates: Partial<Project> = {
      name:          name.trim(),
      district:      district.trim(),
      city:          city.trim(),
      area:          area.trim(),
      units_count:   parseInt(units) || project.units_count,
      floors:        parseInt(floors) || project.floors,
      delivery_year: delivery.trim() || null,
      tip,
    }
    await supabase.from('projects').update(updates).eq('id', project.id)
    onSaved(updates)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="Genel Bilgileri Düzenle" onClose={onClose} onSave={handleSave} saving={saving}>
      <div className="mb-4">{lbl('Proje Adı')}<input value={name} onChange={e => setName(e.target.value)} placeholder="Proje adı" className={inputCls} /></div>
      <div className="mb-4">{lbl('İlçe')}<input value={district} onChange={e => setDistrict(e.target.value)} placeholder="Bağcılar" className={inputCls} /></div>
      <div className="mb-4">{lbl('Şehir')}<input value={city} onChange={e => setCity(e.target.value)} placeholder="İstanbul" className={inputCls} /></div>
      <div className="mb-4">{lbl('İnşaat Alanı (m²)')}<input value={area} onChange={e => setArea(e.target.value)} placeholder="850 m²" className={inputCls} /></div>
      <div className="mb-4">{lbl('Daire Sayısı')}<input type="number" value={units} onChange={e => setUnits(e.target.value)} placeholder="24" className={inputCls} /></div>
      <div className="mb-4">{lbl('Kat Sayısı')}<input type="number" value={floors} onChange={e => setFloors(e.target.value)} placeholder="6" className={inputCls} /></div>
      <div className="mb-4">{lbl('Teslim Yılı')}<input value={delivery} onChange={e => setDelivery(e.target.value)} placeholder="2026" className={inputCls} /></div>
      <div className="mb-4">
        {lbl('Proje Tipi')}
        <select value={tip} onChange={e => setTip(e.target.value)} className={inputCls + ' appearance-none cursor-pointer'}>
          <option>Konut</option><option>Ticari</option>
        </select>
      </div>
    </Modal>
  )
}

// ── Bina Özellikleri ───────────────────────────────────────────────────────────
const BinaOzellikleriKart = ({ activeFeatures, onEdit }: { activeFeatures: Set<string>; onEdit: () => void }) => (
  <Card title="Bina Özellikleri" onEdit={onEdit}>
    <div className="grid grid-cols-4 md:hidden gap-3">
      {FEATURES.map(f => {
        const on = activeFeatures.has(f.key)
        return (
          <div key={f.key} className="flex flex-col items-center gap-1">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${on ? 'bg-primary-50' : 'bg-neutral-100'}`}>
              <img src={f.icon} alt={f.label} width={24} height={24} className={on ? 'opacity-80' : 'opacity-25'} />
            </div>
            <p className={`text-[9px] text-center leading-tight ${on ? 'text-neutral-600' : 'text-neutral-400'}`}>{f.label}</p>
            <p className={`text-[9px] font-bold ${on ? 'text-success-700' : 'text-neutral-400'}`}>{on ? 'Var' : 'Yok'}</p>
          </div>
        )
      })}
    </div>
    <div className="hidden md:grid grid-cols-6 gap-4">
      {FEATURES.map(f => {
        const on = activeFeatures.has(f.key)
        return (
          <div key={f.key} className="flex flex-col items-center gap-1.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${on ? 'bg-primary-50' : 'bg-neutral-100'}`}>
              <img src={f.icon} alt={f.label} width={24} height={24} className={on ? 'opacity-80' : 'opacity-25'} />
            </div>
            <p className={`text-[10px] text-center leading-tight ${on ? 'text-neutral-600' : 'text-neutral-400'}`}>{f.label}</p>
            <p className={`text-[10px] font-bold ${on ? 'text-success-700' : 'text-neutral-400'}`}>{on ? 'Var' : 'Yok'}</p>
          </div>
        )
      })}
    </div>
  </Card>
)

const BinaOzellikleriModal = ({ activeFeatures, setActiveFeatures, projectId, onClose }: {
  activeFeatures: Set<string>; setActiveFeatures: (s: Set<string>) => void
  projectId: string; onClose: () => void
}) => {
  const [saving, setSaving] = useState(false)

  const toggle = (key: string) => {
    const n = new Set(activeFeatures); n.has(key) ? n.delete(key) : n.add(key); setActiveFeatures(n)
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('projects').update({ features: Array.from(activeFeatures) }).eq('id', projectId)
    setSaving(false)
    onClose()
  }

  return (
    <Modal title="Bina Özelliklerini Düzenle" onClose={onClose} onSave={handleSave} saving={saving}>
      <div className="grid grid-cols-2 gap-2">
        {FEATURES.map(f => {
          const on = activeFeatures.has(f.key)
          return (
            <button key={f.key} onClick={() => toggle(f.key)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-colors text-left ${on ? 'bg-primary-50 border-primary-200' : 'bg-neutral-50 border-neutral-100'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${on ? 'bg-white' : 'bg-neutral-100'}`}>
                <img src={f.icon} alt="" width={18} height={18} className={on ? 'opacity-80' : 'opacity-30'} />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-medium leading-tight ${on ? 'text-primary-800' : 'text-neutral-500'}`}>{f.label}</p>
                <p className={`text-[10px] font-bold mt-0.5 ${on ? 'text-success-700' : 'text-neutral-400'}`}>{on ? 'Var' : 'Yok'}</p>
              </div>
            </button>
          )
        })}
      </div>
    </Modal>
  )
}

// ── Proje İlerlemesi ───────────────────────────────────────────────────────────
type PhaseList = typeof PHASES

const ProjeIlerlemesiKart = ({ progress, phases, onEdit }: { progress: number; phases: PhaseList; onEdit: () => void }) => (
  <Card title="Proje İlerlemesi" onEdit={onEdit}>
    <p className="text-xs text-neutral-500 mb-1.5">Genel İlerleme</p>
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-2.5 bg-neutral-100 rounded-full overflow-hidden">
        <div className="h-full bg-success-600 rounded-full" style={{ width: `${progress}%` }} />
      </div>
      <span className="font-bold text-sm text-success-700 w-9 text-right flex-shrink-0">%{progress}</span>
    </div>
    <div>
      {phases.map((ph, i) => (
        <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-50 last:border-b-0">
          <div className="flex items-center gap-3">
            {ph.done
              ? <div className="w-7 h-7 rounded-full bg-success-50 flex items-center justify-center flex-shrink-0">
                  <img src="/icons/check.svg" alt="✓" width={14} height={14} />
                </div>
              : <div className="w-7 h-7 rounded-full border-2 border-neutral-200 bg-white flex-shrink-0" />
            }
            <span className={`text-sm ${ph.done ? 'text-primary-800 font-medium' : 'text-neutral-500'}`}>{ph.label}</span>
          </div>
          <span className={`text-xs font-bold ${ph.done ? 'text-success-700' : 'text-neutral-400'}`}>
            {ph.done ? 'Tamamlandı' : 'Beklemede'}
          </span>
        </div>
      ))}
    </div>
  </Card>
)

const ProjeIlerlemesiModal = ({ progress, setProgress, phases, setPhases, projectId, onClose }: {
  progress: number; setProgress: (n: number) => void
  phases: PhaseList; setPhases: (p: PhaseList) => void
  projectId: string; onClose: () => void
}) => {
  const [saving, setSaving]         = useState(false)
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [dragOver, setDragOver]     = useState<number | null>(null)
  const dragIdx = useRef<number | null>(null)

  const handleSave = async () => {
    setSaving(true)
    const autoStatus = progress === 100 ? 'tamamlandi' : 'devam'
    await supabase.from('projects').update({ progress, phases, status: autoStatus }).eq('id', projectId)
    const { data: others } = await supabase.from('projects').select('id, phases').neq('id', projectId)
    if (others && others.length > 0) {
      await Promise.all(others.map(proj => {
        const existingDone: boolean[] = Array.isArray(proj.phases)
          ? proj.phases.map((p: { done?: boolean }) => p.done ?? false)
          : []
        const updated = phases.map((ph, i) => ({ label: ph.label, done: existingDone[i] ?? false }))
        return supabase.from('projects').update({ phases: updated }).eq('id', proj.id)
      }))
    }
    setSaving(false)
    onClose()
  }

  const toggleDone = (i: number) => {
    const n = [...phases]; n[i] = { ...n[i], done: !n[i].done }; setPhases(n)
  }
  const updateLabel = (i: number, label: string) => {
    const n = [...phases]; n[i] = { ...n[i], label }; setPhases(n)
  }
  const deletePhase = (i: number) => setPhases(phases.filter((_, idx) => idx !== i))
  const addPhase = () => {
    setPhases([...phases, { label: 'Yeni Aşama', done: false }])
    setEditingIdx(phases.length)
  }
  const moveUp = (i: number) => {
    if (i === 0) return
    const n = [...phases];[n[i - 1], n[i]] = [n[i], n[i - 1]]; setPhases(n)
  }
  const moveDown = (i: number) => {
    if (i === phases.length - 1) return
    const n = [...phases];[n[i], n[i + 1]] = [n[i + 1], n[i]]; setPhases(n)
  }
  const onDragStart = (i: number) => { dragIdx.current = i }
  const onDragEnter = (i: number) => setDragOver(i)
  const onDragEnd   = () => {
    if (dragIdx.current !== null && dragOver !== null && dragIdx.current !== dragOver) {
      const n = [...phases]
      const [moved] = n.splice(dragIdx.current, 1)
      n.splice(dragOver, 0, moved)
      setPhases(n)
    }
    dragIdx.current = null
    setDragOver(null)
  }

  return (
  <Modal title="İlerlemeyi Düzenle" onClose={onClose} onSave={handleSave} saving={saving} saveLabel="Kaydet (Tüm Projelere Uygula)">
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <label className="text-xs font-medium text-neutral-500">Genel İlerleme</label>
        <span className="text-xs font-bold text-success-700">%{progress}</span>
      </div>
      <input type="range" min={0} max={100} value={progress}
        onChange={e => setProgress(Number(e.target.value))} className="w-full accent-[#0F6E56]" />
      <div className="flex justify-between text-[10px] text-neutral-400 mt-1"><span>%0</span><span>%100</span></div>
    </div>

    <p className="text-xs font-medium text-neutral-500 mb-3">Yapım Aşamaları</p>
    <div className="space-y-2 mb-3">
      {phases.map((ph, i) => (
        <div key={i}
          draggable
          onDragStart={() => onDragStart(i)}
          onDragEnter={() => onDragEnter(i)}
          onDragEnd={onDragEnd}
          onDragOver={e => e.preventDefault()}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border transition-all ${
            dragOver === i ? 'border-primary-400 bg-primary-50 scale-[1.01]' :
            ph.done ? 'bg-success-50 border-success-100' : 'bg-neutral-50 border-neutral-100'
          }`}>

          {/* ↑↓ sıralama (mobil) + sürükle tutacağı (desktop) */}
          <div className="flex flex-col gap-0.5 flex-shrink-0 cursor-grab active:cursor-grabbing">
            <button onClick={() => moveUp(i)} disabled={i === 0}
              className="w-6 h-5 flex items-center justify-center rounded hover:bg-neutral-200 disabled:opacity-20 transition-colors">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M5 12l7-7 7 7" stroke="#888780" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button onClick={() => moveDown(i)} disabled={i === phases.length - 1}
              className="w-6 h-5 flex items-center justify-center rounded hover:bg-neutral-200 disabled:opacity-20 transition-colors">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12l7 7 7-7" stroke="#888780" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Tamamlandı toggle */}
          <button onClick={() => toggleDone(i)}
            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${ph.done ? 'bg-success-600 border-success-600' : 'bg-white border-neutral-300'}`}>
            {ph.done && <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </button>

          {/* İsim */}
          {editingIdx === i ? (
            <input autoFocus value={ph.label}
              onChange={e => updateLabel(i, e.target.value)}
              onBlur={() => setEditingIdx(null)}
              onKeyDown={e => e.key === 'Enter' && setEditingIdx(null)}
              className="flex-1 text-sm font-medium bg-white border border-primary-300 rounded-lg px-2 py-1 outline-none text-primary-800"
            />
          ) : (
            <button onClick={() => setEditingIdx(i)} className="flex-1 text-left text-sm font-medium text-neutral-700 hover:text-primary-800 transition-colors">
              {ph.label}
            </button>
          )}

          {/* Kalem */}
          <button onClick={() => setEditingIdx(i)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-neutral-200 transition-colors flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Sil */}
          <button onClick={() => deletePhase(i)} className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-danger-100 transition-colors flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#A32D2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      ))}
    </div>

    <button onClick={addPhase}
      className="w-full flex items-center justify-center gap-2 border border-dashed border-neutral-300 rounded-xl py-2.5 text-sm text-neutral-500 hover:border-primary-400 hover:text-primary-700 transition-colors">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
      Aşama Ekle
    </button>
  </Modal>
  )
}

// ── Görseller ──────────────────────────────────────────────────────────────────
const GorsellerKart = ({ photos, setPhotos, slug, projectId }: {
  photos: string[]; setPhotos: (p: string[]) => void
  slug: string; projectId: string
}) => {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting]   = useState<string | null>(null)
  const [lightbox, setLightbox]   = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setUploading(true)
    const newUrls: string[] = []

    for (const file of files) {
      const ext      = file.name.split('.').pop()
      const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const path     = `${slug}/${safeName}`

      const { error: upErr } = await supabase.storage
        .from('project-photos')
        .upload(path, file, { upsert: false })

      if (upErr) { console.error(upErr); continue }

      const { data } = supabase.storage.from('project-photos').getPublicUrl(path)
      newUrls.push(data.publicUrl)
    }

    if (newUrls.length > 0) {
      const updated = [...photos, ...newUrls]
      await supabase.from('projects').update({ photos: updated }).eq('id', projectId)
      setPhotos(updated)
    }
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDelete = async (url: string) => {
    setDeleting(url)
    // Storage'dan sil
    const path = url.split('/project-photos/')[1]
    if (path) {
      await supabase.storage.from('project-photos').remove([decodeURIComponent(path)])
    }
    const updated = photos.filter(p => p !== url)
    await supabase.from('projects').update({ photos: updated }).eq('id', projectId)
    setPhotos(updated)
    setDeleting(null)
  }

  return (
    <Card title={`Görseller (${photos.length})`}>
      {/* Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-3">
          {photos.map((src, i) => (
            <div key={src} className="relative aspect-square rounded-xl overflow-hidden bg-neutral-100 group cursor-pointer"
              onClick={() => setLightbox(i)}>
              <img src={src} alt="" className="w-full h-full object-cover" style={{ imageOrientation: 'from-image' }} />
              {/* Sil butonu */}
              <button
                onClick={e => { e.stopPropagation(); handleDelete(src) }}
                disabled={deleting === src}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-danger-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 z-10"
              >
                {deleting === src
                  ? <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>
                  : <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
                }
              </button>
              {/* Büyüt ikonu */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-end justify-start p-1.5">
                <span className="text-[9px] text-white/0 group-hover:text-white/80 font-medium transition-colors">{i + 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Yükle butonu */}
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="w-full border border-dashed border-neutral-200 rounded-xl py-3 flex items-center justify-center gap-2 text-xs text-neutral-500 hover:bg-neutral-50 hover:border-primary-300 disabled:opacity-50 transition-colors"
      >
        {uploading
          ? <><svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#D3D1C7" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#0A1F44" strokeWidth="3" strokeLinecap="round"/></svg> Yükleniyor...</>
          : <><img src="/icons/plus.svg" alt="" width={13} height={13} className="opacity-50" /> Görsel Ekle (çoklu seçim)</>
        }
      </button>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/60 hover:text-white">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button onClick={e => { e.stopPropagation(); setLightbox(l => l !== null && l > 0 ? l - 1 : photos.length - 1) }}
            className="absolute left-4 text-white/60 hover:text-white">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <img src={photos[lightbox]} alt="" className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
            style={{ imageOrientation: 'from-image' }} onClick={e => e.stopPropagation()} />
          <button onClick={e => { e.stopPropagation(); setLightbox(l => l !== null && l < photos.length - 1 ? l + 1 : 0) }}
            className="absolute right-4 text-white/60 hover:text-white">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <p className="absolute bottom-4 text-white/40 text-sm">{lightbox + 1} / {photos.length}</p>
        </div>
      )}
    </Card>
  )
}


// ── Finansal Tab ───────────────────────────────────────────────────────────────
const FinansalTab = ({ slug }: { slug: string }) => {
  const lsKey = `finansal_v2_${slug}`

  const [sozlesme, setSozlesme]           = useState(0)
  const [sozlesmeInput, setSozlesmeInput] = useState('0')
  const [tahsilatlar, setTahsilatlar]     = useState<TahsilatItem[]>(INIT_TAHSILATLAR)
  const [kalemler, setKalemler]           = useState<KalemItem[]>(INIT_KALEMLER)
  const [lsLoaded, setLsLoaded]           = useState(false)

  // LocalStorage'dan yükle
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(lsKey) || '{}')
      if (stored.sozlesme)    { setSozlesme(stored.sozlesme); setSozlesmeInput(String(stored.sozlesme)) }
      if (stored.tahsilatlar) setTahsilatlar(stored.tahsilatlar)
      if (stored.kalemler)    setKalemler(stored.kalemler)
    } catch {}
    setLsLoaded(true)
  }, [lsKey])

  // Değişince kaydet
  useEffect(() => {
    if (!lsLoaded) return
    localStorage.setItem(lsKey, JSON.stringify({ sozlesme, tahsilatlar, kalemler }))
  }, [sozlesme, tahsilatlar, kalemler, lsLoaded, lsKey])

  const [tahsilatPanel, setTahsilatPanel] = useState(false)
  const [tForm, setTForm]                 = useState({ malik: '', tutar: '', tarih: '' })
  const [tStep, setTStep]                 = useState<1 | 2>(1) // 1: malik seç, 2: tutar+tarih

  // Proje maliklerini localStorage'dan oku
  const projeMalikler: string[] = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem(`malikler_${slug}`) || '{}')
      if (stored.malikler && stored.malikler.length > 0) return stored.malikler.map((m: MalikItem) => m.name)
    } catch {}
    return MALIKLER_MOCK.map(m => m.name)
  })()

  const [kalemPanel, setKalemPanel]       = useState(false)
  const [kForm, setKForm]                 = useState({ label: '', tutar: '', tarih: '' })

  const [kalemAra, setKalemAra]           = useState('')
  const [kalemTarihAy, setKalemTarihAy]   = useState('')

  const tahsilEdilen   = tahsilatlar.reduce((s, t) => s + t.tutar, 0)
  const tahsilEdilecek = sozlesme
  const kalanTahsilat  = tahsilEdilecek - tahsilEdilen
  const toplamMaliyet  = kalemler.reduce((s, k) => s + k.tutar, 0)

  const pctEdilen = tahsilEdilecek > 0 ? (tahsilEdilen / tahsilEdilecek) * 100 : 0
  const pctKalan  = 100 - pctEdilen

  const filtreliKalemler = kalemler.filter(k => {
    const adOk  = !kalemAra     || k.label.toLowerCase().includes(kalemAra.toLowerCase())
    const tarOk = !kalemTarihAy || k.tarih.includes(kalemTarihAy.split('-')[0])
    return adOk && tarOk
  })

  const handleSozlesmeBlur = () => {
    const val = parseInt(sozlesmeInput.replace(/\D/g, '')) || 0
    setSozlesme(val)
  }

  const fmtTarih = (iso: string) => iso
    ? new Date(iso).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
    : new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')

  const handleTahsilatEkle = () => {
    if (!tForm.malik || !tForm.tutar) return
    setTahsilatlar(prev => [...prev, {
      id: `t${Date.now()}`, ad: tForm.malik,
      tutar: parseInt(tForm.tutar) || 0, tarih: fmtTarih(tForm.tarih),
    }])
    setTForm({ malik: '', tutar: '', tarih: '' })
    setTStep(1)
    setTahsilatPanel(false)
  }

  const handleKalemEkle = () => {
    if (!kForm.label.trim() || !kForm.tutar) return
    const color = KALEM_RENKLER[kalemler.length % KALEM_RENKLER.length]
    setKalemler(prev => [...prev, {
      id: `k${Date.now()}`, label: kForm.label.trim(),
      tutar: parseInt(kForm.tutar) || 0, tarih: fmtTarih(kForm.tarih), color,
    }])
    setKForm({ label: '', tutar: '', tarih: '' })
    setKalemPanel(false)
  }

  const inCls = "w-full bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2.5 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors"

  return (
    <div className="space-y-4">

      {/* ── 1. Sözleşme Bedeli ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-sm text-primary-800">Sözleşme Bedeli</p>
            <p className="text-xs text-neutral-500 mt-0.5">Ana sözleşme tutarını elle gir.</p>
          </div>
          <span className="bg-info-50 text-info-700 text-xs font-bold px-3 py-1.5 rounded-xl flex-shrink-0 ml-3">
            {tl(sozlesme)}
          </span>
        </div>
        <input
          type="number"
          value={sozlesmeInput}
          onChange={e => setSozlesmeInput(e.target.value)}
          onBlur={handleSozlesmeBlur}
          className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm font-semibold text-primary-800 outline-none focus:border-primary-300 transition-colors"
        />
      </div>

      {/* ── 2. 3 Metrik Kart ── */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl border border-neutral-100 p-3 md:p-4">
          <img src="/icons/wallet.svg" alt="" width={22} height={22} className="mb-2 opacity-60" />
          <p className="text-[11px] text-neutral-500 mb-1 leading-tight">Tahsil Edilecek</p>
          <p className="font-bold text-sm md:text-base text-warning-700 leading-tight">{tl(tahsilEdilecek)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 p-3 md:p-4">
          <img src="/icons/card.svg" alt="" width={22} height={22} className="mb-2 opacity-60" />
          <p className="text-[11px] text-neutral-500 mb-1 leading-tight">Tahsil Edilen</p>
          <p className="font-bold text-sm md:text-base text-success-700 leading-tight">{tl(tahsilEdilen)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-neutral-100 p-3 md:p-4">
          <img src="/icons/building.svg" alt="" width={22} height={22} className="mb-2 opacity-60" />
          <p className="text-[11px] text-neutral-500 mb-1 leading-tight">Güncel Proje Maliyeti</p>
          <p className="font-bold text-sm md:text-base text-danger-700 leading-tight">{tl(toplamMaliyet)}</p>
        </div>
      </div>

      {/* ── 3. Tahsilatlar ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base text-primary-800">Tahsilatlar</h2>
          <button onClick={() => setTahsilatPanel(v => !v)}
            className="flex items-center gap-1.5 bg-primary-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Ödeme Ekle
          </button>
        </div>

        {tahsilatPanel && (
          <div className="bg-neutral-50 rounded-xl p-4 mb-4">
            {/* Adım göstergesi */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${tStep === 1 ? 'bg-primary-800 text-white' : 'bg-success-500 text-white'}`}>
                {tStep === 1 ? '1' : '✓'}
              </div>
              <span className={`text-xs font-medium ${tStep === 1 ? 'text-primary-800' : 'text-success-600'}`}>Malik Seç</span>
              <div className="flex-1 h-px bg-neutral-200 mx-1" />
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${tStep === 2 ? 'bg-primary-800 text-white' : 'bg-neutral-200 text-neutral-400'}`}>2</div>
              <span className={`text-xs font-medium ${tStep === 2 ? 'text-primary-800' : 'text-neutral-400'}`}>Tutar & Tarih</span>
            </div>

            {/* Adım 1: Malik seç */}
            {tStep === 1 && (
              <div>
                <p className="text-xs font-medium text-neutral-500 mb-3">
                  Bu projedeki maliklerden birini seç
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {projeMalikler.map(name => (
                    <button key={name} onClick={() => { setTForm({...tForm, malik: name}); setTStep(2) }}
                      className="px-3 py-2 rounded-xl text-sm font-medium border bg-white text-neutral-700 border-neutral-200 hover:border-primary-800 hover:bg-primary-50 hover:text-primary-800 transition-colors">
                      {name}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 pt-1 border-t border-neutral-200">
                  <button onClick={() => { setTahsilatPanel(false); setTStep(1); setTForm({malik:'',tutar:'',tarih:''}) }}
                    className="w-full bg-neutral-100 text-neutral-600 py-2.5 rounded-xl text-sm hover:bg-neutral-200 transition-colors mt-3">İptal</button>
                </div>
              </div>
            )}

            {/* Adım 2: Tutar & Tarih */}
            {tStep === 2 && (
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-xl px-3 py-2.5 mb-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="#0A1F44" strokeWidth="1.6"/>
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#0A1F44" strokeWidth="1.6" strokeLinecap="round"/>
                  </svg>
                  <span className="text-sm font-semibold text-primary-800 flex-1">{tForm.malik}</span>
                  <button onClick={() => setTStep(1)} className="text-xs text-primary-500 hover:text-primary-700">değiştir</button>
                </div>
                <input value={tForm.tutar} onChange={e => setTForm({...tForm, tutar: e.target.value})}
                  placeholder="Tutar (₺)" type="number" className={inCls} autoFocus />
                <input value={tForm.tarih} onChange={e => setTForm({...tForm, tarih: e.target.value})}
                  type="date" className={inCls} />
                <div className="flex gap-2 pt-1">
                  <button onClick={handleTahsilatEkle}
                    className="flex-1 bg-primary-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
                    Kaydet
                  </button>
                  <button onClick={() => { setTahsilatPanel(false); setTStep(1); setTForm({malik:'',tutar:'',tarih:''}) }}
                    className="px-4 bg-neutral-100 text-neutral-600 py-2.5 rounded-xl text-sm hover:bg-neutral-200 transition-colors">
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid gap-x-3 pb-2 border-b border-neutral-100 text-[11px] text-neutral-400 font-medium"
          style={{ gridTemplateColumns: '1fr 130px 100px 32px' }}>
          <span>Malik / Açıklama</span>
          <span className="text-right">Tutar</span>
          <span className="text-right">Tarih</span>
          <span />
        </div>

        <div className="divide-y divide-neutral-50">
          {tahsilatlar.map(t => (
            <div key={t.id} className="grid items-center gap-x-3 py-3"
              style={{ gridTemplateColumns: '1fr 130px 100px 32px' }}>
              <span className="text-sm font-semibold text-primary-800 truncate">{t.ad}</span>
              <span className="text-sm font-semibold text-success-700 text-right">{tl(t.tutar)}</span>
              <span className="text-sm text-neutral-500 text-right">{t.tarih}</span>
              <button onClick={() => setTahsilatlar(prev => prev.filter(x => x.id !== t.id))}
                className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-danger-50 transition-colors ml-auto">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#A32D2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          ))}
          {tahsilatlar.length === 0 && (
            <p className="py-8 text-center text-sm text-neutral-400">Henüz tahsilat girilmedi</p>
          )}
        </div>

        <div className="border-t border-neutral-200 pt-3 mt-1 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-primary-800">Toplam Tahsilat</span>
            <span className="text-sm font-bold text-success-700">{tl(tahsilEdilen)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-500">Kalan Tahsilat</span>
            <span className="text-sm font-semibold text-warning-700">{tl(kalanTahsilat)}</span>
          </div>
        </div>
      </div>

      {/* ── 4. Maliyet Kalemleri ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4 md:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base text-primary-800">Maliyet Kalemleri</h2>
          <button onClick={() => setKalemPanel(v => !v)}
            className="flex items-center gap-1.5 bg-primary-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors">
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Kalem Ekle
          </button>
        </div>

        {kalemPanel && (
          <div className="bg-neutral-50 rounded-xl p-3 mb-4 space-y-2.5">
            <input value={kForm.label} onChange={e => setKForm({...kForm, label: e.target.value})}
              placeholder="Kalem adı (örn. İnşaat İşleri)" className={inCls} />
            <input value={kForm.tutar} onChange={e => setKForm({...kForm, tutar: e.target.value})}
              placeholder="Tutar (₺)" type="number" className={inCls} />
            <input value={kForm.tarih} onChange={e => setKForm({...kForm, tarih: e.target.value})}
              type="date" className={inCls} />
            <div className="flex gap-2 pt-1">
              <button onClick={handleKalemEkle}
                className="flex-1 bg-primary-800 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">Ekle</button>
              <button onClick={() => setKalemPanel(false)}
                className="px-4 bg-neutral-100 text-neutral-600 py-2.5 rounded-xl text-sm hover:bg-neutral-200 transition-colors">İptal</button>
            </div>
          </div>
        )}

        {/* Filtreler */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40">
              <circle cx="11" cy="11" r="8" stroke="#0A1F44" strokeWidth="1.8"/>
              <path d="M21 21l-4.35-4.35" stroke="#0A1F44" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input value={kalemAra} onChange={e => setKalemAra(e.target.value)}
              placeholder="Kalem adı ara..."
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pl-8 pr-3 py-2.5 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors" />
          </div>
          <input value={kalemTarihAy} onChange={e => setKalemTarihAy(e.target.value)}
            type="month"
            className="bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2.5 text-sm text-neutral-600 outline-none focus:border-primary-300 transition-colors" />
        </div>

        {/* Desktop header */}
        <div className="hidden md:grid gap-x-4 pb-2 border-b border-neutral-100 text-[11px] text-neutral-400 font-medium"
          style={{ gridTemplateColumns: '1fr 150px 110px 32px' }}>
          <span>Kalem Adı</span>
          <span className="text-right">Tutar</span>
          <span className="text-right">Tarih</span>
          <span />
        </div>
        {/* Mobile header */}
        <div className="md:hidden grid gap-x-3 pb-2 border-b border-neutral-100 text-[11px] text-neutral-400 font-medium"
          style={{ gridTemplateColumns: '1fr auto auto' }}>
          <span>Kalem Adı</span>
          <span className="text-right pr-3">Tutar</span>
          <span className="text-right">Tarih</span>
        </div>

        <div className="divide-y divide-neutral-50">
          {filtreliKalemler.map(k => (
            <div key={k.id}>
              {/* Desktop */}
              <div className="hidden md:grid items-center gap-x-4 py-3"
                style={{ gridTemplateColumns: '1fr 150px 110px 32px' }}>
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: k.color }}/>
                  <span className="text-sm text-primary-800">{k.label}</span>
                </div>
                <span className="text-sm font-semibold text-danger-700 text-right">{tl(k.tutar)}</span>
                <span className="text-sm text-neutral-500 text-right">{k.tarih}</span>
                <button onClick={() => setKalemler(prev => prev.filter(x => x.id !== k.id))}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-danger-50 transition-colors ml-auto">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#A32D2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              {/* Mobile */}
              <div className="md:hidden grid items-center gap-x-3 py-3"
                style={{ gridTemplateColumns: '1fr auto auto' }}>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: k.color }}/>
                  <span className="text-sm text-primary-800">{k.label}</span>
                </div>
                <span className="text-sm font-semibold text-danger-700 text-right pr-3">{tl(k.tutar)}</span>
                <span className="text-sm text-neutral-500 text-right">{k.tarih}</span>
              </div>
            </div>
          ))}
          {filtreliKalemler.length === 0 && (
            <p className="py-8 text-center text-sm text-neutral-400">Kalem bulunamadı</p>
          )}
        </div>

        <div className="border-t border-neutral-200 pt-3 mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-primary-800">Güncel Proje Maliyeti</span>
          <span className="text-sm font-bold text-danger-700">{tl(toplamMaliyet)}</span>
        </div>
      </div>

      {/* ── 5. Finansal Özet (en altta) ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4 md:p-5">
        <h2 className="font-bold text-base text-primary-800 mb-5">Finansal Özet</h2>
        <div className="flex items-center gap-6 md:gap-10">
          <div className="relative w-[110px] h-[110px] flex-shrink-0">
            <div className="w-full h-full rounded-full" style={{
              background: `conic-gradient(#22C55E 0% ${pctEdilen.toFixed(2)}%, #F59E0B ${pctEdilen.toFixed(2)}% 100%)`
            }}/>
            <div className="absolute inset-[18px] bg-white rounded-full flex flex-col items-center justify-center">
              <p className="font-bold text-sm text-primary-800">%{pctEdilen.toFixed(1)}</p>
              <p className="text-[9px] text-neutral-400 leading-tight text-center mt-0.5">Tahsilat<br/>Oranı</p>
            </div>
          </div>
          <div className="space-y-3 flex-1 min-w-0">
            {[
              { label: 'Tahsil Edilen',  v: tahsilEdilen,  p: pctEdilen.toFixed(1) as string | null, color: '#22C55E' },
              { label: 'Kalan Tahsilat', v: kalanTahsilat, p: pctKalan.toFixed(1)  as string | null, color: '#F59E0B' },
              { label: 'Proje Maliyeti', v: toplamMaliyet, p: null,                                  color: '#EF4444' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full mt-0.5 flex-shrink-0" style={{ background: item.color }}/>
                <div className="min-w-0">
                  <p className="text-xs text-neutral-500">{item.label}</p>
                  <p className="text-sm font-bold text-primary-800 leading-tight">
                    {tl(item.v)}
                    {item.p !== null && <span className="text-neutral-400 font-normal text-xs ml-1">(%{item.p})</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
// ── Daire Ekle Form ────────────────────────────────────────────────────────────
const MALIK_LISTESI = ['Müsait', 'Emre Dağ', 'Ahmet Yılmaz', 'Mehmet Kaya', 'Ayşe Demir', 'Fatma Şahin']

const DaireEkleForm = ({ katLabel, form, setForm, onEkle, onClose }: {
  katLabel: string
  form: DaireForm
  setForm: (f: DaireForm) => void
  onEkle: () => void
  onClose: () => void
}) => (
  <div>
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-bold text-base text-primary-800">{katLabel} — Daire Ekle</h3>
      <button onClick={onClose}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>

    <p className="text-xs font-medium text-neutral-500 mb-2">Daire Tipi</p>
    <div className="grid grid-cols-4 gap-2 mb-5">
      {['1+1', '2+1', '3+1', 'Dükkan'].map(tip => (
        <button key={tip} onClick={() => setForm({ ...form, tip })}
          className={`py-2.5 rounded-xl text-sm font-semibold border transition-colors ${form.tip === tip
            ? 'bg-primary-800 text-white border-primary-800'
            : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'}`}>
          {tip}
        </button>
      ))}
    </div>

    <p className="text-xs font-medium text-neutral-500 mb-2">Brüt Alan (m²)</p>
    <input
      type="number"
      value={form.brut}
      onChange={e => setForm({ ...form, brut: e.target.value })}
      placeholder="90"
      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors mb-5"
    />

    <p className="text-xs font-medium text-neutral-500 mb-2">Malik Seç (Opsiyonel)</p>
    {/* Mobile: yatay scroll / Desktop: wrap */}
    <div className="flex gap-2 flex-nowrap overflow-x-auto md:flex-wrap pb-1 mb-6">
      {MALIK_LISTESI.map(name => (
        <button key={name} onClick={() => setForm({ ...form, malik: name })}
          className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-sm font-medium border transition-colors ${form.malik === name
            ? 'bg-primary-800 text-white border-primary-800'
            : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'}`}>
          {name}
        </button>
      ))}
    </div>

    <button onClick={onEkle}
      className="w-full bg-primary-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors">
      <span className="md:hidden">Ekle</span>
      <span className="hidden md:inline">Daireyi Ekle</span>
    </button>
  </div>
)

// ── Daireler Tab ───────────────────────────────────────────────────────────────
const DairelerTab = ({ slug }: { slug: string }) => {
  const lsKey = `daireler_${slug}`

  const [daireler, setDaireler]   = useState<DaireItem[]>(INITIAL_DAIRELER)
  const [katSayisi, setKatSayisi] = useState(6)
  const [expandedKat, setExpandedKat] = useState<number | null>(1)
  const [lsLoaded, setLsLoaded]   = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(lsKey) || '{}')
      if (stored.daireler)  setDaireler(stored.daireler)
      if (stored.katSayisi) setKatSayisi(stored.katSayisi)
    } catch {}
    setLsLoaded(true)
  }, [lsKey])

  useEffect(() => {
    if (!lsLoaded) return
    localStorage.setItem(lsKey, JSON.stringify({ daireler, katSayisi }))
  }, [daireler, katSayisi, lsLoaded, lsKey])
  const [addPanel, setAddPanel]   = useState<number | null>(null)
  const [addForm, setAddForm]     = useState<DaireForm>({ tip: '2+1', brut: '', malik: 'Müsait' })

  const totalCount   = daireler.length
  const dukkanCount  = daireler.filter(d => d.tip === 'Dükkan').length
  const satilmis     = daireler.filter(d => d.durum === 'satildi').length
  const musaitCount  = daireler.filter(d => d.durum === 'musait').length

  const katlar = Array.from({ length: katSayisi }, (_, i) => i + 1)

  const openAdd = (katNo: number) => {
    setAddPanel(katNo)
    setAddForm({ tip: '2+1', brut: '', malik: 'Müsait' })
  }

  const handleEkle = () => {
    if (!addPanel) return
    const katDaireler = daireler.filter(d => d.katNo === addPanel)
    const nextNo      = katDaireler.length > 0 ? Math.max(...katDaireler.map(d => d.no)) + 1 : 1
    const newDaire: DaireItem = {
      id:      Date.now(),
      katNo:   addPanel,
      no:      nextNo,
      tip:     addForm.tip,
      brut:    parseInt(addForm.brut) || 90,
      durum:   addForm.malik === 'Müsait' ? 'musait' : 'satildi',
      malik:   addForm.malik === 'Müsait' ? undefined : addForm.malik,
    }
    setDaireler(prev => [...prev, newDaire])
    setAddPanel(null)
  }

  return (
    <div>
      <div className={`md:flex md:gap-4 md:items-start`}>

        {/* ── Sol / Ana içerik ── */}
        <div className={`min-w-0 ${addPanel !== null ? 'md:flex-1' : 'w-full'} space-y-3`}>

          {/* Özet kartlar — mobil */}
          <div className="md:hidden flex gap-3">
            <div className="bg-white rounded-2xl border border-neutral-100 p-3 flex items-center gap-2.5 flex-1">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="opacity-40 flex-shrink-0">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#0A1F44" strokeWidth="1.8"/>
                <path d="M3 9h18M9 21V9" stroke="#0A1F44" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <div>
                <p className="text-xs font-bold text-primary-800">Dükkan</p>
                <p className="text-xs text-neutral-500">{dukkanCount} Daire</p>
              </div>
            </div>
            <div className="bg-primary-800 rounded-2xl p-3 flex-1 flex flex-col items-center justify-center">
              <p className="text-[10px] text-white/70">Toplam</p>
              <p className="text-2xl font-bold text-white leading-tight">{totalCount}</p>
              <p className="text-[10px] text-white/70">Bağımsız</p>
            </div>
          </div>

          {/* Özet kartlar — desktop */}
          <div className="hidden md:grid grid-cols-4 gap-3">
            <div className="bg-white rounded-2xl border border-neutral-100 p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="#0A1F44" strokeWidth="1.8"/>
                  <path d="M3 9h18M9 21V9" stroke="#0A1F44" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-primary-800">Dükkan</p>
                <p className="text-xs text-neutral-500">{dukkanCount} Daire</p>
              </div>
            </div>
            <div className="bg-primary-800 rounded-2xl p-3.5 text-center">
              <p className="text-[11px] text-white/70 mb-0.5">Toplam</p>
              <p className="text-2xl font-bold text-white leading-none">{totalCount}</p>
              <p className="text-[11px] text-white/70 mt-0.5">Daire</p>
            </div>
            <div className="bg-success-50 rounded-2xl border border-success-100 p-3.5 text-center">
              <p className="text-[11px] text-success-600 mb-0.5">Satılmış</p>
              <p className="text-2xl font-bold text-success-700 leading-none">{satilmis}</p>
              <p className="text-[11px] text-success-600 mt-0.5">Daire</p>
            </div>
            <div className="bg-warning-50 rounded-2xl border border-warning-100 p-3.5 text-center">
              <p className="text-[11px] text-warning-600 mb-0.5">Müsait</p>
              <p className="text-2xl font-bold text-warning-700 leading-none">{musaitCount}</p>
              <p className="text-[11px] text-warning-600 mt-0.5">Daire</p>
            </div>
          </div>

          {/* Kat Yönetimi */}
          <div className="bg-white rounded-2xl border border-neutral-100 px-4 py-3.5 flex items-center justify-between">
            <span className="font-bold text-sm text-primary-800">Kat Yönetimi</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setKatSayisi(k => Math.max(1, k - 1))}
                className="w-9 h-9 rounded-full bg-danger-50 border border-danger-100 flex items-center justify-center hover:bg-danger-100 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14" stroke="#A32D2D" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <span className="text-sm font-semibold text-primary-800 min-w-[52px] text-center">{katSayisi} Kat</span>
              <button
                onClick={() => setKatSayisi(k => k + 1)}
                className="w-9 h-9 rounded-full bg-success-50 border border-success-100 flex items-center justify-center hover:bg-success-100 transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* Kat listesi */}
          <div className="space-y-3">
            {katlar.map(katNo => {
              const katDaireler = daireler.filter(d => d.katNo === katNo)
              const isExpanded  = expandedKat === katNo
              const label       = getKatLabel(katNo)

              return (
                <div key={katNo} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">

                  {/* Kat header */}
                  <div className="flex items-center justify-between px-4 py-3.5">
                    <button
                      className="flex items-center gap-2 flex-1 text-left min-w-0"
                      onClick={() => setExpandedKat(isExpanded ? null : katNo)}>
                      <span className="font-bold text-sm text-primary-800 truncate">{label}</span>
                      <span className="text-xs text-neutral-400 flex-shrink-0">{katDaireler.length} Daire</span>
                    </button>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isExpanded && (
                        <button
                          onClick={() => openAdd(katNo)}
                          className="flex items-center gap-1.5 bg-primary-800 text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors">
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M6 1v10M1 6h10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
                          </svg>
                          Daire Ekle
                        </button>
                      )}
                      <button
                        onClick={() => setExpandedKat(isExpanded ? null : katNo)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          {isExpanded
                            ? <path d="M18 15l-6-6-6 6" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
                            : <path d="M9 18l6-6-6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
                          }
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Daireler grid */}
                  {isExpanded && (
                    <div className="px-4 pb-4">
                      {katDaireler.length === 0 ? (
                        <p className="text-xs text-neutral-400 text-center py-4">Bu katta henüz daire yok.</p>
                      ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {katDaireler.map(d => {
                            const isSat = d.durum === 'satildi'
                            const isMus = d.durum === 'musait'
                            const isRez = d.durum === 'rezerve'
                            return (
                              <div key={d.id}
                                className={`rounded-xl p-3 border ${isSat
                                  ? 'bg-success-50 border-success-100'
                                  : isMus
                                  ? 'bg-white border-dashed border-neutral-200'
                                  : 'bg-warning-50 border-warning-100'}`}>
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="font-bold text-sm text-primary-800">No: {d.no}</span>
                                  <span className="text-[11px] text-neutral-400">{d.tip}</span>
                                </div>
                                <p className="text-xs text-neutral-500 mb-2">Brüt: {d.brut} m²</p>
                                {isSat && (
                                  <>
                                    <span className="inline-block bg-success-100 text-success-700 text-[10px] font-bold px-2 py-0.5 rounded-lg mb-1">
                                      Satıldı
                                    </span>
                                    {d.malik && (
                                      <p className="text-xs font-semibold text-primary-800 truncate">{d.malik}</p>
                                    )}
                                  </>
                                )}
                                {isMus && (
                                  <div className="flex items-center gap-1 text-neutral-400">
                                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                                      <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    </svg>
                                    <span className="text-xs">Müsait</span>
                                  </div>
                                )}
                                {isRez && (
                                  <span className="inline-block bg-warning-100 text-warning-700 text-[10px] font-bold px-2 py-0.5 rounded-lg">
                                    Rezerve
                                  </span>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Sağ panel — Desktop Daire Ekle ── */}
        {addPanel !== null && (
          <div className="hidden md:block md:w-[340px] flex-shrink-0 bg-white rounded-2xl border border-neutral-100 p-5 sticky top-6">
            <DaireEkleForm
              katLabel={getKatLabel(addPanel)}
              form={addForm}
              setForm={setAddForm}
              onEkle={handleEkle}
              onClose={() => setAddPanel(null)}
            />
          </div>
        )}
      </div>

      {/* ── Mobil bottom sheet modal ── */}
      {addPanel !== null && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setAddPanel(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative z-10 w-full bg-white rounded-t-3xl px-5 pt-4 pb-10 max-h-[85vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="mx-auto w-10 h-1 bg-neutral-200 rounded-full mb-4" />
            <DaireEkleForm
              katLabel={getKatLabel(addPanel)}
              form={addForm}
              setForm={setAddForm}
              onEkle={handleEkle}
              onClose={() => setAddPanel(null)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Evraklar Types & Data ──────────────────────────────────────────────────────
type EvrakDurum = 'paylasiliyor' | 'gizli'
type EvrakItem  = { id: string; ad: string; klasor: string; tur: string; boyut: string; tarih: string; durum: EvrakDurum }
type EvrakForm  = { ad: string; tur: string; klasor: string; yeniKlasor: string; durum: EvrakDurum }

const EVRAK_TURLERI    = ['Resmi Belge', 'Proje', 'Sözleşme', 'Rapor', 'Dekont']
const EVRAK_KATEGORILER = ['Tümü', ...EVRAK_TURLERI]

const TUR_STYLE: Record<string, { bg: string; text: string }> = {
  'Resmi Belge': { bg: 'bg-info-50',     text: 'text-info-700'     },
  'Proje':       { bg: 'bg-primary-50',  text: 'text-primary-700'  },
  'Sözleşme':    { bg: 'bg-warning-50',  text: 'text-warning-700'  },
  'Rapor':       { bg: 'bg-neutral-100', text: 'text-neutral-600'  },
  'Dekont':      { bg: 'bg-success-50',  text: 'text-success-700'  },
}

const EVRAKLAR_MOCK: EvrakItem[] = [
  { id: 'e1',  ad: 'İnşaat Ruhsatı',           klasor: 'Ruhsat',          tur: 'Resmi Belge', boyut: '2.4 MB', tarih: '12.03.2026', durum: 'gizli' },
  { id: 'e2',  ad: 'Yapı Kullanma İzni',        klasor: 'Ruhsat',          tur: 'Resmi Belge', boyut: '1.8 MB', tarih: '15.03.2026', durum: 'gizli'        },
  { id: 'e3',  ad: 'İtfaiye Uygunluk Belgesi',  klasor: 'Ruhsat',          tur: 'Resmi Belge', boyut: '0.9 MB', tarih: '18.03.2026', durum: 'gizli' },
  { id: 'e4',  ad: 'Sözleşme - Emre Dağ',       klasor: 'Sözleşmeler',     tur: 'Sözleşme',   boyut: '3.2 MB', tarih: '10.01.2026', durum: 'gizli' },
  { id: 'e5',  ad: 'Sözleşme - Ahmet Yılmaz',   klasor: 'Sözleşmeler',     tur: 'Sözleşme',   boyut: '3.1 MB', tarih: '12.01.2026', durum: 'gizli' },
  { id: 'e6',  ad: 'Mimari Proje',              klasor: 'Teknik Projeler', tur: 'Proje',       boyut: '8.5 MB', tarih: '05.02.2026', durum: 'gizli' },
  { id: 'e7',  ad: 'Statik Hesap Raporu',        klasor: 'Teknik Projeler', tur: 'Rapor',       boyut: '5.2 MB', tarih: '08.02.2026', durum: 'gizli' },
  { id: 'e8',  ad: 'Bütçe Raporu Q1',           klasor: 'Finansal',        tur: 'Rapor',       boyut: '1.5 MB', tarih: '01.04.2026', durum: 'gizli'        },
  { id: 'e9',  ad: 'Ödeme Dekontu - Mart',      klasor: 'Finansal',        tur: 'Dekont',      boyut: '0.8 MB', tarih: '31.03.2026', durum: 'gizli'        },
  { id: 'e10', ad: 'Yazışma - Belediye',        klasor: 'Yazışmalar',      tur: 'Resmi Belge', boyut: '1.2 MB', tarih: '20.04.2026', durum: 'gizli' },
]

// ── Evrak Ekle Form ────────────────────────────────────────────────────────────
const EvrakEkleForm = ({ form, setForm, klasorler, onEkle, onClose }: {
  form: EvrakForm
  setForm: React.Dispatch<React.SetStateAction<EvrakForm>>
  klasorler: string[]
  onEkle: () => void
  onClose: () => void
}) => (
  <div>
    <div className="flex items-center justify-between mb-5">
      <h3 className="font-bold text-lg text-primary-800">Evrak Ekle</h3>
      <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </div>

    <p className="text-xs font-medium text-neutral-500 mb-1.5">Evrak Adı</p>
    <input
      value={form.ad}
      onChange={e => setForm({ ...form, ad: e.target.value })}
      placeholder="Örn. İnşaat Ruhsatı"
      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors mb-4"
    />

    <p className="text-xs font-medium text-neutral-500 mb-2">Evrak Türü</p>
    <div className="flex gap-2 flex-wrap mb-4">
      {EVRAK_TURLERI.map(t => (
        <button key={t} onClick={() => setForm({ ...form, tur: t })}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${form.tur === t
            ? 'bg-primary-800 text-white border-primary-800'
            : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'}`}>
          {t}
        </button>
      ))}
    </div>

    <p className="text-xs font-medium text-neutral-500 mb-2">Klasör</p>
    <div className="flex gap-2 flex-wrap mb-3">
      {klasorler.map(k => (
        <button key={k} onClick={() => setForm({ ...form, klasor: k, yeniKlasor: '' })}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${form.klasor === k && !form.yeniKlasor
            ? 'bg-primary-800 text-white border-primary-800'
            : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'}`}>
          {k}
        </button>
      ))}
    </div>
    <input
      value={form.yeniKlasor}
      onChange={e => setForm({ ...form, yeniKlasor: e.target.value, klasor: '' })}
      placeholder="+ Yeni klasör adı..."
      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-2.5 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors mb-4"
    />

    <div className="border-2 border-dashed border-neutral-200 rounded-xl p-5 flex flex-col items-center justify-center mb-5 cursor-pointer hover:border-primary-300 transition-colors">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="mb-2 opacity-40">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#0A1F44" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14 2v6h6M12 12v6M9 15l3-3 3 3" stroke="#0A1F44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-sm font-medium text-neutral-500">PDF yüklemek için tıklayın</p>
      <p className="text-xs text-neutral-400 mt-0.5">Maks. 50 MB</p>
    </div>

    <button onClick={onEkle}
      className="w-full bg-primary-800 text-white py-3.5 rounded-xl font-bold text-sm hover:bg-primary-700 transition-colors">
      Evrak Ekle
    </button>
  </div>
)

// ── Konum Kartı ────────────────────────────────────────────────────────────────
const KonumKart = ({ mapLat, mapLng, nearbyPlaces, onEdit }: {
  mapLat: number | null; mapLng: number | null; nearbyPlaces: NearbyPlace[]; onEdit: () => void
}) => {
  const hasPin = mapLat !== null && mapLng !== null
  const osmUrl = hasPin
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${mapLng! - 0.005},${mapLat! - 0.005},${mapLng! + 0.005},${mapLat! + 0.005}&layer=mapnik&marker=${mapLat},${mapLng}`
    : null
  return (
    <Card title="Konum & Harita" onEdit={onEdit}>
      <div className="rounded-xl overflow-hidden h-40 mb-3 bg-neutral-100">
        {osmUrl
          ? <iframe src={osmUrl} className="w-full h-full" loading="lazy" />
          : <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="#D3D1C7" strokeWidth="1.5"/><circle cx="12" cy="9" r="2.5" stroke="#D3D1C7" strokeWidth="1.5"/></svg>
              <p className="text-xs text-neutral-400">Konum seçilmemiş</p>
            </div>
        }
      </div>
      {nearbyPlaces.length > 0
        ? <div className="space-y-1.5">
            {nearbyPlaces.map((p, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                <span className="font-semibold text-primary-800">{p.label}</span>
                <span className="text-neutral-400 text-xs truncate">{p.desc}</span>
              </div>
            ))}
          </div>
        : <p className="text-xs text-neutral-400">Yakın yerler girilmemiş</p>
      }
    </Card>
  )
}

// ── Konum Modal (Leaflet harita seçici) ────────────────────────────────────────
const KonumModal = ({ mapLat, mapLng, setMapLat, setMapLng, nearbyPlaces, setNearbyPlaces, projectId, onClose }: {
  mapLat: number | null; mapLng: number | null
  setMapLat: (v: number | null) => void; setMapLng: (v: number | null) => void
  nearbyPlaces: NearbyPlace[]; setNearbyPlaces: (v: NearbyPlace[]) => void
  projectId: string; onClose: () => void
}) => {
  const [saving, setSaving]           = useState(false)
  const [lat, setLat]                 = useState<number | null>(mapLat)
  const [lng, setLng]                 = useState<number | null>(mapLng)
  const [search, setSearch]           = useState('')
  const [searching, setSearching]     = useState(false)
  const [localPlaces, setLocalPlaces] = useState<NearbyPlace[]>(
    nearbyPlaces.length > 0 ? nearbyPlaces : [{ label: '', desc: '' }]
  )
  const mapRef    = useRef<HTMLDivElement>(null)
  const mapInst   = useRef<any>(null)
  const markerRef = useRef<any>(null)

  // Leaflet'i yükle ve haritayı başlat
  useEffect(() => {
    if (!mapRef.current) return

    const initMap = () => {
      const L = (window as any).L
      if (!L || !mapRef.current || mapInst.current) return
      const center: [number, number] = lat && lng ? [lat, lng] : [41.015, 28.979]
      const map = L.map(mapRef.current).setView(center, 14)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(map)
      if (lat && lng) {
        markerRef.current = L.marker([lat, lng]).addTo(map)
      }
      map.on('click', (e: any) => {
        const { lat: la, lng: lo } = e.latlng
        setLat(la); setLng(lo)
        if (markerRef.current) markerRef.current.remove()
        markerRef.current = L.marker([la, lo]).addTo(map)
      })
      mapInst.current = map
    }

    if (!document.querySelector('#leaflet-css')) {
      const link = document.createElement('link')
      link.id = 'leaflet-css'; link.rel = 'stylesheet'
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
      document.head.appendChild(link)
    }
    if ((window as any).L) {
      initMap()
    } else {
      const script = document.createElement('script')
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
      script.onload = initMap
      document.head.appendChild(script)
    }
    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current = null } }
  }, [])

  const handleSearch = async () => {
    if (!search.trim()) return
    setSearching(true)
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(search)}&format=json&limit=1&countrycodes=tr`)
      const data = await res.json()
      if (data[0]) {
        const la = parseFloat(data[0].lat), lo = parseFloat(data[0].lon)
        setLat(la); setLng(lo)
        const L = (window as any).L
        if (mapInst.current && L) {
          mapInst.current.setView([la, lo], 16)
          if (markerRef.current) markerRef.current.remove()
          markerRef.current = L.marker([la, lo]).addTo(mapInst.current)
        }
      }
    } finally { setSearching(false) }
  }

  const handleSave = async () => {
    setSaving(true)
    const places = localPlaces.filter(p => p.label.trim())
    await supabase.from('projects').update({
      map_lat: lat, map_lng: lng,
      nearby_places: places.length > 0 ? places : null,
    }).eq('id', projectId)
    setMapLat(lat); setMapLng(lng)
    setNearbyPlaces(places)
    setSaving(false)
    onClose()
  }

  const updatePlace = (i: number, f: 'label' | 'desc', v: string) => {
    const n = [...localPlaces]; n[i] = { ...n[i], [f]: v }; setLocalPlaces(n)
  }

  return (
    <Modal title="Konum Düzenle" onClose={onClose} onSave={handleSave} saving={saving}>

      {/* Adres Arama */}
      <div className="flex gap-2 mb-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="Adres veya yer ara… (Örn: Avcılar, İstanbul)"
          className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-primary-800 outline-none focus:border-primary-300 placeholder:text-neutral-400"
        />
        <button onClick={handleSearch} disabled={searching}
          className="flex-shrink-0 px-4 py-2 bg-primary-800 text-white text-xs font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {searching ? '...' : 'Ara'}
        </button>
      </div>

      {/* Harita — tıklayarak pin bırak */}
      <div ref={mapRef} className="w-full h-52 rounded-xl overflow-hidden mb-2 border border-neutral-100" />
      <p className="text-[10px] text-neutral-400 mb-4">
        {lat && lng
          ? `📍 ${lat.toFixed(5)}, ${lng.toFixed(5)}`
          : 'Haritaya tıklayarak pin bırak veya adres ara'}
      </p>

      {/* Yakın Yerler */}
      <label className="block text-xs font-semibold text-neutral-500 mb-2">Yakın Yerler</label>
      <div className="space-y-2 mb-2">
        {localPlaces.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <input value={p.label} onChange={e => updatePlace(i, 'label', e.target.value)}
              placeholder="Metrobüse 5 dk"
              className="w-2/5 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-primary-800 outline-none focus:border-primary-300 placeholder:text-neutral-300" />
            <input value={p.desc} onChange={e => updatePlace(i, 'desc', e.target.value)}
              placeholder="Yürüme mesafesinde"
              className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm text-primary-800 outline-none focus:border-primary-300 placeholder:text-neutral-300" />
            <button onClick={() => setLocalPlaces(localPlaces.filter((_, idx) => idx !== i))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-danger-50 transition-colors flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#A32D2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        ))}
      </div>
      <button onClick={() => setLocalPlaces([...localPlaces, { label: '', desc: '' }])}
        className="w-full flex items-center justify-center gap-1.5 border border-dashed border-neutral-300 rounded-xl py-2 text-xs text-neutral-500 hover:border-primary-400 hover:text-primary-700 transition-colors">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        Yer Ekle
      </button>
    </Modal>
  )
}

// ── Evraklar Tab ───────────────────────────────────────────────────────────────
const EvraklarTab = ({ slug }: { slug: string }) => {
  const lsKey = `evraklar_${slug}`

  const [evraklar, setEvraklar]         = useState<EvrakItem[]>(EVRAKLAR_MOCK)
  const [lsLoaded, setLsLoaded]         = useState(false)
  const [aramaText, setAramaText]       = useState('')

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(lsKey) || '{}')
      if (stored.evraklar) setEvraklar(stored.evraklar)
    } catch {}
    setLsLoaded(true)
  }, [lsKey])

  useEffect(() => {
    if (!lsLoaded) return
    localStorage.setItem(lsKey, JSON.stringify({ evraklar }))
  }, [evraklar, lsLoaded, lsKey])
  const [aktifKat, setAktifKat]         = useState('Tümü')
  const [expandedKlasor, setExpandedKlasor] = useState<string | null>('Ruhsat')
  const [showPanel, setShowPanel]       = useState(false)
  const [menuAcik, setMenuAcik]         = useState<string | null>(null)
  const [form, setForm]                 = useState<EvrakForm>({
    ad: '', tur: 'Resmi Belge', klasor: 'Ruhsat', yeniKlasor: '', durum: 'paylasiliyor',
  })

  const tumKlasorler = Array.from(new Set(evraklar.map(e => e.klasor)))

  const filtrelenmis = evraklar.filter(e => {
    const aramaOk = !aramaText || e.ad.toLowerCase().includes(aramaText.toLowerCase()) || e.klasor.toLowerCase().includes(aramaText.toLowerCase())
    const katOk   = aktifKat === 'Tümü' || e.tur === aktifKat
    return aramaOk && katOk
  })

  const toplam    = evraklar.length
  const paylasilan = evraklar.filter(e => e.durum === 'paylasiliyor').length
  const gizli     = evraklar.filter(e => e.durum === 'gizli').length

  const handleEkle = () => {
    const klasorAd = form.yeniKlasor.trim() || form.klasor
    if (!form.ad.trim() || !klasorAd) return
    const yeni: EvrakItem = {
      id: `e${Date.now()}`, ad: form.ad.trim(), klasor: klasorAd, tur: form.tur,
      boyut: '—',
      tarih: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
      durum: 'gizli',
    }
    setEvraklar(prev => [...prev, yeni])
    setShowPanel(false)
    setForm({ ad: '', tur: 'Resmi Belge', klasor: 'Ruhsat', yeniKlasor: '', durum: 'gizli' })
  }

  const PdfIcon = () => (
    <div className="w-9 h-9 bg-danger-50 rounded-lg flex items-center justify-center flex-shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#A32D2D" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14 2v6h6" stroke="#A32D2D" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9 13h1.5a1 1 0 010 2H9v-4h1.5a1 1 0 010 2" stroke="#A32D2D" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    </div>
  )

  return (
    <div>
      <div className={`md:flex md:gap-4 md:items-start`}>

        {/* ── Sol / Ana içerik ── */}
        <div className={`min-w-0 ${showPanel ? 'md:flex-1' : 'w-full'} space-y-3`}>

          {/* Başlık + Ekle butonu */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-primary-800">Evraklar ({toplam})</h2>
            <button onClick={() => setShowPanel(true)}
              className="flex items-center gap-1.5 bg-primary-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              Evrak Ekle
            </button>
          </div>

          {/* Özet kartlar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white rounded-2xl border border-neutral-100 p-3.5 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-neutral-100 rounded-xl flex items-center justify-center mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#888780" strokeWidth="1.6" strokeLinejoin="round"/>
                  <path d="M14 2v6h6" stroke="#888780" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-xl font-bold text-primary-800 leading-none">{toplam}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Toplam Evrak</p>
            </div>
            <div className="bg-success-50 rounded-2xl border border-success-100 p-3.5 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-success-100 rounded-xl flex items-center justify-center mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8" stroke="#0F6E56" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16 6 12 2 8 6" stroke="#0F6E56" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="12" y1="2" x2="12" y2="15" stroke="#0F6E56" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-xl font-bold text-success-700 leading-none">{paylasilan}</p>
              <p className="text-[11px] text-success-600 mt-0.5">Paylaşılan</p>
            </div>
            <div className="bg-neutral-100 rounded-2xl p-3.5 flex flex-col items-center text-center">
              <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="#888780" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" stroke="#888780" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <p className="text-xl font-bold text-neutral-600 leading-none">{gizli}</p>
              <p className="text-[11px] text-neutral-500 mt-0.5">Gizli</p>
            </div>
          </div>

          {/* Arama */}
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40">
              <circle cx="11" cy="11" r="8" stroke="#0A1F44" strokeWidth="1.8" />
              <path d="M21 21l-4.35-4.35" stroke="#0A1F44" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              value={aramaText}
              onChange={e => setAramaText(e.target.value)}
              placeholder="Evrak ara..."
              className="w-full bg-white border border-neutral-100 rounded-xl pl-9 pr-4 py-2.5 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors"
            />
          </div>

          {/* Kategori filtre chips */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {EVRAK_KATEGORILER.map(k => (
              <button key={k} onClick={() => setAktifKat(k)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${aktifKat === k
                  ? 'bg-primary-800 text-white border-primary-800'
                  : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'}`}>
                {k}
              </button>
            ))}
          </div>

          {/* Bilgi banner */}
          <div className="bg-info-50 border border-info-100 rounded-xl px-4 py-3 flex gap-2.5 items-start">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" stroke="#1D6FB8" strokeWidth="1.6"/>
              <path d="M12 8v4M12 16h.01" stroke="#1D6FB8" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <p className="text-xs text-info-700 leading-relaxed">
              <span className="font-semibold">"Paylaşılıyor"</span> olarak işaretlenen evraklar malikler tarafından görülebilir.
            </p>
          </div>

          {/* Klasör listesi */}
          <div className="space-y-2">
            {tumKlasorler.map(klasor => {
              const klasorFiltreEvraklar = filtrelenmis.filter(e => e.klasor === klasor)
              const klasorTumEvraklar   = evraklar.filter(e => e.klasor === klasor)
              // Klasörü gizle: filtre aktifken bu klasörde sonuç yoksa
              if (klasorFiltreEvraklar.length === 0 && (aramaText || aktifKat !== 'Tümü')) return null
              const isExpanded = expandedKlasor === klasor

              return (
                <div key={klasor} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                  {/* Klasör başlığı */}
                  <button
                    onClick={() => setExpandedKlasor(isExpanded ? null : klasor)}
                    className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-neutral-50 transition-colors">
                    <div className="w-8 h-8 bg-warning-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="#92400E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm text-primary-800">{klasor}</p>
                      <p className="text-xs text-neutral-400">{klasorTumEvraklar.length} evrak</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <path d="M6 9l6 6 6-6" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {/* Evrak satırları */}
                  {isExpanded && (
                    <div className="border-t border-neutral-50 divide-y divide-neutral-50">
                      {(klasorFiltreEvraklar.length > 0 ? klasorFiltreEvraklar : klasorTumEvraklar).map(evrak => {
                        const turStyle = TUR_STYLE[evrak.tur] ?? TUR_STYLE['Rapor']
                        return (
                          <div key={evrak.id} className="flex items-center gap-3 px-4 py-3 relative">
                            <PdfIcon />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm text-primary-800 truncate">{evrak.ad}</p>
                              <p className="text-xs text-neutral-400 mt-0.5">{evrak.boyut} · {evrak.tarih}</p>
                            </div>
                            {/* Tür badge — sadece desktop */}
                            <span className={`hidden md:inline-flex flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-lg ${turStyle.bg} ${turStyle.text}`}>
                              {evrak.tur}
                            </span>
                            {/* Paylaşım badge */}
                            {evrak.durum === 'paylasiliyor'
                              ? <span className="flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-lg bg-success-50 text-success-700 whitespace-nowrap">Paylaşılıyor</span>
                              : <span className="flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-500">Gizli</span>
                            }
                            {/* Üç nokta menü */}
                            <div className="relative">
                              <button onClick={() => setMenuAcik(menuAcik === evrak.id ? null : evrak.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="5" r="1.5" fill="#888780" />
                                  <circle cx="12" cy="12" r="1.5" fill="#888780" />
                                  <circle cx="12" cy="19" r="1.5" fill="#888780" />
                                </svg>
                              </button>
                              {menuAcik === evrak.id && (
                                <div className="absolute right-0 top-9 z-20 bg-white rounded-xl border border-neutral-100 shadow-lg min-w-[140px] py-1">
                                  <button className="w-full text-left px-4 py-2.5 text-sm text-primary-800 hover:bg-neutral-50 transition-colors">
                                    İndir
                                  </button>
                                  <button onClick={() => {
                                    setEvraklar(prev => prev.map(e => e.id === evrak.id
                                      ? { ...e, durum: e.durum === 'paylasiliyor' ? 'gizli' : 'paylasiliyor' } : e))
                                    setMenuAcik(null)
                                  }} className="w-full text-left px-4 py-2.5 text-sm text-primary-800 hover:bg-neutral-50 transition-colors">
                                    {evrak.durum === 'paylasiliyor' ? 'Gizle' : 'Paylaş'}
                                  </button>
                                  <button onClick={() => {
                                    setEvraklar(prev => prev.filter(e => e.id !== evrak.id))
                                    setMenuAcik(null)
                                  }} className="w-full text-left px-4 py-2.5 text-sm text-danger-700 hover:bg-danger-50 transition-colors">
                                    Sil
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Boş durum */}
            {filtrelenmis.length === 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 py-12 flex flex-col items-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#D3D1C7" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M14 2v6h6" stroke="#D3D1C7" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <p className="mt-3 font-medium text-neutral-400">Evrak bulunamadı</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Sağ panel — Desktop ── */}
        {showPanel && (
          <div className="hidden md:block w-80 flex-shrink-0 bg-white rounded-2xl border border-neutral-100 p-5 sticky top-4">
            <EvrakEkleForm
              form={form} setForm={setForm}
              klasorler={tumKlasorler}
              onEkle={handleEkle}
              onClose={() => setShowPanel(false)}
            />
          </div>
        )}
      </div>

      {/* ── Mobil bottom sheet ── */}
      {showPanel && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center"
          onClick={() => setShowPanel(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full bg-white rounded-t-3xl px-5 pt-4 pb-10 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
            <div className="mx-auto w-10 h-1 bg-neutral-200 rounded-full mb-4" />
            <EvrakEkleForm
              form={form} setForm={setForm}
              klasorler={tumKlasorler}
              onEkle={handleEkle}
              onClose={() => setShowPanel(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Malikler Mock Data ─────────────────────────────────────────────────────────
type MalikItem = {
  id: string; name: string; initials: string
  katNo: number; daire: string; tip: string
  phone: string; toplam: number; odenen: number
}
type MalikForm = {
  name: string; phone: string; email: string
  daire: string; toplam: string; odenen: string
  vade: string; tip: string
}

const MALIKLER_MOCK: MalikItem[] = [
  { id: 'm1', name: 'Emre Dağ',     initials: 'ED', katNo: 6, daire: '21', tip: '3+1', phone: '0555 123 45 67', toplam: 1_500_000, odenen: 500_000   },
  { id: 'm2', name: 'Ahmet Yılmaz', initials: 'AY', katNo: 6, daire: '22', tip: '2+1', phone: '0544 987 65 43', toplam: 1_200_000, odenen: 1_200_000 },
  { id: 'm3', name: 'Mehmet Kaya',  initials: 'MK', katNo: 6, daire: '23', tip: '2+1', phone: '0533 456 78 90', toplam: 1_000_000, odenen: 300_000   },
  { id: 'm4', name: 'Ayşe Demir',   initials: 'AD', katNo: 6, daire: '24', tip: '3+1', phone: '0507 234 56 78', toplam: 1_000_000, odenen: 0         },
  { id: 'm5', name: 'Fatma Şahin',  initials: 'FŞ', katNo: 5, daire: '17', tip: '2+1', phone: '0532 111 22 33', toplam: 800_000,   odenen: 0         },
]

// ── Malikler Tab ───────────────────────────────────────────────────────────────
const MaliklerTab = ({ slug }: { slug: string }) => {
  const lsKey = `malikler_${slug}`

  const [malikler, setMalikler] = useState<MalikItem[]>(MALIKLER_MOCK)
  const [lsLoaded, setLsLoaded] = useState(false)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(lsKey) || '{}')
      if (stored.malikler) setMalikler(stored.malikler)
    } catch {}
    setLsLoaded(true)
  }, [lsKey])

  useEffect(() => {
    if (!lsLoaded) return
    localStorage.setItem(lsKey, JSON.stringify({ malikler }))
  }, [malikler, lsLoaded, lsKey])
  const [form, setForm] = useState<MalikForm>({
    name: '', phone: '', email: '', daire: '',
    toplam: '', odenen: '', vade: '', tip: '2+1',
  })

  const katlar = Array.from(new Set(malikler.map(m => m.katNo))).sort((a, b) => b - a)

  const handleSave = () => {
    if (!form.name.trim() || !form.daire.trim()) return
    const parts = form.name.trim().split(' ')
    const initials = parts.map(w => w[0]).join('').toUpperCase().slice(0, 2)
    const newMalik: MalikItem = {
      id: `m${Date.now()}`,
      name: form.name.trim(),
      initials,
      katNo: parseInt(form.daire) || 1,
      daire: form.daire.trim(),
      tip: form.tip,
      phone: form.phone.trim(),
      toplam: parseInt(form.toplam.replace(/\D/g, '')) || 0,
      odenen: parseInt(form.odenen.replace(/\D/g, '')) || 0,
    }
    setMalikler(prev => [...prev, newMalik])
    setShowModal(false)
    setForm({ name: '', phone: '', email: '', daire: '', toplam: '', odenen: '', vade: '', tip: '2+1' })
  }

  const inputCls = "w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors placeholder:text-neutral-400"
  const labelCls = "block text-xs font-medium text-neutral-500 mb-1.5"

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base text-primary-800">Malikler ({malikler.length})</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-primary-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Malik Ekle
        </button>
      </div>

      {/* Kat grupları */}
      <div className="space-y-3">
        {katlar.map(katNo => {
          const katMalikler = malikler.filter(m => m.katNo === katNo)
          return (
            <div key={katNo} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
              {/* Kat başlığı */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-50">
                <span className="font-bold text-sm text-primary-800">{katNo}. Kat</span>
                <span className="text-xs text-neutral-400">{katMalikler.length} Malik</span>
              </div>
              {/* Malik satırları */}
              <div className="divide-y divide-neutral-50">
                {katMalikler.map(malik => {
                  const pct = malik.toplam > 0 ? Math.round(malik.odenen / malik.toplam * 100) : 0
                  return (
                    <div key={malik.id} className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-primary-800 font-bold text-sm">{malik.initials}</span>
                        </div>
                        {/* Ad + bilgi */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm text-primary-800">{malik.name}</p>
                          <p className="text-xs text-neutral-500 mt-0.5 truncate">
                            Daire {malik.daire} · {malik.tip} · {malik.phone}
                          </p>
                        </div>
                        {/* Düzenle butonu */}
                        <button className="w-9 h-9 bg-neutral-50 border border-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-neutral-100 transition-colors">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>
                      {/* Progress bar + tutarlar */}
                      <div className="mt-3 flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-success-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-neutral-500 flex-shrink-0 whitespace-nowrap">
                          {tl(malik.odenen)} / {tl(malik.toplam)}
                        </span>
                        <span className="hidden md:block text-xs font-bold text-success-700 w-8 text-right flex-shrink-0">
                          %{pct}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Boş durum */}
      {malikler.length === 0 && (
        <div className="flex flex-col items-center py-20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="#D3D1C7" strokeWidth="1.5" />
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#D3D1C7" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <p className="text-neutral-400 font-medium mt-3">Henüz malik eklenmedi</p>
        </div>
      )}

      {/* ── Maliklerden Alınan Ödemeler ── */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-4 md:p-5 mt-4">
        <h2 className="font-bold text-base text-primary-800 mb-4">Maliklerden Alınan Ödemeler</h2>

        {/* Desktop header */}
        <div className="hidden md:grid md:gap-x-4 pb-2 border-b border-neutral-100 text-[11px] text-neutral-400 font-medium"
          style={{ gridTemplateColumns: '1fr 130px 130px 110px 1fr' }}>
          <span>Malik Adı</span>
          <span className="text-right">Toplam</span>
          <span className="text-right">Ödenen</span>
          <span className="text-right">Kalan</span>
          <span className="pl-2">Tahsilat Oranı</span>
        </div>
        {/* Mobile header */}
        <div className="md:hidden grid pb-2 border-b border-neutral-100 text-[11px] text-neutral-400 font-medium"
          style={{ gridTemplateColumns: '1fr auto auto auto' }}>
          <span>Malik Adı</span>
          <span className="text-right pr-3">Toplam</span>
          <span className="text-right pr-3">Ödenen</span>
          <span className="text-right">Kalan</span>
        </div>

        <div className="divide-y divide-neutral-50">
          {MALIKLER_ODEMELER.map((m, i) => {
            const kalan = m.toplam - m.odenen
            const pct   = m.toplam > 0 ? Math.round(m.odenen / m.toplam * 100) : 0
            return (
              <div key={i} className="py-3">
                <div className="hidden md:grid md:gap-x-4 items-center"
                  style={{ gridTemplateColumns: '1fr 130px 130px 110px 1fr' }}>
                  <span className="text-sm font-bold text-primary-800">{m.name}</span>
                  <span className="text-sm text-neutral-500 text-right">{tl(m.toplam)}</span>
                  <span className="text-sm font-semibold text-success-700 text-right">{tl(m.odenen)}</span>
                  <span className="text-sm text-neutral-600 text-right">{tl(kalan)}</span>
                  <div className="flex items-center gap-2 pl-2">
                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-success-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-neutral-500 w-9 text-right flex-shrink-0">%{pct}</span>
                  </div>
                </div>
                <div className="md:hidden">
                  <div className="grid items-center gap-x-2"
                    style={{ gridTemplateColumns: '1fr auto auto auto' }}>
                    <span className="text-sm font-bold text-primary-800">{m.name}</span>
                    <span className="text-sm text-neutral-500 text-right pr-3">{tl(m.toplam)}</span>
                    <span className="text-sm font-semibold text-success-700 text-right pr-3">{tl(m.odenen)}</span>
                    <span className="text-sm text-neutral-600 text-right">{tl(kalan)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-success-500" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-neutral-500 w-6 text-right flex-shrink-0">%{pct}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Malik Ekle Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative z-10 w-full md:max-w-lg bg-white rounded-t-3xl md:rounded-2xl px-5 pt-4 pb-10 md:pb-6 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="mx-auto w-10 h-1 bg-neutral-200 rounded-full mb-4 md:hidden" />
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-xl text-primary-800">Malik Ekle</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#888780" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>Ad Soyad</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ahmet Yılmaz" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Telefon</label>
                <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="0555 123 45 67" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>E-posta</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="ornek@gmail.com" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Daire No</label>
                <input value={form.daire} onChange={e => setForm({ ...form, daire: e.target.value })} placeholder="21" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Toplam Borç (₺)</label>
                <input type="number" value={form.toplam} onChange={e => setForm({ ...form, toplam: e.target.value })} placeholder="1000000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Ödenen (₺)</label>
                <input type="number" value={form.odenen} onChange={e => setForm({ ...form, odenen: e.target.value })} placeholder="250000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Son Ödeme Tarihi</label>
                <input value={form.vade} onChange={e => setForm({ ...form, vade: e.target.value })} placeholder="31.12.2026" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Daire Tipi</label>
                <div className="grid grid-cols-3 gap-2">
                  {['1+1', '2+1', '3+1'].map(tip => (
                    <button key={tip} onClick={() => setForm({ ...form, tip })}
                      className={`py-3 rounded-xl text-sm font-semibold border transition-colors ${form.tip === tip
                        ? 'bg-primary-800 text-white border-primary-800'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'}`}>
                      {tip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleSave} className="mt-6 w-full bg-primary-800 text-white py-3.5 rounded-xl font-bold text-base hover:bg-primary-700 transition-colors">
              Kaydet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Notlar Tab ─────────────────────────────────────────────────────────────────
const NotlarTab = () => (
  <div className="max-w-2xl">
    <Card title="Proje Notları">
      <textarea
        rows={6}
        placeholder="Bu projeye ait notlarınızı buraya yazın..."
        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 outline-none focus:border-primary-300 resize-none placeholder:text-neutral-400 transition-colors"
      />
      <button className="mt-3 bg-primary-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
        Kaydet
      </button>
    </Card>
  </div>
)

// ── Ayarlar Tab ────────────────────────────────────────────────────────────────
const AyarlarTab = ({ project, onStatusSaved }: { project: Project; onStatusSaved: (status: string) => void }) => {
  const [selected, setSelected] = useState(project.status)
  const [saving,   setSaving]   = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await supabase.from('projects').update({ status: selected }).eq('id', project.id)
    onStatusSaved(selected)
    setSaving(false)
  }

  return (
  <div className="max-w-2xl space-y-4">
    <Card title="Proje Durumu">
      <div className="space-y-3">
        {Object.entries(STATUS_STYLE).map(([key, s]) => (
          <label key={key} onClick={() => setSelected(key)} className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-colors ${selected === key ? `${s.bg} border-transparent` : 'bg-neutral-50 border-neutral-100 hover:bg-neutral-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selected === key ? 'border-primary-800 bg-primary-800' : 'border-neutral-300'}`}>
                {selected === key && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
              </div>
              <span className={`text-sm font-medium ${selected === key ? s.text : 'text-neutral-600'}`}>{s.label}</span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${s.bg} ${s.text}`}>{s.label}</span>
          </label>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving || selected === project.status}
        className="mt-4 bg-primary-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 disabled:opacity-40 transition-colors flex items-center gap-2"
      >
        {saving && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>}
        Durumu Güncelle
      </button>
    </Card>

    <Card title="Tehlikeli Alan">
      <p className="text-sm text-neutral-500 mb-4">Bu işlemler geri alınamaz. Dikkatli olun.</p>
      <button className="flex items-center gap-2 bg-danger-50 text-danger-700 border border-danger-100 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-danger-100 transition-colors">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Projeyi Sil
      </button>
    </Card>
  </div>
  )
}

// ── Ana Sayfa ──────────────────────────────────────────────────────────────────
export default function AdminProjeDetay({ params }: { params: { slug: string } }) {
  const [project, setProject]               = useState<Project | null>(null)
  const [loading, setLoading]               = useState(true)
  const [tab, setTab]                       = useState<Tab>('genel')
  const [editModal, setEditModal]           = useState<EditKey>(null)
  const [progress, setProgress]             = useState(0)
  const [phases, setPhases]                 = useState(PHASES)
  const [activeFeatures, setActiveFeatures] = useState<Set<string>>(new Set())
  const [mapLat,       setMapLat]       = useState<number | null>(null)
  const [mapLng,       setMapLng]       = useState<number | null>(null)
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([])
  const [photos,       setPhotos]       = useState<string[]>([])

  useEffect(() => {
    supabase.from('projects').select('*').eq('slug', params.slug).single()
      .then(({ data }) => {
        if (data) {
          setProject(data)
          setProgress(data.progress ?? 0)
          setActiveFeatures(new Set(Array.isArray(data.features) ? data.features : []))
          if (Array.isArray(data.phases) && data.phases.length > 0) setPhases(data.phases)
          if (data.map_lat) setMapLat(data.map_lat)
          if (data.map_lng) setMapLng(data.map_lng)
          if (Array.isArray(data.nearby_places)) setNearbyPlaces(data.nearby_places)
          if (Array.isArray(data.photos)) setPhotos(data.photos)
        }
        setLoading(false)
      })
  }, [params.slug])

  const TABS: { key: Tab; label: string }[] = [
    { key: 'genel',    label: 'Genel Bakış' },
    { key: 'finansal', label: 'Finansal'    },
    { key: 'daireler', label: 'Daireler'    },
    { key: 'evraklar', label: 'Evraklar'    },
    { key: 'malikler', label: 'Malikler'    },
    { key: 'ayarlar',  label: 'Ayarlar'     },
  ]

  if (loading) return (
    <div className="p-4 md:p-6 space-y-4 animate-pulse">
      <div className="h-8 bg-neutral-100 rounded w-1/3" />
      <div className="h-28 bg-neutral-100 rounded-2xl" />
      <div className="h-10 bg-neutral-100 rounded-xl" />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="h-64 bg-neutral-100 rounded-2xl" />
        <div className="h-64 bg-neutral-100 rounded-2xl" />
      </div>
    </div>
  )

  if (!project) return (
    <div className="flex flex-col items-center py-20 text-neutral-400">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
        <path d="M3 21V9l9-6 9 6v12H3z" stroke="#D3D1C7" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
      <p className="mt-3 font-medium">Proje bulunamadı</p>
      <Link href="/admin/projeler" className="mt-2 text-sm text-primary-800 underline">Projelere dön</Link>
    </div>
  )

  const loc = [project.district, project.city].filter(Boolean).join(' / ') || project.location
  const st  = STATUS_STYLE[project.status] ?? STATUS_STYLE['devam']

  return (
    <div>
      {/* ── Proje üst başlık ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-100 px-4 md:px-6 pt-4 pb-0">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-sm mb-4 min-w-0">
          <Link href="/admin/projeler" className="text-primary-500 font-medium hover:underline flex items-center gap-1 flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Projeler
          </Link>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M9 18l6-6-6-6" stroke="#D3D1C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-primary-800 font-semibold truncate">{project.name}</span>
        </div>

        {/* ── Proje bilgisi — Mobil ── */}
        <div className="md:hidden flex gap-3 mb-4">
          <div className="w-[88px] h-[80px] rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 flex items-center justify-center">
            {project.image_url
              ? <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" style={{ imageOrientation: 'from-image' }} />
              : <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 21V9l9-6 9 6v12H3z" stroke="#D3D1C7" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-lg text-primary-800 leading-tight mb-0.5">{project.name}</h1>
            <p className="flex items-center gap-1 text-xs text-neutral-500 mb-2.5">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#888780" /></svg>
              {loc}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { l: 'Proje Tipi',   v: project.tip            },
                { l: 'Daire Sayısı', v: String(project.units_count) },
                { l: 'İnşaat Alanı', v: project.area || '—'   },
              ].map(({ l, v }) => (
                <div key={l}>
                  <p className="text-[9px] text-neutral-400">{l}</p>
                  <p className="font-bold text-xs text-primary-800 mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Proje bilgisi — Desktop ── */}
        <div className="hidden md:flex gap-5 mb-5">
          <div className="w-[180px] h-[130px] rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 flex items-center justify-center">
            {project.image_url
              ? <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" style={{ imageOrientation: 'from-image' }} />
              : <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M3 21V9l9-6 9 6v12H3z" stroke="#D3D1C7" strokeWidth="1.5" strokeLinejoin="round" /></svg>
            }
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="font-bold text-2xl text-primary-800 leading-tight mb-1">{project.name}</h1>
            <p className="flex items-center gap-1.5 text-sm text-neutral-500 mb-4">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#888780" /></svg>
              {loc}
            </p>
            <div className="flex items-center gap-0">
              {[
                { l: 'Proje Tipi',    v: project.tip            },
                { l: 'Daire Sayısı',  v: String(project.units_count) },
                { l: 'İnşaat Alanı',  v: project.area || '—'   },
                { l: 'Arsa Alanı',    v: '1.250 m²'             },
                { l: 'Teslim Tarihi', v: fmtDate(project.delivery_date || project.delivery_year) },
              ].map(({ l, v }, i) => (
                <div key={l} className="flex items-center">
                  <div className="px-4 first:pl-0">
                    <p className="text-[11px] text-neutral-400 mb-0.5">{l}</p>
                    <p className="font-bold text-sm text-primary-800">{v}</p>
                  </div>
                  {i < 4 && <div className="w-px h-8 bg-neutral-100 flex-shrink-0" />}
                </div>
              ))}
              <div className="ml-6">
                <span className={`${st.bg} ${st.text} text-xs font-bold px-3 py-1.5 rounded-xl`}>{st.label}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex overflow-x-auto -mx-4 md:-mx-6 px-4 md:px-6 gap-0">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${tab === t.key
                ? 'border-primary-800 text-primary-800'
                : 'border-transparent text-neutral-500 hover:text-primary-700'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab içerikleri ───────────────────────────────────────────────── */}
      <div className="p-4 md:p-6">

        {/* GENEL BAKIŞ */}
        {tab === 'genel' && (
          <div className="md:flex md:gap-5 md:items-start">
            <div className="md:flex-1 space-y-4 min-w-0">
              <div className="md:hidden">
                <FinansalKartlar />
              </div>
              <ProjeIlerlemesiKart progress={progress} phases={phases} onEdit={() => setEditModal('ilerleme')} />
              <GenelBilgilerKart project={project} onEdit={() => setEditModal('bilgiler')} />
              <GorsellerKart photos={photos} setPhotos={setPhotos} slug={project.slug} projectId={project.id} />
            </div>
            <div className="hidden md:block md:w-[380px] space-y-4 flex-shrink-0">
              <FinansalKartlar />
              <BinaOzellikleriKart activeFeatures={activeFeatures} onEdit={() => setEditModal('ozellikler')} />
              <KonumKart mapLat={mapLat} mapLng={mapLng} nearbyPlaces={nearbyPlaces} onEdit={() => setEditModal('konum')} />
            </div>
            <div className="md:hidden mt-4 space-y-4">
              <BinaOzellikleriKart activeFeatures={activeFeatures} onEdit={() => setEditModal('ozellikler')} />
              <KonumKart mapLat={mapLat} mapLng={mapLng} nearbyPlaces={nearbyPlaces} onEdit={() => setEditModal('konum')} />
            </div>
          </div>
        )}

        {/* FİNANSAL */}
        {tab === 'finansal' && <FinansalTab slug={project.slug} />}

        {/* DAİRELER */}
        {tab === 'daireler' && <DairelerTab slug={project.slug} />}

        {/* EVRAKLAR */}
        {tab === 'evraklar' && <EvraklarTab slug={project.slug} />}

        {/* MALİKLER */}
        {tab === 'malikler' && <MaliklerTab slug={project.slug} />}

        {/* AYARLAR */}
        {tab === 'ayarlar' && <AyarlarTab project={project} onStatusSaved={status => setProject(prev => prev ? { ...prev, status } : prev)} />}
      </div>

      {/* ── Modaller ────────────────────────────────────────────────────── */}
      {editModal === 'bilgiler'   && <GenelBilgilerModal   project={project} onClose={() => setEditModal(null)} onSaved={updates => setProject(prev => prev ? { ...prev, ...updates } : prev)} />}
      {editModal === 'ozellikler' && <BinaOzellikleriModal activeFeatures={activeFeatures} setActiveFeatures={setActiveFeatures} projectId={project.id} onClose={() => setEditModal(null)} />}
      {editModal === 'ilerleme'   && <ProjeIlerlemesiModal progress={progress} setProgress={setProgress} phases={phases} setPhases={setPhases} projectId={project.id} onClose={() => setEditModal(null)} />}
      {editModal === 'konum'      && <KonumModal mapLat={mapLat} mapLng={mapLng} setMapLat={setMapLat} setMapLng={setMapLng} nearbyPlaces={nearbyPlaces} setNearbyPlaces={setNearbyPlaces} projectId={project.id} onClose={() => setEditModal(null)} />}
    </div>
  )
}
