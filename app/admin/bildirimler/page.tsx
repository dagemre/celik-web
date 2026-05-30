'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminBildirimlerPage() {
  const [title,    setTitle]    = useState('')
  const [body,     setBody]     = useState('')
  const [url,      setUrl]      = useState('')
  const [sending,  setSending]  = useState(false)
  const [result,   setResult]   = useState<{ sent?: number; error?: string } | null>(null)
  const [subCount, setSubCount] = useState<number | null>(null)

  useEffect(() => {
    supabase.from('push_subscriptions').select('id', { count: 'exact', head: true })
      .then(({ count }) => setSubCount(count ?? 0))
  }, [])

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) return
    setSending(true); setResult(null)
    try {
      const res  = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), body: body.trim(), url: url.trim() || '/malik-dashboard' }),
      })
      const data = await res.json()
      setResult(data)
      if (data.sent > 0) { setTitle(''); setBody(''); setUrl('') }
    } catch { setResult({ error: 'Baglanti hatasi' }) }
    setSending(false)
  }

  const templates = [
    { label: 'Yeni Duyuru',        title: 'Yeni Duyuru',        body: 'Projenizle ilgili yeni bir duyuru yayinlandi.' },
    { label: 'Odeme Hatirlatma',   title: 'Odeme Hatirlatmasi', body: 'Yaklasan odeme tarihinizi kontrol etmeyi unutmayin.' },
    { label: 'Genel Bilgilendirme',title: 'Celik Insaat',       body: '' },
  ]

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="font-bold text-2xl text-primary-800">Bildirim Gonder</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Tum abonelere push bildirimi gonder.
          {subCount !== null && (
            <span className="ml-2 font-medium text-primary-700">({subCount} abone)</span>
          )}
        </p>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {templates.map(t => (
          <button key={t.label} onClick={() => { setTitle(t.title); if (t.body) setBody(t.body) }}
            className="px-3 py-1.5 bg-primary-50 border border-primary-100 text-primary-700 text-xs font-medium rounded-xl hover:bg-primary-100 transition-colors">
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-neutral-100 p-5 space-y-4">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">Baslik *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Yeni Duyuru"
            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors" />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">Mesaj *</label>
          <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="Bildirim metni..."
            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors resize-none" />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1.5">Link (opsiyonel)</label>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="/malik-dashboard"
            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-primary-800 outline-none focus:border-primary-300 transition-colors" />
        </div>

        {(title || body) && (
          <div className="bg-neutral-50 border border-neutral-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-neutral-400 mb-2">Onizleme</p>
            <div className="flex items-start gap-3">
              <img src="/pwa-icon-192.png" alt="" className="w-10 h-10 rounded-xl flex-shrink-0" />
              <div>
                <p className="font-bold text-sm text-primary-800">{title || 'Baslik'}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{body || 'Mesaj metni...'}</p>
              </div>
            </div>
          </div>
        )}

        {result && (
          result.error
            ? <p className="text-danger-700 text-sm bg-danger-50 border border-danger-100 rounded-xl px-4 py-3">{result.error}</p>
            : <div className="bg-success-50 border border-success-100 rounded-xl px-4 py-3 flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#0F6E56"/><path d="M8 12l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                <p className="text-success-700 text-sm font-medium">{result.sent} aboneye gonderildi.</p>
              </div>
        )}

        <button onClick={handleSend} disabled={sending || !title.trim() || !body.trim()}
          className="w-full bg-primary-800 text-white font-semibold py-3.5 rounded-xl hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2 text-sm">
          {sending && <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg>}
          {sending ? 'Gonderiliyor...' : 'Herkese Gonder'}
        </button>
      </div>
    </div>
  )
}
