'use client'


function Icon({ name, size = 48, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  return (
    <img src={`/icons/${name}.svg`} alt={name} width={size} height={size} style={style} />
  )
}

const HIZMETLER = [
  { icon: 'home-roof',              title: 'Konut Projeleri',      desc: 'Modern, konforlu ve estetik yaşam alanları tasarlıyor, geleceğe değer katıyoruz.' },
  { icon: 'building',               title: 'Ticari Yapılar',        desc: 'İş dünyasının ihtiyaçlarına uygun, fonksiyonel ve sürdürülebilir yapılar üretiyoruz.' },
  { icon: 'layers',                 title: 'Kentsel Dönüşüm',       desc: 'Güvenli, dayanıklı ve çevre dostu dönüşüm projeleriyle kentlerimizi yeniliyoruz.' },
  { icon: 'bina-klima',             title: 'Taahhüt ve İnşaat',     desc: 'Anahtar teslim taahhüt hizmetlerimizle projelerinizi zamanında hayata geçiriyoruz.' },
  { icon: 'document',               title: 'Proje ve Danışmanlık',  desc: 'Mimari, mühendislik ve danışmanlık hizmetleriyle projelerinize yön veriyoruz.' },
  { icon: 'layers',                 title: 'Bakım ve Onarım',       desc: 'Yapılarınızın değerini koruyan profesyonel bakım ve onarım hizmetleri sunuyoruz.' },
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

export default function HizmetlerPage() {
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

        {/* Metin */}
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

        {/* Floating kart */}
        <div className="hidden lg:flex absolute bottom-10 right-10 bg-[#0A1F44] text-white rounded-2xl p-5 max-w-[240px] items-start gap-4 shadow-xl border border-white/10">
          <div className="shrink-0 bg-white/10 rounded-xl p-2.5">
            <Icon name="building" size={28} style={{ filter: 'brightness(0) invert(1)' }} />
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

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HIZMETLER.map((h) => (
              <div
                key={h.title}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition-shadow group cursor-pointer flex flex-col items-center text-center"
              >
                <div className="mb-4">
                  <Icon name={h.icon} size={48} style={{ filter: BLUE_FILTER }} />
                </div>
                <h3 className="text-[#0A1F44] font-bold text-sm mb-2">{h.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4 hidden lg:block">{h.desc}</p>
                <div className="flex items-center gap-1 text-[#1E54C8] text-xs font-semibold mt-auto">
                  Detaylı Bilgi
                  <Icon name="arrow-right" size={12} style={{ filter: BLUE_FILTER }} />
                </div>
              </div>
            ))}
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
                {/* Sayı + sağ çizgi */}
                <div className="flex items-center w-full justify-center mb-4">
                  {/* Sol çizgi */}
                  {i > 0 && (
                    <div className="flex-1 h-px bg-gray-200 hidden lg:block" />
                  )}
                  <div className="w-12 h-12 rounded-full bg-[#0A1F44] flex items-center justify-center shadow-md shrink-0">
                    <span className="text-white font-bold text-sm">{s.no}</span>
                  </div>
                  {/* Sağ çizgi */}
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
