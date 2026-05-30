'use client'

import { useState, useRef, useEffect } from 'react'
import { getFirmaConfig, saveFirmaConfig, FirmaConfig, DEFAULT_FIRMA } from '@/lib/firma-config'
import { getOdemeConfig, saveOdemeConfig, OdemeConfig, OdemeBank } from '@/lib/odeme-config'

// ── Types ─────────────────────────────────────────────────────────────────────
type Tab = 'hesap' | 'kullanicilar' | 'roller' | 'bildirimler' | 'odeme'

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

// ── Mock data ─────────────────────────────────────────────────────────────────
const ADMIN_USERS: AdminUser[] = [
  { id: '1', name: 'Emre Dağ',     initials: 'ED', email: 'emre.dag@celikinsaat.com',     role: 'Süper Admin',       status: 'Aktif', lastLogin: '27.05.2026 14:32', color: 'bg-primary-800' },
  { id: '2', name: 'Ahmet Yılmaz', initials: 'AY', email: 'ahmet.yilmaz@celikinsaat.com', role: 'Proje Yöneticisi',  status: 'Aktif', lastLogin: '27.05.2026 09:15', color: 'bg-info-600' },
  { id: '3', name: 'Mehmet Kaya',  initials: 'MK', email: 'mehmet.kaya@celikinsaat.com',  role: 'Finans Sorumlusu',  status: 'Aktif', lastLogin: '26.05.2026 16:45', color: 'bg-warning-600' },
  { id: '4', name: 'Fatma Şahin',  initials: 'FS', email: 'fatma.sahin@celikinsaat.com',  role: 'Raporlama Uzmanı', status: 'Pasif', lastLogin: '10.05.2026 11:20', color: 'bg-purple-600' },
]

const INIT_ROLES = [
  { name: 'Süper Admin',       desc: 'Tüm modüllere tam erişim sağlar.',                     count: 1, color: 'bg-primary-800' },
  { name: 'Proje Yöneticisi',  desc: 'Projeleri yönetir, malik ve evrak işlemlerini yapar.', count: 1, color: 'bg-info-600' },
  { name: 'Finans Sorumlusu',  desc: 'Ödeme ve tahsilat işlemlerini yönetir.',                count: 1, color: 'bg-warning-600' },
  { name: 'Raporlama Uzmanı',  desc: 'Raporları görüntüler ve dışa aktarır.',                 count: 1, color: 'bg-purple-600' },
]

const ROLE_PERMS: Record<string, string[]> = {
  'Süper Admin':       ['Projeler', 'Malikler', 'Ödemeler', 'Evraklar', 'Raporlar', 'Ayarlar', 'Kullanıcılar'],
  'Proje Yöneticisi':  ['Projeler', 'Malikler', 'Evraklar'],
  'Finans Sorumlusu':  ['Ödemeler', 'Raporlar'],
  'Raporlama Uzmanı':  ['Raporlar'],
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-primary-800">{title}</h2>
      <p className="text-sm text-neutral-400 mt-0.5">{subtitle}</p>
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

// ── Editable Field Row ─────────────────────────────────────────────────────────
function FieldRow({
  label, value, locked = false, lockedNote,
  onChange
}: {
  label: string
  value: string
  locked?: boolean
  lockedNote?: string
  onChange?: (v: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [val, setVal] = useState(value)

  useEffect(() => { setVal(value) }, [value])

  if (locked) {
    return (
      <div className="flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0">
        <div className="w-36 flex-shrink-0 text-sm text-neutral-400">{label}</div>
        <div className="flex-1 text-sm font-medium text-primary-800">{value}</div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          {lockedNote ?? 'Değiştirilemez'}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-4 py-4 border-b border-neutral-100 last:border-0">
      <div className="w-36 flex-shrink-0 text-sm text-neutral-400">{label}</div>
      {editing ? (
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          <input
            className="flex-1 min-w-0 border border-primary-800 rounded-lg px-3 py-1.5 text-sm text-primary-800 outline-none focus:ring-2 focus:ring-primary-800/20"
            value={val}
            onChange={e => setVal(e.target.value)}
            autoFocus
          />
          <button
            onClick={() => { setEditing(false); onChange?.(val) }}
            className="text-xs text-white bg-primary-800 rounded-lg px-3 py-1.5 font-medium whitespace-nowrap"
          >
            Kaydet
          </button>
          <button
            onClick={() => { setVal(value); setEditing(false) }}
            className="text-xs text-neutral-500 bg-neutral-100 rounded-lg px-3 py-1.5"
          >
            İptal
          </button>
        </div>
      ) : (
        <>
          <div className="flex-1 text-sm font-medium text-primary-800 truncate">{val}</div>
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-800 transition-colors flex-shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8"/></svg>
            Düzenle
          </button>
        </>
      )}
    </div>
  )
}

// ── Hesap Tab ──────────────────────────────────────────────────────────────────
function HesapTab() {
  const [firma, setFirma] = useState<FirmaConfig>(() => {
    if (typeof window !== 'undefined') return getFirmaConfig()
    return DEFAULT_FIRMA
  })

  useEffect(() => { setFirma(getFirmaConfig()) }, [])

  function update(key: keyof FirmaConfig, val: string) {
    const next = { ...firma, [key]: val }
    setFirma(next)
    saveFirmaConfig(next)
  }

  const [showPasswordForm, setShowPasswordForm] = useState(false)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

      {/* Sol — Hesap Bilgileri */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Hesap Bilgileri" subtitle="Admin hesap bilgilerinizi güncelleyin." />
        <FieldRow label="Ad Soyad"       value="Emre Dağ" onChange={() => {}} />
        <FieldRow label="Kullanıcı Adı"  value="emredag" onChange={() => {}} />
        {/* Kilitli e-posta */}
        <FieldRow
          label="E-posta"
          value="dagemre@gmail.com"
          locked
          lockedNote="Yönetici e-postası"
        />
        {/* Şifre değiştir */}
        <div className="flex items-center gap-4 py-4 border-b border-neutral-100">
          <div className="w-36 flex-shrink-0 text-sm text-neutral-400">Şifre</div>
          <div className="flex-1 text-sm font-medium text-primary-800">••••••••</div>
          <button
            onClick={() => setShowPasswordForm(v => !v)}
            className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-800 transition-colors flex-shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            Şifre Değiştir
          </button>
        </div>

        {showPasswordForm && (
          <div className="mt-4 space-y-3 bg-neutral-50 rounded-xl p-4">
            {['Mevcut Şifre', 'Yeni Şifre', 'Yeni Şifre (Tekrar)'].map(lbl => (
              <div key={lbl}>
                <label className="text-xs font-medium text-neutral-500 mb-1 block">{lbl}</label>
                <input type="password" className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all" placeholder="••••••••" />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setShowPasswordForm(false)} className="flex-1 bg-neutral-200 text-neutral-600 text-sm font-semibold py-2 rounded-xl">İptal</button>
              <button className="flex-1 bg-primary-800 text-white text-sm font-semibold py-2 rounded-xl">Güncelle</button>
            </div>
          </div>
        )}
      </div>

      {/* Sağ — Firma Bilgileri (localStorage'a kaydedilir, footer+iletişim senkronize) */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-primary-800">Firma Bilgileri</h2>
            <p className="text-sm text-neutral-400 mt-0.5">İletişim ve footer bilgileri otomatik güncellenir.</p>
          </div>
          <span className="text-[10px] font-semibold bg-success-50 text-success-700 px-2 py-1 rounded-full flex-shrink-0">Senkronize</span>
        </div>
        <FieldRow label="Şirket Adı"     value={firma.sirketAdi}     onChange={v => update('sirketAdi', v)} />
        <FieldRow label="Sabit Telefon"  value={firma.telefon}       onChange={v => update('telefon', v)} />
        <FieldRow label="Cep Telefonu"   value={firma.cepTelefonu}   onChange={v => update('cepTelefonu', v)} />
        <FieldRow label="E-posta"        value={firma.eposta}        onChange={v => update('eposta', v)} />
        <FieldRow label="Adres"          value={firma.adres}         onChange={v => update('adres', v)} />
      </div>
    </div>
  )
}

// ── Renk → rol eşlemesi ───────────────────────────────────────────────────────
const ROLE_COLOR: Record<string, string> = {
  'Süper Admin':       'bg-primary-800',
  'Proje Yöneticisi':  'bg-info-600',
  'Finans Sorumlusu':  'bg-warning-600',
  'Raporlama Uzmanı':  'bg-purple-600',
}

function makeInitials(name: string) {
  return name.trim().split(' ').map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')
}

// ── Kullanıcılar Tab ───────────────────────────────────────────────────────────
function KullanicilarTab() {
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('Tüm Roller')
  const [showAdd, setShowAdd] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const addFormRef = useRef<HTMLDivElement>(null)
  const [roles] = useState(INIT_ROLES)

  function handleDelete(id: string) {
    const user = users.find(u => u.id === id)
    setUsers(prev => prev.filter(u => u.id !== id))
    setDeleteConfirmId(null)
    setSuccessMsg(`${user?.name} silindi.`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'Tüm Roller' || u.role === roleFilter
    return matchSearch && matchRole
  })

  function handleYeniEkle() {
    setShowAdd(true)
    setTimeout(() => {
      addFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function handleAdd(data: { name: string; email: string; username: string; role: string }) {
    const newUser: AdminUser = {
      id: String(Date.now()),
      name: data.name,
      initials: makeInitials(data.name),
      email: data.email,
      role: data.role,
      status: 'Aktif',
      lastLogin: 'Henüz giriş yapılmadı',
      color: ROLE_COLOR[data.role] ?? 'bg-neutral-500',
    }
    setUsers(prev => [...prev, newUser])
    setShowAdd(false)
    setSuccessMsg(`${data.name} başarıyla eklendi.`)
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* Sol — Liste */}
      <div className="xl:col-span-2 bg-white rounded-2xl border border-neutral-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-primary-800">Admin Listesi</h2>
            <p className="text-sm text-neutral-400 mt-0.5">Sistemdeki admin kullanıcılarını yönetin.</p>
          </div>
          <button
            onClick={handleYeniEkle}
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
            {roles.map(r => <option key={r.name}>{r.name}</option>)}
          </select>
        </div>

        {/* Tablo — desktop */}
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
                  <td className="py-3.5"><RoleBadge role={u.role} /></td>
                  <td className="py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.status === 'Aktif' ? 'bg-success-50 text-success-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-neutral-500">{u.lastLogin}</td>
                  <td className="py-3.5">
                    {deleteConfirmId === u.id ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] text-danger-600 font-medium whitespace-nowrap">Silinsin mi?</span>
                        <button
                          onClick={() => handleDelete(u.id)}
                          className="text-[11px] font-bold text-white bg-danger-600 rounded-lg px-2 py-1 hover:bg-danger-700"
                        >
                          Evet
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="text-[11px] font-bold text-neutral-600 bg-neutral-100 rounded-lg px-2 py-1"
                        >
                          Hayır
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-1">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-primary-800">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8"/></svg>
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(u.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-danger-600"
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M10 11v6M14 11v6M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {successMsg && (
          <div className="flex items-center gap-2 mt-4 px-3 py-2.5 bg-success-50 border border-success-100 rounded-xl text-sm text-success-700 font-medium">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round"/><polyline points="22 4 12 14.01 9 11.01" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round"/></svg>
            {successMsg}
          </div>
        )}
        <p className="text-xs text-neutral-400 mt-4">Toplam {filtered.length} kayıt</p>
        </div>

        {/* Mobil kartlar */}
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

        {/* Mobil: Yeni Ekle formu liste altına açılır */}
        {showAdd && (
          <div ref={addFormRef} className="md:hidden mt-5 border-t border-neutral-100 pt-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary-800">Yeni Admin Ekle</h3>
              <button onClick={() => setShowAdd(false)} className="text-neutral-400 hover:text-neutral-600">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
            <AddUserForm roles={roles} onCancel={() => setShowAdd(false)} onAdd={handleAdd} />
          </div>
        )}
      </div>

      {/* Desktop: Sağ sütun — Yeni Admin Ekle */}
      <div className="hidden md:block bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Yeni Admin Ekle" subtitle="Sisteme yeni admin kullanıcısı ekleyin ve rol atayın." />
        <AddUserForm roles={roles} onCancel={() => {}} onAdd={handleAdd} />
      </div>
    </div>
  )
}

function AddUserForm({
  roles,
  onCancel,
  onAdd,
}: {
  roles: typeof INIT_ROLES
  onCancel: () => void
  onAdd: (data: { name: string; email: string; username: string; role: string }) => void
}) {
  const [form, setForm] = useState({ name: '', email: '', username: '', password: '', role: '' })
  const [errors, setErrors] = useState<Partial<typeof form>>({})

  const set = (k: keyof typeof form, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  function validate() {
    const errs: Partial<typeof form> = {}
    if (!form.name.trim())     errs.name     = 'Ad Soyad zorunlu'
    if (!form.email.trim())    errs.email    = 'E-posta zorunlu'
    if (!form.username.trim()) errs.username = 'Kullanıcı adı zorunlu'
    if (!form.password.trim()) errs.password = 'Şifre zorunlu'
    if (!form.role)            errs.role     = 'Rol seçiniz'
    return errs
  }

  function handleSave() {
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onAdd({ name: form.name.trim(), email: form.email.trim(), username: form.username.trim(), role: form.role })
    setForm({ name: '', email: '', username: '', password: '', role: '' })
    setErrors({})
  }

  const inp = 'w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 transition-all'
  const ok  = 'border-neutral-200 focus:border-primary-800 focus:ring-primary-800/10'
  const err = 'border-danger-400 focus:border-danger-500 focus:ring-danger-100'

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-neutral-500 mb-1 block">Ad Soyad</label>
          <input
            className={`${inp} ${errors.name ? err : ok}`}
            placeholder="Örn: Ahmet Yılmaz"
            value={form.name}
            onChange={e => set('name', e.target.value)}
          />
          {errors.name && <p className="text-[11px] text-danger-600 mt-0.5">{errors.name}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500 mb-1 block">E-posta</label>
          <input
            className={`${inp} ${errors.email ? err : ok}`}
            placeholder="örn@celikinsaat.com"
            value={form.email}
            onChange={e => set('email', e.target.value)}
          />
          {errors.email && <p className="text-[11px] text-danger-600 mt-0.5">{errors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-neutral-500 mb-1 block">Kullanıcı Adı</label>
          <input
            className={`${inp} ${errors.username ? err : ok}`}
            placeholder="örnahmetyilmaz"
            value={form.username}
            onChange={e => set('username', e.target.value)}
          />
          {errors.username && <p className="text-[11px] text-danger-600 mt-0.5">{errors.username}</p>}
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500 mb-1 block">Şifre</label>
          <input
            type="password"
            className={`${inp} ${errors.password ? err : ok}`}
            placeholder="••••••••"
            value={form.password}
            onChange={e => set('password', e.target.value)}
          />
          {errors.password && <p className="text-[11px] text-danger-600 mt-0.5">{errors.password}</p>}
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-neutral-500 mb-1 block">Rol</label>
        <select
          className={`${inp} ${errors.role ? err : ok} bg-white cursor-pointer`}
          value={form.role}
          onChange={e => set('role', e.target.value)}
        >
          <option value="">Rol seçin</option>
          {roles.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
        </select>
        {errors.role && <p className="text-[11px] text-danger-600 mt-0.5">{errors.role}</p>}
      </div>
      <div className="flex gap-2 pt-1">
        <button
          onClick={() => { onCancel(); setForm({ name: '', email: '', username: '', password: '', role: '' }); setErrors({}) }}
          className="flex-1 bg-neutral-100 text-neutral-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-neutral-200 transition-colors"
        >
          İptal
        </button>
        <button
          onClick={handleSave}
          className="flex-1 bg-primary-800 text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
        >
          Kaydet
        </button>
      </div>
    </div>
  )
}

// ── Roller Tab ────────────────────────────────────────────────────────────────
function RollerTab() {
  const [roles, setRoles] = useState(INIT_ROLES)
  const [selected, setSelected] = useState('Süper Admin')
  const [editingRoleIdx, setEditingRoleIdx] = useState<number | null>(null)
  const [editingRoleName, setEditingRoleName] = useState('')

  function startEditRole(idx: number) {
    setEditingRoleIdx(idx)
    setEditingRoleName(roles[idx].name)
  }

  function saveRoleName(idx: number) {
    const newName = editingRoleName.trim()
    if (!newName) { setEditingRoleIdx(null); return }
    const oldName = roles[idx].name
    const updated = roles.map((r, i) => i === idx ? { ...r, name: newName } : r)
    setRoles(updated)
    if (selected === oldName) setSelected(newName)
    setEditingRoleIdx(null)
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

      {/* Sol — Rol Listesi */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Rol Bilgileri" subtitle="Rollerin yetki kapsamları." />
        <div className="space-y-3">
          {roles.map((r, idx) => (
            <div
              key={r.name}
              onClick={() => setSelected(r.name)}
              className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${selected === r.name ? 'border-primary-800 bg-primary-50' : 'border-neutral-100 hover:border-neutral-200 bg-white'}`}
            >
              <div className={`w-9 h-9 ${r.color} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
              </div>
              <div className="flex-1 min-w-0">
                {editingRoleIdx === idx ? (
                  <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                    <input
                      className="flex-1 min-w-0 border border-primary-800 rounded-lg px-2 py-0.5 text-sm text-primary-800 outline-none"
                      value={editingRoleName}
                      onChange={e => setEditingRoleName(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveRoleName(idx); if (e.key === 'Escape') setEditingRoleIdx(null) }}
                      autoFocus
                    />
                    <button onClick={() => saveRoleName(idx)} className="text-white bg-primary-800 rounded-lg px-2 py-0.5 text-xs font-medium">✓</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-sm text-primary-800 truncate">{r.name}</p>
                    <button
                      onClick={e => { e.stopPropagation(); startEditRole(idx) }}
                      className="text-neutral-400 hover:text-primary-800 flex-shrink-0"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/></svg>
                    </button>
                  </div>
                )}
                <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed">{r.desc}</p>
                <p className="text-[11px] text-neutral-400 mt-1">{r.count} Kullanıcı</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sağ — Yetkiler */}
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
            const hasAccess = ROLE_PERMS[selected]?.includes(mod) ?? false
            return (
              <div key={mod} className={`flex items-center justify-between p-4 rounded-xl border ${hasAccess ? 'border-success-100 bg-success-50' : 'border-neutral-100 bg-neutral-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasAccess ? 'bg-success-100' : 'bg-neutral-200'}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke={hasAccess ? '#0F6E56' : '#888780'} strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1" stroke={hasAccess ? '#0F6E56' : '#888780'} strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1" stroke={hasAccess ? '#0F6E56' : '#888780'} strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1" stroke={hasAccess ? '#0F6E56' : '#888780'} strokeWidth="1.8"/></svg>
                  </div>
                  <span className={`text-sm font-semibold ${hasAccess ? 'text-success-700' : 'text-neutral-400'}`}>{mod}</span>
                </div>
                <Toggle defaultChecked={hasAccess} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Bildirimler Tab ────────────────────────────────────────────────────────────
type Channel = 'email' | 'push'

function EmailPreview({ message }: { message: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
      <div className="bg-neutral-50 border-b border-neutral-200 px-4 py-2.5 flex items-center gap-3">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-danger-400" />
          <span className="w-3 h-3 rounded-full bg-warning-400" />
          <span className="w-3 h-3 rounded-full bg-success-500" />
        </div>
        <div className="flex-1 bg-white border border-neutral-200 rounded px-2 py-0.5 text-[10px] text-neutral-400 text-center">Mail İstemcisi</div>
      </div>
      <div className="p-4">
        <div className="border-b border-neutral-100 pb-3 mb-3">
          <p className="text-[10px] text-neutral-400 mb-0.5">Kimden: <span className="text-primary-800">bildirim@celikinsaat.com</span></p>
          <p className="text-[10px] text-neutral-400 mb-0.5">Konu: <span className="text-primary-800 font-semibold">Çelik İnşaat Bildirimi</span></p>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-primary-800 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[9px] font-bold">ÇEL</span>
          </div>
          <div>
            <p className="text-xs font-bold text-primary-800">Çelik İnşaat</p>
            <p className="text-[10px] text-neutral-400">bildirim@celikinsaat.com</p>
          </div>
        </div>
        <div className="border-l-2 border-primary-800 pl-3">
          <p className="text-xs text-neutral-600 leading-relaxed">{message || 'Maliklerinize göndermek istediğiniz mesajı yazın...'}</p>
        </div>
        <div className="mt-3 pt-3 border-t border-neutral-100">
          <p className="text-[10px] text-neutral-400">Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. — celikinsaat.com</p>
        </div>
      </div>
    </div>
  )
}

function PushPreview({ message }: { message: string }) {
  return (
    <div className="bg-neutral-800 rounded-2xl p-4 shadow-lg">
      <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3">
        <div className="w-10 h-10 bg-primary-800 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-bold">ÇEL</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-white text-xs font-bold">Çelik İnşaat</p>
            <p className="text-white/50 text-[10px]">Şimdi</p>
          </div>
          <p className="text-white/80 text-xs leading-relaxed line-clamp-2">
            {message || 'Maliklerinize göndermek istediğiniz mesajı yazın...'}
          </p>
        </div>
      </div>
      <p className="text-white/30 text-[10px] text-center mt-3">Telefon bildirimi önizlemesi</p>
    </div>
  )
}

const CHANNELS: { key: Channel; label: string }[] = [
  { key: 'email', label: 'E-posta' },
  { key: 'push',  label: 'Uygulama İçi' },
]

const events = [
  { label: 'Ödeme Hatırlatıcısı',  desc: 'Vade tarihi yaklaşan malikler uyarılsın.' },
  { label: 'Ödeme Onayı',          desc: 'Tahsilat gerçekleştiğinde malik bilgilendirilsin.' },
  { label: 'Yeni Evrak',           desc: 'Yeni evrak yüklendiğinde bildirim gönderilsin.' },
  { label: 'Yeni Duyuru',          desc: 'Duyuru yayınlandığında bildirim gönderilsin.' },
  { label: 'Proje Güncelleme',     desc: 'Proje durumu değiştiğinde malik bilgilendirilsin.' },
  { label: 'Vadesi Geçen Ödeme',   desc: 'Vadesi geçen ödemeler için otomatik uyarı.' },
]

function BildirimlerTab() {
  const [selectedChannel, setSelectedChannel] = useState<Channel>('email')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ sent?: number; error?: string } | null>(null)

  const handleSend = async () => {
    if (!message.trim()) return
    if (selectedChannel === 'push') {
      setSending(true); setSendResult(null)
      try {
        const res = await fetch('/api/push/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Çelik İnşaat', body: message.trim(), url: '/malik-dashboard' }),
        })
        const data = await res.json()
        setSendResult(data)
        if (data.sent > 0) setMessage('')
      } catch { setSendResult({ error: 'Bağlantı hatası' }) }
      setSending(false)
    } else {
      setSendResult({ error: 'E-posta gönderimi henüz aktif değil.' })
    }
  }

  return (
    <div className="space-y-6">

      {/* Manuel Bildirim Gönder */}
      <div className="bg-white rounded-2xl border border-neutral-100 p-6">
        <SectionTitle title="Manuel Bildirim Gönder" subtitle="Seçili maliklerinize özel mesaj gönderin." />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Alıcılar</label>
              <select className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-800 bg-white cursor-pointer">
                <option value="herkes">Herkes (Bildirime izin veren tüm kullanıcılar)</option>
                <option value="malikler">Sadece Malikler</option>
                <option value="vadesi-gecen">Vadesi Geçen Malikler</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">Kanal</label>
              <div className="flex gap-2">
                {CHANNELS.map(ch => (
                  <button
                    key={ch.key}
                    onClick={() => setSelectedChannel(ch.key)}
                    className={`flex-1 text-xs font-semibold py-2.5 rounded-xl border transition-colors ${
                      selectedChannel === ch.key
                        ? 'border-primary-800 bg-primary-800 text-white'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-primary-800 hover:text-primary-800'
                    }`}
                  >
                    {ch.label}
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
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
            </div>
            {sendResult && (
              sendResult.error
                ? <p className="text-danger-700 text-sm bg-danger-50 border border-danger-100 rounded-xl px-4 py-3">{sendResult.error}</p>
                : <p className="text-success-700 text-sm bg-success-50 border border-success-100 rounded-xl px-4 py-3 font-medium">{sendResult.sent} kişiye gönderildi ✓</p>
            )}
            <button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className="w-full bg-primary-800 text-white text-sm font-semibold py-3 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="22" y1="2" x2="11" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/><polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" opacity="0.3" stroke="white" strokeWidth="1.2"/></svg>
              {sending ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </div>

          {/* Önizleme — kanala göre değişir */}
          <div className={`rounded-xl p-5 ${selectedChannel === 'push' ? 'bg-neutral-700' : 'bg-neutral-50'}`}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-4 ${selectedChannel === 'push' ? 'text-white/50' : 'text-neutral-400'}`}>
              {selectedChannel === 'email' ? 'E-posta Önizleme' : 'Uygulama İçi Bildirim Önizleme'}
            </p>
            {selectedChannel === 'email' && <EmailPreview message={message} />}
            {selectedChannel === 'push'  && <PushPreview  message={message} />}
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

// ── Ödeme Bilgileri Tab (Editlenebilir) ───────────────────────────────────────

// Banka satırı düzenleme formu
function BankEditRow({
  bank,
  onSave,
  onDelete,
  onCancel,
}: {
  bank: OdemeBank
  onSave: (b: OdemeBank) => void
  onDelete: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<OdemeBank>({ ...bank })
  return (
    <div className="px-5 py-4 bg-primary-50 border border-primary-100 rounded-2xl mb-3 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-1 block">Banka Adı</label>
          <input
            className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-1 block">Hesap Türü</label>
          <input
            className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all"
            value={form.type}
            onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
          />
        </div>
      </div>
      <div>
        <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-1 block">IBAN</label>
        <input
          className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm font-mono outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all"
          value={form.iban}
          onChange={e => setForm(f => ({ ...f, iban: e.target.value }))}
        />
      </div>
      <div>
        <label className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wide mb-1 block">Şube</label>
        <input
          className="w-full border border-neutral-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all"
          value={form.sube}
          onChange={e => setForm(f => ({ ...f, sube: e.target.value }))}
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setForm(f => ({ ...f, isAna: !f.isAna }))}
            className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 relative ${form.isAna ? 'bg-success-500' : 'bg-neutral-200'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${form.isAna ? 'left-5' : 'left-1'}`} />
          </div>
          <span className="text-sm font-medium text-neutral-600">Ana Hesap</span>
        </label>
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onDelete} className="flex items-center gap-1.5 text-xs text-danger-600 bg-danger-50 border border-danger-100 px-3 py-2 rounded-xl hover:bg-danger-100 transition-colors">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M19 6l-1 14H6L5 6" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 6V4h6v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          Sil
        </button>
        <button onClick={onCancel} className="flex-1 bg-neutral-100 text-neutral-600 text-sm font-semibold py-2 rounded-xl hover:bg-neutral-200 transition-colors">İptal</button>
        <button onClick={() => onSave(form)} className="flex-1 bg-primary-800 text-white text-sm font-semibold py-2 rounded-xl hover:bg-primary-700 transition-colors">Kaydet</button>
      </div>
    </div>
  )
}

// Banka satırı görüntüleme
function BankViewRow({
  bank,
  onEdit,
}: {
  bank: OdemeBank
  onEdit: () => void
}) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <p className="text-sm font-bold text-primary-800 leading-tight">{bank.name}</p>
            <p className="text-xs text-neutral-400">{bank.type}</p>
          </div>
          {bank.isAna && (
            <span className="text-xs font-semibold text-success-700 bg-success-50 border border-success-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
              Ana Hesap
            </span>
          )}
        </div>
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-primary-800 transition-colors flex-shrink-0"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="1.8"/></svg>
          Düzenle
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">IBAN</p>
          <p className="text-xs font-mono font-semibold text-primary-800 leading-tight break-all">{bank.iban}</p>
        </div>
        <div>
          <p className="text-[10px] text-neutral-400 uppercase tracking-wider mb-1">Şube</p>
          <p className="text-xs font-medium text-primary-800">{bank.sube}</p>
        </div>
      </div>
    </div>
  )
}

function OdemeBilgileriTab() {
  const [config, setConfig] = useState<OdemeConfig>(() =>
    typeof window !== 'undefined' ? getOdemeConfig() : require('@/lib/odeme-config').DEFAULT_ODEME_CONFIG
  )
  const [editingBankId, setEditingBankId] = useState<string | null>(null)
  const [showAddBank, setShowAddBank] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { setConfig(getOdemeConfig()) }, [])

  function updateConfig(patch: Partial<OdemeConfig>) {
    const next = { ...config, ...patch }
    setConfig(next)
    saveOdemeConfig(next)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function updateBank(updated: OdemeBank) {
    const banks = config.banks.map(b => b.id === updated.id ? updated : b)
    updateConfig({ banks })
    setEditingBankId(null)
  }

  function deleteBank(id: string) {
    updateConfig({ banks: config.banks.filter(b => b.id !== id) })
    setEditingBankId(null)
  }

  function addBank(bank: OdemeBank) {
    updateConfig({ banks: [...config.banks, bank] })
    setShowAddBank(false)
  }

  const newBankTemplate: OdemeBank = { id: Date.now().toString(), name: '', type: 'TL Hesabı', iban: '', sube: '', isAna: false }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-5">

      {/* ── Sol kolon ─────────────────────────────────────── */}
      <div className="space-y-4 order-2 xl:order-1">

        {/* Kaydedildi bildirimi */}
        {saved && (
          <div className="flex items-center gap-2 px-4 py-3 bg-success-50 border border-success-100 rounded-2xl text-success-700 text-sm font-semibold">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            Değişiklikler kaydedildi — Malik Ödeme Yap sayfasına yansıdı.
          </div>
        )}

        {/* Şirket Bilgileri */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-primary-800">Şirket Bilgileri</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Malik sayfasında görünecek bilgiler.</p>
            </div>
            <span className="text-[10px] font-semibold bg-info-50 text-info-700 px-2 py-1 rounded-full flex-shrink-0">Malike Görünür</span>
          </div>
          <div className="flex gap-4 items-start mb-4">
            <div className="w-16 h-16 border border-neutral-100 rounded-2xl flex items-center justify-center flex-shrink-0 p-1.5 bg-neutral-50">
              <img src="/icons/celik-logo.svg" alt="Çelik" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <FieldRow label="Şirket Adı" value={config.sirketAdi} onChange={v => updateConfig({ sirketAdi: v })} />
              <FieldRow label="Adres"      value={config.adres}     onChange={v => updateConfig({ adres: v })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4">
            <FieldRow label="Vergi Dairesi" value={config.vergiDairesi}  onChange={v => updateConfig({ vergiDairesi: v })} />
            <FieldRow label="Vergi No"      value={config.vergiNo}       onChange={v => updateConfig({ vergiNo: v })} />
            <FieldRow label="Mersis No"     value={config.mersisNo}      onChange={v => updateConfig({ mersisNo: v })} />
            <FieldRow label="Kuruluş Yılı"  value={config.kurulusYili}   onChange={v => updateConfig({ kurulusYili: v })} />
          </div>
        </div>

        {/* İletişim Bilgileri */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-primary-800">İletişim Bilgileri</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Malikler bu bilgileri görecek.</p>
            </div>
            <span className="text-[10px] font-semibold bg-info-50 text-info-700 px-2 py-1 rounded-full flex-shrink-0">Malike Görünür</span>
          </div>
          <FieldRow label="Telefon" value={config.telefon}        onChange={v => updateConfig({ telefon: v })} />
          <FieldRow label="E-posta" value={config.eposta}         onChange={v => updateConfig({ eposta: v })} />
          <FieldRow label="Adres"   value={config.iletisimAdres}  onChange={v => updateConfig({ iletisimAdres: v })} />
        </div>

        {/* Ödeme Notu */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-sm text-primary-800">Ödeme Notu</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Banka hesapları üzerinde görünür.</p>
            </div>
            <span className="text-[10px] font-semibold bg-info-50 text-info-700 px-2 py-1 rounded-full flex-shrink-0">Malike Görünür</span>
          </div>
          <textarea
            rows={2}
            className="w-full border border-neutral-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary-800 focus:ring-2 focus:ring-primary-800/10 transition-all resize-none"
            value={config.odemNotu}
            onChange={e => updateConfig({ odemNotu: e.target.value })}
          />
        </div>
      </div>

      {/* ── Sağ kolon: Banka Hesapları ────────────────────── */}
      <div className="order-1 xl:order-2">
        <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">

          {/* Başlık */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-neutral-100">
            <div>
              <h3 className="font-bold text-base text-primary-800">Banka Hesap Bilgileri</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Malik sayfasında görünecek hesaplar.</p>
            </div>
            <button
              onClick={() => { setShowAddBank(true); setEditingBankId(null) }}
              className="flex items-center gap-1.5 bg-primary-800 text-white text-xs font-semibold px-3 py-2 rounded-xl hover:bg-primary-700 transition-colors flex-shrink-0"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
              Hesap Ekle
            </button>
          </div>

          {/* Yeni Banka Formu */}
          {showAddBank && (
            <div className="px-5 pt-4">
              <BankEditRow
                bank={newBankTemplate}
                onSave={addBank}
                onDelete={() => setShowAddBank(false)}
                onCancel={() => setShowAddBank(false)}
              />
            </div>
          )}

          {/* Banka Listesi */}
          <div className="divide-y divide-neutral-100">
            {config.banks.map(bank => (
              <div key={bank.id}>
                {editingBankId === bank.id ? (
                  <div className="px-5 pt-4">
                    <BankEditRow
                      bank={bank}
                      onSave={updateBank}
                      onDelete={() => deleteBank(bank.id)}
                      onCancel={() => setEditingBankId(null)}
                    />
                  </div>
                ) : (
                  <BankViewRow
                    bank={bank}
                    onEdit={() => { setEditingBankId(bank.id); setShowAddBank(false) }}
                  />
                )}
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
                <p className="text-xs text-success-600 mt-0.5 leading-relaxed">Değişiklikler anında Malik Ödeme Yap sayfasına yansır.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string }[] = [
  { key: 'hesap',        label: 'Hesap Ayarları' },
  { key: 'kullanicilar', label: 'Kullanıcılar' },
  { key: 'roller',       label: 'Roller ve Yetkiler' },
  { key: 'bildirimler',  label: 'Bildirim Ayarları' },
  { key: 'odeme',        label: 'Ödeme Bilgileri' },
]

export default function AyarlarPage() {
  const [tab, setTab] = useState<Tab>('hesap')

  return (
    <div className="flex-1 overflow-auto">
      {/* Sayfa başlığı */}
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
                tab === t.key ? 'text-primary-800' : 'text-neutral-400 hover:text-neutral-600'
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

      {/* İçerik */}
      <div className="p-6 pb-24 md:pb-6">
        {tab === 'hesap'        && <HesapTab />}
        {tab === 'kullanicilar' && <KullanicilarTab />}
        {tab === 'roller'       && <RollerTab />}
        {tab === 'bildirimler'  && <BildirimlerTab />}
        {tab === 'odeme'        && <OdemeBilgileriTab />}
      </div>
    </div>
  )
}
