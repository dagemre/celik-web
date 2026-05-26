'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

type Project = {
  id: string
  name: string
  slug: string
  location: string
  tip: string
  status: string
  floors: number
  units_count: number
  delivery_year: string
  image_url: string
}

const STATUS_LABEL: Record<string, { label: string; bg: string }> = {
  devam:      { label: 'DEVAM EDİYOR', bg: 'bg-[#0A1F44]' },
  tamamlandi: { label: 'TAMAMLANDI',   bg: 'bg-emerald-600' },
  yakinda:    { label: 'YAKINDA',       bg: 'bg-amber-500' },
}

const TABS = [
  { key: 'tumu',       label: 'Tümü' },
  { key: 'devam',      label: 'Devam Eden' },
  { key: 'tamamlandi', label: 'Tamamlanan' },
  { key: 'yakinda',    label: 'Yakında' },
]

export default function ProjelerPage() {
  const [projects,   setProjects]   = useState<Project[]>([])
  const [loading,    setLoading]    = useState(true)
  const [dbError,    setDbError]    = useState<string | null>(null)
  const [activeTab,  setActiveTab]  = useState('tumu')
  const [lokasyon,   setLokasyon]   = useState('Tüm Lokasyonlar')
  const [tip,        setTip]        = useState('Tüm Proje Tipleri')
  const [applied,    setApplied]    = useState({ lok: 'Tüm Lokasyonlar', tip: 'Tüm Proje Tipleri' })

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Projeler yüklenemedi:', error)
        setDbError(error.message)
      } else {
        setProjects(data || [])
      }
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const LOKASYONLAR = ['Tüm Lokasyonlar', ...Array.from(new Set(projects.map(p => p.location)))]
  const TIPLER      = ['Tüm Proje Tipleri', ...Array.from(new Set(projects.map(p => p.tip)))]

  const counts: Record<string, number> = {
    tumu:       projects.length,
    devam:      projects.filter(p => p.status === 'devam').length,
    tamamlandi: projects.filter(p => p.status === 'tamamlandi').length,
    yakinda:    projects.filter(p => p.status === 'yakinda').length,
  }

  const filtered = projects.filter(p => {
    if (activeTab !== 'tumu' && p.status !== activeTab) return false
    if (applied.lok !== 'Tüm Lokasyonlar' && p.location !== applied.lok) return false
    if (applied.tip !== 'Tüm Proje Tipleri' && p.tip !== applied.tip) return false
    return true
  })

  const handleFiltrele = () => setApplied({ lok: lokasyon, tip: tip })
  const hasActiveFilter = applied.lok !== 'Tüm Lokasyonlar' || applied.tip !== 'Tüm Proje Tipleri'

  return (
    <>
      {/* Hero */}
      <section className="relative h-[420px] flex items-end overflow-hidden">
        <img
          src="/Projeler-hero.jpg"
          alt="Projelerimiz"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">Projelerimiz</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">Projelerimiz</h1>
          <p className="text-white/70 text-sm mt-3 max-w-md leading-relaxed">
            Modern mimari, kaliteli işçiliğimiz ve zamanında teslim prensibimizle değer katan projeler üretiyoruz.
          </p>
        </div>
      </section>

      {/* Filtre bar */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 py-3 overflow-x-auto">
            <div className="flex items-center gap-2 flex-shrink-0">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.key
                      ? 'bg-[#0A1F44] text-white shadow-sm'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-[#0A1F44]'
                  }`}
                >
                  {tab.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {counts[tab.key as keyof typeof counts]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm text-gray-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                <select value={lokasyon} onChange={e => setLokasyon(e.target.value)}
                  className="appearance-none bg-transparent outline-none cursor-pointer pr-4 text-sm font-medium text-gray-700">
                  {LOKASYONLAR.map(l => <option key={l}>{l}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm text-gray-600">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                  <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                </svg>
                <select value={tip} onChange={e => setTip(e.target.value)}
                  className="appearance-none bg-transparent outline-none cursor-pointer pr-4 text-sm font-medium text-gray-700">
                  {TIPLER.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <button onClick={handleFiltrele}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  hasActiveFilter ? 'bg-[#0A1F44] text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filtrele
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-gray-400 text-sm mb-6">{filtered.length} proje listeleniyor</p>

          {dbError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-mono">
              ⚠️ Supabase Hatası: {dbError}
            </div>
          )}

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="flex gap-2">
                      <div className="h-5 bg-gray-100 rounded-lg w-16" />
                      <div className="h-5 bg-gray-100 rounded-lg w-16" />
                      <div className="h-5 bg-gray-100 rounded-lg w-14" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              {projects.length === 0 ? 'Henüz proje eklenmemiş.' : 'Bu kriterlere uygun proje bulunamadı.'}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map(project => (
                <Link
                  key={project.id}
                  href={`/projeler/${project.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group"
                >
                  {/* Görsel */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image_url}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      style={{ imageOrientation: 'from-image' }}
                    />
                    <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-md ${STATUS_LABEL[project.status]?.bg ?? 'bg-gray-500'}`}>
                      {STATUS_LABEL[project.status]?.label ?? project.status}
                    </span>
                  </div>

                  {/* Bilgiler */}
                  <div className="p-4">
                    <h3 className="font-bold text-[#0A1F44] text-base mb-1">{project.name}</h3>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      İstanbul / {project.location}
                    </div>

                    {/* Detay chip'leri */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {project.floors > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#0A1F44] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="2.5">
                            <rect x="2" y="3" width="20" height="4" rx="1"/><rect x="2" y="10" width="20" height="4" rx="1"/><rect x="2" y="17" width="20" height="4" rx="1"/>
                          </svg>
                          {project.floors} Kat
                        </span>
                      )}
                      {project.units_count > 0 && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-[#0A1F44] bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-lg">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="2.5">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                          </svg>
                          {project.units_count} Daire
                        </span>
                      )}
                      {project.delivery_year && (
                        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-lg">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#047857" strokeWidth="2.5">
                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {project.delivery_year}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-2.5">
                      <span className="text-[11px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{project.tip}</span>
                      <div className="w-7 h-7 rounded-full bg-gray-50 group-hover:bg-[#0A1F44] flex items-center justify-center transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:stroke-white transition-colors">
                          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
