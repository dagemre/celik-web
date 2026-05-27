'use client'

import { useState } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────
type Tab = 'hesap' | 'kullanicilar' | 'roller' | 'bildirimler' | 'guvenlik'

interface AdminUser {
  id: string
  name: string
  initials: string
  email: string
  role: string
  status: 'Aktif' | 'Pasif'
  lastLogin: string
  color: string
}

// ── Mock data ────────────────────────────────────────────────────────────────
const ADMIN_USERS: AdminUser[] = [
  { id: '1', name: 'Emre Dağ',     initials: 'ED', email: 'emre.dag@celikinsaat.com',   role: 'Süper Admin',       status: 'Aktif', lastLogin: '27.05.2026 14:32', color: 'bg-primary-800' },
  { id: '2', name: 'Ahmet Yılmaz', initials: 'AY', email: 'ahmet.yilmaz@celikinsaat.com', role: 'Proje Yöneticisi', status: 'Aktif', lastLogin: '27.05.2026 09:15', color: 'bg-info-600' },
  { id: '3', name: 'Mehmet Kaya',  initials: 'MK', email: 'mehmet.kaya@celikinsaat.com',  role: 'Finans Sorumlusu', status: 'Aktif', lastLogin: '26.05.2026 16:45', color: 'bg-warning-600' },
  { id: '4', name: 'Fatma Şahin', initials: 'FS', email: 'fatma.sahin@celikinsaat.com',  role: 'Raporlama Uzmanı', status: 'Pasif', lastLogin: '10.05.2026 11:20', color: 'bg-purple-600' },
]

const ROLES = [
  { name: 'Süper Admin',       desc: 'Tüm modüllere tam erişim sağlar.',                  count: 1, color: 'bg-primary-800' },
  { name: 'Proje Yöneticisi',  desc: 'Projeleri yönetir, malik ve evrak işlemlerini yapar.', count: 1, color: 'bg-info-600' },
  { name: 'Finans Sorumlusu',  desc: 'Ödeme ve tahsilat işlemlerini yönetir.',             count: 1, color: 'bg-warning-600' },
  { name: 'Raporlama Uzmanı',  desc: 'Raporları görüntüler ve dışa aktarır.',              count: 1, color: 'bg-purple-600' },
]

const ROLE_PERMS: Record<string, string[]> = {
  'Süper Admin':       ['Projeler', 'Malikler', 'Ödemeler', 'Evraklar', 'Raporlar', 'Ayarlar', 'Kullanıcılar'],
  'Proje Yöneticisi':  ['Projeler', 'Malikler', 'Evraklar'],
  'Finans Sorumlusu':  ['Ödemeler', 'Raporlar'],
  'Raporlama Uzmanı':  ['Raporlar'],
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-primary-800">{title}</h2>
      <p className="text-sm text-neutral-400 mt-0.5">{subtitle}</p>
    </div>
  )
}

function FieldRow({ label, value }: { label: string; value: string }) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)
  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0">
      <div className="w-32 flex-shrink-0 text-sm text-neutral-400">{label}</div>
      {editing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            className="flex-1 border border-primary-800 rounded-lg px-3 py-1.5 text-sm text-primary-800 outline-none focus:ring-2 focus:ring-primary-800/20"
            value={val}
            onChange={e => setVal(e.target.value)}
            autoFocus
          />
          <button onClick={() => setEditing(false)} className="text-xs text-white bg-primary-800 rounded-lg px-3 py-1.5 font-medium">Kaydet</button>
          <button onClick={() => { setVal(value); setEditing(false) }} className="text-xs text-neutral-500 bg-neutral-100 rounded-lg px-3 py-1.5">İptal</button>
        </div>
      ) : (
        <>
          <div className="flex-1 text-sm font-medium text-primary-800">{val}</div>
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-800 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8"/></svg>
            Düzenle
          </button>
        </>
      )}
    </div>
  )
}

// ── Tabs ────────────────────────────────────────────────────────────────────

function HesapTab() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Sol — Hesap Bilgileri */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Hesap Bilgileri" subtitle="Admin hesap bilgilerinizi güncelleyin." />
        <FieldRow label="Ad Soyad"      value="Emre Dağ" />
        <FieldRow label="Kullanıcı Adı" value="emredag" />
        <FieldRow label="E-posta"       value="emre.dag@celikinsaat.com" />
        <div className="flex items-center gap-4 py-4">
          <div className="w-32 flex-shrink-0 text-sm text-neutral-400">Şifre</div>
          <div className="flex-1 text-sm font-medium text-primary-800">••••••••</div>
          <button className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-800 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Şifre Değiştir
          </button>
        </div>
      </div>

      {/* Sağ — Firma Bilgileri */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Firma Bilgileri" subtitle="Şirket adı ve iletişim bilgilerini düzenleyin." />
        <FieldRow label="Şirket Adı"  value="Çelik Taahhüt İnşaat San. Tic. Ltd. Şti." />
        <FieldRow label="Telefon"     value="+90 212 421 02 88" />
        <FieldRow label="E-posta"     value="snrclk@hotmail.com.tr" />
        <FieldRow label="Adres"       value="Bakırköy / İstanbul" />
      </div>
    </div>
  )
}

function KullanicilarTab() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Tüm Roller')
  const [showAdd, setShowAdd] = useState(false)

  const filtered = ADMIN_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'Tüm Roller' || u.role === roleFilter
    return matchSearch && matchRole
  })

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Sol — Kullanıcı Listesi */}
      <div className="xl:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-primary-800">Admin Listesi</h2>
            <p className="text-sm text-neutral-400 mt-0.5">Sistemdeki admin kullanıcılarını yönetin.</p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-primary-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            Yeni Ekle
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#888780" strokeWidth="1.8"/><path d="M21 21l-4.35-4.35" stroke="#888780" strokeWidth="1.8" strokeLinecap="round"/></svg>
            <input
              className="w-full pl-9 pr-3 py-2 border border-neutral-200 rounded-xl text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all"
              placeholder="Kullanıcı ara..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="border border-neutral-200 rounded-xl px-3 py-2 text-sm text-neutral-600 outline-none focus:border-primary-800 bg-white cursor-pointer"
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
          >
            <option>Tüm Roller</option>
            {ROLES.map(r => <option key={r.name}>{r.name}</option>)}
          </select>
        </div>

        {/* Table — desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-400 border-b border-neutral-100">
                <th className="pb-3 font-medium">Kullanıcı</th>
                <th className="pb-3 font-medium">Rol</th>
                <th className="pb-3 font-medium">Durum</th>
                <th className="pb-3 font-medium">Son Giriş</th>
                <th className="pb-3 font-medium w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-neutral-50 hover:bg-neutral-50 transition-colors">
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 ${u.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <span className="text-white text-xs font-bold">{u.initials}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-primary-800 leading-tight">{u.name}</p>
                        <p className="text-[11px] text-neutral-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.status === 'Aktif' ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-neutral-500">{u.lastLogin}</td>
                  <td className="py-3.5">
                    <div className="flex gap-1">
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-primary-800">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8"/></svg>
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-danger-600">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-neutral-400 mt-4">Toplam {filtered.length} kayıt</p>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {filtered.map(u => (
            <div key={u.id} className="flex items-center gap-3 p-3 border border-neutral-100 rounded-xl">
              <div className={`w-10 h-10 ${u.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <span className="text-white text-xs font-bold">{u.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-primary-800 truncate">{u.name}</p>
                <p className="text-[11px] text-neutral-400 truncate">{u.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <RoleBadge role={u.role} />
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${u.status === 'Aktif' ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>{u.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sağ — Yeni Admin Ekle */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Yeni Admin Ekle" subtitle="Sisteme yeni admin kullanıcısı ekleyin ve rol atayın." />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Ad Soyad</label>
              <input className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all" placeholder="Örn: Ahmet Yılmaz" />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">E-posta</label>
              <input className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all" placeholder="örn@celikinsaat.com" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Kullanıcı Adı</label>
              <input className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all" placeholder="örnahmetyilmaz" />
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1 block">Şifre</label>
              <input type="password" className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all" placeholder="••••••••" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-neutral-500 mb-1 block">Rol</label>
            <select className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-800 bg-white cursor-pointer">
              <option value="">Rol seçin</option>
              {ROLES.map(r => <option key={r.name}>{r.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="flex-1 bg-neutral-100 text-neutral-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-neutral-200 transition-colors">İptal</button>
            <button className="flex-1 bg-primary-800 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-700 transition-colors">Kaydet</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    'Süper Admin':       'bg-primary-50 text-primary-800',
    'Proje Yöneticisi':  'bg-info-50 text-info-700',
    'Finans Sorumlusu':  'bg-warning-50 text-warning-700',
    'Raporlama Uzmanı':  'bg-purple-50 text-purple-700',
  }
  return (
    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles[role] ?? 'bg-neutral-100 text-neutral-600'}`}>
      {role}
    </span>
  )
}

function RollerTab() {
  const [selected, setSelected] = useState('Süper Admin')
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Sol — Rol Listesi */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Rol Bilgileri" subtitle="Rollerin yetki kapsamları." />
        <div className="space-y-3">
          {ROLES.map(r => (
            <button
              key={r.name}
              onClick={() => setSelected(r.name)}
              className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition-all ${selected === r.name ? 'border-primary-800 bg-primary-50' : 'border-neutral-100 hover:border-neutral-200 bg-white'}`}
            >
              <div className={`w-9 h-9 ${r.color} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
              <div>
                <p className="font-semibold text-sm text-primary-800">{r.name}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{r.desc}</p>
                <p className="text-[11px] text-neutral-400 mt-1">{r.count} Kullanıcı</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Sağ — Seçilen Rolün Yetkileri */}
      <div className="xl:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary-800">{selected} — Yetki Yönetimi</h2>
            <p className="text-sm text-neutral-400 mt-0.5">Bu rolün erişebileceği modülleri düzenleyin.</p>
          </div>
          <button className="flex items-center gap-1.5 bg-primary-800 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/><path d="M17 21v-8H7v8M7 3v5h8" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Kaydet
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {['Projeler', 'Malikler', 'Ödemeler', 'Evraklar', 'Raporlar', 'Ayarlar', 'Kullanıcılar'].map(mod => {
            const hasAccess = ROLE_PERMS[selected]?.includes(mod)
            return (
              <div key={mod} className={`flex items-center justify-between p-4 rounded-xl border ${hasAccess ? 'border-success-100 bg-success-50' : 'border-neutral-100 bg-neutral-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasAccess ? 'bg-success-100' : 'bg-neutral-200'}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke={hasAccess ? '#0F6E56' : '#888780'} strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke={hasAccess ? '#0F6E56' : '#888780'} strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke={hasAccess ? '#0F6E56' : '#888780'} strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke={hasAccess ? '#0F6E56' : '#888780'} strokeWidth="1.8"/></svg>
                  </div>
                  <span className={`text-sm font-semibold ${hasAccess ? 'text-success-700' : 'text-neutral-400'}`}>{mod}</span>
                </div>
                <Toggle defaultChecked={!!hasAccess} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function Toggle({ defaultChecked }: { defaultChecked: boolean }) {
  const [on, setOn] = useState(defaultChecked)
  return (
    <button
      onClick={() => setOn(v => !v)}
      className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-success-500' : 'bg-neutral-200'}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${on ? 'left-5' : 'left-1'}`} />
    </button>
  )
}

function BildirimlerTab() {
  const channels = [
    { key: 'sms',   label: 'SMS Bildirimi',   desc: 'Maliklerinize SMS ile bildirim gönderin.',     icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#0A1F44" strokeWidth="1.8" strokeLinejoin="round"/></svg> },
    { key: 'email', label: 'E-posta Bildirimi', desc: 'Maliklerinize e-posta ile bildirim gönderin.', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#0A1F44" strokeWidth="1.8"/><polyline points="22,6 12,13 2,6" stroke="#0A1F44" strokeWidth="1.8"/></svg> },
    { key: 'push',  label: 'Uygulama İçi Bildirim', desc: 'Malikler uygulamayı açtığında gösterilir.',   icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#0A1F44" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  ]

  const events = [
    { label: 'Ödeme Hatırlatıcısı',   desc: 'Vade tarihi yaklaşan malikler uyarılsın.' },
    { label: 'Ödeme Onayı',           desc: 'Tahsilat gerçekleştiğinde malik bilgilendirilsin.' },
    { label: 'Yeni Evrak',            desc: 'Yeni evrak yüklendiğinde bildirim gönderilsin.' },
    { label: 'Yeni Duyuru',           desc: 'Duyuru yayınlandığında bildirim gönderilsin.' },
    { label: 'Proje Güncelleme',      desc: 'Proje durumu değiştiğinde malik bilgilendirilsin.' },
    { label: 'Vadesi Geçen Ödeme',    desc: 'Vadesi geçen ödemeler için otomatik uyarı.' },
  ]

  return (
    <div className="space-y-6">
      {/* Gönderim Kanalları */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Gönderim Kanalları" subtitle="Maliklerinize hangi kanallardan bildirim gönderileceğini seçin." />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {channels.map(ch => (
            <div key={ch.key} className="border border-neutral-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                  {ch.icon}
                </div>
                <Toggle defaultChecked={ch.key !== 'push'} />
              </div>
              <p className="font-semibold text-sm text-primary-800 mb-0.5">{ch.label}</p>
              <p className="text-[11px] text-neutral-400 leading-relaxed">{ch.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Manuel Bildirim Gönder */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Manuel Bildirim Gönder" subtitle="Seçili maliklerinize özel mesaj gönderin." />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Alıcılar</label>
              <select className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-800 bg-white cursor-pointer">
                <option>Tüm Malikler</option>
                <option>Vadesi Geçen Malikler</option>
                <option>Aktif Proje Malikleri</option>
                <option>Belirli Proje Malikleri...</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Kanal</label>
              <div className="flex gap-2">
                {['SMS', 'E-posta', 'Uygulama İçi'].map(c => (
                  <button key={c} className="flex-1 text-xs font-semibold py-2 rounded-xl border border-primary-800 bg-primary-50 text-primary-800 hover:bg-primary-800 hover:text-white transition-colors">
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Mesaj</label>
              <textarea
                rows={4}
                className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all resize-none"
                placeholder="Maliklerinize göndermek istediğiniz mesajı yazın..."
              />
              <p className="text-[11px] text-neutral-400 mt-1">SMS için maksimum 160 karakter önerilir.</p>
            </div>
            <button className="w-full bg-primary-800 text-white text-sm font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" opacity="0.3" stroke="white" strokeWidth="1.2"/></svg>
              Gönder
            </button>
          </div>

          {/* Önizleme */}
          <div className="bg-neutral-50 rounded-xl p-5">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide mb-4">SMS Önizleme</p>
            <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center">
                  <span className="text-white text-[10px] font-bold">ÇEL</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-primary-800">Çelik İnşaat</p>
                  <p className="text-[10px] text-neutral-400">Şimdi</p>
                </div>
              </div>
              <p className="text-xs text-neutral-600 leading-relaxed">Sayın Malik, ödemenizin vadesi 3 gün içinde dolmaktadır. Bilgi için: +90 212 421 02 88</p>
            </div>
            <p className="text-[11px] text-neutral-400 mt-3 text-center">Gerçek mesajınız buraya yansıyacak.</p>
          </div>
        </div>
      </div>

      {/* Otomatik Bildirim Tetikleyicileri */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Otomatik Bildirimler" subtitle="Hangi olayların otomatik bildirim tetikleyeceğini ayarlayın." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {events.map(ev => (
            <div key={ev.label} className="flex items-center justify-between p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
              <div>
                <p className="text-sm font-semibold text-primary-800">{ev.label}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">{ev.desc}</p>
              </div>
              <Toggle defaultChecked={ev.label !== 'Proje Güncelleme'} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GuvenlikTab() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Şifre Değiştir */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Şifre Değiştir" subtitle="Hesabınızın güvenliği için düzenli olarak şifrenizi güncelleyin." />
        <div className="space-y-4">
          {['Mevcut Şifre', 'Yeni Şifre', 'Yeni Şifre (Tekrar)'].map(label => (
            <div key={label}>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">{label}</label>
              <input type="password" className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all" placeholder="••••••••" />
            </div>
          ))}
          <div className="bg-warning-50 border border-warning-100 rounded-xl p-3">
            <p className="text-xs text-warning-700 font-medium">Güçlü şifre için en az 8 karakter, büyük/küçük harf ve rakam kullanın.</p>
          </div>
          <button className="w-full bg-primary-800 text-white text-sm font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors">Şifreyi Güncelle</button>
        </div>
      </div>

      {/* Oturum Yönetimi */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Aktif Oturumlar" subtitle="Sisteme bağlı cihazlarınızı yönetin." />
        <div className="space-y-3">
          {[
            { device: 'MacBook Pro — Safari',    ip: '85.105.22.14',   time: 'Şu an aktif',    current: true },
            { device: 'iPhone 15 Pro — Chrome',  ip: '85.105.22.14',   time: '2 saat önce',    current: false },
            { device: 'Windows PC — Chrome',     ip: '212.58.91.3',    time: '3 gün önce',     current: false },
          ].map(s => (
            <div key={s.device} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.current ? 'border-success-200 bg-success-50' : 'border-neutral-100'}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.current ? 'bg-success-100' : 'bg-neutral-100'}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke={s.current ? '#0F6E56' : '#888780'} strokeWidth="1.8"/><path d="M8 21h8M12 17v4" stroke={s.current ? '#0F6E56' : '#888780'} strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate ${s.current ? 'text-success-700' : 'text-primary-800'}`}>{s.device}</p>
                <p className="text-[11px] text-neutral-400">{s.ip} · {s.time}</p>
              </div>
              {s.current
                ? <span className="text-[10px] font-bold bg-success-100 text-success-700 px-2 py-0.5 rounded-full flex-shrink-0">Aktif</span>
                : <button className="text-[11px] text-danger-600 font-semibold hover:underline flex-shrink-0">Kapat</button>
              }
            </div>
          ))}
        </div>
        <button className="w-full mt-4 border border-danger-200 text-danger-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-danger-50 transition-colors">
          Diğer Tüm Oturumları Kapat
        </button>
      </div>

      {/* Güvenlik Ayarları */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 xl:col-span-2">
        <SectionTitle title="Güvenlik Ayarları" subtitle="Hesap güvenliğinizi artırmak için aşağıdaki seçenekleri etkinleştirin." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { label: 'İki Faktörlü Doğrulama (2FA)', desc: 'Giriş yaparken SMS kodu istenir.', on: false },
            { label: 'Oturum Zaman Aşımı',           desc: '30 dakika işlem yapılmazsa çıkış yapılır.', on: true },
            { label: 'Şüpheli Giriş Bildirimi',      desc: 'Tanımadık cihazdan giriş yapılınca uyarı.', on: true },
            { label: 'IP Kısıtlaması',                desc: 'Sadece izinli IP adreslerinden giriş.', on: false },
            { label: 'Güçlü Şifre Zorunluluğu',     desc: 'Tüm kullanıcılar güçlü şifre kullanmak zorunda.', on: true },
            { label: 'Giriş Günlüğü',                desc: 'Tüm giriş denemeleri kaydedilir.', on: true },
          ].map(item => (
            <div key={item.label} className="flex items-start justify-between p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors">
              <div className="flex-1 pr-3">
                <p className="text-sm font-semibold text-primary-800">{item.label}</p>
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
              <Toggle defaultChecked={item.on} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string }[] = [
  { key: 'hesap',        label: 'Hesap Ayarları' },
  { key: 'kullanicilar', label: 'Kullanıcılar' },
  { key: 'roller',       label: 'Roller ve Yetkiler' },
  { key: 'bildirimler',  label: 'Bildirim Ayarları' },
  { key: 'guvenlik',     label: 'Güvenlik' },
]

export default function AyarlarPage() {
  const [tab, setTab] = useState<Tab>('hesap')

  return (
    <div className="flex-1 overflow-auto">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 bg-white border-b border-neutral-100">
        <h1 className="font-bold text-2xl text-primary-800">Ayarlar</h1>
        <p className="text-sm text-neutral-400 mt-0.5">Sistem ve hesap ayarlarını buradan yönetebilirsiniz.</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-neutral-100 px-6 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`relative py-3.5 px-4 text-sm font-semibold whitespace-nowrap transition-colors ${
                tab === t.key
                  ? 'text-primary-800'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              {t.label}
              {tab === t.key && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-800 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pb-24 md:pb-6">
        {tab === 'hesap'        && <HesapTab />}
        {tab === 'kullanicilar' && <KullanicilarTab />}
        {tab === 'roller'       && <RollerTab />}
        {tab === 'bildirimler'  && <BildirimlerTab />}
        {tab === 'guvenlik'     && <GuvenlikTab />}
      </div>
    </div>
  )
}
