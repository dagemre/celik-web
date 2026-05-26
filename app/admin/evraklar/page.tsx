'use client'

import { useState } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────
type EvrakDurum = 'paylasiliyor' | 'gizli'
type EvrakItem  = { id: string; proje: string; klasor: string; tur: string; ad: string; boyut: string; tarih: string; durum: EvrakDurum }
type EvrakForm  = { proje: string; klasor: string; yeniKlasor: string; tur: string; ad: string; durum: EvrakDurum }

// ── Sabit veriler ──────────────────────────────────────────────────────────────
const EVRAK_TURLERI    = ['Resmi Belge', 'Proje', 'Sözleşme', 'Rapor', 'Dekont']
const EVRAK_KATEGORILER = ['Tümü', ...EVRAK_TURLERI]

const TUR_STYLE: Record<string, { bg: string; text: string }> = {
  'Resmi Belge': { bg: 'bg-info-50',     text: 'text-info-700'    },
  'Proje':       { bg: 'bg-primary-50',  text: 'text-primary-700' },
  'Sözleşme':    { bg: 'bg-warning-50',  text: 'text-warning-700' },
  'Rapor':       { bg: 'bg-neutral-100', text: 'text-neutral-600' },
  'Dekont':      { bg: 'bg-success-50',  text: 'text-success-700' },
}

const PROJELER_LISTESI = ['Kemal Apartman', 'Gülbahçe Apartmanı', 'Doğa Rezidans', 'Yazgan Konutları']

const MOCK_EVRAKLAR: EvrakItem[] = [
  // Kemal Apartman
  { id: 'e1',  proje: 'Kemal Apartman',     klasor: 'Ruhsat',           tur: 'Resmi Belge', ad: 'İnşaat Ruhsatı',           boyut: '2.4 MB', tarih: '12.03.2026', durum: 'paylasiliyor' },
  { id: 'e2',  proje: 'Kemal Apartman',     klasor: 'Ruhsat',           tur: 'Resmi Belge', ad: 'Yapı Kullanma İzni',        boyut: '1.8 MB', tarih: '15.03.2026', durum: 'gizli'        },
  { id: 'e3',  proje: 'Kemal Apartman',     klasor: 'Sözleşmeler',      tur: 'Sözleşme',   ad: 'Sözleşme - Emre Dağ',       boyut: '3.2 MB', tarih: '10.01.2026', durum: 'paylasiliyor' },
  { id: 'e4',  proje: 'Kemal Apartman',     klasor: 'Teknik Projeler',  tur: 'Proje',       ad: 'Mimari Proje',              boyut: '8.5 MB', tarih: '05.02.2026', durum: 'paylasiliyor' },
  { id: 'e5',  proje: 'Kemal Apartman',     klasor: 'Finansal',         tur: 'Rapor',       ad: 'Bütçe Raporu Q1',           boyut: '1.5 MB', tarih: '01.04.2026', durum: 'gizli'        },
  // Gülbahçe Apartmanı
  { id: 'e6',  proje: 'Gülbahçe Apartmanı', klasor: 'Ruhsat',           tur: 'Resmi Belge', ad: 'İnşaat Ruhsatı',           boyut: '2.1 MB', tarih: '08.03.2026', durum: 'paylasiliyor' },
  { id: 'e7',  proje: 'Gülbahçe Apartmanı', klasor: 'Teknik Projeler',  tur: 'Proje',       ad: 'Statik Hesap Raporu',       boyut: '5.2 MB', tarih: '12.02.2026', durum: 'paylasiliyor' },
  { id: 'e8',  proje: 'Gülbahçe Apartmanı', klasor: 'Finansal',         tur: 'Dekont',      ad: 'Ödeme Dekontu - Mart',      boyut: '0.8 MB', tarih: '31.03.2026', durum: 'gizli'        },
  // Doğa Rezidans
  { id: 'e9',  proje: 'Doğa Rezidans',      klasor: 'Ruhsat',           tur: 'Resmi Belge', ad: 'İtfaiye Uygunluk Belgesi', boyut: '0.9 MB', tarih: '20.03.2026', durum: 'paylasiliyor' },
  { id: 'e10', proje: 'Doğa Rezidans',      klasor: 'Sözleşmeler',      tur: 'Sözleşme',   ad: 'Sözleşme - Ahmet Yılmaz',   boyut: '3.1 MB', tarih: '14.01.2026', durum: 'paylasiliyor' },
  // Yazgan Konutları
  { id: 'e11', proje: 'Yazgan Konutları',   klasor: 'Teknik Projeler',  tur: 'Proje',       ad: 'Elektrik Projesi',          boyut: '4.3 MB', tarih: '18.02.2026', durum: 'paylasiliyor' },
  { id: 'e12', proje: 'Yazgan Konutları',   klasor: 'Yazışmalar',       tur: 'Resmi Belge', ad: 'Yazışma - Belediye',        boyut: '1.2 MB', tarih: '22.04.2026', durum: 'gizli'        },
]

// ── Pdf İkonu ──────────────────────────────────────────────────────────────────
const PdfIcon = () => (
  <div className="w-9 h-9 bg-danger-50 rounded-lg flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#A32D2D" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M14 2v6h6" stroke="#A32D2D" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </div>
)

// ── Evrak Ekle Formu ───────────────────────────────────────────────────────────
const EvrakEkleForm = ({ form, setForm, mevcutKlasorler, onEkle, onClose }: {
  form: EvrakForm
  setForm: React.Dispatch<React.SetStateAction<EvrakForm>>
  mevcutKlasorler: string[]
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

    {/* Proje seç */}
    <p className="text-xs font-medium text-neutral-500 mb-2">Proje</p>
    <div className="flex gap-2 flex-wrap mb-4">
      {PROJELER_LISTESI.map(p => (
        <button key={p} onClick={() => setForm({ ...form, proje: p })}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${form.proje === p
            ? 'bg-primary-800 text-white border-primary-800'
            : 'bg-white text-neutral-600 border-neutral-200 hover:border-primary-300'}`}>
          {p}
        </button>
      ))}
    </div>

    {/* Evrak Adı */}
    <p className="text-xs font-medium text-neutral-500 mb-1.5">Evrak Adı</p>
    <input
      value={form.ad}
      onChange={e => setForm({ ...form, ad: e.target.value })}
      placeholder="Örn. İnşaat Ruhsatı"
      className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors mb-4"
    />

    {/* Evrak Türü */}
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

    {/* Klasör */}
    <p className="text-xs font-medium text-neutral-500 mb-2">Klasör</p>
    <div className="flex gap-2 flex-wrap mb-3">
      {mevcutKlasorler.map(k => (
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

    {/* Paylaşım Durumu */}
    <p className="text-xs font-medium text-neutral-500 mb-2">Paylaşım Durumu</p>
    <div className="flex gap-2 mb-5">
      {(['paylasiliyor', 'gizli'] as EvrakDurum[]).map(d => (
        <button key={d} onClick={() => setForm({ ...form, durum: d })}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${form.durum === d
            ? d === 'paylasiliyor' ? 'bg-success-50 text-success-700 border-success-200' : 'bg-neutral-100 text-neutral-700 border-neutral-200'
            : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'}`}>
          {d === 'paylasiliyor' ? 'Paylaşılıyor' : 'Gizli'}
        </button>
      ))}
    </div>

    {/* PDF Yükleme */}
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

// ── Ana Sayfa ──────────────────────────────────────────────────────────────────
export default function AdminEvraklarPage() {
  const [evraklar, setEvraklar]     = useState<EvrakItem[]>(MOCK_EVRAKLAR)
  const [aramaText, setAramaText]   = useState('')
  const [aktifKat, setAktifKat]     = useState('Tümü')
  const [expandedProje, setExpandedProje] = useState<string | null>(null)
  const [expandedKlasor, setExpandedKlasor] = useState<Record<string, string | null>>({})
  const [showPanel, setShowPanel]   = useState(false)
  const [menuAcik, setMenuAcik]     = useState<string | null>(null)
  const [form, setForm]             = useState<EvrakForm>({
    proje: PROJELER_LISTESI[0], klasor: 'Ruhsat', yeniKlasor: '',
    tur: 'Resmi Belge', ad: '', durum: 'paylasiliyor',
  })

  const projeler    = Array.from(new Set(evraklar.map(e => e.proje)))
  const tumKlasorler = Array.from(new Set(evraklar.map(e => e.klasor)))

  const filtrelenmis = evraklar.filter(e => {
    const aramaOk = !aramaText || e.ad.toLowerCase().includes(aramaText.toLowerCase())
      || e.proje.toLowerCase().includes(aramaText.toLowerCase())
      || e.klasor.toLowerCase().includes(aramaText.toLowerCase())
    const katOk = aktifKat === 'Tümü' || e.tur === aktifKat
    return aramaOk && katOk
  })

  const toplam     = evraklar.length
  const paylasilan = evraklar.filter(e => e.durum === 'paylasiliyor').length
  const gizli      = evraklar.filter(e => e.durum === 'gizli').length

  const handleEkle = () => {
    const klasorAd = form.yeniKlasor.trim() || form.klasor
    if (!form.ad.trim() || !form.proje || !klasorAd) return
    const yeni: EvrakItem = {
      id: `e${Date.now()}`, proje: form.proje, klasor: klasorAd, tur: form.tur,
      ad: form.ad.trim(), boyut: '—',
      tarih: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.'),
      durum: form.durum,
    }
    setEvraklar(prev => [...prev, yeni])
    setShowPanel(false)
    setForm({ proje: PROJELER_LISTESI[0], klasor: 'Ruhsat', yeniKlasor: '', tur: 'Resmi Belge', ad: '', durum: 'paylasiliyor' })
  }

  const toggleProjeKlasor = (proje: string, klasor: string) => {
    setExpandedKlasor(prev => ({ ...prev, [proje]: prev[proje] === klasor ? null : klasor }))
  }

  return (
    <div className="p-4 md:p-6">

      {/* Başlık */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-2xl text-primary-800">Evraklar</h1>
        <button onClick={() => setShowPanel(true)}
          className="flex items-center gap-1.5 bg-primary-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Evrak Ekle
        </button>
      </div>

      <div className={`md:flex md:gap-4 md:items-start`}>
        <div className={`min-w-0 ${showPanel ? 'md:flex-1' : 'w-full'} space-y-3`}>

          {/* Arama */}
          <div className="relative">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40">
              <circle cx="11" cy="11" r="8" stroke="#0A1F44" strokeWidth="1.8" />
              <path d="M21 21l-4.35-4.35" stroke="#0A1F44" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
            <input
              value={aramaText}
              onChange={e => setAramaText(e.target.value)}
              placeholder="Apartman, proje veya evrak ara..."
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

          {/* Proje listesi */}
          <div className="space-y-2">
            {projeler.map(proje => {
              const projeEvraklar    = filtrelenmis.filter(e => e.proje === proje)
              const projeTumEvraklar = evraklar.filter(e => e.proje === proje)
              if (projeEvraklar.length === 0 && (aramaText || aktifKat !== 'Tümü')) return null

              const isExpanded    = expandedProje === proje
              const klasorler     = Array.from(new Set(projeTumEvraklar.map(e => e.klasor)))
              const expKlasor     = expandedKlasor[proje] ?? null

              return (
                <div key={proje} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">

                  {/* Proje başlığı */}
                  <button
                    onClick={() => setExpandedProje(isExpanded ? null : proje)}
                    className="w-full flex items-center gap-3 px-4 py-4 hover:bg-neutral-50 transition-colors">
                    <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M3 21V9l9-6 9 6v12H3z" stroke="#0A1F44" strokeWidth="1.6" strokeLinejoin="round"/>
                        <path d="M9 21V12h6v9" stroke="#0A1F44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-sm text-primary-800">{proje}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {klasorler.length} klasör · {projeTumEvraklar.length} evrak
                      </p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <path d="M6 9l6 6 6-6" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>

                  {/* Klasörler */}
                  {isExpanded && (
                    <div className="border-t border-neutral-50">
                      {klasorler.map(klasor => {
                        const klasorEvraklar     = (projeEvraklar.length > 0 ? projeEvraklar : projeTumEvraklar).filter(e => e.klasor === klasor)
                        const klasorTumEvraklar  = projeTumEvraklar.filter(e => e.klasor === klasor)
                        if (klasorEvraklar.length === 0 && (aramaText || aktifKat !== 'Tümü')) return null
                        const isKlasorExpanded   = expKlasor === klasor

                        return (
                          <div key={klasor} className="border-b border-neutral-50 last:border-0">
                            {/* Klasör satırı */}
                            <button
                              onClick={() => toggleProjeKlasor(proje, klasor)}
                              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-neutral-50 transition-colors">
                              <div className="w-7 h-7 bg-warning-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                  <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" stroke="#92400E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                              </div>
                              <div className="flex-1 text-left">
                                <span className="font-medium text-sm text-primary-800">{klasor}</span>
                                <span className="text-xs text-neutral-400 ml-2">{klasorTumEvraklar.length} evrak</span>
                              </div>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                className={`flex-shrink-0 transition-transform ${isKlasorExpanded ? 'rotate-180' : ''}`}>
                                <path d="M6 9l6 6 6-6" stroke="#B0AEA5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>

                            {/* Evrak satırları */}
                            {isKlasorExpanded && (
                              <div className="bg-neutral-50/50 divide-y divide-neutral-100">
                                {(klasorEvraklar.length > 0 ? klasorEvraklar : klasorTumEvraklar).map(evrak => {
                                  const turStyle = TUR_STYLE[evrak.tur] ?? TUR_STYLE['Rapor']
                                  return (
                                    <div key={evrak.id} className="flex items-center gap-3 pl-14 pr-4 py-3 relative">
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
                                            <button className="w-full text-left px-4 py-2.5 text-sm text-primary-800 hover:bg-neutral-50 transition-colors">İndir</button>
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
                                            }} className="w-full text-left px-4 py-2.5 text-sm text-danger-700 hover:bg-danger-50 transition-colors">Sil</button>
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
                    </div>
                  )}
                </div>
              )
            })}

            {/* Boş durum */}
            {filtrelenmis.length === 0 && (
              <div className="bg-white rounded-2xl border border-neutral-100 py-14 flex flex-col items-center">
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
              mevcutKlasorler={tumKlasorler}
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
              mevcutKlasorler={tumKlasorler}
              onEkle={handleEkle}
              onClose={() => setShowPanel(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
