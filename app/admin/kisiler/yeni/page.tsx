'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Project = { id: string; name: string }

const UNIT_TYPES = ['1+1', '2+1', '3+1', '4+1', 'Dükkan', 'Ofis']

// Telefon numarasından son 4 hane şifre üret
function getLast4(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  return digits.length >= 4 ? digits.slice(-4) : digits
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '')
}

export default function MalikEklePage() {
  const router = useRouter()

  const [projects,        setProjects]        = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  // Daire bilgileri
  const [unitNo,   setUnitNo]   = useState('')
  const [floor,    setFloor]    = useState('')
  const [unitType, setUnitType] = useState('2+1')
  const [price,    setPrice]    = useState('')

  // Malik bilgileri
  const [fullName, setFullName] = useState('')
  const [phone,    setPhone]    = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [copied,   setCopied]   = useState(false)

  // Telefon girilince şifreyi otomatik son 4 hane yap
  function handlePhoneChange(val: string) {
    setPhone(val)
    setError('')
    const last4 = getLast4(val)
    if (last4) setPassword(last4)
  }

  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [createdEmail, setCreatedEmail] = useState('')
  const [createdPass,  setCreatedPass]  = useState('')
  const [error,   setError]   = useState('')

  useEffect(() => {
    supabase
      .from('projects')
      .select('id, name')
      .order('name')
      .then(({ data }) => setProjects(data ?? []))
  }, [])

  function copyCredentials() {
    const text = `Çelik İnşaat — Malik Panel Girişi\n\nGiriş adresi: ${window.location.origin}/malik-giris\nTelefon: ${phone}\nŞifre: ${createdPass}\n\nBu bilgileri güvenli saklayınız.`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  async function handleSave() {
    if (!selectedProject) { setError('Lütfen bir proje seçin.'); return }
    if (!unitNo.trim())   { setError('Daire numarası zorunlu.'); return }
    if (!floor.trim())    { setError('Kat numarası zorunlu.'); return }
    if (!fullName.trim()) { setError('Ad soyad zorunlu.'); return }
    if (!phone.trim())    { setError('Telefon numarası zorunlu.'); return }
    if (password.length < 4) { setError('Şifre en az 4 karakter olmalı.'); return }

    setSaving(true)
    setError('')

    // 1) Supabase Auth kullanıcısı oluştur (sunucu tarafında, service_role ile)
    const normalizedPhone = normalizePhone(phone.trim())
    const authRes = await fetch('/api/admin/create-malik', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), password, phone: normalizedPhone }),
    })
    const authJson = await authRes.json()

    if (!authRes.ok) {
      setSaving(false)
      setError('Kullanıcı oluşturulamadı: ' + (authJson.error || 'bilinmeyen hata'))
      return
    }

    const authUserId: string = authJson.auth_user_id

    // 2) Daire oluştur
    const { data: unitData, error: unitErr } = await supabase
      .from('units')
      .insert({
        project_id: selectedProject.id,
        unit_no:    unitNo.trim(),
        floor:      parseInt(floor) || 0,
        type:       unitType,
        price:      price ? parseFloat(price.replace(/[^\d.]/g, '')) : null,
        status:     'satildi',
      })
      .select('id')
      .single()

    if (unitErr) { setSaving(false); setError('Daire eklenemedi: ' + unitErr.message); return }

    // 3) Maliki oluştur — auth_user_id + normalize edilmiş telefon ile
    const { error: ownerErr } = await supabase
      .from('owners')
      .insert({
        project_id:   selectedProject.id,
        unit_id:      unitData.id,
        full_name:    fullName.trim(),
        phone:        normalizedPhone,           // normalize edilmiş (sadece rakam)
        email:        authJson.email,            // gerçek veya otomatik üretilen
        auth_user_id: authUserId,
      })

    setSaving(false)
    if (ownerErr) { setError('Malik eklenemedi: ' + ownerErr.message); return }

    setCreatedEmail(email.trim().toLowerCase())
    setCreatedPass(password)
    setSuccess(true)
  }

  // ── Başarı Ekranı ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm space-y-5">

          {/* Başarı İkonu */}
          <div className="flex flex-col items-center gap-3 mb-2">
            <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-primary-800">Malik Eklendi!</h2>
            <p className="text-sm text-neutral-500 text-center">{fullName} başarıyla kaydedildi. Aşağıdaki bilgileri malике iletin.</p>
          </div>

          {/* Giriş Bilgileri Kartı */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Panel Giriş Bilgileri</p>
            <div className="space-y-2">
              <div className="bg-neutral-50 rounded-xl px-4 py-3">
                <p className="text-[10px] text-neutral-400 mb-1">Telefon (Giriş için)</p>
                <p className="text-sm font-bold text-primary-800">{phone}</p>
              </div>
              <div className="bg-neutral-50 rounded-xl px-4 py-3">
                <p className="text-[10px] text-neutral-400 mb-1">Şifre</p>
                <p className="text-sm font-bold text-primary-800 font-mono">{createdPass}</p>
              </div>
              <div className="bg-neutral-50 rounded-xl px-4 py-3">
                <p className="text-[10px] text-neutral-400 mb-1">Giriş Adresi</p>
                <p className="text-sm font-medium text-primary-800">/malik-giris</p>
              </div>
            </div>

            <button
              onClick={copyCredentials}
              className="w-full flex items-center justify-center gap-2 bg-primary-800 text-white font-bold text-sm py-3 rounded-xl transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  Kopyalandı!
                </>
              ) : (
                <>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
                  WhatsApp için Kopyala
                </>
              )}
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push('/admin/kisiler')}
              className="flex-1 py-3.5 rounded-2xl border border-neutral-200 text-sm font-semibold text-neutral-600"
            >
              Kişiler Listesi
            </button>
            <button
              onClick={() => {
                setSuccess(false)
                setFullName(''); setPhone(''); setEmail('')
                setUnitNo(''); setFloor(''); setPrice('')
                setPassword('')
                setSelectedProject(null)
              }}
              className="flex-1 py-3.5 rounded-2xl bg-primary-800 text-white text-sm font-bold"
            >
              Yeni Malik Ekle
            </button>
          </div>

        </div>
      </div>
    )
  }

  // ── Ana Form ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-neutral-50 pb-36">

      {/* Başlık */}
      <div className="bg-white border-b border-neutral-100 px-5 pt-5 pb-4 flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0A1F44" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div>
          <h1 className="font-bold text-xl text-primary-800">Malik Ekle</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Yeni daire sahibini projeye kaydet.</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-6 max-w-lg mx-auto">

        {/* 1 — Proje Seç */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Proje Seç</p>
          <div className="space-y-2">
            {projects.length === 0 && (
              <p className="text-sm text-neutral-400 py-3 text-center">Yükleniyor...</p>
            )}
            {projects.map((p) => {
              const active = selectedProject?.id === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProject(p)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all text-left ${
                    active ? 'border-primary-800 bg-primary-50' : 'border-neutral-100 bg-white hover:border-neutral-200'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary-100' : 'bg-neutral-100'}`}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
                      <rect x="14" y="3" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
                      <rect x="3" y="14" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
                      <rect x="14" y="14" width="7" height="7" rx="1" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <span className={`text-sm font-medium flex-1 ${active ? 'text-primary-800' : 'text-neutral-700'}`}>{p.name}</span>
                  {active && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polyline points="20 6 9 17 4 12" stroke="#0A1F44" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* 2 — Daire Bilgileri */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Daire Bilgileri</p>
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 bg-white border border-neutral-200 rounded-2xl px-4 py-3">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Daire No</p>
                <input
                  type="text"
                  value={unitNo}
                  onChange={(e) => { setUnitNo(e.target.value); setError('') }}
                  placeholder="Örn: 21"
                  className="w-full text-base font-bold text-primary-800 outline-none placeholder:text-neutral-300 placeholder:font-normal"
                />
              </div>
              <div className="flex-1 bg-white border border-neutral-200 rounded-2xl px-4 py-3">
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1.5">Kat</p>
                <input
                  type="number"
                  inputMode="numeric"
                  value={floor}
                  onChange={(e) => { setFloor(e.target.value); setError('') }}
                  placeholder="Örn: 3"
                  className="w-full text-base font-bold text-primary-800 outline-none placeholder:text-neutral-300 placeholder:font-normal"
                />
              </div>
            </div>

            {/* Daire Tipi */}
            <div>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2 mt-3">Daire Tipi</p>
              <div className="flex gap-2 flex-wrap">
                {UNIT_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setUnitType(t)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      unitType === t
                        ? 'bg-primary-800 text-white border-primary-800'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Satış Bedeli */}
            <div className="mt-3">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
                Satış Bedeli <span className="font-normal normal-case text-neutral-400">(opsiyonel)</span>
              </p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-semibold text-lg pointer-events-none">₺</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border border-neutral-200 rounded-2xl pl-10 pr-4 py-4 text-xl font-bold text-primary-800 outline-none focus:border-primary-400 placeholder:text-neutral-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 3 — Malik Bilgileri */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Malik Bilgileri</p>
          <div className="space-y-2">
            <input
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setError('') }}
              placeholder="Ad Soyad"
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => handlePhoneChange(e.target.value)}
              placeholder="Telefon — 05XX XXX XX XX"
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="E-posta — panel girişi için zorunlu"
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
            />
          </div>
        </div>

        {/* 4 — Panel Şifresi */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Panel Şifresi</p>
            <button
              onClick={() => setPassword(getLast4(phone))}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-900 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="23 4 23 10 17 10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sıfırla (Son 4 Hane)
            </button>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm font-mono font-bold text-primary-800 outline-none focus:border-primary-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPass ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round"/><circle cx="12" cy="12" r="3" strokeLinecap="round"/></svg>
              )}
            </button>
          </div>
          <p className="text-xs text-neutral-400 mt-2 ml-1">
            Maliki bu şifreyle panele gireceğini bildirin. İstersen değiştirebilirsiniz.
          </p>
        </div>

        {/* Hata */}
        {error && (
          <div className="bg-danger-50 border border-danger-100 rounded-2xl px-4 py-3 text-sm text-danger-700">{error}</div>
        )}

      </div>

      {/* Kaydet — sabit alt */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 pt-3"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 bg-primary-800 text-white font-bold text-base py-4 rounded-2xl disabled:opacity-60 transition-all active:scale-[0.98]"
        >
          {saving ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Kaydediliyor...
            </>
          ) : 'Maliki Kaydet'}
        </button>
      </div>

    </div>
  )
}
