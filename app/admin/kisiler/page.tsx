'use client'

import { useState, useMemo } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────
type Owner = {
  id: string
  name: string
  phone: string
  email: string
  unitNo: number
  floor: number
  unitType: string
  totalPay: number
  paid: number
  payShare: number
  projectId: string
}

type Project = {
  id: string
  name: string
  location: string
  ownerCount: number
}

type OwnerForm = {
  projectId: string
  floor: number
  unitNo: number
  unitType: string
  name: string
  phone: string
  email: string
  totalPay: string
  paid: string
  payShare: string
  dueDate: string
}

// ── Mock veri ──────────────────────────────────────────────────────────────────
const PROJELER: Project[] = [
  { id: 'ap1', name: 'Kemal Apartman',     location: 'Avcılar / İstanbul',    ownerCount: 24 },
  { id: 'ap2', name: 'Gülbahçe Apartmanı', location: 'Beylikdüzü / İstanbul', ownerCount: 18 },
  { id: 'ap3', name: 'Doğa Rezidans',      location: 'Başakşehir / İstanbul', ownerCount: 12 },
  { id: 'ap4', name: 'Yazgan Konutları',   location: 'Esenyurt / İstanbul',   ownerCount: 16 },
  { id: 'ap5', name: 'Mavişehir Evleri',   location: 'Küçükçekmece / İstanbul', ownerCount: 20 },
  { id: 'ap6', name: 'Yeşil Vadi Konutları', location: 'Arnavutköy / İstanbul', ownerCount: 14 },
]

const MOCK_OWNERS: Owner[] = [
  { id: 'o1', name: 'Emre Dağ',      phone: '0555 123 45 67', email: 'emredag@gmail.com',       unitNo: 21, floor: 6, unitType: '3+1', totalPay: 1_500_000, paid: 500_000,   payShare: 4.167, projectId: 'ap1' },
  { id: 'o2', name: 'Ahmet Yılmaz',  phone: '0544 987 65 43', email: 'ahmet@gmail.com',          unitNo: 22, floor: 6, unitType: '2+1', totalPay: 1_200_000, paid: 1_200_000, payShare: 4.167, projectId: 'ap1' },
  { id: 'o3', name: 'Mehmet Kaya',   phone: '0533 456 78 90', email: 'mehmet@gmail.com',         unitNo: 23, floor: 6, unitType: '2+1', totalPay: 1_000_000, paid: 300_000,   payShare: 4.167, projectId: 'ap1' },
  { id: 'o4', name: 'Ayşe Demir',    phone: '0507 234 56 78', email: 'ayse@gmail.com',           unitNo: 24, floor: 6, unitType: '3+1', totalPay: 1_000_000, paid: 0,         payShare: 4.167, projectId: 'ap1' },
  { id: 'o5', name: 'Fatma Şahin',   phone: '0532 111 22 33', email: 'fatma@gmail.com',          unitNo: 17, floor: 5, unitType: '2+1', totalPay: 800_000,   paid: 0,         payShare: 4.167, projectId: 'ap1' },
  { id: 'o6', name: 'Ali Veli',      phone: '0541 333 44 55', email: 'ali@gmail.com',            unitNo: 13, floor: 4, unitType: '2+1', totalPay: 900_000,   paid: 450_000,   payShare: 4.167, projectId: 'ap1' },
  { id: 'o7', name: 'Zeynep Kılıç',  phone: '0536 789 12 34', email: 'zeynep@gmail.com',        unitNo:  9, floor: 3, unitType: '1+1', totalPay: 700_000,   paid: 700_000,   payShare: 4.167, projectId: 'ap1' },
  { id: 'o8', name: 'Hasan Çelik',   phone: '0542 555 66 77', email: 'hasan@gmail.com',          unitNo:  5, floor: 2, unitType: '2+1', totalPay: 950_000,   paid: 200_000,   payShare: 4.167, projectId: 'ap1' },
]

const UNIT_TYPES = ['1+1', '2+1', '3+1', 'Dükkan']

// ── Yardımcılar ────────────────────────────────────────────────────────────────
function formatTL(n: number) {
  return n.toLocaleString('tr-TR') + ' TL'
}

function formatCompactTL(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')}M TL`
  if (n >= 1_000) return `${Math.round(n / 1_000)}K TL`
  return formatTL(n)
}

function getInitials(name: string) {
  const p = name.trim().split(' ')
  return p.length >= 2 ? (p[0][0] + p[p.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = ['#185FA5', '#0F6E56', '#BA7517', '#5B21B6', '#A32D2D', '#0E7490', '#0A1F44']
function getAvatarColor(name: string) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

function buildUnits(floor: number) {
  return Array.from({ length: 4 }, (_, i) => ({ no: (floor - 1) * 4 + i + 1, floor }))
}

// ── Progress bar bileşeni ──────────────────────────────────────────────────────
function ProgressBar({ pct }: { pct: number }) {
  const color = pct >= 100 ? '#0F6E56' : pct >= 50 ? '#185FA5' : pct > 0 ? '#BA7517' : '#D3D1C7'
  return (
    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
    </div>
  )
}

// ── Boş durum ─────────────────────────────────────────────────────────────────
function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 bg-neutral-100 rounded-2xl flex items-center justify-center mb-4">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="#B0ADA6" strokeWidth="1.8"/>
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#B0ADA6" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-base font-semibold text-neutral-400 mb-1">Bu projeye henüz malik eklenmedi</p>
      <p className="text-sm text-neutral-300 mb-4">Malik ekleyerek daire ve ödeme bilgilerini takip edin</p>
      <button onClick={onAdd} className="bg-primary-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors">
        + İlk Maliki Ekle
      </button>
    </div>
  )
}

// ── Malik Ekle / Düzenle Formu ─────────────────────────────────────────────────
function MalikForm({
  form, setForm, editId, onSave, onClose,
}: {
  form: OwnerForm
  setForm: React.Dispatch<React.SetStateAction<OwnerForm>>
  editId: string | null
  onSave: () => void
  onClose: () => void
}) {
  const totalPay = Number(form.totalPay.replace(/\D/g, '')) || 0
  const paid     = Number(form.paid.replace(/\D/g, ''))     || 0
  const floors   = [1, 2, 3, 4, 5, 6, 7, 8]
  const units    = buildUnits(form.floor)

  return (
    <div>
      {/* Başlık */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="font-bold text-lg text-primary-800">{editId ? 'Malik Düzenle' : 'Malik Ekle'}</h3>
          <p className="text-xs text-neutral-400 mt-0.5">Var olan projeye daire ve ödeme bilgisiyle malik ekleyin.</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-500 font-bold text-lg leading-none">
          ×
        </button>
      </div>

      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {/* Proje */}
        {!editId && (
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">Proje</label>
            <div className="space-y-2">
              {PROJELER.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setForm(f => ({ ...f, projectId: p.id }))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
                    form.projectId === p.id ? 'bg-primary-50 border-primary-800' : 'bg-neutral-50 border-neutral-100 hover:border-neutral-300'
                  }`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="7" height="7" rx="1" stroke={form.projectId === p.id ? '#0A1F44' : '#888780'} strokeWidth="1.8"/>
                    <rect x="14" y="3" width="7" height="7" rx="1" stroke={form.projectId === p.id ? '#0A1F44' : '#888780'} strokeWidth="1.8"/>
                    <rect x="3" y="14" width="7" height="7" rx="1" stroke={form.projectId === p.id ? '#0A1F44' : '#888780'} strokeWidth="1.8"/>
                    <rect x="14" y="14" width="7" height="7" rx="1" stroke={form.projectId === p.id ? '#0A1F44' : '#888780'} strokeWidth="1.8"/>
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${form.projectId === p.id ? 'text-primary-800' : 'text-neutral-700'}`}>{p.name}</p>
                    <p className="text-xs text-neutral-400">{p.location}</p>
                  </div>
                  {form.projectId === p.id && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12l5 5L20 7" stroke="#0A1F44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Kat */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-2">Kat Bilgisi</label>
          <div className="flex flex-wrap gap-2">
            {floors.map((f) => (
              <button
                key={f}
                onClick={() => setForm(prev => ({ ...prev, floor: f, unitNo: buildUnits(f)[0].no }))}
                className={`px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${
                  form.floor === f ? 'bg-primary-800 border-primary-800 text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                {f}. Kat
              </button>
            ))}
          </div>
        </div>

        {/* Daire */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-2">Daire</label>
          <div className="flex flex-wrap gap-2">
            {units.map((u) => (
              <button
                key={u.no}
                onClick={() => setForm(prev => ({ ...prev, unitNo: u.no }))}
                className={`px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${
                  form.unitNo === u.no ? 'bg-primary-800 border-primary-800 text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                Daire {u.no}
              </button>
            ))}
          </div>
        </div>

        {/* Daire Tipi */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-2">Daire Tipi</label>
          <div className="flex flex-wrap gap-2">
            {UNIT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setForm(prev => ({ ...prev, unitType: t }))}
                className={`px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${
                  form.unitType === t ? 'bg-primary-800 border-primary-800 text-white' : 'bg-white border-neutral-200 text-neutral-500 hover:border-neutral-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Ad Soyad */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Ad Soyad</label>
          <input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Örn. Ahmet Yılmaz"
            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
          />
        </div>

        {/* Telefon + E-posta */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Telefon</label>
            <input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="05XX XXX XX XX"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">E-posta</label>
            <input
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="ornek@gmail.com"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>
        </div>

        {/* Toplam + Ödenen */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Toplam Ödeme (₺)</label>
            <input
              value={form.totalPay}
              onChange={e => setForm(f => ({ ...f, totalPay: e.target.value.replace(/\D/g, '') }))}
              placeholder="1500000"
              inputMode="numeric"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Ödenen / Peşinat (₺)</label>
            <input
              value={form.paid}
              onChange={e => setForm(f => ({ ...f, paid: e.target.value.replace(/\D/g, '') }))}
              placeholder="250000"
              inputMode="numeric"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>
        </div>

        {/* Ödeme Payı + Tarih */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Ödeme Payı (%)</label>
            <input
              value={form.payShare}
              onChange={e => setForm(f => ({ ...f, payShare: e.target.value }))}
              placeholder="4.167"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">İlk Ödeme Tarihi</label>
            <input
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              placeholder="gg.aa.yyyy"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>
        </div>

        {/* Ödeme Özeti */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
          <p className="font-bold text-sm text-primary-800 mb-3">Ödeme Özeti</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Toplam',  value: formatTL(totalPay),                       color: 'text-primary-800' },
              { label: 'Ödenen',  value: formatTL(paid),                            color: 'text-success-700' },
              { label: 'Kalan',   value: formatTL(Math.max(totalPay - paid, 0)),   color: 'text-primary-800' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-3">
                <p className="text-[10px] text-neutral-400">{s.label}</p>
                <p className={`font-bold text-sm mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex gap-3 pt-1 pb-2">
          <button onClick={onClose} className="flex-1 border border-neutral-200 text-neutral-600 text-sm font-semibold py-3 rounded-xl hover:bg-neutral-50 transition-colors">
            İptal
          </button>
          <button onClick={onSave} className="flex-1 bg-primary-800 text-white text-sm font-semibold py-3 rounded-xl hover:bg-primary-700 transition-colors">
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Ana Sayfa ─────────────────────────────────────────────────────────────────
export default function AdminKisilerPage() {
  const [selectedProjectId, setSelectedProjectId] = useState('ap1')
  const [owners, setOwners] = useState<Owner[]>(MOCK_OWNERS)
  const [search, setSearch] = useState('')
  const [showPanel, setShowPanel] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)

  const emptyForm: OwnerForm = {
    projectId: selectedProjectId,
    floor: 6, unitNo: 21, unitType: '2+1',
    name: '', phone: '', email: '',
    totalPay: '', paid: '', payShare: '', dueDate: '',
  }
  const [form, setForm] = useState<OwnerForm>(emptyForm)

  const projectOwners = useMemo(
    () => owners.filter(o => o.projectId === selectedProjectId),
    [owners, selectedProjectId]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return projectOwners
    const q = search.toLowerCase()
    return projectOwners.filter(o =>
      o.name.toLowerCase().includes(q) ||
      o.phone.includes(q) ||
      String(o.unitNo).includes(q)
    )
  }, [projectOwners, search])

  const totalDebt = projectOwners.reduce((s, o) => s + o.totalPay, 0)
  const totalPaid = projectOwners.reduce((s, o) => s + o.paid, 0)
  const collRate   = totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0

  const openAdd = () => {
    setEditId(null)
    setForm({ ...emptyForm, projectId: selectedProjectId })
    setShowPanel(true)
  }

  const openEdit = (o: Owner) => {
    setEditId(o.id)
    setForm({
      projectId: o.projectId,
      floor: o.floor, unitNo: o.unitNo, unitType: o.unitType,
      name: o.name, phone: o.phone, email: o.email,
      totalPay: String(o.totalPay), paid: String(o.paid),
      payShare: String(o.payShare), dueDate: '',
    })
    setShowPanel(true)
  }

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim()) {
      alert('Ad soyad ve telefon zorunludur.')
      return
    }
    const totalPay = Number(form.totalPay) || 0
    const paid     = Number(form.paid) || 0

    if (editId) {
      setOwners(prev => prev.map(o =>
        o.id === editId
          ? { ...o, name: form.name, phone: form.phone, email: form.email,
              floor: form.floor, unitNo: form.unitNo, unitType: form.unitType,
              totalPay, paid, payShare: Number(form.payShare) || 0 }
          : o
      ))
    } else {
      const newOwner: Owner = {
        id: `o${Date.now()}`,
        projectId: form.projectId,
        name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
        floor: form.floor, unitNo: form.unitNo, unitType: form.unitType,
        totalPay, paid, payShare: Number(form.payShare) || 0,
      }
      setOwners(prev => [newOwner, ...prev])
      setSelectedProjectId(form.projectId)
    }
    setShowPanel(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Bu maliki silmek istediğinizden emin misiniz?')) return
    setOwners(prev => prev.filter(o => o.id !== id))
    if (editId === id) setShowPanel(false)
  }

  const selectedProject = PROJELER.find(p => p.id === selectedProjectId)

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">

      {/* Sayfa başlığı */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-primary-800">Malikler</h1>
          <p className="text-sm text-neutral-500 mt-1">Projelerinize ait daire ve ödeme bilgileriyle malikleri yönetin.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Malik Ekle
        </button>
      </div>

      <div className="flex gap-5 items-start">

        {/* ── Sol panel: Proje listesi ── */}
        <div className="hidden md:block w-72 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm text-neutral-500">Projeler / Apartmanlar</p>
            <button
              onClick={openAdd}
              className="w-7 h-7 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Arama */}
          <div className="relative mb-3">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="14" height="14" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#B0ADA6" strokeWidth="1.8"/>
              <path d="M21 21l-4.35-4.35" stroke="#B0ADA6" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input
              placeholder="Apartman ara..."
              className="w-full bg-white border border-neutral-100 rounded-xl pl-8 pr-3 py-2 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>

          {PROJELER.map((p) => {
            const isSelected = p.id === selectedProjectId
            const pOwners = owners.filter(o => o.projectId === p.id)
            return (
              <button
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-colors ${
                  isSelected
                    ? 'bg-primary-50 border-primary-200'
                    : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-primary-100' : 'bg-neutral-100'}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke={isSelected ? '#0A1F44' : '#888780'} strokeWidth="1.8"/>
                    <path d="M3 9h18M9 9v12M15 9v12" stroke={isSelected ? '#0A1F44' : '#888780'} strokeWidth="1.4"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${isSelected ? 'text-primary-800' : 'text-neutral-700'}`}>{p.name}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {pOwners.length} Daire · {pOwners.length} Malik
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* ── Orta: Ana içerik ── */}
        <div className={`flex-1 min-w-0 ${showPanel ? 'hidden lg:block' : ''}`}>

          {/* Proje başlığı */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-bold text-xl text-primary-800">{selectedProject?.name}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#888780"/>
                  </svg>
                  <span className="text-xs text-neutral-400">{selectedProject?.location}</span>
                </div>
              </div>
              <button
                onClick={() => {/* dışa aktar */}}
                className="flex items-center gap-2 border border-neutral-200 text-neutral-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-neutral-50 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="#666" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Dışa Aktar
              </button>
            </div>

            {/* Özet istatistikler */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Toplam Malik',    value: String(projectOwners.length),      color: 'text-primary-800',  bold: true },
                { label: 'Toplam Borç',     value: formatCompactTL(totalDebt),        color: 'text-danger-600',   bold: true },
                { label: 'Tahsil Edilen',   value: formatCompactTL(totalPaid),        color: 'text-success-700',  bold: true },
                { label: 'Tahsilat Oranı',  value: `%${collRate}`,                    color: collRate >= 70 ? 'text-success-700' : collRate >= 40 ? 'text-warning-700' : 'text-danger-600', bold: true },
              ].map((s) => (
                <div key={s.label} className="bg-neutral-50 rounded-xl p-3.5">
                  <p className="text-xs text-neutral-400 mb-1">{s.label}</p>
                  <p className={`font-bold text-lg ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Arama */}
          <div className="relative mb-4">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#B0ADA6" strokeWidth="1.8"/>
              <path d="M21 21l-4.35-4.35" stroke="#B0ADA6" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Malik adı, daire veya telefon ara..."
              className="w-full bg-white border border-neutral-100 rounded-xl pl-11 pr-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>

          {/* Tablo */}
          {filtered.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
              {/* Tablo başlıkları */}
              <div className="grid grid-cols-[1fr_140px_140px_180px_100px_80px] gap-4 px-5 py-3 border-b border-neutral-100 bg-neutral-50">
                {['Malik', 'Daire', 'Telefon', 'Ödenen / Toplam', 'Ödeme Oranı', 'İşlemler'].map((h) => (
                  <p key={h} className="text-xs font-semibold text-neutral-400">{h}</p>
                ))}
              </div>

              {/* Satırlar */}
              {filtered.map((owner, idx) => {
                const pct       = owner.totalPay > 0 ? Math.round((owner.paid / owner.totalPay) * 100) : 0
                const remaining = Math.max(owner.totalPay - owner.paid, 0)
                const avatarColor = getAvatarColor(owner.name)
                const initials    = getInitials(owner.name)
                const rateColor   = pct >= 100 ? 'text-success-700 bg-success-50' : pct >= 50 ? 'text-warning-700 bg-warning-50' : pct > 0 ? 'text-warning-700 bg-warning-50' : 'text-neutral-400 bg-neutral-100'

                return (
                  <div
                    key={owner.id}
                    className={`grid grid-cols-[1fr_140px_140px_180px_100px_80px] gap-4 px-5 py-4 items-center ${idx < filtered.length - 1 ? 'border-b border-neutral-100' : ''} hover:bg-neutral-50 transition-colors`}
                  >
                    {/* Malik */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-primary-800 truncate">{owner.name}</p>
                        <p className="text-xs text-neutral-400">Malik</p>
                      </div>
                    </div>

                    {/* Daire */}
                    <div>
                      <p className="font-medium text-sm text-primary-800">Daire {owner.unitNo} · {owner.unitType}</p>
                      <p className="text-xs text-neutral-400">{owner.floor}. Kat</p>
                    </div>

                    {/* Telefon */}
                    <p className="text-sm text-neutral-600">{owner.phone}</p>

                    {/* Ödenen / Toplam */}
                    <div>
                      <p className="text-sm text-neutral-700 mb-1">
                        <span className="font-semibold text-success-700">{formatTL(owner.paid)}</span>
                        <span className="text-neutral-400"> / {formatTL(owner.totalPay)}</span>
                      </p>
                      <ProgressBar pct={pct} />
                    </div>

                    {/* Ödeme Oranı */}
                    <div>
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${rateColor}`}>
                        %{pct}
                      </span>
                    </div>

                    {/* İşlemler */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(owner)}
                        className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors"
                        title="Düzenle"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(owner.id)}
                        className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-danger-50 hover:text-danger-600 transition-colors"
                        title="Sil"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Alt bar */}
              <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50 flex items-center justify-between">
                <p className="text-xs text-neutral-400">Toplam {filtered.length} kayıt</p>
              </div>
            </div>
          )}
        </div>

        {/* ── Sağ panel — Desktop ── */}
        {showPanel && (
          <div className="hidden md:block w-80 flex-shrink-0 bg-white rounded-2xl border border-neutral-100 p-5 sticky top-4">
            <MalikForm form={form} setForm={setForm} editId={editId} onSave={handleSave} onClose={() => setShowPanel(false)} />
          </div>
        )}
      </div>

      {/* ── Mobil bottom sheet ── */}
      {showPanel && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowPanel(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full bg-white rounded-t-3xl px-5 pt-4 pb-10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="mx-auto w-10 h-1 bg-neutral-200 rounded-full mb-4" />
            <MalikForm form={form} setForm={setForm} editId={editId} onSave={handleSave} onClose={() => setShowPanel(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
