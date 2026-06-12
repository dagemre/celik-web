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
                src="/Soner-hakkimizda.jpg"
                alt="Soner Çelik"
                className="w-full h-full object-cover object-top"
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
              <div className="mt-8 flex flex-col">
                <svg width="180" height="72" viewBox="100 340 1260 420" xmlns="http://www.w3.org/2000/svg" fill="#1a1a1a">
                  <path d="M750.1,487.68c1.61,2.74-.34,7.52-2.25,10.25-7.94,11.34-15.11,21.85-21.26,35.38,5.67.29,10.47-1.26,15.47-3.21l51.81-20.2c10.9-4.25,26.82-5.13,23.83-2.59-.41.35-1.62,1.32-2.35,1.63l-33.3,14.28c-19.51,8.37-53.85,30.09-68.05,20.35-14.86-10.19,7.29-37.33,17.99-51.3l-16.03-1.33c-21.35,21.26-61.87,63.34-90.79,58.38-7.63-1.31-12.34-7.03-13.49-14.55-11.61,10.28-26.26,23.15-38.42,15-12.96-8.69-2.59-26.66,2.8-41.5-14.18,10.81-25.96,22.79-36.32,36.38l-11.72,15.37c-2.63,3.45-8.29,1.88-10.93-.25-3.08-2.49-3.84-7.63-1.81-11.58l18.74-36.41-25.43,13.07c-10.98,21.82-35.2,53.58-60.34,50.59-5.51-.65-10.52-3.15-13.12-6.74-8.65-11.92.97-26.09,8.04-40l-58.21,24.7c8.3,7.16,14.95,13.04,19.21,22.09,9.1,19.33,2.71,42.7-11.28,59.24-22.83,26.99-57.21,47.95-88.96,64.01-32.38,16.38-65.37,29.94-100.45,39.31-21.11,5.64-61.77,12.08-72.03-4.84-4-6.6-2.85-14.79.69-21.54,15.95-30.42,55.68-61.31,84.81-81,20.66-13.97,40.64-27.06,63.15-37.83l84.33-40.32c-19.61-11.2-39.68-19.32-60.8-26.45l-53.77-18.18c-15.41-5.21-29.58-11.77-42.55-21.27-15.53-11.39-21.5-29.99-14.62-48.27,2.96-7.86,7.67-14.96,13.32-21.51,17.87-20.71,38.66-37.21,61.48-52.48,44.14-29.52,91.85-51.91,142.34-68.38,32.78-10.69,76.27-21.57,108.82-12.93,10.03,2.66,17.13,9.97,18.76,20.38,3.1,19.8-11.32,43.86-24.12,60.14-22.43,28.52-47.94,53.69-76.4,76.22-10.87,8.61-21.74,15.64-33.63,22.48-3.86,2.22-9.26,2.69-12.65-.04-1.12-.9-2.69-2.88-2.57-3.96s1.18-2.98,2.03-4.32c21.64-12.28,40.96-26.65,59.79-43.05,22.54-19.52,42.79-40.53,59.88-64.88,6.81-9.7,12.29-19.6,15.24-30.8,2.84-10.79-2.45-20.52-13.38-23.24-19.2-4.78-49.14-.22-69.81,5.19-64.37,16.87-124.33,46.02-177.46,85.94-17.62,13.25-44.39,36.48-53.19,54.79-7.21,15.01-2.45,31.29,11.03,40.89,12.94,9.23,27.24,15.06,42.29,20.6l49.63,18.26c21.93,8.07,42.48,17.67,62.38,29.47l72.61-28.06c7.31-2.82,10.2-11.69,23.63-20.39,9.97-6.46,26.97-9.57,32.79-2.63,4.1,4.88,4.91,10.96,5.87,17.5,12.74-5.03,23.16-11,33.77-18.38,1.68-1.17,6.26-.1,7.49,1.29s1.38,5.25.37,7.38l-11.34,23.93c13.43-12.42,25.66-25.5,41.4-35.46,4.66-2.95,12.15-2.24,13.42,3.77.84,3.95-1.87,9.26-3.44,12.95l-8.07,19.09c-1.54,3.65-1.24,7.79-.23,12.26,10.19-4.42,20.52-9.67,27.6-18.01,5.96-14.22,13.52-27.57,27.07-35.81,10.57-6.43,25.73-10.41,31.36-2.26,5.54,8.01-2.71,18.02-11.31,25.27-9.19,7.75-19.41,12.63-30.54,17.8-2.21,1.03-2.33,7.58.09,9.12,13.02,8.29,66.85-35.64,79.71-51.68-.42-6.91.9-15.26,9.5-17.71,4.03-1.15,8.36-2.04,12.86.58,1.37.8,1.71,4.7.68,6.08l-5.43,7.26,9.35.37c5.5.22,11.18.8,14.4,6.27ZM660.7,492.32l-.18-3.68c-4.39-.12-8.02,1.76-11.21,4.73-7.33,6.84-13.94,13.81-17.84,23.4,12.11-5.53,22.21-13.1,29.22-24.46ZM496.39,518.44c3.72-3.75,4.19-12.12,2.61-16.68-1.63-1.44-6.4-1.29-8.2-.12-8.15,5.33-15.66,13.47-15.49,22.23,7.6-.29,15.65-1.11,21.08-5.44ZM490.42,531.29c-12.44,2.21-23.84,5.07-28.25-6.77-7.66,11.6-20.39,37.99-9.98,37.66,12.68-.39,29.18-18.13,38.23-30.89ZM206.5,725.04c32.18-12.17,63.34-25.15,93.94-40.83,32.39-16.6,76.28-42.94,90.95-75.83,7.16-16.06,3.3-32.99-9.72-44.53l-7.89-5.83-49.09,23.52c-53.61,25.69-100.86,54.74-145.19,94.53-8.78,7.88-16.32,16.21-23.46,25.54-9.17,11.99-16,30.09-3.2,32.27,15.42,2.63,37.96-2.91,53.65-8.84Z"/>
                  <path d="M939.22,514.55c-20.11,20.71-43.44,37.4-70.15,48.77.74,3.28-.5,5.72-2.83,8.04-6.71,6.72-12.89,13.12-18.63,21.52l15.21,1.67c3.28.36,6.71,3.66,7.9,6.02,1.35,2.67,1.57,8.17-.39,10.93-9.68,13.71-29.22,18.66-43.56,8.29,3.35-2.12,7.08-1.89,10.85-1.86,9.35.08,18.16-4.6,24.05-12.28-8.71-6.61-26.32,3.29-30.54-6.05-.43-.95.18-3.3,1.04-4.27l25.01-27.99c-18.85,1.83-36.57-6.78-38.43-25.71-2.47-25.15,11.07-51.33,26.19-71.6,26.96-36.15,68.58-73.92,110.11-91.55,6.64-2.82,13.96-4.54,20.69-4.09,7.97.53,12.88,5.73,12.7,13.69-.16,7.2-2.93,13.92-6.23,20.6-11.2,18.35-25.91,33.93-43.66,46.11l-2.49-.03c-.66,0-.61-2.28-.1-2.9l15.51-18.93c9.1-11.11,17.06-22.16,22.97-35.09,1.91-4.19,2.71-8.98,1.48-13.46-3.25-.86-7.69-.38-11.04.87-40.46,15.09-81.03,57.62-106.07,92.66-12.92,18.08-26.74,43.68-23.49,64.91,1.22,7.97,7.34,12.97,15.39,12.07,9.86-1.11,19.01-4.57,27.97-9.07,19.47-9.8,37.37-21.17,55.24-33.59l8.6-4.84c-.8,3-1.63,5.45-3.29,7.16Z"/>
                  <path d="M1198.74,490.86l-16.45,30.93c-.77,1.45-2.17,3.65-3.25,4.39-1.23.85-4.57-.06-5.95-.81-4.82-2.65-5.81-6.84-3.8-11.6,5.16-12.17,10.96-23.5,18.56-34.47l38.4-55.4,25.7-35.4c1.24-1.71,5.09-1.61,6.78-.49,1.79,1.19,1.49,4.03.02,6.4l-46.62,74.82,23.81-15.8,37.28-28.64,51.34-48.55c1.12-1.06,4.24-1.07,5.35-.33,6.87,4.57-31.4,42.01-41.87,50.73l-38.71,32.22-39.42,26.25c12.21,5.53,24.51,9.5,37.54,12.62l58.61,9.54,69.18,11.28,30.17,7.69,1.51,1.45c.39.38-.21,1.52-.76,2.08-41.32-6.48-81.68-11.29-123.21-14.48-29.75-2.27-56.96-9.56-84.21-24.42Z"/>
                  <path d="M1008.96,517.79l29.6-9.31c-.82,3.96-3.48,6.17-6.71,7.74l-22.2,10.81c-15.47,7.54-31.3,13.86-48.06,17.56-5.54,1.22-11-1.04-14.35-4.15-10.17-9.45,1.26-29.01,8-42.99-1.31-.58-3.08-1.94-3.19-3.12-.42-4.75,6.28-2.21,10.56-9.5,8.98-15.33,19.91-28.62,31.01-42.04l-9.53.91c-1.28-2.81.56-6.24,2.92-7.39,8.56-4.17,17.09-7.27,26.52-9.52,21.81-5.2,43.39-8.24,65.79-9.99,1.52-.12,4.22,1.41,4.38,2.58.18,1.36-1.84,4.02-3.58,4.41l-57.44,13.18c-4.31.99-8.15,2.63-11.15,5.94-11.87,13.09-22.58,26.22-31.88,42.13l43.38-11.75c5.18-1.4,9.84-1.5,15.16.3-2.7,3.55-5.48,4.54-9.07,5.98-18.47,7.43-36.61,13.32-56.61,17.46-5.5,9.33-15.96,28.59-11.84,32.97.96,1.02,4.22,2.1,5.66,1.63l42.65-13.84Z"/>
                  <path d="M950.12,580.8l-39.81,6.81c-5.68.97-10.66,1.2-16.83,1.04.27-1.84,1.7-4.37,3.06-4.83l15.94-5.28,83.05-16.71,92.99-12.14c76.51-7.01,152.5-9.41,229.02-5.48,14.26.73,27.5,1.3,40.85,4.58-62.7-1.1-123.69.82-185.94,4.83l-99.06,8.2c-41.7,3.45-81.52,11.82-123.28,18.96Z"/>
                  <path d="M382.44,685.46c-3.54,1.62-6.21,2.24-9.9,2.14,3.36-3.38,6.44-6.07,10.39-7.97l37.2-17.84c53.63-23,108.64-40.52,165.83-52.82,35.37-7.61,69.78-13.87,105.71-18.49,43.19-5.65,85.41-10.12,128.81-12.14.88.26,2.74,1.28,2.41,1.83s-1.57,1.4-2.48,1.5c-51.36,5.63-101.83,11.8-152.76,20.99-67.52,12.17-135.13,28.41-200.23,49.59-29.19,9.5-56.85,20.37-84.99,33.21Z"/>
                  <path d="M1129.39,504.82c-10.88,6.52-21.41,10.9-32.52,15.47-12.51,5.14-24.97,9.41-38.47,11.22-5.82.78-12.38-1.08-15.85-5.84-2.66-3.63-1.89-9.54.52-13.3l31.6-49.31,40.76-55.03c1.96-.81,4.58-1.56,6.29-1.58s4,3.17,3.68,5.3c-19.83,27.81-38.82,55.25-56.46,84.39l-12.12,23.06,40.46-9.52,16.12-3.98c5.19-.82,9.75-3.63,16-.89Z"/>
                  <path d="M1128.18,520.1c-1.44-2.2.57-7.4,1.69-9.62l8.15-16.16,55.53-89.05c.81-1.29,4.68-2.05,6.16-2.05,1.66,0,4.92,2.64,4.71,4.4l-9.48,16.98-54.25,94.34c-2.5,4.35-9.18,6.26-12.52,1.16Z"/>
                  <path d="M1209.78,391.73c-1.94.31-4.61-.49-5.55-1.33-3.2-2.87.56-9.96,5.27-15.15,2.66-2.93,8.53-3.44,10.07.34,2.71,6.65-2.15,14.9-9.79,16.13Z"/>
                </svg>
                <p className="text-gray-400 text-xs ml-3">Kurucu & Genel Müdür</p>
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
                value: '5000+',
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
