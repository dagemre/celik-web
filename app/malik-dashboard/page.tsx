'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import KVKKModal from '@/components/malik/KVKKModal'
import MalikNav from '@/components/malik/MalikNav'
import {
  getMalikBilgi,
  getMalikOdemeleri,
  getProjeeDuyurulari,
  hesaplaOdemeDurumu,
  formatOdemeTarihi,
  type MalikBilgi,
  type MalikOdeme,
  type MalikDuyuru,
} from '@/lib/malik-data'

// ─── Mock Data (auth + seed data gelene kadar fallback) ───────────────────────
// TODO: Auth kurulunca MOCK_OWNER_ID → supabase.auth.getUser().id ile değişecek
const MOCK_OWNER_ID = '' // boş bırakıldı → gerçek veri yoksa mock'a düşer

const MOCK_MALIK: MalikBilgi = {
  id: 'mock',
  full_name: 'Emre Dağ',
  email: 'dagemre@gmail.com',
  phone: '',
  unit_id: 'mock',
  unit_no: '5',
  floor: 3,
  unit_type: '3+1',
  price: 500000,
  gross_area: 135.5,
  net_area: 108.25,
  project_id: 'mock',
  project_name: 'Mutlu Apartman',
  project_slug: 'mutlu-apartman',
  project_location: 'İstanbul / Avcılar / Merkez Mah.',
  project_status: 'devam',
  project_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop',
}

const MOCK_ODEMELER: MalikOdeme[] = [
  { id: '1', paid_date: '2026-05-04', source: 'Havale', amount: 300000, description: '', status: 'odendi' },
  { id: '2', paid_date: '2026-03-01', source: 'Havale', amount: 50000,  description: '', status: 'odendi' },
  { id: '3', paid_date: '2026-01-15', source: 'Havale', amount: 50000,  description: '', status: 'odendi' },
]

const MOCK_DUYURULAR: MalikDuyuru[] = [
  { id: '1', title: 'Aidat Ödemeleri Hakkında',  content: 'Mayıs ayı aidat ödemelerinizin 10.05.2026 tarihine kadar yapılması rica olunur.', created_at: '2026-05-02' },
  { id: '2', title: 'Genel Bakım Çalışması',       content: '15.05.2026 tarihinde bina genelinde bakım çalışması yapılacaktır.',              created_at: '2026-04-28' },
]

const TECHNICAL_DOCS = [
  { id: '1', title: 'Kat Planları',     size: '2.4 MB' },
  { id: '2', title: 'Cephe Görselleri', size: '3.1 MB' },
  { id: '3', title: 'Elektrik Projesi', size: '1.8 MB' },
]

function formatTL(n: number) { return n.toLocaleString('tr-TR') + ' TL' }

// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ percent }: { percent: number }) {
  const r = 48, cx = 60, cy = 60, circ = 2 * Math.PI * r
  const segments = [
    { value: 63, color: '#0A1F44' },
    { value: 27, color: '#22C55E' },
    { value: 10, color: '#D1D5DB' },
  ]
  let offset = 0
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {segments.map((seg, i) => {
        const dash = (seg.value / 100) * circ
        const rotate = (offset / 100) * 360 - 90
        offset += seg.value
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={seg.color} strokeWidth="14"
          strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="butt"
          transform={`rotate(${rotate} ${cx} ${cy})`} />
      })}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize="15" fontWeight="700" fill="#0A1F44">%{percent}</text>
    </svg>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MalikDashboardPage() {
  const router = useRouter()
  const [activePage, setActivePage] = useState<string>('anasayfa')
  const [kvkkGoster, setKvkkGoster] = useState(false)

  // ── Supabase veri state'leri (auth + seed data gelince dolacak) ──
  const [malik, setMalik]         = useState<MalikBilgi>(MOCK_MALIK)
  const [odemeler, setOdemeler]   = useState<MalikOdeme[]>(MOCK_ODEMELER)
  const [duyurular, setDuyurular] = useState<MalikDuyuru[]>(MOCK_DUYURULAR)

  useEffect(() => {
    // KVKK kontrolü
    const onay = localStorage.getItem('kvkk_onay')
    if (!onay) setKvkkGoster(true)

    // Supabase'den veri çek — MOCK_OWNER_ID dolu olduğunda aktif olur
    // TODO: Auth kurulunca MOCK_OWNER_ID → session.user.id
    if (!MOCK_OWNER_ID) return
    async function yukle() {
      const [bilgi, odeme, duyuru] = await Promise.all([
        getMalikBilgi(MOCK_OWNER_ID),
        getMalikOdemeleri(MOCK_OWNER_ID),
        getProjeeDuyurulari(MOCK_OWNER_ID), // project_id auth sonrası bilgi'den gelecek
      ])
      if (bilgi)  setMalik(bilgi)
      if (odeme.length)  setOdemeler(odeme)
      if (duyuru.length) setDuyurular(duyuru)
    }
    yukle()
  }, [])

  const odemeDurumu = hesaplaOdemeDurumu(malik.price, odemeler)
  const { toplamBorc, odenen, kalan, yuzdesi: paidPercent } = odemeDurumu

  return (
    <div className="flex h-screen bg-[#F4F6FA] overflow-hidden">

      {/* ── KVKK Modal — ilk girişte gösterilir ── */}
      {kvkkGoster && (
        <KVKKModal
          ownerEmail={malik.email}
          ownerId={undefined}
          onOnaylandi={() => setKvkkGoster(false)}
        />
      )}

      {/* ── NAV (sidebar desktop / bottom nav mobil) ─────────────────── */}
      <MalikNav activePage={activePage} setActivePage={setActivePage} />

      {/* ── RIGHT SIDE ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOP BAR */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center px-5 gap-4 flex-shrink-0">
          <div className="flex-1">
            <h1 className="text-base font-bold text-[#0A1F44] leading-tight">Merhaba, {malik.full_name}</h1>
            <button className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
              {malik.project_name}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 w-52">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35" strokeLinecap="round"/></svg>
            <input placeholder="Arama yapın..." className="bg-transparent text-sm text-gray-600 outline-none w-full placeholder:text-gray-400" />
          </div>
          <button className="relative w-9 h-9 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">2</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#0A1F44] flex items-center justify-center text-white font-bold text-sm">
              {malik.full_name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[#0A1F44] leading-tight">{malik.full_name}</p>
              <p className="text-xs text-gray-400">Malik</p>
            </div>
            <button onClick={() => router.push('/malik-giris')} className="text-gray-300 hover:text-gray-500 transition-colors ml-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round"/><polyline points="16 17 21 12 16 7" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" strokeLinecap="round"/></svg>
            </button>
          </div>
        </header>

        {/* ── CONTENT ───────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <div className="flex gap-5 p-5">

            {/* ── CENTER COLUMN ──────────────────────────── */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">

              {/* ══ ANASAYFA ══════════════════════════════ */}
              {activePage === 'anasayfa' && <>

                {/* Ödeme Durumu */}
                <div className="bg-[#0A1F44] rounded-2xl px-4 py-3 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2 relative">
                    <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest">Ödeme Durumu</p>
                    <div className="w-6 h-6 bg-white/10 rounded-lg flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round"/></svg>
                    </div>
                  </div>
                  <div className="flex gap-5 mb-2.5 relative">
                    <div><p className="text-white/50 text-[10px] mb-0.5">Toplam Borç</p><p className="text-white font-bold text-sm">{formatTL(toplamBorc)}</p></div>
                    <div><p className="text-white/50 text-[10px] mb-0.5">Ödenen</p><p className="text-[#22C55E] font-bold text-sm">{formatTL(odenen)}</p></div>
                    <div><p className="text-white/50 text-[10px] mb-0.5">Kalan Borç</p><p className="text-white font-bold text-sm">{formatTL(kalan)}</p></div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${paidPercent}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#22C55E] flex items-center justify-center">
                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <p className="text-white/50 text-[10px]">Ödemeleriniz düzenli</p>
                    </div>
                    <p className="text-white/50 text-[10px]">%{paidPercent} ödendi</p>
                  </div>
                </div>

                {/* Proje Kartı */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  {/* Üst kısım: görsel + başlık */}
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={malik.project_image_url} alt={malik.project_name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base font-bold text-[#0A1F44] leading-tight">{malik.project_name}</h2>
                      <div className="flex items-center gap-1 mt-1.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <p className="text-xs text-gray-400">{malik.project_location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Ayırıcı + 4 kolon */}
                  <div className="border-t border-gray-100 grid grid-cols-4 divide-x divide-gray-100 px-2 py-3">
                    <div className="px-3">
                      <p className="text-[10px] text-gray-400 mb-1.5 leading-tight">Proje Durumu</p>
                      <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-lg ${malik.project_status === 'tamamlandi' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'}`}>
                        {malik.project_status === 'tamamlandi' ? 'Tamamlandı' : 'Devam Ediyor'}
                      </span>
                    </div>
                    <div className="px-3">
                      <p className="text-[10px] text-gray-400 mb-1.5">Tip</p>
                      <p className="text-sm font-bold text-[#0A1F44]">{malik.unit_type}</p>
                    </div>
                    <div className="px-3">
                      <p className="text-[10px] text-gray-400 mb-1.5">Daire No</p>
                      <p className="text-sm font-bold text-[#0A1F44]">{malik.unit_no}</p>
                    </div>
                    <div className="px-3">
                      <p className="text-[10px] text-gray-400 mb-1.5">Kat</p>
                      <p className="text-sm font-bold text-[#0A1F44]">{malik.floor}</p>
                    </div>
                  </div>

                  {/* Alt link */}
                  <button className="w-full flex items-center justify-between px-4 py-3 border-t border-gray-100 hover:bg-gray-50 transition-colors">
                    <p className="text-xs font-medium text-gray-500">Proje detayına git</p>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>

                {/* Hızlı Aksiyonlar */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Ödeme\nGeçmişim',  bg: 'bg-blue-50',   iconBg: 'bg-blue-100',   icon: <IcDoc color="#2563EB" />,    action: () => setActivePage('odemeler') },
                      { label: 'Ödeme\nYap',        bg: 'bg-green-50',  iconBg: 'bg-green-100',  icon: <IcCard color="#16A34A" />,   action: () => router.push('/malik-dashboard/odeme-yap') },
                      { label: 'Teknik\nÇizimler',  bg: 'bg-purple-50', iconBg: 'bg-purple-100', icon: <IcFolder color="#7C3AED" />, action: () => setActivePage('belgeler') },
                      { label: 'Daire\nBilgilerim', bg: 'bg-amber-50',  iconBg: 'bg-amber-100',  icon: <IcInfo color="#D97706" />,   action: () => setActivePage('daire') },
                    ].map((item, i) => (
                      <button key={i} onClick={item.action} className={`flex flex-col items-center gap-2.5 py-4 px-2 rounded-xl ${item.bg} hover:opacity-80 transition-opacity`}>
                        <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center`}>{item.icon}</div>
                        <p className="text-xs font-semibold text-[#0A1F44] text-center whitespace-pre-line leading-tight">{item.label}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Son Ödemeler */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-base font-bold text-[#0A1F44]">Son Ödemeler</p>
                    <button className="text-xs font-medium text-gray-400 hover:text-[#0A1F44] transition-colors">Tümünü Gör</button>
                  </div>
                  {odemeler.slice(0, 3).map((p, i) => (
                    <div key={p.id} className={`flex items-center gap-3 py-3.5 ${i < Math.min(odemeler.length, 3) - 1 ? 'border-b border-gray-100' : ''}`}>
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#0A1F44]">{formatOdemeTarihi(p.paid_date)}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{p.source}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-green-500">{formatTL(p.amount)}</p>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Duyurular */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 bg-gray-50 rounded-lg flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p className="text-sm font-bold text-[#0A1F44]">Duyurular</p>
                  </div>
                  {duyurular.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">Henüz duyuru yok.</p>
                  ) : duyurular.map((ann, i) => (
                    <div key={ann.id} className={`flex items-center gap-3 py-3.5 ${i < duyurular.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#0A1F44] flex-shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0A1F44] truncate">{ann.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{ann.content}</p>
                      </div>
                      <p className="text-xs text-gray-400 flex-shrink-0">{formatOdemeTarihi(ann.created_at)}</p>
                    </div>
                  ))}
                </div>

              </>}

              {/* ══ DAİRE BİLGİLERİM ══════════════════════ */}
              {activePage === 'daire' && <>

                {/* Başlık */}
                <div>
                  <h2 className="text-xl font-bold text-[#0A1F44]">Daire Bilgilerim</h2>
                  <p className="text-sm text-gray-400 mt-1">Dairenize ait tüm bilgileri aşağıda görüntüleyebilirsiniz.</p>
                </div>

                {/* ROW 1: Mutlu Apartman + Proje İlerleme — eşit 2 kolon */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

                  {/* Proje Kartı */}
                  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
                    <div className="h-52 flex-shrink-0">
                      <img src={malik.imageUri} alt={malik.projectName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 p-5">
                      <h3 className="text-base font-bold text-[#0A1F44]">{malik.projectName}</h3>
                      <div className="flex items-center gap-1.5 mt-1 mb-4">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <p className="text-xs text-gray-400">{malik.location}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <div><p className="text-xs text-gray-400 mb-1">Proje Durumu</p><span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-lg">Devam Ediyor</span></div>
                        <div><p className="text-xs text-gray-400 mb-1">Blok</p><p className="text-sm font-bold text-[#0A1F44]">{malik.block} Blok</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Kat</p><p className="text-sm font-bold text-[#0A1F44]">{malik.floor}. Kat</p></div>
                        <div><p className="text-xs text-gray-400 mb-1">Daire No</p><p className="text-sm font-bold text-[#0A1F44]">{malik.unitNumber}</p></div>
                      </div>
                      <button className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-[#0A1F44] hover:text-blue-600 transition-colors">
                        Proje detayına git
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  </div>

                  {/* Proje İlerleme */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <p className="text-sm font-bold text-[#0A1F44]">Proje İlerleme</p>
                      <button className="text-xs text-gray-400 hover:text-[#0A1F44] flex items-center gap-1">Detaylı Rapor <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                    </div>
                    <div className="flex items-center gap-5 flex-1">
                      <DonutChart percent={63} />
                      <div className="flex-1 flex flex-col gap-3">
                        {[
                          { label: 'Tamamlanan İşler', value: 63, color: 'bg-[#0A1F44]' },
                          { label: 'Devam Eden İşler',  value: 27, color: 'bg-[#22C55E]' },
                          { label: 'Planlanan İşler',   value: 10, color: 'bg-gray-200'  },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between mb-1.5"><p className="text-xs text-gray-500">{item.label}</p><p className="text-xs font-bold text-[#0A1F44]">%{item.value}</p></div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} /></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* ROW 2: Daire Bilgilerim + Finansal Bilgiler — eşit 2 kolon */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">

                  {/* Daire Bilgilerim */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-[#0A1F44]">Daire Bilgilerim</h3>
                      <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#0A1F44] border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 3h15v13H1z" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Daire Planı
                      </button>
                    </div>
                    {[
                      { label: 'Daire Tipi',    value: '3+1',          icon: <><rect x="3" y="3" width="7" height="7" strokeLinecap="round"/><rect x="14" y="3" width="7" height="7" strokeLinecap="round"/><rect x="3" y="14" width="7" height="7" strokeLinecap="round"/><rect x="14" y="14" width="7" height="7" strokeLinecap="round"/></> },
                      { label: 'Brüt Alan',     value: '135,50 m²',    icon: <><path d="M21 6H3" strokeLinecap="round"/><path d="M21 12H3" strokeLinecap="round"/><path d="M21 18H3" strokeLinecap="round"/></> },
                      { label: 'Net Alan',      value: '108,25 m²',    icon: <><path d="M21 6H3" strokeLinecap="round"/><path d="M21 12H3" strokeLinecap="round"/><path d="M21 18H3" strokeLinecap="round"/></> },
                      { label: 'Satış Bedeli',  value: '3.750.000 TL', icon: <><line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round"/></> },
                      { label: 'Tapu Durumu',   value: 'Kat İrtifakı', icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round"/></> },
                      { label: 'Teslim Tarihi', value: 'Aralık 2026',  icon: <><rect x="3" y="4" width="18" height="18" rx="2" strokeLinecap="round"/><line x1="16" y1="2" x2="16" y2="6" strokeLinecap="round"/><line x1="8" y1="2" x2="8" y2="6" strokeLinecap="round"/><line x1="3" y1="10" x2="21" y2="10" strokeLinecap="round"/></> },
                    ].map((row, i, arr) => (
                      <div key={row.label} className={`flex items-center gap-3 py-3 ${i < arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">{row.icon}</svg>
                        </div>
                        <p className="text-xs text-gray-400 flex-1">{row.label}</p>
                        <p className="text-sm font-semibold text-[#0A1F44]">{row.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Finansal Bilgiler */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-center gap-2.5 mb-4">
                      <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" strokeLinecap="round"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round"/></svg>
                      </div>
                      <p className="text-sm font-bold text-[#0A1F44]">Finansal Bilgiler</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div><p className="text-xs text-gray-400 mb-1">Toplam Bedel</p><p className="text-base font-bold text-[#0A1F44]">3.750.000 TL</p></div>
                      <div><p className="text-xs text-gray-400 mb-1">Ödenen Tutar</p><p className="text-base font-bold text-[#22C55E]">1.500.000 TL</p></div>
                      <div><p className="text-xs text-gray-400 mb-1">Kalan Tutar</p><p className="text-base font-bold text-[#0A1F44]">2.250.000 TL</p></div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Ödeme Durumu</p>
                        <div className="flex items-center gap-2">
                          <div className="relative w-9 h-9 flex-shrink-0">
                            <svg width="36" height="36" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="14" fill="none" stroke="#F3F4F6" strokeWidth="4"/>
                              <circle cx="18" cy="18" r="14" fill="none" stroke="#22C55E" strokeWidth="4"
                                strokeDasharray={`${40 * 0.879} ${87.9}`} strokeLinecap="round" transform="rotate(-90 18 18)"/>
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-[#0A1F44]">%40</span>
                          </div>
                          <p className="text-xs text-gray-400">tamamlandı</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-between py-3 border-t border-gray-50 text-xs text-gray-400 hover:text-[#0A1F44] transition-colors">
                      Ödeme planı ve geçmişi görüntüle
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>

                </div>

                {/* ROW 3: Daire Özellikleri + Dairenize Ait Belgeler — eşit 2 kolon */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">

                  {/* Daire Özellikleri — sadece icon, shape yok, ince çizgi */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="text-sm font-bold text-[#0A1F44] mb-4">Daire Özellikleri</h3>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-0">
                      {[
                        { label: 'Isıtma',          value: 'Yerden Isıtma',  color: '#F97316', icon: <><path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 12v4" strokeLinecap="round"/></> },
                        { label: 'Klima',            value: 'Altyapı Var',    color: '#3B82F6', icon: <><path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 10 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" strokeLinecap="round" strokeLinejoin="round"/></> },
                        { label: 'Balkon',           value: 'Var',            color: '#10B981', icon: <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round"/></> },
                        { label: 'Otopark',          value: 'Kapalı',         color: '#6366F1', icon: <><rect x="1" y="3" width="15" height="13" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M16 8h4l3 3v5h-7V8z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="5.5" cy="18.5" r="2.5" strokeLinecap="round"/><circle cx="18.5" cy="18.5" r="2.5" strokeLinecap="round"/></> },
                        { label: 'Depo',             value: 'Var',            color: '#8B5CF6', icon: <><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" strokeLinecap="round" strokeLinejoin="round"/></> },
                        { label: 'Banyo',            value: '2 Adet',         color: '#06B6D4', icon: <><path d="M4 12h16a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3a1 1 0 0 1 1-1z" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 12V5a2 2 0 0 1 2-2h3v2.25" strokeLinecap="round" strokeLinejoin="round"/></> },
                        { label: 'Ebeveyn Banyo',   value: 'Var',            color: '#EC4899', icon: <><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/></> },
                        { label: 'Yön',              value: 'Güney - Batı',   color: '#F59E0B', icon: <><circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" strokeLinecap="round" strokeLinejoin="round"/></> },
                      ].map((feat, i, arr) => (
                        <div key={feat.label} className={`flex items-center gap-3 py-3 ${i < arr.length - 2 || (arr.length % 2 === 0 && i < arr.length - 2) ? 'border-b border-gray-50' : ''}`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={feat.color} strokeWidth="1.5">{feat.icon}</svg>
                          <div>
                            <p className="text-xs text-gray-400">{feat.label}</p>
                            <p className="text-xs font-semibold text-[#0A1F44] mt-0.5">{feat.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dairenize Ait Belgeler */}
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <p className="text-sm font-bold text-[#0A1F44] mb-4">Dairenize Ait Belgeler</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['Satış Sözleşmesi', 'Kat Planı', 'Daire Planı', 'Teknik Şartname'].map((title) => (
                        <button key={title} className="flex items-center gap-2.5 p-3 border border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50/30 transition-all text-left">
                          <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round"/></svg>
                          </div>
                          <div className="min-w-0"><p className="text-xs font-semibold text-[#0A1F44] truncate">{title}</p><p className="text-xs text-gray-400">PDF</p></div>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Hızlı İşlemler */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-[#0A1F44] mb-4">Hızlı İşlemler</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: 'Talep / Destek Oluştur', desc: 'Dairenizle ilgili talep oluşturabilirsiniz.',        bg: 'bg-green-50',  iconBg: 'bg-green-100',  stroke: '#16A34A', path: <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/> },
                      { label: 'Bilgileri Güncelle',      desc: 'İletişim ve adres bilgilerinizi güncelleyebilirsiniz.', bg: 'bg-blue-50', iconBg: 'bg-blue-100',   stroke: '#2563EB', path: <><circle cx="12" cy="8" r="4" strokeLinecap="round"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round"/></> },
                      { label: 'Daire Notlarım',          desc: 'Kişisel notlarınızı buradan tutabilirsiniz.',         bg: 'bg-orange-50', iconBg: 'bg-orange-100', stroke: '#EA580C', path: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round"/><line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/></> },
                    ].map((item) => (
                      <button key={item.label} className={`flex items-center gap-3 p-4 ${item.bg} rounded-xl hover:opacity-80 transition-opacity text-left`}>
                        <div className={`w-10 h-10 ${item.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={item.stroke} strokeWidth="2">{item.path}</svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#0A1F44]">{item.label}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                        </div>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" className="flex-shrink-0"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    ))}
                  </div>
                </div>

              </>}

              {/* ══ ÖDEMELER ══════════════════════════════ */}
              {activePage === 'odemeler' && <>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1F44]">Ödemeler</h2>
                  <p className="text-sm text-gray-400 mt-1">Ödeme geçmişinizi ve yaklaşan ödemelerinizi görüntüleyin.</p>
                </div>

                {/* Ödeme Durumu */}
                <div className="bg-[#0A1F44] rounded-2xl px-4 py-3 relative overflow-hidden">
                  <p className="text-white/60 text-[10px] font-semibold uppercase tracking-widest mb-2 relative">Ödeme Durumu</p>
                  <div className="flex gap-5 mb-2.5 relative">
                    <div><p className="text-white/50 text-[10px] mb-0.5">Toplam Borç</p><p className="text-white font-bold text-sm">{formatTL(toplamBorc)}</p></div>
                    <div><p className="text-white/50 text-[10px] mb-0.5">Ödenen</p><p className="text-[#22C55E] font-bold text-sm">{formatTL(odenen)}</p></div>
                    <div><p className="text-white/50 text-[10px] mb-0.5">Kalan Borç</p><p className="text-white font-bold text-sm">{formatTL(kalan)}</p></div>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${paidPercent}%` }} />
                  </div>
                  <p className="text-white/50 text-[10px] text-right">%{paidPercent} ödendi</p>
                </div>

                {/* Son Ödemeler */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm font-bold text-[#0A1F44] mb-4">Son Ödemelerim</p>
                  {odemeler.map((p, i) => (
                    <div key={p.id} className={`flex items-center gap-3 py-3 ${i < odemeler.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-9 h-9 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="flex-1"><p className="text-sm font-semibold text-[#0A1F44]">{formatOdemeTarihi(p.paid_date)}</p><p className="text-xs text-gray-400">{p.source}</p></div>
                      <p className="text-sm font-bold text-[#22C55E]">{formatTL(p.amount)}</p>
                    </div>
                  ))}
                </div>
              </>}

              {/* ══ BELGELER ══════════════════════════════ */}
              {activePage === 'belgeler' && <>
                <div>
                  <h2 className="text-xl font-bold text-[#0A1F44]">Belgeler</h2>
                  <p className="text-sm text-gray-400 mt-1">Dairenize ait tüm belgeler ve teknik çizimler.</p>
                </div>

                {/* Belgeler */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm font-bold text-[#0A1F44] mb-4">Dairenize Ait Belgeler</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {['Satış Sözleşmesi', 'Kat Planı', 'Daire Planı', 'Teknik Şartname', 'Tapu Belgesi', 'İskan Belgesi'].map((title) => (
                      <button key={title} className="flex items-center gap-2.5 p-3 border border-gray-100 rounded-xl hover:border-red-200 hover:bg-red-50/30 transition-all text-left">
                        <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round"/></svg>
                        </div>
                        <div className="min-w-0"><p className="text-xs font-semibold text-[#0A1F44] truncate">{title}</p><p className="text-xs text-gray-400">PDF</p></div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Teknik Çizimler */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <p className="text-sm font-bold text-[#0A1F44] mb-4">Teknik Çizimler</p>
                  {TECHNICAL_DOCS.map((doc, i) => (
                    <div key={doc.id} className={`flex items-center gap-3 py-3 ${i < TECHNICAL_DOCS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round"/></svg>
                      </div>
                      <div className="flex-1 min-w-0"><p className="text-sm font-semibold text-[#0A1F44] truncate">{doc.title}</p><p className="text-xs text-gray-400">PDF · {doc.size}</p></div>
                      <button className="text-gray-300 hover:text-[#0A1F44] transition-colors">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round"/><polyline points="7 10 12 15 17 10" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  ))}
                </div>
              </>}

            </div>{/* ── END CENTER COLUMN ── */}

            {/* ── RIGHT COLUMN — sadece anasayfa için ──── */}
            {activePage === 'anasayfa' && (
              <div className="hidden xl:flex flex-col gap-4 w-96 flex-shrink-0">

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-[#0A1F44]">Son Ödemelerim</p>
                    <button className="text-xs text-gray-400 hover:text-[#0A1F44] flex items-center gap-1">Tümü <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                  </div>
                  {RECENT_PAYMENTS.map((p, i) => (
                    <div key={p.id} className={`flex items-center gap-3 py-3 ${i < RECENT_PAYMENTS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                      <div className="flex-1"><p className="text-xs font-semibold text-[#0A1F44]">{p.date}</p><p className="text-xs text-gray-400">{p.method}</p></div>
                      <p className="text-xs font-bold text-[#22C55E]">{formatTL(p.amount)}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-[#0A1F44]">Teknik Çizimler</p>
                    <button className="text-xs text-gray-400 hover:text-[#0A1F44] flex items-center gap-1">Tümü <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                  </div>
                  {TECHNICAL_DOCS.map((doc, i) => (
                    <div key={doc.id} className={`flex items-center gap-3 py-3 ${i < TECHNICAL_DOCS.length - 1 ? 'border-b border-gray-50' : ''}`}>
                      <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round"/></svg>
                      </div>
                      <div className="flex-1 min-w-0"><p className="text-xs font-semibold text-[#0A1F44] truncate">{doc.title}</p><p className="text-xs text-gray-400">PDF · {doc.size}</p></div>
                      <button className="text-gray-300 hover:text-[#0A1F44] transition-colors">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" strokeLinecap="round"/><polyline points="7 10 12 15 17 10" strokeLinecap="round"/><line x1="12" y1="15" x2="12" y2="3" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-bold text-[#0A1F44]">Proje İlerleme Durumu</p>
                    <button className="text-xs text-gray-400 hover:text-[#0A1F44] flex items-center gap-1">Detaylı <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
                  </div>
                  <div className="flex items-center gap-4">
                    <DonutChart percent={63} />
                    <div className="flex-1 flex flex-col gap-2.5">
                      {[{ label: 'Tamamlanan İşler', value: 63, color: 'bg-[#0A1F44]' }, { label: 'Devam Eden İşler', value: 27, color: 'bg-[#22C55E]' }, { label: 'Planlanan İşler', value: 10, color: 'bg-gray-200' }].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between mb-1"><p className="text-xs text-gray-500">{item.label}</p><p className="text-xs font-bold text-[#0A1F44]">%{item.value}</p></div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} /></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
function IcHome() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IcBuilding() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IcCard({ color = 'currentColor' }: { color?: string }) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round"/></svg> }
function IcDoc({ color = 'currentColor' }: { color?: string }) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round"/><polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round"/><line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round"/><line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round"/></svg> }
function IcFolder({ color = 'currentColor' }: { color?: string }) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IcInfo({ color = 'currentColor' }: { color?: string }) { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="16" x2="12" y2="12" strokeLinecap="round"/><line x1="12" y1="8" x2="12.01" y2="8" strokeLinecap="round"/></svg> }
function IcGrid() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="3" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/><rect x="3" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/><rect x="14" y="14" width="7" height="7" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IcBell() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round"/></svg> }
function IcSettings() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/></svg> }
