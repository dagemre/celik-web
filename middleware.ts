import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN
const COOKIE_NAME = 'celik_admin_session'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin altındaki tüm rotaları koru (login sayfası hariç)
  if (pathname.startsWith('/admin')) {
    // Env var tanımlı değilse hiçbir zaman geçirme
    if (!ADMIN_SESSION_TOKEN) {
      return NextResponse.redirect(new URL('/admin-giris', request.url))
    }

    const sessionCookie = request.cookies.get(COOKIE_NAME)
    if (!sessionCookie || sessionCookie.value !== ADMIN_SESSION_TOKEN) {
      // Giriş sonrası geri dönülecek URL'i parametre olarak ekle
      const loginUrl = new URL('/admin-giris', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
