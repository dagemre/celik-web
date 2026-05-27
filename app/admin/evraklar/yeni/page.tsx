'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Project = { id: string; name: string }

const EVRAK_TURLERI = ['Resmi Belge', 'Proje', 'Sözleşme', 'Rapor', 'Dekont']

export default function EvrakEklePage() {
  const router = useRouter()

  const [projects,        setProjects]        = useState<Project[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const [name,    setName]    = useState('')
  const [type,    setType]    = useState('Resmi Belge')

  const [saving,  setSaving]  = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  useEffect(() => {
    supabase
      .from('projects')
      .select('id, name')
      .order('name')
      .then(({ data }) => setProjects(data ?? []))
  }, [])

  async function handleSave() {
    if (!selectedProject) { setError('Lütfen bir proje seçin.'); return }
    if (!name.trim())     { setError('Evrak adı zorunlu.'); return }

    setSaving(true)
    setError('')

    const { error: err } = await supabase.from('documents').insert({
      project_id: selectedProject.id,
      name:       name.trim(),
      type,
    })

    setSaving(false)
    if (err) { setError('Hata: ' + err.message); return }
    setSuccess(true)
    setTimeout(() => router.push('/admin/evraklar'), 1500)
  }

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
          <h1 className="font-bold text-xl text-primary-800">Evrak Ekle</h1>
          <p className="text-xs text-neutral-500 mt-0.5">Projeye yeni belge kaydı oluştur.</p>
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
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M14 2v6h6" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinecap="round"/>
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

        {/* 2 — Evrak Türü */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Evrak Türü</p>
          <div className="flex gap-2 flex-wrap">
            {EVRAK_TURLERI.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  type === t
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* 3 — Evrak Adı */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Evrak Adı</p>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError('') }}
            placeholder="Örn: İnşaat Ruhsatı, Statik Hesap Raporu..."
            className="w-full bg-white border border-neutral-200 rounded-2xl px-4 py-3.5 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
          />
        </div>

        {/* Dosya yükleme notu */}
        <div className="bg-info-50 border border-info-100 rounded-2xl px-4 py-3.5 flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="9" stroke="#185FA5" strokeWidth="1.8"/>
            <path d="M12 8v4M12 16h.01" stroke="#185FA5" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p className="text-xs text-info-700 leading-relaxed">
            Dosya yükleme özelliği yakında eklenecek. Şimdilik evrak kaydını oluşturabilir, dosyayı daha sonra ekleyebilirsin.
          </p>
        </div>

        {/* Hata / Başarı */}
        {error && (
          <div className="bg-danger-50 border border-danger-100 rounded-2xl px-4 py-3 text-sm text-danger-700">{error}</div>
        )}
        {success && (
          <div className="bg-success-50 border border-success-100 rounded-2xl px-4 py-3 text-sm text-success-700 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <polyline points="20 6 9 17 4 12" stroke="#0F6E56" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Evrak kaydedildi! Yönlendiriliyor...
          </div>
        )}

      </div>

      {/* Kaydet — sabit alt */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-4 pt-3"
        style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={handleSave}
          disabled={saving || success}
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
          ) : 'Evrakı Kaydet'}
        </button>
      </div>

    </div>
  )
}
