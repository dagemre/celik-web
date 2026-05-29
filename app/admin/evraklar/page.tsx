'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────────
type EvrakItem = {
  id: string
  proje: string
  klasor: string
  tur: string
  ad: string
  boyut: string
  tarih: string
  durum: 'paylasiliyor' | 'gizli'
  file_url: string | null
  storage_path: string | null
}

// ── Sabit veriler ──────────────────────────────────────────────────────────────
const EVRAK_TURLERI     = ['Resmi Belge', 'Proje', 'Sözleşme', 'Rapor', 'Dekont']
const EVRAK_KATEGORILER = ['Tümü', ...EVRAK_TURLERI]

const TUR_STYLE: Record<string, { bg: string; text: string }> = {
  'Resmi Belge': { bg: 'bg-info-50',     text: 'text-info-700'    },
  'Proje':       { bg: 'bg-primary-50',  text: 'text-primary-700' },
  'Sözleşme':    { bg: 'bg-warning-50',  text: 'text-warning-700' },
  'Rapor':       { bg: 'bg-neutral-100', text: 'text-neutral-600' },
  'Dekont':      { bg: 'bg-success-50',  text: 'text-success-700' },
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')
}

// ── Pdf İkonu ──────────────────────────────────────────────────────────────────
const PdfIcon = () => (
  <div className="w-9 h-9 bg-danger-50 rounded-lg flex items-center justify-center flex-shrink-0">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#A32D2D" strokeWidth="1.6" strokeLinejoin="round"/>
      <path d="M14 2v6h6" stroke="#A32D2D" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  </div>
)

// ── Ana Sayfa ──────────────────────────────────────────────────────────────────
export default function AdminEvraklarPage() {
  const router = useRouter()

  const [evraklar,      setEvraklar]      = useState<EvrakItem[]>([])
  const [loading,       setLoading]       = useState(true)
  const [aramaText,     setAramaText]     = useState('')
  const [aktifKat,      setAktifKat]      = useState('Tümü')
  const [expandedProje, setExpandedProje] = useState<string | null>(null)
  const [expandedKlasor, setExpandedKlasor] = useState<Record<string, string | null>>({})
  const [menuAcik,      setMenuAcik]      = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // ── Supabase'den yükle ──────────────────────────────────────────────────────
  const loadEvraklar = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('documents')
      .select('*, projects(name)')
      .order('created_at', { ascending: false })

    if (!error && data) {
      setEvraklar(
        data.map((d: any) => ({
          id:           d.id,
          proje:        d.projects?.name ?? 'Proje yok',
          klasor:       d.folder ?? 'Diğer',
          tur:          d.type   ?? 'Rapor',
          ad:           d.name,
          boyut:        d.file_size ?? '—',
          tarih:        d.created_at ? formatDate(d.created_at) : '—',
          durum:        d.is_shared ? 'paylasiliyor' : 'gizli',
          file_url:     d.file_url ?? null,
          storage_path: d.storage_path ?? null,
        }))
      )
    }
    setLoading(false)
  }, [])

  useEffect(() => { loadEvraklar() }, [loadEvraklar])

  // Dışarı tıklayınca menüyü kapat
  useEffect(() => {
    const handler = () => setMenuAcik(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [])

  // ── Aksiyonlar ──────────────────────────────────────────────────────────────
  function handleDownload(evrak: EvrakItem) {
    if (!evrak.file_url) return
    window.open(evrak.file_url, '_blank')
    setMenuAcik(null)
  }

  async function handleToggleShare(evrak: EvrakItem) {
    setActionLoading(evrak.id)
    setMenuAcik(null)
    const yeniDurum = evrak.durum !== 'paylasiliyor'
    await supabase.from('documents').update({ is_shared: yeniDurum }).eq('id', evrak.id)
    setEvraklar(prev =>
      prev.map(e => e.id === evrak.id ? { ...e, durum: yeniDurum ? 'paylasiliyor' : 'gizli' } : e)
    )
    setActionLoading(null)
  }

  async function handleDelete(evrak: EvrakItem) {
    if (!confirm(`"${evrak.ad}" silinsin mi?`)) return
    setActionLoading(evrak.id)
    setMenuAcik(null)

    // Önce storage'dan sil
    if (evrak.storage_path) {
      await supabase.storage.from('documents').remove([evrak.storage_path])
    }

    // Sonra DB'den sil
    await supabase.from('documents').delete().eq('id', evrak.id)
    setEvraklar(prev => prev.filter(e => e.id !== evrak.id))
    setActionLoading(null)
  }

  // ── Filtre ─────────────────────────────────────────────────────────────────
  const filtrelenmis = evraklar.filter(e => {
    const aramaOk = !aramaText
      || e.ad.toLowerCase().includes(aramaText.toLowerCase())
      || e.proje.toLowerCase().includes(aramaText.toLowerCase())
      || e.klasor.toLowerCase().includes(aramaText.toLowerCase())
    const katOk = aktifKat === 'Tümü' || e.tur === aktifKat
    return aramaOk && katOk
  })

  const projeler = Array.from(new Set(evraklar.map(e => e.proje)))

  const toggleProjeKlasor = (proje: string, klasor: string) => {
    setExpandedKlasor(prev => ({ ...prev, [proje]: prev[proje] === klasor ? null : klasor }))
  }

  return (
    <div className="p-4 md:p-6">

      {/* Başlık */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="font-bold text-2xl text-primary-800">Evraklar</h1>
        <button
          onClick={() => router.push('/admin/evraklar/yeni')}
          className="flex items-center gap-1.5 bg-primary-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          Evrak Yükle
        </button>
      </div>

      <div className="space-y-3">

        {/* Arama */}
        <div className="relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-40">
            <circle cx="11" cy="11" r="8" stroke="#0A1F44" strokeWidth="1.8"/>
            <path d="M21 21l-4.35-4.35" stroke="#0A1F44" strokeWidth="1.8" strokeLinecap="round"/>
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

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl border border-neutral-100 py-10 flex flex-col items-center gap-3">
            <svg className="animate-spin" width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#E5E2D9" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#0A1F44" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            <p className="text-sm text-neutral-400">Evraklar yükleniyor...</p>
          </div>
        )}

        {/* Proje listesi */}
        {!loading && (
          <div className="space-y-2">
            {projeler.map(proje => {
              const projeEvraklar    = filtrelenmis.filter(e => e.proje === proje)
              const projeTumEvraklar = evraklar.filter(e => e.proje === proje)
              if (projeEvraklar.length === 0 && (aramaText || aktifKat !== 'Tümü')) return null

              const isExpanded = expandedProje === proje
              const klasorler  = Array.from(new Set(projeTumEvraklar.map(e => e.klasor)))
              const expKlasor  = expandedKlasor[proje] ?? null

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
                                  const isLoading = actionLoading === evrak.id
                                  return (
                                    <div key={evrak.id} className={`flex items-center gap-3 pl-14 pr-4 py-3 relative transition-opacity ${isLoading ? 'opacity-50' : ''}`}>
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
                                        <button
                                          onClick={e => { e.stopPropagation(); setMenuAcik(menuAcik === evrak.id ? null : evrak.id) }}
                                          disabled={isLoading}
                                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0">
                                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="5" r="1.5" fill="#888780"/>
                                            <circle cx="12" cy="12" r="1.5" fill="#888780"/>
                                            <circle cx="12" cy="19" r="1.5" fill="#888780"/>
                                          </svg>
                                        </button>
                                        {menuAcik === evrak.id && (
                                          <div
                                            className="absolute right-0 top-9 z-20 bg-white rounded-xl border border-neutral-100 shadow-lg min-w-[140px] py-1"
                                            onClick={e => e.stopPropagation()}
                                          >
                                            <button
                                              onClick={() => handleDownload(evrak)}
                                              disabled={!evrak.file_url}
                                              className="w-full text-left px-4 py-2.5 text-sm text-primary-800 hover:bg-neutral-50 transition-colors disabled:opacity-40"
                                            >
                                              İndir
                                            </button>
                                            <button
                                              onClick={() => handleToggleShare(evrak)}
                                              className="w-full text-left px-4 py-2.5 text-sm text-primary-800 hover:bg-neutral-50 transition-colors"
                                            >
                                              {evrak.durum === 'paylasiliyor' ? 'Gizle' : 'Paylaş'}
                                            </button>
                                            <button
                                              onClick={() => handleDelete(evrak)}
                                              className="w-full text-left px-4 py-2.5 text-sm text-danger-700 hover:bg-danger-50 transition-colors"
                                            >
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
                    </div>
                  )}
                </div>
              )
            })}

            {/* Boş durum */}
            {filtrelenmis.length === 0 && !loading && (
              <div className="bg-white rounded-2xl border border-neutral-100 py-14 flex flex-col items-center">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#D3D1C7" strokeWidth="1.4" strokeLinejoin="round"/>
                  <path d="M14 2v6h6" stroke="#D3D1C7" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
                <p className="mt-3 font-medium text-neutral-400">Evrak bulunamadı</p>
                <button
                  onClick={() => router.push('/admin/evraklar/yeni')}
                  className="mt-4 px-4 py-2 bg-primary-800 text-white text-xs font-semibold rounded-xl hover:bg-primary-700 transition-colors"
                >
                  İlk evrakı yükle
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
