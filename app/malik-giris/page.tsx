'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MalikGirisPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Lütfen tüm alanları doldurun.')
      return
    }

    setLoading(true)

    // localStorage'daki malik_credentials ile kontrol — Supabase kurulunca değişecek
    setTimeout(() => {
      try {
        const creds: { telefon: string; email: string; sifre: string; slug: string }[] =
          JSON.parse(localStorage.getItem('malik_credentials') || '[]')
        const giris = email.trim()
        const found = creds.find(c =>
          (c.telefon === giris || c.email === giris) && c.sifre === password
        )
        if (found) {
          localStorage.setItem('aktif_malik_slug', found.slug)
          router.push('/malik-dashboard')
        } else {
          setLoading(false)
          setError('Telefon/e-posta veya şifre hatalı.')
        }
      } catch {
        setLoading(false)
        setError('Bir hata oluştu, lütfen tekrar deneyin.')
      }
    }, 600)
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col">

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
        <div className="w-full max-w-md">

          {/* Başlık */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#0A1F44] rounded-2xl mb-5">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#0A1F44] mb-1">Malik Girişi</h1>
            <p className="text-gray-500 text-sm">Proje bilgilerinize erişmek için giriş yapın</p>
          </div>

          {/* Kart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">

              {/* E-posta */}
              <div>
                <label className="block text-sm font-semibold text-[#0A1F44] mb-2">
                  Telefon veya E-posta
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="4" width="20" height="16" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="0555 123 45 67 veya ornek@email.com"
                    autoComplete="email"
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
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0A1F44]/20 focus:border-[#0A1F44] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword
                      ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" strokeLinejoin="round"/>
                          <line x1="1" y1="1" x2="23" y2="23" strokeLinecap="round"/>
                        </svg>
                      )
                      : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )
                    }
                  </button>
                </div>
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="text-xs text-[#0A1F44]/60 hover:text-[#0A1F44] transition-colors"
                  >
                    Şifremi unuttum
                  </button>
                </div>
              </div>

              {/* Hata mesajı */}
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

              {/* Giriş butonu */}
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
                ) : (
                  'Giriş Yap'
                )}
              </button>
            </form>
          </div>

          {/* Alt bilgi */}
          <div className="text-center mt-6">
            <p className="text-gray-400 text-xs">
              Hesabınız yok mu veya erişim sorunuz mu var?{' '}
              <a href="tel:+902124210288" className="text-[#0A1F44] font-medium hover:underline">
                Bizimle iletişime geçin
              </a>
            </p>
          </div>

        </div>
      </div>

      {/* Alt footer */}
      <div className="py-5 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. — Tüm hakları saklıdır.
        </p>
      </div>

    </div>
  )
}
