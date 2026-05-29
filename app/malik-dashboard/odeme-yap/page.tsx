'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import MalikNav from '@/components/malik/MalikNav'
import { getOdemeConfig, ODEME_CHANGED_EVENT, type OdemeConfig, type OdemeBank } from '@/lib/odeme-config'

// ── Banka Logo ─────────────────────────────────────────────────────────────────
function BankLogo({ name }: { name: string }) {
  const lower = name.toLowerCase()
  if (lower.includes('iş bank')) return (
    <div className="flex flex-col items-start leading-tight select-none">
      <span style={{ fontSize: 7, fontWeight: 900, color: '#CC0000', letterSpacing: '-0.2px' }}>TÜRKİYE</span>
      <span style={{ fontSize: 11, fontWeight: 900, color: '#CC0000' }}>İŞ BANKASI</span>
    </div>
  )
  if (lower.includes('garanti')) return (
    <div className="flex flex-col items-start leading-tight select-none">
      <span style={{ fontSize: 12, fontWeight: 700, color: '#009843' }}>Garanti</span>
      <span style={{ fontSize: 10, fontWeight: 900, color: '#004B8D' }}>BBVA</span>
    </div>
  )
  if (lower.includes('yapı kredi')) return (
    <div className="flex flex-col items-start leading-tight select-none">
      <span style={{ fontSize: 10, fontWeight: 700, color: '#1E3A6E' }}>Yapı Kredi</span>
      <span style={{ fontSize: 8, color: '#1E3A6E', opacity: 0.7 }}>Bankası</span>
    </div>
  )
  if (lower.includes('ziraat')) return (
    <div className="flex flex-col items-start leading-tight select-none">
      <span style={{ fontSize: 10, fontWeight: 700, color: '#C8102E' }}>Ziraat</span>
      <span style={{ fontSize: 8, fontWeight: 600, color: '#C8102E' }}>BANKASI</span>
    </div>
  )
  // Generic fallback
  return (
    <div className="flex flex-col items-start leading-tight select-none">
      <span style={{ fontSize: 10, fontWeight: 700, color: '#0A1F44' }}>{name}</span>
    </div>
  )
}

// ── Ana Bileşen ────────────────────────────────────────────────────────────────
export default function OdemeYapPage() {
  const router = useRouter()
  const [config, setConfig] = useState<OdemeConfig | null>(null)
  const [copiedIban, setCopiedIban] = useState<string | null>(null)

  // Config'i yükle ve admin değişikliklerini dinle
  useEffect(() => {
    setConfig(getOdemeConfig())
    function onChanged() { setConfig(getOdemeConfig()) }
    window.addEventListener(ODEME_CHANGED_EVENT, onChanged)
    return () => window.removeEventListener(ODEME_CHANGED_EVENT, onChanged)
  }, [])

  function copyIban(iban: string) {
    navigator.clipboard.writeText(iban.replace(/\s/g, ''))
    setCopiedIban(iban)
    setTimeout(() => setCopiedIban(null), 2000)
  }

  if (!config) return null

  return (
    <div className="flex h-screen bg-[#F4F6FA] overflow-hidden">

      {/* Sidebar Nav */}
      <MalikNav
        activePage="odeme-yap"
        setActivePage={(key) => {
          // Diğer sayfalara geri dön
          router.push('/malik-dashboard')
        }}
      />

      {/* ── İçerik ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-auto">

        {/* Başlık */}
        <div className="bg-white border-b border-neutral-100 px-5 md:px-8 py-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/malik-dashboard')}
              className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-primary-800 md:hidden"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div>
              <h1 className="font-bold text-xl md:text-2xl text-primary-800">Ödeme Yap</h1>
              <p className="text-sm text-neutral-400 mt-0.5">Ödeme için banka hesap bilgileri ve iletişim</p>
            </div>
          </div>
        </div>

        {/* İçerik Grid */}
        <div className="flex-1 p-5 md:p-8 pb-28 md:pb-8 overflow-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-5 max-w-6xl">

            {/* ── Sol Kolon ────────────────────────────────── */}
            <div className="space-y-4 order-2 xl:order-1">

              {/* Şirket Kartı */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5">
                <div className="flex gap-4 items-start mb-5">
                  <div className="w-20 h-20 border border-neutral-100 rounded-2xl flex items-center justify-center flex-shrink-0 p-2 bg-neutral-50">
                    <img src="/icons/celik-logo.svg" alt="Çelik" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <h2 className="font-bold text-base text-primary-800 leading-tight">{config.sirketAdi}</h2>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-700 bg-success-50 border border-success-100 rounded-full px-2.5 py-0.5 flex-shrink-0">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Güvenilir
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1.5 flex items-start gap-1.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                        <path d="M12 21s-8-5.5-8-12a8 8 0 0116 0c0 6.5-8 12-8 12z" stroke="#888780" strokeWidth="1.8"/>
                        <circle cx="12" cy="9" r="2.5" stroke="#888780" strokeWidth="1.8"/>
                      </svg>
                      {config.adres}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-neutral-100">
                  {[
                    { icon: 'doc',  label: 'Vergi Dairesi', value: config.vergiDairesi },
                    { icon: 'hash', label: 'Vergi No',      value: config.vergiNo },
                    { icon: 'info', label: 'Mersis No',     value: config.mersisNo },
                    { icon: 'cal',  label: 'Kuruluş Yılı',  value: config.kurulusYili },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-2">
                      <div className="w-7 h-7 bg-neutral-50 border border-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.icon === 'doc'  && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#888780" strokeWidth="1.8"/><path d="M7 8h10M7 12h7" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                        {item.icon === 'hash' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#888780" strokeWidth="1.8"/><path d="M8 12h8M8 8h5" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                        {item.icon === 'info' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#888780" strokeWidth="1.8"/><path d="M12 8v4M12 16h.01" stroke="#888780" strokeWidth="2" strokeLinecap="round"/></svg>}
                        {item.icon === 'cal'  && <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#888780" strokeWidth="1.8"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400">{item.label}</p>
                        <p className="text-sm font-semibold text-primary-800 leading-tight">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Belgeler */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5">
                <h3 className="font-bold text-sm text-primary-800 mb-4">Belgeler</h3>
                <div className="flex gap-3 flex-wrap">
                  {[{ name: 'Banka Hesap Dökümü' }, { name: 'Vergi Levhası' }].map(doc => (
                    <button key={doc.name} className="flex items-center gap-3 px-4 py-3 border border-neutral-200 rounded-xl hover:border-neutral-300 hover:bg-neutral-50 transition-colors">
                      <div className="w-9 h-9 bg-danger-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#A32D2D" strokeWidth="1.8" strokeLinejoin="round"/>
                          <path d="M14 2v6h6" stroke="#A32D2D" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-primary-800">{doc.name}</p>
                        <p className="text-xs text-neutral-400">PDF</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* İletişim Bilgileri */}
              <div className="bg-white rounded-2xl border border-neutral-100 p-5">
                <h3 className="font-bold text-sm text-primary-800 mb-1">İletişim Bilgileri</h3>
                <p className="text-xs text-neutral-400 mb-4">Ödeme planınız, makbuz talepleriniz veya diğer konular için bizimle iletişime geçebilirsiniz.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { icon: 'phone', label: 'Telefon', value: config.telefon },
                    { icon: 'mail',  label: 'E-posta', value: config.eposta },
                    { icon: 'pin',   label: 'Adres',   value: config.iletisimAdres },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-2.5">
                      <div className="w-8 h-8 bg-neutral-50 border border-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.icon === 'phone' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.88 11.9 19.79 19.79 0 01.82 3.28 2 2 0 012.82 1.1h3a2 2 0 012 1.72 12 12 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l.98-.98a2 2 0 012.11-.45 12 12 0 002.81.7A2 2 0 0122 16.92z" stroke="#888780" strokeWidth="1.8"/></svg>}
                        {item.icon === 'mail'  && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="2" stroke="#888780" strokeWidth="1.8"/><path d="M2 8l10 7 10-7" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                        {item.icon === 'pin'   && <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 21s-8-5.5-8-12a8 8 0 0116 0c0 6.5-8 12-8 12z" stroke="#888780" strokeWidth="1.8"/><circle cx="12" cy="9" r="2.5" stroke="#888780" strokeWidth="1.8"/></svg>}
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-400">{item.label}</p>
                        <p className="text-xs font-medium text-primary-800 leading-snug">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Banner */}
              <div className="bg-primary-800 rounded-2xl p-5 flex items-center gap-4 flex-wrap md:flex-nowrap">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.88 11.9 19.79 19.79 0 01.82 3.28 2 2 0 012.82 1.1h3a2 2 0 012 1.72 12 12 0 00.7 2.81 2 2 0 01-.45 2.11L7.09 8.91a16 16 0 006 6l.98-.98a2 2 0 012.11-.45 12 12 0 002.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="1.8"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">Ödeme bilgilerinizle ilgili soru mu var?</p>
                  <p className="text-sm text-white/70 mt-0.5">Bizimle iletişime geçin, size yardımcı olalım.</p>
                </div>
                <a
                  href={`tel:${config.telefon.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 bg-white text-primary-800 font-bold text-sm px-5 py-2.5 rounded-xl flex-shrink-0 hover:bg-neutral-100 transition-colors"
                >
                  İletişime Geç
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* ── Sağ Kolon: Banka Hesapları ────────────────── */}
            <div className="order-1 xl:order-2">
              <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">

                {/* Başlık */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-neutral-100">
                  <h3 className="font-bold text-base text-primary-800">Banka Hesap Bilgileri</h3>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-neutral-400">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>

                {/* Ödeme Notu */}
                <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-100">
                  <p className="text-xs text-neutral-500">{config.odemNotu}</p>
                </div>

                {/* Banka Listesi */}
                <div className="divide-y divide-neutral-100">
                  {config.banks.map((bank: OdemeBank) => (
                    <div key={bank.id} className="px-5 py-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-[88px] flex-shrink-0">
                            <BankLogo name={bank.name} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary-800 leading-tight">{bank.name}</p>
                            <p className="text-xs text-neutral-400">{bank.type}</p>
                          </div>
                        </div>
                        {bank.isAna && (
                          <span className="text-xs font-semibold text-success-700 bg-success-50 border border-success-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                            Ana Hesap
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">IBAN</p>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-mono font-semibold text-primary-800 leading-tight">{bank.iban}</span>
                            <button
                              onClick={() => copyIban(bank.iban)}
                              className="w-6 h-6 flex items-center justify-center rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors flex-shrink-0"
                              title="IBAN kopyala"
                            >
                              {copiedIban === bank.iban ? (
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                  <polyline points="20 6 9 17 4 12" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                              ) : (
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                  <rect x="9" y="9" width="13" height="13" rx="2" stroke="#888780" strokeWidth="1.8"/>
                                  <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#888780" strokeWidth="1.8"/>
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Şube</p>
                          <p className="text-xs font-medium text-primary-800">{bank.sube}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Güvenli Ödeme */}
                <div className="m-5 mt-2 p-4 bg-success-50 border border-success-100 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-success-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#0F6E56" strokeWidth="1.8" strokeLinejoin="round"/>
                        <polyline points="9 12 11 14 15 10" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-success-700">Güvenli Ödeme</p>
                      <p className="text-xs text-success-600 mt-0.5 leading-relaxed">Ödemelerinizi yalnızca yukarıda belirtilen resmi banka hesaplarına yapmanızı rica ederiz. Farklı hesaplara yapılan ödemelerden firmamız sorumlu değildir.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
