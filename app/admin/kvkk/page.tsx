'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type KvkkLog = {
  id: string
  owner_id: string | null
  email: string | null
  onay: boolean
  ip_adresi: string | null
  user_agent: string | null
  created_at: string
}

function formatTarih(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function CihazBadge({ ua }: { ua: string | null }) {
  if (!ua) return <span className="text-neutral-300">—</span>
  const mobil = /iPhone|Android|Mobile/i.test(ua)
  const tablet = /iPad|Tablet/i.test(ua)
  const label = tablet ? 'Tablet' : mobil ? 'Mobil' : 'Masaüstü'
  const style = tablet
    ? 'bg-warning-50 text-warning-700'
    : mobil
    ? 'bg-info-50 text-info-700'
    : 'bg-neutral-100 text-neutral-600'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-medium ${style}`}>
      {label}
    </span>
  )
}

export default function AdminKvkkPage() {
  const [kayitlar, setKayitlar] = useState<KvkkLog[]>([])
  const [yukleniyor, setYukleniyor] = useState(true)
  const [hata, setHata] = useState('')
  const [arama, setArama] = useState('')

  useEffect(() => {
    async function getir() {
      setYukleniyor(true)
      const { data, error } = await supabase
        .from('kvkk_log')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        setHata('Kayıtlar yüklenemedi: ' + error.message)
      } else {
        setKayitlar(data ?? [])
      }
      setYukleniyor(false)
    }
    getir()
  }, [])

  const filtered = kayitlar.filter((k) => {
    const q = arama.toLowerCase()
    return (
      !q ||
      k.email?.toLowerCase().includes(q) ||
      k.ip_adresi?.includes(q) ||
      k.owner_id?.includes(q)
    )
  })

  const toplamOnay = kayitlar.filter((k) => k.onay).length

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">

      {/* Başlık */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-primary-50 rounded-xl flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#0A1F44" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
          </div>
          <h1 className="font-bold text-2xl text-primary-800">KVKK İzin Listesi</h1>
        </div>
        <p className="text-sm text-neutral-500 ml-12">
          Malik paneline giriş yapan kullanıcıların KVKK onay kayıtları. Yasal ispat için saklanmaktadır.
        </p>
      </div>

      {/* Özet kartlar */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-neutral-100 rounded-2xl p-4">
          <p className="text-xs text-neutral-400 mb-1">Toplam Onay</p>
          <p className="font-bold text-2xl text-success-700">{toplamOnay}</p>
        </div>
        <div className="bg-white border border-neutral-100 rounded-2xl p-4">
          <p className="text-xs text-neutral-400 mb-1">Toplam Kayıt</p>
          <p className="font-bold text-2xl text-primary-800">{kayitlar.length}</p>
        </div>
        <div className="bg-white border border-neutral-100 rounded-2xl p-4 col-span-2 md:col-span-1">
          <p className="text-xs text-neutral-400 mb-1">Son Onay</p>
          <p className="font-bold text-sm text-primary-800">
            {kayitlar.length > 0 ? formatTarih(kayitlar[0].created_at) : '—'}
          </p>
        </div>
      </div>

      {/* Uyarı kutusu */}
      <div className="flex gap-3 bg-warning-50 border border-warning-200 rounded-2xl px-4 py-3 mb-5">
        <svg className="flex-shrink-0 mt-0.5" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#92400e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-xs text-warning-800 leading-relaxed">
          Bu kayıtlar <strong>KVKK Kurumu denetimine</strong> karşı ispat belgesidir. Silmeyin veya değiştirmeyin.
          Her satır; onay tarihi, saati ve IP adresini içermektedir.
        </p>
      </div>

      {/* Arama */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#B0ADA6" strokeWidth="1.8"/>
          <path d="M21 21l-4.35-4.35" stroke="#B0ADA6" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
        <input
          value={arama}
          onChange={e => setArama(e.target.value)}
          placeholder="E-posta veya IP adresine göre ara..."
          className="w-full bg-white border border-neutral-100 rounded-xl pl-10 pr-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
        />
      </div>

      {/* Tablo */}
      {yukleniyor ? (
        <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center">
          <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-800 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-400">Kayıtlar yükleniyor...</p>
        </div>
      ) : hata ? (
        <div className="bg-danger-50 border border-danger-200 rounded-2xl p-5 text-sm text-danger-700">{hata}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center">
          <p className="text-sm text-neutral-400">
            {arama ? 'Arama sonucu bulunamadı.' : 'Henüz KVKK onay kaydı yok.'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">

          {/* Başlıklar — masaüstü */}
          <div className="hidden md:grid grid-cols-[1fr_160px_140px_100px_80px] gap-4 px-5 py-3 bg-neutral-50 border-b border-neutral-100">
            {['E-posta', 'Tarih / Saat', 'IP Adresi', 'Cihaz', 'Durum'].map(h => (
              <p key={h} className="text-xs font-semibold text-neutral-400">{h}</p>
            ))}
          </div>

          {/* Satırlar */}
          {filtered.map((k, idx) => (
            <div
              key={k.id}
              className={`${idx < filtered.length - 1 ? 'border-b border-neutral-100' : ''}`}
            >
              {/* Masaüstü satır */}
              <div className="hidden md:grid grid-cols-[1fr_160px_140px_100px_80px] gap-4 px-5 py-4 items-center hover:bg-neutral-50 transition-colors">
                <div>
                  <p className="font-medium text-sm text-primary-800">{k.email ?? '—'}</p>
                  {k.owner_id && (
                    <p className="text-xs text-neutral-400 mt-0.5 font-mono">{k.owner_id.slice(0, 8)}…</p>
                  )}
                </div>
                <p className="text-sm text-neutral-600">{formatTarih(k.created_at)}</p>
                <p className="text-sm font-mono text-neutral-600">{k.ip_adresi ?? '—'}</p>
                <CihazBadge ua={k.user_agent} />
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${k.onay ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
                  {k.onay ? 'Onaylandı' : 'Reddedildi'}
                </span>
              </div>

              {/* Mobil kart */}
              <div className="md:hidden px-4 py-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-semibold text-sm text-primary-800">{k.email ?? '—'}</p>
                  <span className={`ml-2 flex-shrink-0 px-2 py-0.5 rounded-lg text-xs font-bold ${k.onay ? 'bg-success-50 text-success-700' : 'bg-danger-50 text-danger-700'}`}>
                    {k.onay ? 'Onaylandı' : 'Reddedildi'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
                  <span>{formatTarih(k.created_at)}</span>
                  <span className="font-mono">{k.ip_adresi ?? '—'}</span>
                  <CihazBadge ua={k.user_agent} />
                </div>
              </div>
            </div>
          ))}

          {/* Alt bar */}
          <div className="px-5 py-3 bg-neutral-50 border-t border-neutral-100">
            <p className="text-xs text-neutral-400">Toplam {filtered.length} kayıt</p>
          </div>
        </div>
      )}
    </div>
  )
}
