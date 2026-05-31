'use client'

import { useState, useMemo, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

// ── Types ──────────────────────────────────────────────────────────────────────
type Owner = {
  id: string
  unitId: string | null
  name: string
  phone: string
  email: string
  unitNo: string
  floor: number
  unitType: string
  totalPay: number
  paid: number
  projectId: string
}

type Project = {
  id: string
  name: string
  location: string
  slug: string
}

type OwnerForm = {
  projectId: string
  floor: number
  unitNo: string
  unitType: string
  name: string
  phone: string
  email: string
  totalPay: string
  paid: string
  dueDate: string
  sifre: string
}

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

// ── Progress bar ──────────────────────────────────────────────────────────────
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
  form, setForm, editId, projects, onSave, onClose, saving,
}: {
  form: OwnerForm
  setForm: React.Dispatch<React.SetStateAction<OwnerForm>>
  editId: string | null
  projects: Project[]
  onSave: () => void
  onClose: () => void
  saving: boolean
}) {
  const [showSifre, setShowSifre] = useState(false)
  const [katOptions, setKatOptions] = useState<{ no: number; label: string }[]>([])
  const totalPay = Number(form.totalPay.replace(/\D/g, '')) || 0
  const paid     = Number(form.paid.replace(/\D/g, ''))     || 0
  const inputCls = "w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"

  // Seçili projenin kat sayısını ve isimlerini localStorage'dan oku
  useEffect(() => {
    const projectId = form.projectId
    if (!projectId) { setKatOptions([]); return }
    const project = projects.find(p => p.id === projectId)
    if (!project) { setKatOptions([]); return }
    const lsKey = `daireler_v2_${project.slug}`
    let katSayisi = 5
    try {
      const stored = JSON.parse(localStorage.getItem(lsKey) || '{}')
      if (stored.katSayisi) katSayisi = stored.katSayisi
    } catch {}
    let katIsimler: Record<number, string> = {}
    try {
      katIsimler = JSON.parse(localStorage.getItem('kat_isimler_global') || '{}')
    } catch {}
    const options = Array.from({ length: katSayisi }, (_, i) => {
      const no = i + 1
      return { no, label: katIsimler[no] || `${no}. Kat` }
    })
    setKatOptions(options)
  }, [form.projectId, projects])

  return (
    <div>
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

        {/* Proje seçimi — sadece yeni ekleme */}
        {!editId && (
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2">Proje</label>
            <div className="space-y-2">
              {projects.map((p) => (
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
          <label className="block text-xs font-medium text-neutral-400 mb-1">Kat</label>
          <select
            value={form.floor || ''}
            onChange={e => setForm(prev => ({ ...prev, floor: Number(e.target.value) }))}
            className={inputCls}
          >
            <option value="">Kat seçin…</option>
            {katOptions.length > 0
              ? katOptions.map(k => (
                  <option key={k.no} value={k.no}>{k.label}</option>
                ))
              : Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}. Kat</option>
                ))
            }
          </select>
        </div>

        {/* Daire No */}
        <div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Daire No</label>
          <input
            value={form.unitNo}
            onChange={e => setForm(f => ({ ...f, unitNo: e.target.value }))}
            placeholder="Örn. D-5 veya 12"
            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
          />
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

        {/* Toplam Satış Bedeli + Ödenen */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Satış Bedeli (₺)</label>
            <input
              value={form.totalPay}
              onChange={e => setForm(f => ({ ...f, totalPay: e.target.value.replace(/\D/g, '') }))}
              placeholder="3500000"
              inputMode="numeric"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Ödenen / Peşinat (₺)</label>
            <input
              value={form.paid}
              onChange={e => setForm(f => ({ ...f, paid: e.target.value.replace(/\D/g, '') }))}
              placeholder="500000"
              inputMode="numeric"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>
        </div>

        {/* İlk Ödeme Tarihi */}
        {!editId && paid > 0 && (
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-1">Ödeme Tarihi</label>
            <input
              value={form.dueDate}
              onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
              placeholder="gg.aa.yyyy"
              className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>
        )}

        {/* Ödeme Özeti */}
        <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
          <p className="font-bold text-sm text-primary-800 mb-3">Ödeme Özeti</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Toplam',  value: formatTL(totalPay),                     color: 'text-primary-800' },
              { label: 'Ödenen',  value: formatTL(paid),                          color: 'text-success-700' },
              { label: 'Kalan',   value: formatTL(Math.max(totalPay - paid, 0)), color: 'text-primary-800' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-3">
                <p className="text-[10px] text-neutral-400">{s.label}</p>
                <p className={`font-bold text-sm mt-0.5 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Giriş Bilgileri */}
        <div>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-wide mb-2">Giriş Bilgileri</p>
          <div className="bg-info-50 border border-info-100 rounded-xl px-3 py-2.5 mb-3 flex items-start gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" stroke="#0E7490" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#0E7490" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <p className="text-xs text-info-700">Malik, <strong>telefon numarası veya e-posta</strong> + şifre ile giriş yapabilecek.</p>
          </div>
          <label className="block text-xs font-medium text-neutral-400 mb-1">Şifre {!editId && '*'}</label>
          <div className="relative">
            <input
              type={showSifre ? 'text' : 'password'}
              value={form.sifre}
              onChange={e => setForm(f => ({ ...f, sifre: e.target.value }))}
              placeholder="En az 6 karakter"
              className={inputCls + ' pr-10'}
            />
            <button
              type="button"
              onClick={() => setShowSifre(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              {showSifre ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Butonlar */}
        <div className="flex gap-3 pt-1 pb-2">
          <button onClick={onClose} className="flex-1 border border-neutral-200 text-neutral-600 text-sm font-semibold py-3 rounded-xl hover:bg-neutral-50 transition-colors">
            İptal
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 bg-primary-800 text-white text-sm font-semibold py-3 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {saving && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>}
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Ana Sayfa ─────────────────────────────────────────────────────────────────
export default function AdminKisilerPage() {
  const [projects, setProjects]               = useState<Project[]>([])
  const [owners, setOwners]                   = useState<Owner[]>([])
  const [selectedProjectId, setSelectedProjectId] = useState<string>('')
  const [search, setSearch]                   = useState('')
  const [showPanel, setShowPanel]             = useState(false)
  const [editId, setEditId]                   = useState<string | null>(null)
  const [saving, setSaving]                   = useState(false)
  const [loadingOwners, setLoadingOwners]     = useState(false)
  const [mobileView, setMobileView]           = useState<'projects' | 'owners'>('projects')

  const emptyForm: OwnerForm = {
    projectId: selectedProjectId,
    floor: 1, unitNo: '', unitType: '2+1',
    name: '', phone: '', email: '',
    totalPay: '', paid: '', dueDate: '',
    sifre: '',
  }
  const [form, setForm] = useState<OwnerForm>(emptyForm)

  // ── Projeleri yükle ────────────────────────────────────────────────────────
  useEffect(() => {
    supabase
      .from('projects')
      .select('id, name, district, city, slug')
      .order('name')
      .then(({ data }) => {
        if (!data) return
        const mapped: Project[] = data.map(p => ({
          id:       p.id,
          name:     p.name,
          slug:     p.slug,
          location: [p.district, p.city].filter(Boolean).join(' / ') || 'İstanbul',
        }))
        setProjects(mapped)
        if (mapped.length > 0) setSelectedProjectId(mapped[0].id)
      })
  }, [])

  // ── Seçili projenin maliklerini yükle ──────────────────────────────────────
  // Tüm malikleri tek seferde yükle — her proje kartı doğru sayı göstersin
  useEffect(() => {
    setLoadingOwners(true)
    supabase
      .from('owners')
      .select(`
        id, full_name, phone, email, project_id, unit_id,
        units(id, unit_no, floor, type, price),
        payments(amount, status)
      `)
      .order('full_name')
      .then(({ data, error }) => {
        if (error) console.error('Owners yükleme hatası:', error)
        if (!data) { setLoadingOwners(false); return }
        const mapped: Owner[] = (data as any[]).map(o => {
          const unit = o.units
          const paidTotal = ((o.payments ?? []) as any[])
            .filter((p: any) => p.status === 'odendi')
            .reduce((s: number, p: any) => s + Number(p.amount), 0)
          return {
            id:        o.id,
            unitId:    o.unit_id,
            name:      o.full_name,
            phone:     o.phone ?? '',
            email:     o.email ?? '',
            unitNo:    unit?.unit_no ?? '—',
            floor:     unit?.floor ?? 0,
            unitType:  unit?.type ?? '—',
            totalPay:  Number(unit?.price ?? 0),
            paid:      paidTotal,
            projectId: o.project_id,
          }
        })
        setOwners(mapped)
        setLoadingOwners(false)
      })
  }, []) // Sadece bir kez yükle — yeni ekleme/silme local state'i günceller

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
      o.unitNo.toLowerCase().includes(q)
    )
  }, [projectOwners, search])

  const totalDebt = projectOwners.reduce((s, o) => s + o.totalPay, 0)
  const totalPaid = projectOwners.reduce((s, o) => s + o.paid,     0)
  const collRate  = totalDebt > 0 ? Math.round((totalPaid / totalDebt) * 100) : 0

  const openAdd = () => {
    setEditId(null)
    setForm({ ...emptyForm, projectId: selectedProjectId })
    setShowPanel(true)
  }

  const openEdit = (o: Owner) => {
    setEditId(o.id)
    // Mevcut şifreyi credentials store'dan getir
    let mevcutSifre = ''
    try {
      const creds: { id: string; sifre: string }[] = JSON.parse(localStorage.getItem('malik_credentials') || '[]')
      mevcutSifre = creds.find(c => c.id === o.id)?.sifre || ''
    } catch {}
    setForm({
      projectId: o.projectId,
      floor:    o.floor,
      unitNo:   o.unitNo,
      unitType: o.unitType,
      name:     o.name,
      phone:    o.phone,
      email:    o.email,
      totalPay: String(o.totalPay),
      paid:     String(o.paid),
      dueDate:  '',
      sifre:    mevcutSifre,
    })
    setShowPanel(true)
  }

  // ── Kaydet ────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim() || !form.phone.trim()) {
      alert('Ad soyad ve telefon zorunludur.')
      return
    }
    setSaving(true)
    const totalPay = Number(form.totalPay) || 0
    const paid     = Number(form.paid)     || 0

    try {
      if (editId) {
        // ── Güncelle ──
        const editOwner = owners.find(o => o.id === editId)
        await supabase.from('owners').update({
          full_name: form.name.trim(),
          phone:     form.phone.trim(),
          email:     form.email.trim(),
        }).eq('id', editId)

        if (editOwner?.unitId) {
          await supabase.from('units').update({
            unit_no:    form.unitNo.trim() || editOwner.unitNo,
            floor:      form.floor,
            type:       form.unitType,
            price:      totalPay,
          }).eq('id', editOwner.unitId)
        }

        // Local state güncelle
        setOwners(prev => prev.map(o =>
          o.id === editId
            ? { ...o, name: form.name.trim(), phone: form.phone.trim(), email: form.email.trim(),
                floor: form.floor, unitNo: form.unitNo.trim() || o.unitNo,
                unitType: form.unitType, totalPay }
            : o
        ))

      } else {
        // ── Yeni ekle ──
        const projectId = form.projectId || selectedProjectId

        // 1. Daire oluştur
        const { data: unit, error: unitErr } = await supabase.from('units').insert({
          project_id: projectId,
          unit_no:    form.unitNo.trim() || 'D-?',
          floor:      form.floor,
          type:       form.unitType,
          price:      totalPay,
          status:     'sold',
        }).select().single()

        if (unitErr || !unit) throw unitErr

        // 2. Malik oluştur
        const { data: owner, error: ownerErr } = await supabase.from('owners').insert({
          full_name:  form.name.trim(),
          phone:      form.phone.trim(),
          email:      form.email.trim(),
          project_id: projectId,
          unit_id:    unit.id,
        }).select().single()

        if (ownerErr || !owner) throw ownerErr

        // 3. Peşinat ödemesi oluştur (ödenen > 0 ise)
        if (paid > 0) {
          const today = new Date().toISOString().split('T')[0]
          await supabase.from('payments').insert({
            owner_id:    owner.id,
            unit_id:     unit.id,
            project_id:  projectId,
            amount:      paid,
            paid_date:   today,
            status:      'odendi',
            description: 'Peşinat',
            source:      'Banka',
            type:        'peşinat',
          })
        }

        // Local state güncelle — sadece doğru proje seçiliyse göster
        if (projectId === selectedProjectId) {
          const newOwner: Owner = {
            id:        owner.id,
            unitId:    unit.id,
            name:      form.name.trim(),
            phone:     form.phone.trim(),
            email:     form.email.trim(),
            unitNo:    form.unitNo.trim() || 'D-?',
            floor:     form.floor,
            unitType:  form.unitType,
            totalPay,
            paid,
            projectId,
          }
          setOwners(prev => [newOwner, ...prev])
        }
        setSelectedProjectId(projectId)
      }

      // Giriş bilgilerini global credentials store'a kaydet
      if (form.sifre.trim()) {
        try {
          const creds: { id: string; telefon: string; email: string; sifre: string; slug: string; daireNo: string }[] =
            JSON.parse(localStorage.getItem('malik_credentials') || '[]')
          const credId = editId || `m${Date.now()}`
          const project = projects.find(p => p.id === (form.projectId || selectedProjectId))
          const newCred = {
            id:      credId,
            ad:      form.name.trim(),
            telefon: form.phone.trim(),
            email:   form.email.trim(),
            sifre:   form.sifre.trim(),
            slug:    project?.slug || '',
            daireNo: form.unitNo.trim(),
          }
          const updated = editId
            ? creds.map(c => c.id === editId ? newCred : c)
            : [...creds, newCred]
          localStorage.setItem('malik_credentials', JSON.stringify(updated))
        } catch {}
      }

      setShowPanel(false)
    } catch (err) {
      console.error('Kayıt hatası:', err)
      alert('Kaydetme sırasında hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setSaving(false)
    }
  }

  // ── Sil ──────────────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm('Bu maliki silmek istediğinizden emin misiniz?')) return
    const owner = owners.find(o => o.id === id)

    // 1. Ödemeleri sil
    await supabase.from('payments').delete().eq('owner_id', id)
    // 2. Maliki sil
    await supabase.from('owners').delete().eq('id', id)
    // 3. Daireyi sil
    if (owner?.unitId) {
      await supabase.from('units').delete().eq('id', owner.unitId)
    }

    setOwners(prev => prev.filter(o => o.id !== id))
    if (editId === id) setShowPanel(false)
  }

  const selectedProject = projects.find(p => p.id === selectedProjectId)

  const selectProject = (id: string) => {
    setSelectedProjectId(id)
    setMobileView('owners')
  }

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">

      {/* ── Sayfa başlığı — Masaüstü ── */}
      <div className="hidden md:flex items-center justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-primary-800">Malikler</h1>
          <p className="text-sm text-neutral-500 mt-1">Projelerinize ait daire ve ödeme bilgilerinizle malikleri yönetin.</p>
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

      {/* ── Mobil: Proje listesi ── */}
      {mobileView === 'projects' && (
        <div className="md:hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="font-bold text-2xl text-primary-800">Malikler</h1>
              <p className="text-sm text-neutral-400 mt-0.5">Proje seçin</p>
            </div>
            <button onClick={openAdd} className="flex items-center gap-2 bg-primary-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Ekle
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((p) => {
              const pOwners = owners.filter(o => o.projectId === p.id)
              const pDebt   = pOwners.reduce((s, o) => s + o.totalPay, 0)
              const pPaid   = pOwners.reduce((s, o) => s + o.paid, 0)
              const pRate   = pDebt > 0 ? Math.round((pPaid / pDebt) * 100) : 0
              return (
                <button
                  key={p.id}
                  onClick={() => selectProject(p.id)}
                  className="w-full bg-white border border-neutral-100 rounded-2xl p-4 text-left hover:border-primary-200 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#0A1F44" strokeWidth="1.8"/>
                        <path d="M3 9h18M9 9v12M15 9v12" stroke="#0A1F44" strokeWidth="1.4"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-primary-800 truncate">{p.name}</p>
                      <p className="text-xs text-neutral-400 mt-0.5">{p.location}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="#B0ADA6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">{pOwners.length} Malik</span>
                    <span className="text-neutral-500">{formatCompactTL(pPaid)} / {formatCompactTL(pDebt)}</span>
                    <span className={`font-bold px-2 py-0.5 rounded-lg ${pRate >= 70 ? 'text-success-700 bg-success-50' : pRate >= 40 ? 'text-warning-700 bg-warning-50' : 'text-neutral-400 bg-neutral-100'}`}>
                      %{pRate}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Mobil: Malik listesi ── */}
      {mobileView === 'owners' && (
        <div className="md:hidden">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setMobileView('projects')}
              className="w-9 h-9 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="#0A1F44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg text-primary-800 truncate">{selectedProject?.name}</h2>
              <p className="text-xs text-neutral-400">{projectOwners.length} malik</p>
            </div>
            <button onClick={openAdd} className="flex items-center gap-1.5 bg-primary-800 text-white text-xs font-semibold px-3 py-2 rounded-xl">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
              Malik Ekle
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: 'Toplam Malik',   value: String(projectOwners.length), color: 'text-primary-800' },
              { label: 'Tahsilat Oranı', value: `%${collRate}`,               color: collRate >= 70 ? 'text-success-700' : 'text-warning-700' },
              { label: 'Tahsil Edilen',  value: formatCompactTL(totalPaid),   color: 'text-success-700' },
              { label: 'Toplam Borç',    value: formatCompactTL(totalDebt),   color: 'text-danger-600'  },
            ].map((s) => (
              <div key={s.label} className="bg-white border border-neutral-100 rounded-2xl p-3">
                <p className="text-xs text-neutral-400 mb-1">{s.label}</p>
                <p className={`font-bold text-base ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="relative mb-4">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="8" stroke="#B0ADA6" strokeWidth="1.8"/>
              <path d="M21 21l-4.35-4.35" stroke="#B0ADA6" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Malik adı veya telefon ara..."
              className="w-full bg-white border border-neutral-100 rounded-xl pl-11 pr-4 py-3 text-sm text-primary-800 placeholder-neutral-300 focus:outline-none focus:border-primary-300"
            />
          </div>

          {loadingOwners ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-neutral-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="space-y-3">
              {filtered.map((owner) => {
                const pct         = owner.totalPay > 0 ? Math.round((owner.paid / owner.totalPay) * 100) : 0
                const remaining   = Math.max(owner.totalPay - owner.paid, 0)
                const avatarColor = getAvatarColor(owner.name)
                const initials    = getInitials(owner.name)
                const rateColor   = pct >= 100 ? 'text-success-700 bg-success-50' : pct > 0 ? 'text-warning-700 bg-warning-50' : 'text-neutral-400 bg-neutral-100'
                return (
                  <div key={owner.id} className="bg-white rounded-2xl border border-neutral-100 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs" style={{ backgroundColor: avatarColor }}>
                        {initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-primary-800">{owner.name}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">Daire {owner.unitNo} · {owner.unitType} · {owner.floor}. Kat</p>
                      </div>
                      <button onClick={() => openEdit(owner)} className="w-8 h-8 bg-neutral-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                    <p className="text-xs text-neutral-500 mb-3">{owner.phone}</p>
                    <ProgressBar pct={pct} />
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-3">
                        <div>
                          <p className="text-[10px] text-neutral-400">Ödenen</p>
                          <p className="font-bold text-xs text-success-700">{formatTL(owner.paid)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-400">Kalan</p>
                          <p className="font-bold text-xs text-danger-600">{formatTL(remaining)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-400">Toplam</p>
                          <p className="font-bold text-xs text-primary-800">{formatTL(owner.totalPay)}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${rateColor}`}>%{pct}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Masaüstü layout ── */}
      <div className="hidden md:flex gap-5 items-start">

        {/* Sol panel: Proje listesi */}
        <div className="w-72 flex-shrink-0 space-y-2">
          <div className="flex items-center justify-between mb-3">
            <p className="font-semibold text-sm text-neutral-500">Projeler</p>
            <button onClick={openAdd} className="w-7 h-7 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-neutral-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            projects.map((p) => {
              const isSelected = p.id === selectedProjectId
              const pOwners    = owners.filter(o => o.projectId === p.id)
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProjectId(p.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-colors ${
                    isSelected ? 'bg-primary-50 border-primary-200' : 'bg-white border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50'
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
                    <p className="text-xs text-neutral-400 mt-0.5">{pOwners.length} Malik</p>
                  </div>
                </button>
              )
            })
          )}
        </div>

        {/* Orta: Ana içerik */}
        <div className={`flex-1 min-w-0 ${showPanel ? 'hidden lg:block' : ''}`}>

          {/* Proje başlığı + istatistikler */}
          <div className="bg-white rounded-2xl border border-neutral-100 p-5 mb-4">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-bold text-xl text-primary-800">{selectedProject?.name ?? '—'}</h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#888780"/>
                  </svg>
                  <span className="text-xs text-neutral-400">{selectedProject?.location}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Toplam Malik',   value: String(projectOwners.length),  color: 'text-primary-800' },
                { label: 'Toplam Borç',    value: formatCompactTL(totalDebt),    color: 'text-danger-600'  },
                { label: 'Tahsil Edilen',  value: formatCompactTL(totalPaid),    color: 'text-success-700' },
                { label: 'Tahsilat Oranı', value: `%${collRate}`,                color: collRate >= 70 ? 'text-success-700' : collRate >= 40 ? 'text-warning-700' : 'text-danger-600' },
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

          {/* Liste */}
          {loadingOwners ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => <div key={i} className="h-16 bg-neutral-100 rounded-xl animate-pulse" />)}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState onAdd={openAdd} />
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
              <div className="grid grid-cols-[1fr_140px_140px_180px_100px_80px] gap-4 px-5 py-3 border-b border-neutral-100 bg-neutral-50">
                {['Malik', 'Daire', 'Telefon', 'Ödenen / Toplam', 'Oran', 'İşlem'].map((h) => (
                  <p key={h} className="text-xs font-semibold text-neutral-400">{h}</p>
                ))}
              </div>

              {filtered.map((owner, idx) => {
                const pct         = owner.totalPay > 0 ? Math.round((owner.paid / owner.totalPay) * 100) : 0
                const avatarColor = getAvatarColor(owner.name)
                const initials    = getInitials(owner.name)
                const rateColor   = pct >= 100 ? 'text-success-700 bg-success-50' : pct > 0 ? 'text-warning-700 bg-warning-50' : 'text-neutral-400 bg-neutral-100'
                return (
                  <div
                    key={owner.id}
                    className={`grid grid-cols-[1fr_140px_140px_180px_100px_80px] gap-4 px-5 py-4 items-center ${idx < filtered.length - 1 ? 'border-b border-neutral-100' : ''} hover:bg-neutral-50 transition-colors`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs" style={{ backgroundColor: avatarColor }}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-primary-800 truncate">{owner.name}</p>
                        <p className="text-xs text-neutral-400">{owner.email || 'Malik'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-primary-800">Daire {owner.unitNo} · {owner.unitType}</p>
                      <p className="text-xs text-neutral-400">{owner.floor}. Kat</p>
                    </div>
                    <p className="text-sm text-neutral-600">{owner.phone}</p>
                    <div>
                      <p className="text-sm text-neutral-700 mb-1">
                        <span className="font-semibold text-success-700">{formatTL(owner.paid)}</span>
                        <span className="text-neutral-400"> / {formatTL(owner.totalPay)}</span>
                      </p>
                      <ProgressBar pct={pct} />
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${rateColor}`}>%{pct}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(owner)} className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-neutral-200 transition-colors" title="Düzenle">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(owner.id)} className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center hover:bg-danger-50 transition-colors" title="Sil">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })}

              <div className="px-5 py-3 border-t border-neutral-100 bg-neutral-50">
                <p className="text-xs text-neutral-400">Toplam {filtered.length} kayıt</p>
              </div>
            </div>
          )}
        </div>

        {/* Sağ panel */}
        {showPanel && (
          <div className="hidden md:block w-80 flex-shrink-0 bg-white rounded-2xl border border-neutral-100 p-5 sticky top-4">
            <MalikForm form={form} setForm={setForm} editId={editId} projects={projects} onSave={handleSave} onClose={() => setShowPanel(false)} saving={saving} />
          </div>
        )}
      </div>

      {/* ── Mobil bottom sheet ── */}
      {showPanel && (
        <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center" onClick={() => setShowPanel(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 w-full bg-white rounded-t-3xl px-5 pt-4 pb-10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="mx-auto w-10 h-1 bg-neutral-200 rounded-full mb-4" />
            <MalikForm form={form} setForm={setForm} editId={editId} projects={projects} onSave={handleSave} onClose={() => setShowPanel(false)} saving={saving} />
          </div>
        </div>
      )}
    </div>
  )
}
