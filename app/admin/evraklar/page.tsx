'use client'

const EVRAKLAR = [
  { id: 'e1', name: 'Kemal Apartman — İnşaat Ruhsatı.pdf',   project: 'Kemal Apartman',     category: 'Ruhsat',  date: '12.03.2025', size: '2.4 MB' },
  { id: 'e2', name: 'Gülbahçe — Mimari Proje.pdf',            project: 'Gülbahçe Apartmanı', category: 'Mimari',  date: '05.01.2025', size: '8.1 MB' },
  { id: 'e3', name: 'Doğa Rezidans — Statik Proje.pdf',       project: 'Doğa Rezidans',      category: 'Statik',  date: '22.04.2025', size: '5.6 MB' },
  { id: 'e4', name: 'Yazgan Konutları — Elektrik Projesi.pdf', project: 'Yazgan Konutları',   category: 'Elektrik',date: '14.02.2025', size: '3.2 MB' },
  { id: 'e5', name: 'Kemal Apartman — Zemin Etüdü.pdf',       project: 'Kemal Apartman',     category: 'Zemin',   date: '18.11.2024', size: '1.8 MB' },
]

const CAT_COLORS: Record<string, string> = {
  Ruhsat:   'bg-info-50 text-info-700',
  Mimari:   'bg-success-50 text-success-700',
  Statik:   'bg-warning-50 text-warning-700',
  Elektrik: 'bg-danger-50 text-danger-700',
  Zemin:    'bg-neutral-100 text-neutral-600',
}

export default function AdminEvraklarPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-bold text-2xl text-primary-800">Evraklar</h1>
          <p className="text-sm text-neutral-500 mt-1">Proje bazlı belgeler ve teknik dökümanlar.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-800 text-white px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-700 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          Evrak Yükle
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
        <div className="grid grid-cols-[1fr_auto_auto_auto_auto] text-xs font-medium text-neutral-500 px-5 py-3 border-b border-neutral-100 bg-neutral-50">
          <span>Dosya Adı</span>
          <span className="w-32 text-center">Proje</span>
          <span className="w-24 text-center">Kategori</span>
          <span className="w-24 text-center">Tarih</span>
          <span className="w-16 text-center">Boyut</span>
        </div>
        {EVRAKLAR.map((e, i) => (
          <div key={e.id} className={`grid grid-cols-[1fr_auto_auto_auto_auto] items-center px-5 py-4 hover:bg-neutral-50 transition-colors ${i < EVRAKLAR.length - 1 ? 'border-b border-neutral-50' : ''}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-info-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="#185FA5" strokeWidth="1.8" strokeLinejoin="round" />
                  <path d="M14 2v6h6" stroke="#185FA5" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="font-medium text-sm text-primary-800 truncate">{e.name}</span>
            </div>
            <span className="w-32 text-center text-xs text-neutral-500">{e.project}</span>
            <span className={`w-24 text-center text-[10px] font-bold px-2 py-1 rounded-lg ${CAT_COLORS[e.category] ?? 'bg-neutral-100 text-neutral-600'}`}>
              {e.category}
            </span>
            <span className="w-24 text-center text-xs text-neutral-500">{e.date}</span>
            <span className="w-16 text-center text-xs text-neutral-400">{e.size}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
