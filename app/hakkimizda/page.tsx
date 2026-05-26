export const metadata = {
  title: 'Hakkımızda | Çelik Taahhüt İnşaat',
  description: 'Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. hakkında bilgi edinin. 2009\'dan bu yana İstanbul\'da güvenli ve kaliteli inşaat projeleri.',
}

export default function HakkimizdaPage() {
  return (
    <>

      {/* Hero */}
      <section className="relative h-[420px] flex items-end overflow-hidden">
        <img
          src="/hero-bina3.jpg"
          alt="Çelik Taahhüt İnşaat"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">Hakkımızda</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
            Güvenle inşa ediyor,<br />geleceğe değer katıyoruz.
          </h1>
        </div>
      </section>

      {/* Biz Kimiz + Değerlerimiz — 3 kolon */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12 items-start">

            {/* Sol: Fotoğraf */}
            <div className="rounded-2xl overflow-hidden shadow-md h-full min-h-[360px]">
              <img
                src="/buildin-hakkimizda.png"
                alt="Çelik İnşaat Şantiyesi"
                className="w-full h-full object-cover object-center"
                style={{ minHeight: 360 }}
              />
            </div>

            {/* Orta: Biz Kimiz metni + imza */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A1F44] mb-5">Biz Kimiz?</h2>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  2009 yılında Soner Çelik tarafından kurulan firmamız; kurumsallaşmış yapısı, yüksek nitelikli uzman kadrosu ve yerel ile uluslararası kural ve şartnamelere bağlı çalışma anlayışıyla inşaat süreçlerinde ihtiyaç duyulan tüm mühendislik, inşaat ve yenilikçi tasarım çözümlerini başarıyla sunmaktadır. 12 Haziran 2015 tarihinde limited şirkete dönüştürülerek <strong className="text-[#0A1F44]">Çelik Taahhüt İnşaat Sanayi ve Ticaret Limited Şirketi</strong> adını almıştır.
                </p>
                <p>
                  Şirket; gayrimenkul projeleri, inşaat taahhüdü, tasarım ve anahtar teslim inşaatları gerçekleştirmektedir. Ağırlıklı olarak Bakırköy, Bahçelievler ve Avcılar'da lüks konut projeleri inşa etmektedir.
                </p>
                <p>
                  Mali yapı, iş deneyimi, mesleki/teknik yeterlilik ve iş gücü alanlarında Çevre ve Şehircilik Bakanlığı tarafından değerlendirilen müteahhitler arasında <strong className="text-[#0A1F44]">E Grubu</strong> yetki belgesine hak kazanmıştır.
                </p>
              </div>

              {/* İmza */}
              <div className="mt-8 flex items-center gap-4">
                <svg width="110" height="52" viewBox="0 0 110 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8 36 C12 28, 18 18, 26 20 C34 22, 28 34, 34 32 C40 30, 44 22, 50 24 C54 26, 52 32, 56 30"
                    stroke="#0A1F44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
                  />
                  <path
                    d="M56 30 C62 26, 68 20, 74 22 C80 24, 76 32, 82 28 C86 26, 90 22, 96 24 C100 26, 102 30, 104 28"
                    stroke="#0A1F44" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"
                  />
                  <path
                    d="M20 42 C30 44, 60 44, 90 40"
                    stroke="#0A1F44" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.4"
                  />
                  {/* S harfi */}
                  <path
                    d="M10 24 C14 20, 22 20, 20 26 C18 30, 10 30, 12 36 C14 40, 24 40, 28 36"
                    stroke="#0A1F44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"
                  />
                </svg>
                <div>
                  <p className="font-bold text-[#0A1F44] text-base">Soner Çelik</p>
                  <p className="text-gray-400 text-xs mt-0.5">Kurucu & Genel Müdür</p>
                </div>
              </div>
            </div>

            {/* Sağ: Değerlerimiz */}
            <div>
              <h2 className="text-2xl font-bold text-[#0A1F44] mb-5">Değerlerimiz</h2>
              <div className="space-y-5">
                {[
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="1.8">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                    title: 'Dürüstlük',
                    desc: 'Tüm süreçlerde şeffaf, etik ve güvenilir bir yaklaşım benimsiyoruz.',
                  },
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="1.8">
                        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                    title: 'Kalite',
                    desc: 'En iyi malzeme, doğru planlama ve usta işçilikle kalıcı işler üretiyoruz.',
                  },
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="1.8">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                    title: 'Güvenlik',
                    desc: 'İş güvenliği ve çevre duyarlılığını her zaman önceliğimiz olarak görüyoruz.',
                  },
                  {
                    icon: (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="1.8">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                    title: 'Müşteri Memnuniyeti',
                    desc: 'Müşterilerimizin ihtiyaçlarını anlayarak en uygun çözümleri sunuyoruz.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-[#0A1F44]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A1F44] text-sm">{item.title}</p>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar — açık arkaplan, ikonlu */}
      <section className="bg-gray-50 border-t border-b border-gray-100 py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="18" rx="2"/><path d="M7 3v18M17 3v18M2 12h20M2 7h5M2 17h5M17 7h5M17 17h5"/>
                  </svg>
                ),
                value: '16+',
                label: 'Yıllık Deneyim',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="1.5">
                    <path d="M2 20h20M4 20V10l8-7 8 7v10"/><path d="M9 20v-5h6v5"/>
                  </svg>
                ),
                value: '50+',
                label: 'Tamamlanan Proje',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                value: '500+',
                label: 'Mutlu Müşteri',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="1.5">
                    <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                value: 'E Grubu',
                label: 'Müteahhitlik Yetki',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                value: '100%',
                label: 'Müşteri Memnuniyeti',
              },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2">
                <div className="mb-1">{s.icon}</div>
                <p className="text-2xl font-bold text-[#0A1F44]">{s.value}</p>
                <p className="text-gray-500 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-[#0A1F44] mb-3">Projeniz için bizimle iletişime geçin</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">Size en uygun çözümü sunmak için buradayız.</p>
          <a
            href="/iletisim"
            className="inline-block bg-[#0A1F44] text-white font-semibold px-8 py-3.5 rounded-lg hover:bg-[#0d2a5c] transition-colors"
          >
            Teklif Alın
          </a>
        </div>
      </section>

    </>
  )
}
