'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Project = {
  id: string
  name: string
  slug: string
  location: string
  district: string
  city: string
  tip: string
  status: string
  floors: number
  units_count: number
  area: string
  delivery_year: string
  progress: number
  image_url: string
}

type StatusFilter = 'Tümü' | 'devam' | 'tamamlandi' | 'yakinda'
type TabFilter = 'devam' | 'tamamlanan'

const STATUS_LABEL: Record<string, string> = {
  devam:       'Devam Ediyor',
  tamamlandi:  'Tamamlandı',
  yakinda:     'Planlama',
}
const STATUS_STYLE: Record<string, { bg: string; text: string; bar: string }> = {
  devam:      { bg: 'bg-success-50', text: 'text-success-700', bar: '#0F6E56' },
  tamamlandi: { bg: 'bg-info-50',    text: 'text-info-700',    bar: '#185FA5' },
  yakinda:    { bg: 'bg-warning-50', text: 'text-warning-700', bar: '#BA7517' },
}

function ProjectCard({ project }: { project: Project }) {
  const s = STATUS_STYLE[project.status] ?? STATUS_STYLE['devam']
  const label = STATUS_LABEL[project.status] ?? project.status
  const location = [project.district, project.city].filter(Boolean).join(' / ') || project.location

  return (
    <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-44">
        {project.image_url ? (
          <img src={project.image_url} alt={project.name} className="w-full h-full object-cover" style={{ imageOrientation: 'from-image' }} />
        ) : (
          <div className="w-full h-full bg-neutral-100 flex items-center justify-center">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path d="M3 21V9l9-6 9 6v12H3z" stroke="#D3D1C7" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        )}
        <span className={`absolute top-3 left-3 ${s.bg} ${s.text} text-[10px] font-bold px-2 py-1 rounded-lg`}>
          {label}
        </span>
        <span className="absolute top-3 right-3 bg-white/90 text-primary-800 text-[10px] font-medium px-2 py-1 rounded-lg">
          {project.tip}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base text-primary-800 mb-1 truncate">{project.name}</h3>
        <p className="text-xs text-neutral-500 mb-3 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#888780" />
          </svg>
          {location}
        </p>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <p className="text-[10px] text-neutral-400">Kat</p>
            <p className="font-bold text-sm text-primary-800">{project.floors ?? '—'}</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-400">Daire</p>
            <p className="font-bold text-sm text-primary-800">{project.units_count ?? '—'}</p>
          </div>
          <div>
            <p className="text-[10px] text-neutral-400">Teslim</p>
            <p className="font-bold text-sm text-primary-800">{project.delivery_year ?? '—'}</p>
          </div>
        </div>
        {project.status !== 'tamamlandi' && (
          <>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] text-neutral-400">İlerleme</span>
              <span className="text-[11px] font-bold" style={{ color: s.bar }}>%{project.progress ?? 0}</span>
            </div>
            <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${project.progress ?? 0}%`, backgroundColor: s.bar }} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function AdminProjelerPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<TabFilter>('devam')
  const [tipFilter, setTipFilter] = useState('Tümü')

  useEffect(() => {
    async function fetchProjects() {
      const { data, error } = await supabase
        .from('projects')
        .select('id,name,slug,location,district,city,tip,status,floors,units_count,area,delivery_year,progress,image_url')
        .order('created_at', { ascending: false })
      if (error) { setError(error.message); setLoading(false); return }
      setProjects(data || [])
      setLoading(false)
    }
    fetchProjects()
  }, [])

  const devam = projects.filter((p) => p.status !== 'tamamlandi')
  const tamamlanan = projects.filter((p) => p.status === 'tamamlandi')
  const base = tab === 'devam' ? devam : tamamlanan

  const filtered = base.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.toLowerCase().includes(search.toLowerCase()) ||
      p.district?.toLowerCase().includes(search.toLowerCase())
    const matchTip = tipFilter === 'Tümü' || p.tip === tipFilter
    return matchSearch && matchTip
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-primary-800">Projeler</h1>
          <p className="text-sm text-neutral-500 mt-1">Tüm projelerinizi görüntüleyebilir ve yönetebilirsiniz.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Yeni Proje Ekle
        </button>
      </div>

      {/* Arama + Filtreler */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 bg-white border border-neutral-100 rounded-xl px-4 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="#888780" strokeWidth="1.8" />
            <path d="M16.5 16.5l4 4" stroke="#888780" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Proje adı veya lokasyon ara..."
            className="flex-1 py-2.5 text-sm text-primary-800 outline-none bg-transparent placeholder:text-neutral-400"
          />
        </div>
        <select
          value={tipFilter}
          onChange={(e) => setTipFilter(e.target.value)}
          className="bg-white border border-neutral-100 rounded-xl px-3 py-2.5 text-sm text-primary-800 outline-none"
        >
          <option>Tümü</option>
          <option>Konut</option>
          <option>Ticari</option>
        </select>
      </div>

      {/* Tab */}
      <div className="flex border-b border-neutral-100 mb-5">
        {(['devam', 'tamamlanan'] as TabFilter[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-primary-800 text-primary-800' : 'border-transparent text-neutral-500 hover:text-primary-800'
            }`}
          >
            {t === 'devam' ? `Devam Eden (${devam.length})` : `Tamamlanan (${tamamlanan.length})`}
          </button>
        ))}
      </div>

      {/* İçerik */}
      {loading && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
              <div className="h-44 bg-neutral-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-100 rounded w-3/4" />
                <div className="h-3 bg-neutral-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
      {error && (
        <div className="bg-danger-50 border border-danger-100 rounded-xl p-4 text-danger-700 text-sm">{error}</div>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center py-20">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path d="M3 21V9l9-6 9 6v12H3z" stroke="#D3D1C7" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
          <p className="text-neutral-400 font-medium mt-3">Proje bulunamadı</p>
        </div>
      )}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((p) => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}
    </div>
  )
}
