'use client'

import { useState } from 'react'

function Icon({ name, size = 24, style }: { name: string; size?: number; style?: React.CSSProperties }) {
  return <img src={`/icons/${name}.svg`} alt={name} width={size} height={size} style={style} />
}

const BLUE_FILTER  = 'brightness(0) saturate(100%) invert(22%) sepia(90%) saturate(500%) hue-rotate(200deg)'
const WHITE_FILTER = 'brightness(0) invert(1)'
const NAVY_FILTER  = 'brightness(0) saturate(100%) invert(10%) sepia(30%) saturate(800%) hue-rotate(190deg)'

const INFO = [
  { icon: 'map-pin',       label: 'Adres',            lines: ['Ambarlı Petrol Ofisi Cad. No:4', 'Güzelce Plaza B Blok Kat:7 Avcılar / İstanbul'] },
  { icon: 'phone',         label: 'Telefon',           lines: ['+90 212 421 02 88', '+90 532 272 30 33'] },
  { icon: 'Envelope-open', label: 'E-posta',           lines: ['snrclk@hotmail.com.tr'] },
  { icon: 'calendar',      label: 'Çalışma Saatleri',  lines: ['Pazartesi - Cuma: 09:00 - 18:00', 'Cumartesi: 10:00 - 15:00'] },
]

const KONULAR = ['Genel Bilgi', 'Proje Talebi', 'Teklif Al', 'İş Ortaklığı', 'Diğer']

export default function IletisimPage() {
  const [form, setForm] = useState({ ad: '', eposta: '', telefon: '', konu: '', mesaj: '', kvkk: false })
  const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

  return (
    <>

      {/* ── Hero — hakkımızda ile aynı ───────────────────────────── */}
      <section className="relative h-[420px] flex items-end overflow-hidden">
        <img
          src="/iletisim-hero.jpg"
          alt="İletişim"
          className="absolute inset-0 w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F44]/90 via-[#0A1F44]/60 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-14 w-full">
          <p className="text-white/60 text-sm font-medium uppercase tracking-widest mb-3">İletişim</p>
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight max-w-2xl">
            Birlikte sağlam<br />gelecekler inşa edelim.
          </h1>
          <p className="text-white/70 text-sm mt-3 max-w-md leading-relaxed">
            Projeleriniz, sorularınız veya iş birlikleri için bizimle iletişime geçebilirsiniz.
            Ekibimiz en kısa sürede size dönüş yapacaktır.
          </p>
        </div>
      </section>

      {/* ── Info Bar ─────────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-6 lg:py-0">
        <div className="max-w-7xl mx-auto px-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-0 lg:divide-x lg:divide-gray-100">
            {INFO.map((item) => (
              <div key={item.label} className="flex items-center gap-4 bg-gray-50 lg:bg-transparent rounded-2xl lg:rounded-none p-4 lg:py-8 lg:px-6">
                <div className="w-10 h-10 rounded-xl bg-[#0A1F44]/5 flex items-center justify-center shrink-0 lg:bg-transparent lg:w-auto lg:h-auto">
                  <Icon name={item.icon} size={22} style={{ filter: NAVY_FILTER }} />
                </div>
                <div>
                  <p className="text-[#0A1F44] font-bold text-sm mb-0.5">{item.label}</p>
                  {item.lines.map((l) => (
                    <p key={l} className="text-gray-500 text-xs leading-relaxed">{l}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Harita ─────────────────────────────────────────── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10">

            {/* Sol — Form */}
            <div className="bg-white rounded-2xl border border-gray-100 p-8">
              <h2 className="text-[#0A1F44] text-2xl font-bold mb-2">Bize Mesaj Gönderin</h2>
              <div className="w-10 h-1 bg-[#1E54C8] rounded mb-8" />

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Adınız Soyadınız"
                  value={form.ad}
                  onChange={e => set('ad', e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors"
                />
                <input
                  type="email"
                  placeholder="E-posta Adresiniz"
                  value={form.eposta}
                  onChange={e => set('eposta', e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <input
                  type="tel"
                  placeholder="Telefon Numaranız"
                  value={form.telefon}
                  onChange={e => set('telefon', e.target.value)}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors"
                />
                <div className="relative">
                  <select
                    value={form.konu}
                    onChange={e => set('konu', e.target.value)}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors bg-white pr-10"
                  >
                    <option value="" disabled>Konu</option>
                    {KONULAR.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>

              <textarea
                placeholder="Mesajınız"
                rows={4}
                value={form.mesaj}
                onChange={e => set('mesaj', e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#0A1F44] transition-colors resize-none mb-5"
              />

              <label className="flex items-start gap-3 mb-6 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.kvkk}
                  onChange={e => set('kvkk', e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#0A1F44] shrink-0"
                />
                <span className="text-gray-400 text-xs leading-relaxed">
                  Kişisel verilerimin, iletişim formu aracılığıyla iletilen talebimin karşılanması amacıyla işlenmesini
                  ve KVKK kapsamında aydınlatma metnini okuduğumu onaylıyorum.
                </span>
              </label>

              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-[#0A1F44] text-white text-sm font-semibold px-7 py-3.5 rounded-xl hover:bg-[#071628] transition-colors"
              >
                <Icon name="Envelope-open" size={15} style={{ filter: WHITE_FILTER }} />
                Gönder
              </button>
            </div>

            {/* Sağ — Harita */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-100 min-h-[500px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.2!2d28.7195!3d40.9812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caa5d3890b86fd%3A0x3a3c8b5b5f5f5f5f!2sAvc%C4%B1lar%2C%20%C4%B0stanbul!5e0!3m2!1str!2str!4v1"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 500 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              />

              {/* Map info card */}
              <div className="absolute top-5 left-5 bg-white rounded-2xl shadow-lg p-5 w-[230px] z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 bg-[#0A1F44] rounded-xl flex items-center justify-center shrink-0">
                    <Icon name="building" size={18} style={{ filter: WHITE_FILTER }} />
                  </div>
                  <p className="text-[#0A1F44] font-bold text-sm">Çelik İnşaat</p>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed mb-4">
                  Ambarlı Petrol Ofisi Cad. No:4<br />
                  Güzelce Plaza B Blok Kat:7<br />
                  Avcılar / İstanbul
                </p>
                <a
                  href="https://maps.google.com/?q=Avcilar+Istanbul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[#0A1F44] text-xs font-semibold hover:gap-3 transition-all"
                >
                  Yol Tarifi Al
                  <Icon name="arrow-right" size={12} style={{ filter: NAVY_FILTER }} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
