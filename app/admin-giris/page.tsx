'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function AdminGirisForm() {
  const [username,    setUsername]    = useState('')
  const [password,    setPassword]    = useState('')
  const [showPass,    setShowPass]    = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState('')
  const router      = useRouter()
  const searchParams = useSearchParams()
  const redirect    = searchParams.get('redirect') || '/admin'

  useEffect(() => {}, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username) { setError('Kullanıcı adı gerekli.'); return }
    if (!password) { setError('Şifre gerekli.'); return }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin-giris', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username, password, redirect }),
      })
      const data = await res.json()

      if (res.ok) {
        router.push(data.redirect || '/admin')
        router.refresh()
      } else {
        setError(data.error || 'Giriş başarısız.')
        setLoading(false)
      }
    } catch {
      setError('Sunucu hatası. Tekrar deneyin.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* Üst bar */}
      <div className="bg-[#0A1F44] px-6 py-4 flex items-center justify-between">
        <Link href="/">
          <img
            src="/celik-logo.svg"
            alt="Çelik Taahhüt İnşaat"
            className="h-12 w-auto brightness-0 invert"
          />
        </Link>
        <Link
          href="/"
          className="text-white/70 hover:text-white text-sm flex items-center gap-1.5 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M5 12l7-7M5 12l7 7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Ana Sayfaya Dön
        </Link>
      </div>

      {/* İçerik */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm">

          {/* Başlık */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A1F44] rounded-2xl mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#0A1F44] mb-1">Admin Girişi</h1>
            <p className="text-gray-500 text-sm">Yönetim paneline erişmek için şifrenizi girin</p>
          </div>

          {/* Kart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* Kullanıcı Adı */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="8" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError('') }}
                    placeholder="admin"
                    autoComplete="username"
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A1F44]/20 focus:border-[#0A1F44] transition-all"
                  />
                </div>
              </div>

              {/* Şifre */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError('') }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A1F44]/20 focus:border-[#0A1F44] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPass
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" strokeLinejoin="round"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" strokeLinejoin="round"/><line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
                    <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="12" y1="8" x2="12" y2="12" strokeLinecap="round"/>
                    <line x1="12" y1="16" x2="12.01" y2="16" strokeLinecap="round"/>
                  </svg>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0A1F44] hover:bg-[#0d2a5e] text-white text-sm font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Giriş yapılıyor...
                  </>
                ) : 'Giriş Yap'}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-400 text-xs">
              Şifrenizi mi unuttunuz?{' '}
              <a href="mailto:dagemre@gmail.com" className="text-[#0A1F44] font-medium hover:underline">
                Sistem yöneticisiyle iletişime geçin
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="py-5 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Çelik Taahhüt İnşaat San. Tic. Ltd. Şti.
        </p>
      </div>
    </div>
  )
}

export default function AdminGirisPage() {
  return (
    <Suspense>
      <AdminGirisForm />
    </Suspense>
  )
}
