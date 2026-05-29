'use client'

import { useState } from 'react'
import Link from 'next/link'

type OzellikItem = { icon: string; label: string }
type StatItem    = { icon: string; label: string; value: string }

type ProjeProps = {
  slug:         string
  name:         string
  location:     string
  description:  string
  statusLabel:  string
  statusBg:     string
  ilerleme:     number
  ozellikler:   OzellikItem[]
  gallery:      string[]
  heroImage:    string
  stats:        StatItem[]
  floors:       number | null
  unitsCount:   number | null
  deliveryYear: string | null
}

function Icon({ name, size = 24, className = '' }: { name: string; size?: number; className?: string }) {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt={name}
      width={size}
      height={size}
      className={className}
    />
  )
}

export default function ProjeDetayClient({ proje }: { proje: ProjeProps }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[560px] flex flex-col justify-end overflow-hidden">
        <img
          src={proje.heroImage}
          alt={proje.name}
          className="absolute inset-0 w-full h-full object-cover object-right"
          style={{ imageOrientation: 'from-image' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

        {/* Breadcrumb */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28">
          <div className="flex items-center gap-2 text-white/50 text-xs mb-8">
            <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/projeler" className="hover:text-white transition-colors">Projelerimiz</Link>
            <span>/</span>
            <span className="text-white/80">{proje.name}</span>
          </div>

          <span className={`inline-block text-white text-[11px] font-bold px-3 py-1 rounded mb-4 ${proje.statusBg}`}>
            {proje.statusLabel.toUpperCase()}
          </span>
          <h1 className="text-white text-5xl lg:text-6xl font-bold leading-none mb-3 uppercase">{proje.name}</h1>
          <p className="text-white/60 flex items-center gap-1.5 text-sm mb-4">
            <Icon name="map-pin" size={14} className="brightness-0 invert opacity-60" />
            {proje.location}
          </p>
          <p className="text-white/70 text-sm max-w-lg leading-relaxed mb-8">{proje.description}</p>
          <div className="flex flex-wrap gap-3 pb-16">
            <a
              href="#galeri"
              className="bg-[#0A1F44] text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-[#152C5C] transition-colors flex items-center gap-2"
            >
              <Icon name="building" size={16} className="brightness-0 invert" />
              Fotoğrafları Gör
            </a>
            <Link
              href="/iletisim"
              className="border border-white/40 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Teklif Al
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="max-w-6xl mx-auto px-6 -mt-1 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <div className={`grid grid-cols-2 lg:grid-cols-${proje.stats.length} divide-x divide-gray-100`}>
            {proje.stats.map((s, i) => (
              <div key={i} className="py-5 px-5 flex flex-col items-center text-center gap-2">
                <Icon name={s.icon} size={22} className="opacity-60" />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className="font-bold text-[#0A1F44] text-sm leading-tight">{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Proje Hakkında + Galeri ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14">

            {/* Sol */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#1E54C8] text-xs font-bold uppercase tracking-widest">PROJE HAKKINDA</span>
                <div className="flex-1 h-px bg-[#1E54C8]/20" />
              </div>
              <h2 className="text-3xl font-bold text-[#0A1F44] leading-tight mb-5">
                Geleceğe değer katan<br />yaşam alanları
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-10">{proje.description}</p>
              <div className="grid grid-cols-3 gap-6">
                {[
                  { icon: 'building',   title: 'Modern Mimari',   desc: 'Estetik ve fonksiyonel tasarım anlayışı' },
                  { icon: 'check',      title: 'Kaliteli Malzeme', desc: 'Uzun ömürlü, güvenli ve üstün malzeme kalitesi' },
                  { icon: 'pie-chart',  title: 'Yatırım Değeri',  desc: 'Stratejik konum ve yüksek kira potansiyeli' },
                ].map((f, i) => (
                  <div key={i} className="text-center">
                    <div className="w-12 h-12 bg-[#0A1F44]/8 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Icon name={f.icon} size={22} />
                    </div>
                    <p className="font-semibold text-[#0A1F44] text-sm">{f.title}</p>
                    <p className="text-gray-400 text-xs mt-1 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sağ: Galeri önizleme */}
            <div id="galeri">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-[#1E54C8] text-xs font-bold uppercase tracking-widest">PROJE GALERİSİ</span>
                <div className="flex-1 h-px bg-[#1E54C8]/20" />
              </div>
              {proje.gallery.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {proje.gallery.slice(0, 2).map((src, i) => (
                    <div
                      key={i}
                      onClick={() => setLightbox(i)}
                      className="overflow-hidden rounded-xl cursor-pointer group relative h-44"
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ imageOrientation: 'from-image' }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                  {proje.gallery.slice(2, 5).map((src, i) => (
                    <div
                      key={i + 2}
                      onClick={() => setLightbox(i + 2)}
                      className={`overflow-hidden rounded-xl cursor-pointer group relative h-36 ${i === 2 ? 'col-span-2' : ''}`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        style={{ imageOrientation: 'from-image' }}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      {i === 2 && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="bg-white/90 text-[#0A1F44] text-xs font-bold px-3 py-1.5 rounded-full">Tümünü Gör</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm">
                  Fotoğraf eklenmemiş
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Özellikler + İlerleme ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`grid gap-10 ${proje.ilerleme > 0 && proje.ilerleme < 100 ? 'lg:grid-cols-2' : ''}`}>

            {/* Bina Özellikleri */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h3 className="font-bold text-[#0A1F44] text-lg mb-6">Bina Özellikleri</h3>
              {proje.ozellikler.length > 0 ? (
                <div className={`grid gap-4 ${proje.ilerleme > 0 && proje.ilerleme < 100 ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-4 lg:grid-cols-6'}`}>
                  {proje.ozellikler.map((o, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border border-gray-100">
                        <Icon name={o.icon} size={22} />
                      </div>
                      <p className="text-gray-700 text-xs font-medium leading-tight">{o.label}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-sm">Özellik bilgisi henüz eklenmemiş.</p>
              )}
            </div>

            {/* İlerleme — sadece %0 değilse ve %100 değilse göster */}
            {proje.ilerleme > 0 && proje.ilerleme < 100 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-[#0A1F44] text-lg mb-6">Proje İlerlemesi</h3>
                  <div className="flex items-end gap-3 mb-4">
                    <span className="text-5xl font-bold text-[#1E54C8]">%{proje.ilerleme}</span>
                    <span className="text-gray-400 text-sm mb-2">Tamamlandı</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#1E54C8] rounded-full transition-all duration-1000"
                      style={{ width: `${proje.ilerleme}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Başlangıç</span>
                    <span>Tamamlandı</span>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <img src="/icons/proje-detail-ilerleme.svg" alt="İnşaat" className="h-24 opacity-20" />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Tüm Fotoğraflar ── */}
      {proje.gallery.length > 2 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-2xl font-bold text-[#0A1F44]">Proje Fotoğrafları</h2>
              <span className="text-gray-400 text-sm">{proje.gallery.length} fotoğraf</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {proje.gallery.map((src, i) => (
                <div
                  key={i}
                  onClick={() => setLightbox(i)}
                  className="overflow-hidden rounded-xl cursor-pointer group relative h-56"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ imageOrientation: 'from-image' }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-[#0A1F44] text-xs font-bold px-3 py-1.5 rounded-full transition-opacity">Büyüt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Konum ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-[#0A1F44] mb-8">Konum</h2>
          <div className="grid lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 rounded-2xl h-72 overflow-hidden bg-gray-200">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(proje.location)}&output=embed`}
                className="w-full h-full"
                loading="lazy"
              />
            </div>
            <div className="space-y-3">
              {[
                { icon: 'map-pin', label: 'Metroya 5 dk',     desc: 'Yürüme mesafesinde'              },
                { icon: 'map-pin', label: "AVM'ye 3 dk",      desc: 'Alışveriş merkezlerine yakın'    },
                { icon: 'map-pin', label: "Hastane'ye 7 dk",  desc: 'Sağlık kurumuna kolay erişim'    },
                { icon: 'map-pin', label: "E-5'e Bağlantı 4 dk", desc: 'Ana arterlere hızlı ulaşım'  },
              ].map((u, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100">
                  <div className="w-9 h-9 bg-[#0A1F44]/8 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon name={u.icon} size={16} />
                  </div>
                  <div>
                    <p className="font-semibold text-[#0A1F44] text-sm">{u.label}</p>
                    <p className="text-gray-400 text-xs">{u.desc}</p>
                  </div>
                </div>
              ))}
              <div className="bg-[#0A1F44] rounded-xl p-5 text-white">
                <p className="font-bold">{proje.name}</p>
                <p className="text-white/60 text-sm mt-1">{proje.location}</p>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(proje.location)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center gap-1.5 text-white/80 hover:text-white text-sm font-semibold transition-colors"
                >
                  Yol Tarifi Al
                  <Icon name="arrow-right" size={14} className="brightness-0 invert opacity-80" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#071628] py-16">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Bu projede yerinizi alın.</h2>
            <p className="text-white/50 text-sm">Uzman ekibimizden detaylı bilgi almak için bizimle iletişime geçin.</p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/iletisim"
              className="bg-white text-[#0A1F44] font-semibold text-sm px-7 py-3.5 rounded-lg hover:bg-white/90 transition-colors"
            >
              Teklif Alın
            </Link>
            <a
              href="https://wa.me/905322723033"
              target="_blank"
              rel="noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm px-7 py-3.5 rounded-lg flex items-center gap-2 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 text-white/60 hover:text-white">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round"/>
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(l => l !== null && l > 0 ? l - 1 : proje.gallery.length - 1) }}
            className="absolute left-5 text-white/60 hover:text-white"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <img
            src={proje.gallery[lightbox]}
            alt=""
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain"
            style={{ imageOrientation: 'from-image' }}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(l => l !== null && l < proje.gallery.length - 1 ? l + 1 : 0) }}
            className="absolute right-5 text-white/60 hover:text-white"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <p className="absolute bottom-5 text-white/40 text-sm">{lightbox + 1} / {proje.gallery.length}</p>
        </div>
      )}
    </>
  )
}
