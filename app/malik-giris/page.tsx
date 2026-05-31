'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function MalikGirisPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  async function handleLogin() {
    if (!email.trim())    { setError('E-posta adresi zorunlu.'); return }
    if (!password.trim()) { setError('Şifre zorunlu.'); return }

    setLoading(true)
    setError('')

    const { error: authErr } = await supabase.auth.signInWithPassword({
      email:    email.trim().toLowerCase(),
      password: password.trim(),
    })

    setLoading(false)

    if (authErr) {
      if (authErr.message.includes('Invalid login')) {
        setError('E-posta veya şifre hatalı. Lütfen kontrol edin.')
      } else {
        setError(authErr.message)
      }
      return
    }

    router.push('/malik-dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F4F6FA] flex flex-col items-center justify-center px-5 py-10">

      {/* Logo / Başlık */}
      <div className="flex flex-col items-center mb-10">
        <div className="w-14 h-14 bg-[#0A1F44] rounded-2xl flex items-center justify-center mb-4 shadow-lg">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="9 22 9 12 15 12 15 22" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#0A1F44]">Malik Paneli</h1>
        <p className="text-sm text-gray-400 mt-1 text-center">Çelik İnşaat · Daire Takip Sistemi</p>
      </div>

      {/* Form Kartı */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-100 p-7 space-y-4">

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">E-posta</p>
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="ornek@gmail.com"
            autoComplete="email"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#0A1F44] outline-none focus:border-[#0A1F44] placeholder:text-gray-300 transition-colors"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Şifre</p>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError('') }}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="••••••••••"
              autoComplete="current-password"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-[#0A1F44] outline-none focus:border-[#0A1F44] pr-11 placeholder:text-gray-300 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeLinecap="round"/>
                  <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="3" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#0A1F44] text-white font-bold py-4 rounded-xl text-sm disabled:opacity-60 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              Giriş yapılıyor...
            </>
          ) : 'Giriş Yap'}
        </button>

      </div>

      <p className="text-xs text-gray-400 mt-8 text-center">
        Giriş bilgilerinizi yöneticinizden alabilirsiniz.
      </p>

    </div>
  )
}
