'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Project = { id: string; name: string }

const EVRAK_TURLERI = ['Resmi Belge', 'Proje', 'Sözleşme', 'Rapor', 'Dekont']
const KLASORLER     = ['Ruhsat', 'Sözleşmeler', 'Teknik Projeler', 'Finansal', 'Yazışmalar', 'Diğer']

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function EvrakEklePage() {
  const router      = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [projects,         setProjects]        = useState<Project[]>([])
  const [selectedProject,  setSelectedProject] = useState<Project | null>(null)
  const [name,             setName]            = useState('')
  const [type,             setType]            = useState('Resmi Belge')
  const [folder,           setFolder]          = useState('Ruhsat')
  const [yeniKlasor,       setYeniKlasor]      = useState('')
  const [file,             setFile]            = useState<File | null>(null)
  const [dragOver,         setDragOver]        = useState(false)
  const [uploading,        setUploading]       = useState(false)
  const [progress,         setProgress]        = useState(0)
  const [success,          setSuccess]         = useState(false)
  const [error,            setError]           = useState('')

  useEffect(() => {
    supabase
      .from('projects')
      .select('id, name')
      .order('name')
      .then(({ data }) => setProjects(data ?? []))
  }, [])

  function handleFileSelect(f: File) {
    if (f.size > 50 * 1024 * 1024) {
      setError('Dosya 50 MB\'den büyük olamaz.')
      return
    }
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg', 'image/png']
    if (!allowed.includes(f.type) && !f.name.endsWith('.pdf')) {
      setError('Yalnızca PDF, DOC, DOCX, JPG veya PNG yüklenebilir.')
      return
    }
    setFile(f)
    setError('')
    if (!name.trim()) setName(f.name.replace(/\.[^/.]+$/, ''))
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) handleFileSelect(f)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files?.[0]
    if (f) handleFileSelect(f)
  }

  async function handleSave() {
    if (!selectedProject) { setError('Lütfen bir proje seçin.'); return }
    if (!name.trim())      { setError('Evrak adı zorunlu.'); return }
    if (!file)             { setError('Lütfen bir dosya seçin.'); return }

    const klasorAd  = yeniKlasor.trim() || folder
    const timestamp = Date.now()
    const safeName  = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const storagePath = `${selectedProject.id}/${timestamp}-${safeName}`

    setUploading(true)
    setProgress(10)
    setError('')

    // 1 — Supabase Storage'a yükle
    const { error: uploadErr } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, { cacheControl: '3600', upsert: false })

    if (uploadErr) {
      setError('Yükleme hatası: ' + uploadErr.message)
      setUploading(false)
      setProgress(0)
      return
    }

    setProgress(70)

    // 2 — Public URL al
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(storagePath)

    // 3 — documents tablosuna kaydet
    const { error: dbErr } = await supabase.from('documents').insert({
      project_id:   selectedProject.id,
      name:         name.trim(),
      type,
      folder:       klasorAd,
      file_url:     urlData.publicUrl,
      file_size:    formatFileSize(file.size),
      storage_path: storagePath,
      is_shared:    false,
    })

    setProgress(100)
    setUploading(false)

    if (dbErr) {
      // Rollback: storage'dan sil
      await supabase.storage.from('documents').remove([storagePath])
      setError('Kayıt hatası: ' + dbErr.message)
      setProgress(0)
      return
    }

    setSuccess(true)
    setTimeout(() => router.push('/admin/evraklar'), 1600)
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
          <h1 className="font-bold text-xl text-primary-800">Evrak Yükle</h1>
          <p className="text-xs text-neutral-500 mt-0.5">PDF veya belge dosyasını projeye ekle.</p>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-6 max-w-lg mx-auto">

        {/* 1 — Dosya Seç */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Dosya</p>

          {file ? (
            /* Seçili dosya */
            <div className="bg-white border border-neutral-200 rounded-2xl px-4 py-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-danger-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#A32D2D" strokeWidth="1.6" strokeLinejoin="round"/>
                  <path d="M14 2v6h6" stroke="#A32D2D" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-primary-800 truncate">{file.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{formatFileSize(file.size)}</p>
              </div>
              <button
                onClick={() => { setFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors flex-shrink-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="#888780" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          ) : (
            /* Upload alanı */
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-neutral-200 bg-white hover:border-primary-300 hover:bg-neutral-50'
              }`}
            >
              <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#0A1F44" strokeWidth="1.6" strokeLinejoin="round" opacity="0.5"/>
                  <path d="M14 2v6h6M12 12v6M9 15l3-3 3 3" stroke="#0A1F44" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                </svg>
              </div>
              <p className="font-semibold text-sm text-primary-800 mb-1">
                {dragOver ? 'Bırakın...' : 'Dosyayı buraya sürükleyin'}
              </p>
              <p className="text-xs text-neutral-400 mb-3">veya tıklayarak seçin</p>
              <span className="px-3 py-1.5 bg-primary-800 text-white text-xs font-semibold rounded-xl">
                Dosya Seç
              </span>
              <p className="text-[11px] text-neutral-400 mt-2.5">PDF, DOC, DOCX, JPG, PNG · Maks. 50 MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,application/pdf"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* 2 — Proje Seç */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Proje</p>
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
                      <path d="M3 21V9l9-6 9 6v12H3z" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinejoin="round"/>
                      <path d="M9 21V12h6v9" stroke={active ? '#0A1F44' : '#A5A49C'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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

        {/* 4 — Evrak Türü */}
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

        {/* 5 — Klasör */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">Klasör</p>
          <div className="flex gap-2 flex-wrap mb-3">
            {KLASORLER.map((k) => (
              <button
                key={k}
                onClick={() => { setFolder(k); setYeniKlasor('') }}
                className={`px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  folder === k && !yeniKlasor
                    ? 'bg-primary-800 text-white border-primary-800'
                    : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={yeniKlasor}
            onChange={(e) => setYeniKlasor(e.target.value)}
            placeholder="+ Yeni klasör adı..."
            className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm text-neutral-700 outline-none focus:border-primary-400 placeholder:text-neutral-300"
          />
        </div>

        {/* Progress bar */}
        {uploading && (
          <div className="bg-white border border-neutral-100 rounded-2xl px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <svg className="animate-spin flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#E5E2D9" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="#0A1F44" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <span className="text-sm font-medium text-primary-800">Yükleniyor...</span>
              <span className="ml-auto text-sm text-neutral-500">{progress}%</span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-800 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Hata */}
        {error && (
          <div className="bg-danger-50 border border-danger-100 rounded-2xl px-4 py-3 text-sm text-danger-700">{error}</div>
        )}

        {/* Başarı */}
        {success && (
          <div className="bg-success-50 border border-success-100 rounded-2xl px-4 py-3.5 text-sm text-success-700 flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <circle cx="12" cy="12" r="10" stroke="#0F6E56" strokeWidth="1.8"/>
              <polyline points="8 12 11 15 16 9" stroke="#0F6E56" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Evrak yüklendi! Yönlendiriliyor...
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
          disabled={uploading || success}
          className="w-full max-w-lg mx-auto flex items-center justify-center gap-2 bg-primary-800 text-white font-bold text-base py-4 rounded-2xl disabled:opacity-60 transition-all active:scale-[0.98]"
        >
          {uploading ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Yükleniyor...
            </>
          ) : 'Evrakı Yükle'}
        </button>
      </div>

    </div>
  )
}
