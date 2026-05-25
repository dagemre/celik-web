'use client'

import { useState } from 'react'

function Icon({ name, size = 24, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  return <img src={`/icons/${name}.svg`} alt={name} width={size} height={size} style={style} />
}

const BLUE_FILTER  = 'brightness(0) saturate(100%) invert(22%) sepia(90%) saturate(500%) hue-rotate(200deg)'
const WHITE_FILTER = 'brightness(0) invert(1)'

const NEDEN = [
  { icon: 'layers',   title: 'Deneyim ve Uzmanlık',  desc: 'Yılların tecrübesiyle projelerinize değer katıyoruz.' },
  { icon: 'check',    title: 'Kaliteli ve Güvenilir', desc: 'En yüksek kalite standartlarında, güvenilir çözümler sunuyoruz.' },
  { icon: 'calendar', title: 'Zamanında Teslim',      desc: 'Projelerinizi taahhüt ettiğimiz sürede teslim ediyoruz.' },
  { icon: 'user',     title: 'Müşteri Memnuniyeti',   desc: 'İhtiyaçlarınıza özel çözümlerle memnuniyetinizi önemsiyoruz.' },
]

const SUREC = [
  { no: '01', icon: 'Envelope-open', title: 'Talebinizi İletin', desc: 'Formu doldurun ve projeniz hakkında bilgi paylaşın.' },
  { no: '02', icon: 'document',      title: 'İnceleme',          desc: 'Ekibimiz projenizin detaylarını inceler.' },
  { no: '03', icon: 'folder-dolu',   title: 'Teklif Hazırlığı',  desc: 'Size özel çözüm ve teklifimizi hazırlarız.' },
  { no: '04', icon: 'pie-chart',     title: 'Teklif Sunumu',     desc: 'Teklifimizi sizinle paylaşır, sorularınızı yanıtlarız.' },
  { no: '05', icon: 'building',      title: 'Proje Başlangıcı',  desc: 'Anlaşma sonrası projeniz hayata geçirilir.' },
]

const PROJE_TURLERI = ['Konut Projesi', 'Ticari Yapı', 'Kentsel Dönüşüm', 'Taahhüt ve İnşaat', 'Diğer']
const PROJE_ASAMALARI = ['Planlama Aşaması', 'Proje Hazır', 'İnşaat Aşaması', 'Tadilat / Onarım']

export default function TeklifAlPage() {
  const [form, setForm] = useState({
    ad: '', eposta: '', telefon: '', sirket: '',
    projeTuru: '', projeYeri: '', alan: '', asamasi: '',
    detay: '', kvkk: false,
  })
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  return (
    <>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative h-[420px] flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&auto=format&fit=crop&q=80"
          alt="Teklif Alın"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">Teklif Alın</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
            Projeniz için size özel<br />teklifimizi hazırlayalım.
          </h1>
          <p className="text-white/70 text-sm mt-3 max-w-md leading-relaxed">
            Projenizin detaylarını paylaşın, uzman ekibimiz en kısa sürede size özel
            çözümlerimiz ve teklifimizle dönüş yapsın.
          </p>
        </div>
      </section>

      {/* ── Form + Sidebar ────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-start">

            {/* Sol — Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-[#0A1F44] text-2xl font-bold mb-1">Teklif Formu</h2>
              <p className="text-gray-400 text-sm mb-8">
                Aşağıdaki formu doldurarak projeniz hakkında bilgi verebilir,
                size özel teklifimizi alabilirsiniz.
              </p>

              {/* İletişim Bilgileri */}
              <div className="flex items-center gap-2 mb-5">
                <Icon name="user" size={20} style={{ filter: BLUE_FILTER }} />
                <h3 className="text-[#0A1F44] font-bold text-base">İletişim Bilgileri</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <input type="text" placeholder="Adınız Soyadınız *" value={form.ad} onChange={e => set('ad', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors" />
                </div>
                <div>
                  <input type="email" placeholder="E-posta Adresiniz *" value={form.eposta} onChange={e => set('eposta', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <input type="tel" placeholder="+90 (5xx) xxx xx xx *" value={form.telefon} onChange={e => set('telefon', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors" />
                <input type="text" placeholder="Şirket / Kurum Adı" value={form.sirket} onChange={e => set('sirket', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors" />
              </div>

              {/* Proje Bilgileri */}
              <div className="flex items-center gap-2 mb-5">
                <Icon name="building" size={20} style={{ filter: BLUE_FILTER }} />
                <h3 className="text-[#0A1F44] font-bold text-base">Proje Bilgileri</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="relative">
                  <select value={form.projeTuru} onChange={e => set('projeTuru', e.target.value)}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-[#0A1F44] bg-white pr-10">
                    <option value="" disabled>Proje Türü *</option>
                    {PROJE_TURLERI.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
                <input type="text" placeholder="Proje Yeri *" value={form.projeYeri} onChange={e => set('projeYeri', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="m² cinsinden alan" value={form.alan} onChange={e => set('alan', e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors" />
                <div className="relative">
                  <select value={form.asamasi} onChange={e => set('asamasi', e.target.value)}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-[#0A1F44] bg-white pr-10">
                    <option value="" disabled>Proje Aşaması *</option>
                    {PROJE_ASAMALARI.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                </div>
              </div>
              <textarea placeholder="Proje Hakkında Detaylı Bilgi" rows={4} value={form.detay} onChange={e => set('detay', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors resize-none mb-8" />

              {/* Dosya Yükle */}
              <div className="flex items-center gap-2 mb-2">
                <Icon name="folder" size={20} style={{ filter: BLUE_FILTER }} />
                <h3 className="text-[#0A1F44] font-bold text-base">Dosya Yükleyin</h3>
              </div>
              <p className="text-gray-400 text-xs mb-4">Projeye ait mimari proje, vaziyet planı vb. dökümanları yükleyebilirsiniz.</p>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl py-8 px-6 cursor-pointer hover:border-[#0A1F44] transition-colors mb-8 bg-gray-50">
                <Icon name="folder" size={32} style={{ filter: 'brightness(0) saturate(100%) invert(70%)' }} />
                <p className="text-gray-500 text-sm font-medium">Dosya seçin veya sürükleyip bırakın</p>
                <p className="text-gray-400 text-xs">PDF, DWG, JPG, PNG (Maks. 20 MB)</p>
                <input type="file" className="hidden" accept=".pdf,.dwg,.jpg,.jpeg,.png" multiple />
              </label>

              {/* KVKK + Buton */}
              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input type="checkbox" checked={form.kvkk} onChange={e => set('kvkk', e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#0A1F44] shrink-0" />
                <span className="text-gray-400 text-xs leading-relaxed">
                  KVKK kapsamında aydınlatma metnini okudum ve kabul ediyorum.
                </span>
              </label>
              <button className="inline-flex items-center gap-2 bg-[#0A1F44] text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:bg-[#071628] transition-colors">
                <Icon name="Envelope-open" size={15} style={{ filter: WHITE_FILTER }} />
                Teklif Talebinizi Gönderin
              </button>
            </div>

            {/* Sağ — Sidebar */}
            <div className="flex flex-col gap-5">
              {/* Neden Çelik İnşaat */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-[#0A1F44] font-bold text-base mb-5">Neden Çelik İnşaat?</h3>
                <div className="flex flex-col gap-5">
                  {NEDEN.map((n) => (
                    <div key={n.title} className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        <Icon name={n.icon} size={20} style={{ filter: BLUE_FILTER }} />
                      </div>
                      <div>
                        <p className="text-[#0A1F44] font-semibold text-sm mb-0.5">{n.title}</p>
                        <p className="text-gray-400 text-xs leading-relaxed">{n.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hızlı İletişim */}
              <div className="bg-[#0A1F44] rounded-2xl p-6 text-white">
                <p className="font-bold text-base mb-2">Hızlı İletişim</p>
                <p className="text-white/60 text-xs leading-relaxed mb-5">
                  Form doldurmak yerine bizimle doğrudan iletişime geçebilirsiniz.
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="phone" size={16} style={{ filter: WHITE_FILTER }} />
                  <span className="text-sm font-semibold">+90 212 421 02 88</span>
                </div>
                <div className="flex items-center gap-3 mb-6">
                  <Icon name="Envelope-open" size={16} style={{ filter: WHITE_FILTER }} />
                  <span className="text-sm">snrclk@hotmail.com.tr</span>
                </div>
                <div className="border-t border-white/10 pt-5">
                  <p className="text-white/70 text-xs font-semibold mb-2">Çalışma Saatleri</p>
                  <p className="text-white/60 text-xs">Pazartesi - Cuma: 09:00 - 18:00</p>
                  <p className="text-white/60 text-xs">Cumartesi: 10:00 - 15:00</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Teklif Sürecimiz ──────────────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-[#0A1F44] text-3xl font-bold mb-3">Teklif Sürecimiz</h2>
            <div className="w-12 h-1 bg-[#1E54C8] rounded mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {SUREC.map((s, i) => (
              <div key={s.no} className="flex flex-col items-center text-center">
                <div className="flex items-center w-full justify-center mb-4">
                  {i > 0 && <div className="flex-1 h-px bg-gray-200 hidden lg:block" />}
                  <div className="w-12 h-12 rounded-full bg-[#0A1F44] flex items-center justify-center shadow-md shrink-0">
                    <span className="text-white font-bold text-sm">{s.no}</span>
                  </div>
                  {i < SUREC.length - 1 && <div className="flex-1 h-px bg-gray-200 hidden lg:block" />}
                </div>
                <div className="mb-3">
                  <Icon name={s.icon} size={28} style={{ filter: BLUE_FILTER }} />
                </div>
                <h3 className="text-[#0A1F44] font-bold text-sm mb-1">{s.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
