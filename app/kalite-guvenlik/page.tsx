'use client'


function Icon({ name, size = 40, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  return <img src={`/icons/${name}.svg`} alt={name} width={size} height={size} style={style} />
}

const BLUE_FILTER = 'brightness(0) saturate(100%) invert(22%) sepia(90%) saturate(500%) hue-rotate(200deg)'

const KALITE_CARDS = [
  { icon: 'check',    title: 'Standartlara Uygunluk',  desc: 'TSE, ISO 9001 ve uluslararası standartlara uygun yönetim sistemleriyle çalışırız.' },
  { icon: 'layers',   title: 'Sürekli İyileştirme',    desc: 'Süreçlerimizi düzenli olarak gözden geçirir, daha iyisini hedefleriz.' },
  { icon: 'user',     title: 'Müşteri Memnuniyeti',    desc: 'Müşterilerimizin ihtiyaç ve beklentilerini en iyi şekilde karşılarız.' },
  { icon: 'tree',     title: 'Sürdürülebilirlik',      desc: 'Çevreye duyarlı, kaynakları verimli kullanan projeler üretiriz.' },
  { icon: 'security', title: 'Güvenilir İş Ortaklığı', desc: 'İş ortaklarımızla uzun vadeli ve güvene dayalı ilişkiler kurarız.' },
]

const MADDELER = [
  'Riskleri önceden belirler ve önleyici tedbirler alırız.',
  'Düzenli eğitimlerle farkındalığı artırırız.',
  'Tüm sahalarımızda İSG kurallarına %100 uyum sağlarız.',
  'Sıfır kaza hedefiyle çalışmalarımızı kararlılıkla sürdürürüz.',
]

const SERTIFIKALAR = [
  { img: '/sertifikalar/iso-9001.png',  aciklama: 'Kalite Yönetim\nSistemi' },
  { img: '/sertifikalar/iso-14001.png', aciklama: 'Çevre Yönetim\nSistemi' },
  { img: '/sertifikalar/iso-45001.png', aciklama: 'İş Sağlığı ve Güvenliği\nYönetim Sistemi' },
  { img: '/sertifikalar/tse-en1090.png',aciklama: 'Yapı Çelikleri ve\nAlüminyum Yapılar' },
  { img: '/sertifikalar/ce.png',        aciklama: 'Avrupa Standartlarına\nUyum' },
]

export default function KaliteGuvenlikPage() {
  return (
    <>

      {/* ── Hero — hakkımızda ile aynı ───────────────────────────── */}
      <section className="relative h-[420px] flex items-end overflow-hidden">
        <img
          src="/Neden-imaj-home.png"
          alt="Kalite ve Güvenlik"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">Kalite ve Güvenlik</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
            Kaliteyi ilkemiz,<br />güvenliği önceliğimiz yapıyoruz.
          </h1>
          <p className="text-white/70 text-sm mt-3 max-w-md leading-relaxed">
            Tüm projelerimizde kalite standartlarından ödün vermeden çalışır, çalışanlarımızın güvenliğini her zaman en üst düzeyde tutarız.
          </p>
        </div>
      </section>

      {/* ── Kalite Anlayışımız ────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[#0A1F44] text-3xl font-bold mb-3">Kalite Anlayışımız</h2>
            <div className="w-12 h-1 bg-[#1E54C8] rounded mx-auto mb-4" />
            <p className="text-gray-500 text-sm max-w-2xl mx-auto">
              Ulusal ve uluslararası standartlara uygun, sürdürülebilir ve yenilikçi çözümlerle
              müşteri memnuniyetini en üst düzeyde sağlıyoruz.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {KALITE_CARDS.map((c) => (
              <div key={c.title} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
                <div className="mb-5">
                  <Icon name={c.icon} size={44} style={{ filter: BLUE_FILTER }} />
                </div>
                <h3 className="text-[#0A1F44] font-bold text-sm mb-2">{c.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── İş Sağlığı & Sertifikalar ────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-start">

            {/* Sol — İş Sağlığı */}
            <div>
              <h2 className="text-[#0A1F44] text-2xl font-bold mb-4">İş Sağlığı ve Güvenliği</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Çalışanlarımızın sağlığı ve güvenliği, tüm faaliyetlerimizin merkezinde yer alır.
                Yasal gerekliliklerin ötesinde bir yaklaşımla hareket ediyoruz.
              </p>
              <ul className="space-y-3 mb-8">
                {MADDELER.map((m) => (
                  <li key={m} className="flex items-start gap-3 text-sm text-gray-600">
                    <Icon name="check" size={18} style={{ filter: BLUE_FILTER, marginTop: 2, flexShrink: 0 }} />
                    {m}
                  </li>
                ))}
              </ul>

              {/* Baret görseli */}
              <div className="rounded-2xl overflow-hidden h-56">
                <img
                  src="/construction-helmet.jpg"
                  alt="İş güvenliği bareti"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Sağ — Sertifikalar */}
            <div>
              <h2 className="text-[#0A1F44] text-2xl font-bold mb-2">Sertifikalarımız</h2>
              <div className="w-10 h-1 bg-[#1E54C8] rounded mb-8" />

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {SERTIFIKALAR.map((s) => (
                  <div
                    key={s.img}
                    className="border border-gray-200 rounded-2xl p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow"
                  >
                    <div className="h-16 flex items-center justify-center mb-3">
                      <img
                        src={s.img}
                        alt={s.aciklama}
                        className="max-h-16 max-w-full object-contain"
                      />
                    </div>
                    <p className="text-gray-500 text-xs leading-snug whitespace-pre-line">{s.aciklama}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
