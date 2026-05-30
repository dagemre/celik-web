'use client'

import { useState, useEffect } from 'react'

function Icon({ name, size = 48, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  return (
    <img src={`/icons/${name}.svg`} alt={name} width={size} height={size} style={style} />
  )
}

const HIZMETLER = [
  {
    icon: 'home-roof',
    title: 'Konut Projeleri',
    desc: 'Modern, konforlu ve estetik yaşam alanları tasarlıyor, geleceğe değer katıyoruz.',
    detay: {
      ozet: 'Yaşam kalitenizi yükselten, mimari açıdan özgün ve mühendislik kalitesiyle inşa edilmiş konut projeleri geliştiriyoruz.',
      maddeler: [
        'Tek daire, villa ve büyük ölçekli konut kompleksleri',
        'Enerji verimli, yeşil bina standartlarına uygun tasarım',
        'Akıllı ev sistemleri ve modern peyzaj',
        'Anahtar teslim ile sözleşme yönetimi',
        'Teslimden sonra 5 yıl yapı garantisi',
      ],
    },
  },
  {
    icon: 'building',
    title: 'Ticari Yapılar',
    desc: 'İş dünyasının ihtiyaçlarına uygun, fonksiyonel ve sürdürülebilir yapılar üretiyoruz.',
    detay: {
      ozet: 'Ofis binaları, alışveriş merkezleri, depolar ve endüstriyel tesislerden kurumsal yapılara kadar ticari inşaat alanında kapsamlı çözümler sunuyoruz.',
      maddeler: [
        'Ofis binaları ve kurumsal merkez yapıları',
        'Perakende ve ticari kompleks projeleri',
        'Endüstriyel tesis ve lojistik yapılar',
        'Teknik altyapı ve çevre düzenleme',
        'İş sürecinizi aksatmayan hızlı uygulama',
      ],
    },
  },
  {
    icon: 'layers',
    title: 'Kentsel Dönüşüm',
    desc: 'Güvenli, dayanıklı ve çevre dostu dönüşüm projeleriyle kentlerimizi yeniliyoruz.',
    detay: {
      ozet: 'Riskli yapıların tespitinden yıkım sürecine, yeni inşaata kadar tüm kentsel dönüşüm aşamalarını eksiksiz yönetiyoruz.',
      maddeler: [
        'Riskli yapı tespiti ve hukuki danışmanlık',
        'Kat karşılığı ve hasılat paylaşımı modelleri',
        'Geçici konut desteği ve taşınma yönetimi',
        'DASK ve sigorta işlemlerinde rehberlik',
        'Deprem yönetmeliğine tam uygunluk',
      ],
    },
  },
  {
    icon: 'bina-klima',
    title: 'Taahhüt ve İnşaat',
    desc: 'Anahtar teslim taahhüt hizmetlerimizle projelerinizi zamanında hayata geçiriyoruz.',
    detay: {
      ozet: 'Kaba inşaattan ince işçiliğe, elektrik-mekanik altyapıdan bitişe kadar tüm süreçleri tek çatı altında taahhüt ediyoruz.',
      maddeler: [
        'Kaba inşaat ve betonarme uygulamaları',
        'Elektrik, mekanik ve sıhhi tesisat',
        'İç mimari, alçıpan ve seramik kaplama',
        'Cephe kaplamaları ve ısı yalıtımı',
        'Sabit bütçe ve takvim taahhüdü',
      ],
    },
  },
  {
    icon: 'document',
    title: 'Proje ve Danışmanlık',
    desc: 'Mimari, mühendislik ve danışmanlık hizmetleriyle projelerinize yön veriyoruz.',
    detay: {
      ozet: 'Fikir aşamasından yapı ruhsatına, şantiye yönetiminden teslime kadar her adımda uzman kadromuzla yanınızdayız.',
      maddeler: [
        'Mimari ve statik proje tasarımı',
        'Avan proje, keşif ve maliyet analizi',
        'Yapı ruhsatı ve izin süreçleri',
        'Şantiye yönetimi ve hakediş kontrolü',
        'Teknik müşavirlik ve proje denetimi',
      ],
    },
  },
]

const SUREC = [
  { no: '01', title: 'İhtiyaç Analizi',      desc: 'Projeye özel ihtiyaçlarınızı belirliyor ve analiz ediyoruz.' },
  { no: '02', title: 'Planlama',             desc: 'En uygun çözümleri planlıyor, proje tasarımını oluşturuyoruz.' },
  { no: '03', title: 'Uygulama',             desc: 'Deneyimli ekibimizle projeyi yüksek kalite standartlarında hayata geçiriyoruz.' },
  { no: '04', title: 'Kalite Kontrol',       desc: 'Tüm süreçlerde kalite ve güvenlik kontrollerini titizlikle gerçekleştiriyoruz.' },
  { no: '05', title: 'Teslimat',             desc: 'Projeyi zamanında teslim ediyor, sizi yeni yaşam alanlarınıza kavuşturuyoruz.' },
  { no: '06', title: 'Satış Sonrası Destek', desc: 'Teslim sonrası da yanınızda olarak destek hizmetlerimizi sürdürüyoruz.' },
]

const BLUE_FILTER = 'brightness(0) saturate(100%) invert(22%) sepia(90%) saturate(500%) hue-rotate(200deg)'
const WHITE_FILTER = 'brightness(0) invert(1)'

export default function HizmetlerPage() {
  const [acik, setAcik] = useState<number | null>(null)
  const [cols, setCols] = useState(5) // SSR için desktop varsayılan

  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1024) setCols(5)
      else if (window.innerWidth >= 768) setCols(3)
      else setCols(2)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const toggle = (i: number) => setAcik(prev => (prev === i ? null : i))

  // Kartları satırlara böl (cols sayısına göre)
  const satirlar: { h: typeof HIZMETLER[0]; index: number }[][] = []
  for (let i = 0; i < HIZMETLER.length; i += cols) {
    satirlar.push(
      HIZMETLER.slice(i, i + cols).map((h, j) => ({ h, index: i + j }))
    )
  }

  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative h-[420px] flex items-end overflow-hidden">
        <img
          src="/hizmetlerimiz-hero.jpg"
          alt="Hizmetlerimiz"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-12 w-full">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-3">Hizmetlerimiz</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
            Hayallerinizi, güvenle inşa ediyoruz.
          </h1>
          <p className="text-white/70 text-sm mt-3 max-w-md leading-relaxed">
            Modern mühendislik çözümlerimiz ve deneyimli ekibimizle projelerinize değer katıyor,
            sürdürülebilir ve kaliteli yaşam alanları oluşturuyoruz.
          </p>
        </div>

        <div className="hidden lg:flex absolute bottom-10 right-10 bg-[#0A1F44] text-white rounded-2xl p-5 max-w-[240px] items-start gap-4 shadow-xl border border-white/10">
          <div className="shrink-0 bg-white/10 rounded-xl p-2.5">
            <Icon name="building" size={28} style={{ filter: WHITE_FILTER }} />
          </div>
          <p className="text-xs leading-relaxed">
            Her projede önceliğimiz; kalite, güvenlik ve zamanında teslimdir.
          </p>
        </div>
      </section>

      {/* ── Hizmet Alanlarımız ────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-[#0A1F44] text-3xl font-bold mb-3">Hizmet Alanlarımız</h2>
            <div className="w-12 h-1 bg-[#1E54C8] rounded mx-auto mb-4" />
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Projelerinizi baştan sona profesyonel bir yaklaşımla yönetiyor, en iyi çözümleri sunuyoruz.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {satirlar.map((satir, satirIndex) => {
              // Bu satırda aktif kart var mı?
              const satirdaAcik = acik !== null && satir.some(({ index }) => index === acik)

              return (
                <div key={satirIndex}>
                  {/* Kart satırı */}
                  <div className="flex flex-wrap justify-center gap-4">
                    {satir.map(({ h, index }) => {
                      const aktif = acik === index
                      return (
                        <button
                          key={h.title}
                          onClick={() => toggle(index)}
                          className={`w-[calc(50%-8px)] md:w-[calc(33.33%-11px)] lg:w-[calc(20%-13px)] bg-white rounded-2xl border p-5 transition-all duration-200 cursor-pointer flex flex-col items-center text-center
                            ${aktif
                              ? 'border-[#1E54C8] shadow-lg ring-2 ring-[#1E54C8]/20'
                              : 'border-gray-100 hover:shadow-lg hover:border-[#1E54C8]/30'
                            }`}
                        >
                          <div className="mb-4">
                            <Icon
                              name={h.icon}
                              size={48}
                              style={{ filter: aktif ? 'brightness(0) saturate(100%) invert(22%) sepia(90%) saturate(700%) hue-rotate(200deg)' : BLUE_FILTER }}
                            />
                          </div>
                          <h3 className={`font-bold text-sm mb-2 ${aktif ? 'text-[#1E54C8]' : 'text-[#0A1F44]'}`}>{h.title}</h3>
                          <p className="text-gray-400 text-xs leading-relaxed mb-4 hidden lg:block">{h.desc}</p>
                          <div className="flex items-center gap-1 text-[#1E54C8] text-xs font-semibold mt-auto">
                            {aktif ? 'Kapat' : 'Detaylı Bilgi'}
                            <span
                              className="inline-block transition-transform duration-200"
                              style={{ transform: aktif ? 'rotate(90deg)' : 'rotate(0deg)' }}
                            >
                              <Icon name="arrow-right" size={12} style={{ filter: BLUE_FILTER }} />
                            </span>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Detay paneli — bu satırda aktif kart varsa hemen altında göster */}
                  {satirdaAcik && acik !== null && (
                    <div className="mt-3 bg-white rounded-2xl border border-[#1E54C8]/20 shadow-lg overflow-hidden animate-fadeIn">
                      <div className="flex flex-col lg:flex-row">
                        {/* Sol — İkon + başlık */}
                        <div className="bg-[#0A1F44] text-white p-6 lg:w-56 flex flex-col items-center justify-center text-center shrink-0">
                          <div className="bg-white/10 rounded-2xl p-4 mb-3">
                            <Icon name={HIZMETLER[acik].icon} size={40} style={{ filter: WHITE_FILTER }} />
                          </div>
                          <h3 className="font-bold text-base leading-tight">{HIZMETLER[acik].title}</h3>
                        </div>

                        {/* Sağ — Detay içeriği */}
                        <div className="p-6 flex-1">
                          <p className="text-gray-600 text-sm leading-relaxed mb-5">
                            {HIZMETLER[acik].detay.ozet}
                          </p>

                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
                            {HIZMETLER[acik].detay.maddeler.map((m) => (
                              <li key={m} className="flex items-start gap-3">
                                <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-[#1E54C8]/10 flex items-center justify-center">
                                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                    <path d="M2 5L4.5 7.5L8 3" stroke="#1E54C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </span>
                                <span className="text-gray-600 text-sm leading-snug">{m}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="flex flex-col sm:flex-row gap-3">
                            <a
                              href="/iletisim?konu=teklif"
                              className="inline-flex items-center justify-center gap-2 bg-[#0A1F44] text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-[#1E54C8] transition-colors"
                            >
                              Teklif Alın
                              <Icon name="arrow-right" size={14} style={{ filter: WHITE_FILTER }} />
                            </a>
                            <a
                              href="/iletisim"
                              className="inline-flex items-center justify-center gap-2 border border-[#0A1F44]/20 text-[#0A1F44] text-sm font-semibold px-6 py-3 rounded-xl hover:border-[#1E54C8] hover:text-[#1E54C8] transition-colors"
                            >
                              Bize Ulaşın
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Çalışma Sürecimiz ─────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-[#0A1F44] text-3xl font-bold mb-3">Çalışma Sürecimiz</h2>
            <div className="w-12 h-1 bg-[#1E54C8] rounded mx-auto" />
          </div>

          <div className="relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {SUREC.map((s, i) => (
              <div key={s.no} className="flex flex-col items-center text-center relative">
                <div className="flex items-center w-full justify-center mb-4">
                  {i > 0 && (
                    <div className="flex-1 h-px bg-gray-200 hidden lg:block" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-[#0A1F44] flex items-center justify-center shadow-md shrink-0">
                    <span className="text-white font-bold text-sm">{s.no}</span>
                  </div>
                  {i < SUREC.length - 1 && (
                    <div className="flex-1 h-px bg-gray-200 hidden lg:block" />
                  )}
                </div>
                <h3 className="text-[#0A1F44] font-bold text-sm mb-2">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
