'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// ─── Video Modal ───────────────────────────────────────────────────────────────
function VideoModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80" onClick={onClose}>
      <div className="relative w-full max-w-4xl aspect-video" onClick={e => e.stopPropagation()}>
        <iframe
          src="https://www.youtube.com/embed/xsjAHe7D9oY?autoplay=1&rel=0&modestbranding=1"
          className="w-full h-full rounded-2xl"
          allow="autoplay; fullscreen"
          allowFullScreen
          style={{ border: 0 }}
        />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <>
      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    <section className="relative min-h-screen flex flex-col">
      <div className="absolute inset-0">
        <img
          src="/hero-bina3.jpg"
          alt="Çelik İnşaat Projesi"
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-transparent" />
      </div>

      <div className="relative flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full pt-24 pb-8">
          <div className="max-w-xl">
            <p className="text-white/60 text-xs font-semibold tracking-[0.2em] uppercase mb-6 flex items-center gap-3">
              GÜVENLİ İNŞA EDİYORUZ
              <span className="w-10 h-px bg-white/40" />
            </p>
            <h1 className="text-5xl lg:text-[3.5rem] font-bold text-white leading-[1.15] mb-6">
              Geleceğe değer<br />katan yapılar<br />üretiyoruz.
            </h1>
            <p className="text-white/65 text-base leading-relaxed mb-10 max-w-md">
              Modern mühendislik çözümleri, kaliteli işçilik ve zamanında teslim
              anlayışımızla yaşam alanlarını daha iyi bir geleceğe dönüştürüyoruz.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setVideoOpen(true)}
                className="flex items-center gap-2 bg-white text-[#0A1F44] font-semibold px-7 py-3.5 rounded text-sm hover:bg-white/90 transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                Tanıtım Videomuzu İzleyin
              </button>
              <Link href="/hakkimizda" className="flex items-center gap-2 border border-white/40 text-white font-semibold px-7 py-3.5 rounded text-sm hover:border-white/70 hover:bg-white/10 transition-all">
                Hakkımızda
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative bg-white/10 backdrop-blur-sm border-t border-white/15">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/15">
            {[
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="6" height="18"/><rect x="9" y="8" width="6" height="13"/><rect x="16" y="1" width="6" height="20"/></svg>, value: '15+', label: 'Yıllık Deneyim' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, value: '500+', label: 'Mutlu Müşteri' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9,22 9,12 15,12 15,22"/></svg>, value: '1.2M+ m²', label: 'İnşaat Alanı' },
              { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>, value: '100%', label: 'Müşteri Memnuniyeti' },
            ].map((s) => (
              <div key={s.label} className="py-5 px-6 flex items-center gap-4">
                <span className="text-white/50">{s.icon}</span>
                <div>
                  <p className="text-white font-bold text-xl leading-none">{s.value}</p>
                  <p className="text-white/55 text-xs mt-1">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

// ─── Projeler ─────────────────────────────────────────────────────────────────
const PROJECTS = [
  { slug: 'degirmen-sokak',   name: 'Değirmen Sokak',   location: 'İstanbul / Avcılar', status: 'Devam Ediyor', statusCls: 'bg-[#0A1F44] text-white',       img: '/projeler/degirmen-sokak/DJI_20240922001110_0317_D.JPG' },
  { slug: 'papatya-sokak',    name: 'Papatya Sokak',    location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/papatya-sokak/DJI_20240920224940_0193_D.JPG' },
  { slug: 'mahmutoglu-sokak', name: 'Mahmutoğlu Sokak', location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/mahmutoglu-sokak/DJI_20240921210940_0209_D.JPG' },
  { slug: 'oya-sokak',        name: 'Oya Sokak',        location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/oya-sokak/DJI_20240920222607_0175_D.JPG' },
  { slug: 'sukrubey-caddesi', name: 'Şükrübey Caddesi', location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/sukrubey-caddesi/DJI_20240921231700_0289_D.JPG' },
  { slug: 'menekse-sokak',    name: 'Menekşe Sokak',    location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/menekse-sokak/DJI_20240921212429_0222_D.JPG' },
  { slug: 'koroglu-sokak',    name: 'Köroğlu Sokak',    location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/koroglu-sokak/DJI_20240921223036_0261_D.JPG' },
  { slug: 'ds-ahmet-caddesi', name: 'D.S. Ahmet Cad.',  location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/ds-ahmet-caddesi/DJI_20240920213730_0137_D.JPG' },
  { slug: 'afacan-sokak',     name: 'Afacan Sokak',     location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/afacan-sokak/DJI_20240921214713_0237_D.JPG' },
  { slug: 'hacibey-sokak',    name: 'Hacıbey Sokak',    location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/hacibey-sokak/DJI_20240921234703_0299_D.JPG' },
  { slug: 'turna-sokak',      name: 'Turna Sokak',      location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/turna-sokak/DJI_20240920212530_0131_D.JPG' },
  { slug: 'yazgan-sokak',     name: 'Yazgan Sokak',     location: 'İstanbul / Avcılar', status: 'Tamamlandı',   statusCls: 'bg-emerald-600 text-white',     img: '/projeler/yazgan-sokak/DJI_20240920204659_0103_D.JPG' },
]

function Projeler() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPct, setScrollPct] = useState(0)
  const CARD_W = 272 // w-64 (256) + gap-4 (16)

  const onScroll = () => {
    const el = scrollRef.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setScrollPct(max > 0 ? el.scrollLeft / max : 0)
  }

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({ left: dir === 'right' ? CARD_W * 2 : -CARD_W * 2, behavior: 'smooth' })
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Başlık satırı */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#1E54C8] text-xs font-semibold tracking-[0.18em] uppercase mb-3">PROJELERİMİZ</p>
            <h2 className="text-[2.25rem] font-bold text-[#0A1F44] leading-snug">Yaşam alanlarınıza<br />değer katıyoruz.</h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Ok butonları */}
            <div className="hidden lg:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#0A1F44] hover:bg-[#0A1F44] hover:text-white text-gray-400 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#0A1F44] hover:bg-[#0A1F44] hover:text-white text-gray-400 transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <Link href="/projeler" className="flex items-center gap-2 text-[#0A1F44] text-sm font-semibold hover:text-[#1E54C8] transition-colors group">
              Tümünü Gör
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Kaydırmalı bant */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex gap-4 overflow-x-auto pb-4 px-6 max-w-7xl mx-auto scrollbar-hide snap-x snap-mandatory"
      >
        {PROJECTS.map((p) => (
          <Link
            key={p.slug}
            href={`/projeler/${p.slug}`}
            className="group flex-shrink-0 w-64 bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 snap-start"
          >
            <div className="relative h-44 overflow-hidden">
              <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-md ${p.statusCls}`}>{p.status}</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-[#0A1F44] mb-1 text-[15px]">{p.name}</h3>
              <p className="text-gray-400 text-xs flex items-center gap-1 mb-3">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {p.location}
              </p>
              <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1E54C8" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Scroll göstergesi */}
      <div className="max-w-7xl mx-auto px-6 mt-5 flex items-center gap-4">
        <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#0A1F44] rounded-full transition-all duration-200"
            style={{ width: `${Math.max(8, scrollPct * 100)}%` }}
          />
        </div>
        <span className="text-gray-400 text-xs whitespace-nowrap flex items-center gap-1.5">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          kaydır
        </span>
      </div>
    </section>
  )
}

// ─── Neden Biz ────────────────────────────────────────────────────────────────
function NedenBiz() {
  const features = [
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/></svg>, title: 'Kaliteli Malzeme', desc: 'En iyi malzemelerle uzun ömürlü yapılar inşa ediyoruz.' },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, title: 'Zamanında Teslim', desc: 'Projelerimizi söz verdiğimiz tarihte teslim ediyoruz.' },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>, title: 'Güvenli Yapılar', desc: 'Tüm projelerimizde güvenlik standartlarını en üst seviyede tutuyoruz.' },
    { icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>, title: 'Müşteri Memnuniyeti', desc: 'İhtiyaçlarınıza en uygun çözümlerle yanınızdayız.' },
  ]

  return (
    <section className="py-20 bg-[#F8F9FC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#1E54C8] text-xs font-semibold tracking-[0.18em] uppercase mb-3">NEDEN ÇELİK İNŞAAT?</p>
            <h2 className="text-[2.25rem] font-bold text-[#0A1F44] leading-snug mb-8">Kalite, güven ve sürdürülebilirlik<br />anlayışımızın temelidir.</h2>
            <div className="space-y-5">
              {features.map((f) => (
                <div key={f.title} className="flex items-start gap-4">
                  <div className="w-9 h-9 bg-[#0A1F44]/8 rounded-lg flex items-center justify-center text-[#0A1F44] flex-shrink-0 mt-0.5">{f.icon}</div>
                  <div>
                    <p className="font-semibold text-[#0A1F44] text-sm mb-0.5">{f.title}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/hizmetler" className="mt-10 inline-flex items-center gap-2 bg-[#0A1F44] text-white text-sm font-semibold px-7 py-3.5 rounded hover:bg-[#0D2857] transition-colors">
              Hizmetlerimiz
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </Link>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=900&q=85" alt="Çelik İnşaat şantiye" className="w-full h-[500px] object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Haberler ─────────────────────────────────────────────────────────────────
const NEWS = [
  { id: 1, day: '24', month: 'Mayıs', title: 'Sürdürülebilir İnşaatın Geleceği', excerpt: 'Çevre dostu malzemeler ve sürdürülebilir uygulamalarla daha yaşanabilir bir gelecek.', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&q=80' },
  { id: 2, day: '16', month: 'Mayıs', title: 'Avcılar Projemiz Satışta', excerpt: "Avcılar'da yükselen yeni projemizi sizlerle tanıştırmaktan mutluluk duyuyoruz.", img: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&q=80' },
  { id: 3, day: '08', month: 'Mayıs', title: 'E Grubu Yetki Belgemiz Yenilendi', excerpt: "Çevre ve Şehircilik Bakanlığı'nın değerlendirmesinde E Grubu yetki belgemiz başarıyla yenilendi.", img: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300&q=80' },
]

function Haberler() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-[#1E54C8] text-xs font-semibold tracking-[0.18em] uppercase mb-3">GÜNCEL HABERLER</p>
            <h2 className="text-[2.25rem] font-bold text-[#0A1F44] leading-snug">Sektörden haberler ve gelişmeler</h2>
          </div>
          <Link href="/haberler" className="flex items-center gap-2 text-[#0A1F44] text-sm font-semibold hover:text-[#1E54C8] transition-colors group">
            Tüm Haberler
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {NEWS.map((item) => (
            <article key={item.id} className="flex gap-4 group cursor-pointer hover:bg-gray-50 rounded-xl p-3 -mx-3 transition-colors">
              <div className="relative flex-shrink-0 w-[88px] h-[88px] rounded-lg overflow-hidden">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#0A1F44]/80 flex flex-col items-center justify-center">
                  <p className="text-white text-2xl font-bold leading-none">{item.day}</p>
                  <p className="text-white/70 text-[11px] mt-0.5">{item.month}</p>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-[#0A1F44] text-sm leading-snug mb-1.5 group-hover:text-[#1E54C8] transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">{item.excerpt}</p>
                <p className="mt-2 text-[#1E54C8] text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                  Devamını Oku
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Projeler />
        <NedenBiz />
        <Haberler />
      </main>
      <Footer />
    </>
  )
}
