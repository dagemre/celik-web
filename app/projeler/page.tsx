'use client'

import { useState } from 'react'
import Link from 'next/link'

// İleride Supabase'den gelecek — şimdilik mock data
const PROJECTS = [
  { slug: 'afacan-sokak',           name: 'Afacan Sokak',            location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/afacan-sokak/DJI_20240921214713_0237_D.JPG' },
  { slug: 'cengiz-sokak',           name: 'Cengiz Sokak',            location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/cengiz-sokak/DJI_20240921220055_0248_D.jpg' },
  { slug: 'ds-ahmet-caddesi',       name: 'D.S. Ahmet Caddesi',      location: 'Avcılar',  tip: 'Ticari',  status: 'tamamlandi',  image: '/projeler/ds-ahmet-caddesi/DJI_20240920213730_0137_D.JPG' },
  { slug: 'degirmen-sokak',         name: 'Değirmen Sokak',          location: 'Avcılar',  tip: 'Konut',   status: 'devam',       image: '/projeler/degirmen-sokak/DJI_20240922001110_0317_D.JPG' },
  { slug: 'filiz-sokak',            name: 'Filiz Sokak',             location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/filiz-sokak/DJI_20240920221911_0166_D.JPG' },
  { slug: 'gayretli-sokak',         name: 'Gayretli Sokak',          location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/gayretli-sokak/DJI_20240920224515_0189_D.JPG' },
  { slug: 'hacibey-sokak',          name: 'Hacıbey Sokak',           location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/hacibey-sokak/DJI_20240921234703_0299_D.JPG' },
  { slug: 'inci-sokak',             name: 'İnci Sokak',              location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/inci-sokak/DJI_20240921214713_0237_D.JPG' },
  { slug: 'koroglu-sokak',          name: 'Köroğlu Sokak',           location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/koroglu-sokak/DJI_20240921223036_0261_D.JPG' },
  { slug: 'kutlu-sokak',            name: 'Kutlu Sokak',             location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/kutlu-sokak/DJI_20240921230119_0278_D.JPG' },
  { slug: 'mahmutoglu-sokak',       name: 'Mahmutoğlu Sokak',        location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/mahmutoglu-sokak/DJI_20240921210940_0209_D.JPG' },
  { slug: 'menekse-sokak',          name: 'Menekşe Sokak',           location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/menekse-sokak/DJI_20240921212429_0222_D.JPG' },
  { slug: 'oya-sokak',              name: 'Oya Sokak',               location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/oya-sokak/DJI_20240920222607_0175_D.JPG' },
  { slug: 'ozcan-sokak',            name: 'Özcan Sokak',             location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/ozcan-sokak/DJI_20240921221610_0256_D.JPG' },
  { slug: 'papatya-sokak',          name: 'Papatya Sokak',           location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/papatya-sokak/DJI_20240920224940_0193_D.JPG' },
  { slug: 'sulun-sokak-2',          name: 'Sülün Sokak 2',           location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/sulun-sokak-2/DJI_20240920211258_0123_D.JPG' },
  { slug: 'sulun-sokak',            name: 'Sülün Sokak',             location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/sulun-sokak/DJI_20240920210639_0114_D.JPG' },
  { slug: 'sukrubey-caddesi',       name: 'Şükrübey Caddesi',        location: 'Avcılar',  tip: 'Ticari',  status: 'tamamlandi',  image: '/projeler/sukrubey-caddesi/DJI_20240921231700_0289_D.JPG' },
  { slug: 'tavla-sokak',            name: 'Tavla Sokak',             location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/tavla-sokak/DJI_20240920220107_0152_D.JPG' },
  { slug: 'turna-sokak',            name: 'Turna Sokak',             location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/turna-sokak/DJI_20240920212530_0131_D.JPG' },
  { slug: 'uner-sokak',             name: 'Üner Sokak',              location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/uner-sokak/DJI_20240921224800_0270_D.JPG' },
  { slug: 'yazgan-sokak',           name: 'Yazgan Sokak',            location: 'Avcılar',  tip: 'Konut',   status: 'tamamlandi',  image: '/projeler/yazgan-sokak/DJI_20240920204659_0103_D.JPG' },
]

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

const LOKASYONLAR = ['Tüm Lokasyonlar', ...Array.from(new Set(PROJECTS.map(p => p.location)))]
const TIPLER      = ['Tüm Proje Tipleri', ...Array.from(new Set(PROJECTS.map(p => p.tip)))]

export default function ProjelerPage() {
  const [activeTab,  setActiveTab]  = useState('tumu')
  const [lokasyon,   setLokasyon]   = useState('Tüm Lokasyonlar')
  const [tip,        setTip]        = useState('Tüm Proje Tipleri')
  const [applied,    setApplied]    = useState({ lok: 'Tüm Lokasyonlar', tip: 'Tüm Proje Tipleri' })

  const counts: Record<string, number> = {
    tumu:       PROJECTS.length,
    devam:      PROJECTS.filter(p => p.status === 'devam').length,
    tamamlandi: PROJECTS.filter(p => p.status === 'tamamlandi').length,
    yakinda:    PROJECTS.filter(p => p.status === 'yakinda').length,
  }

  const filtered = PROJECTS.filter(p => {
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
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
            Projelerimiz
          </h1>
          <p className="text-white/70 text-sm mt-3 max-w-md leading-relaxed">
            Modern mimari, kaliteli işçiliğimiz ve zamanında teslim prensibimizle değer katan projeler üretiyoruz.
          </p>
        </div>
      </section>

      {/* Filtre bar */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4 py-3 overflow-x-auto">

            {/* Sol — durum sekmeleri (pill) */}
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

            {/* Sağ — dropdown filtreler */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Lokasyon */}
              <div className="relative">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm text-gray-600 cursor-pointer hover:border-gray-300 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  <select
                    value={lokasyon}
                    onChange={e => setLokasyon(e.target.value)}
                    className="appearance-none bg-transparent outline-none cursor-pointer pr-4 text-sm font-medium text-gray-700"
                  >
                    {LOKASYONLAR.map(l => <option key={l}>{l}</option>)}
                  </select>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="pointer-events-none">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Proje Tipi */}
              <div className="relative">
                <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white text-sm text-gray-600 cursor-pointer hover:border-gray-300 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                  <select
                    value={tip}
                    onChange={e => setTip(e.target.value)}
                    className="appearance-none bg-transparent outline-none cursor-pointer pr-4 text-sm font-medium text-gray-700"
                  >
                    {TIPLER.map(t => <option key={t}>{t}</option>)}
                  </select>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" className="pointer-events-none">
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Filtrele butonu */}
              <button
                onClick={handleFiltrele}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  hasActiveFilter
                    ? 'bg-[#0A1F44] text-white'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                Filtrele
                {hasActiveFilter && (
                  <span
                    onClick={e => { e.stopPropagation(); setLokasyon('Tüm Lokasyonlar'); setTip('Tüm Proje Tipleri'); setApplied({ lok: 'Tüm Lokasyonlar', tip: 'Tüm Proje Tipleri' }) }}
                    className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 ml-1"
                    title="Filtreyi temizle"
                  >
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg>
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          {/* Sonuç sayısı */}
          <p className="text-gray-400 text-sm mb-6">{filtered.length} proje listeleniyor</p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">Bu kriterlere uygun proje bulunamadı.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map(project => (
                <Link
                  key={project.slug}
                  href={`/projeler/${project.slug}`}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow group"
                >
                  {/* Görsel */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className={`absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-md ${STATUS_LABEL[project.status].bg}`}>
                      {STATUS_LABEL[project.status].label}
                    </span>
                  </div>

                  {/* Bilgiler */}
                  <div className="p-4">
                    <h3 className="font-bold text-[#0A1F44] text-base mb-1.5">{project.name}</h3>

                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                      </svg>
                      İstanbul / {project.location}
                    </div>

                    <div className="flex items-center justify-between">
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
