/** @type {import('next').NextConfig} */

const securityHeaders = [
  // Clickjacking önlemi — iframe'de gösterilmesin
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // MIME sniffing engelle
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Referrer bilgisini kısıtla
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // XSS koruma (eski tarayıcılar için)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  // Tarayıcı özellik kısıtlamaları
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
  },
  // HTTPS zorunluluğu (prod'da 1 yıl)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains',
  },
]

const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },

  async headers() {
    return [
      {
        // Tüm sayfalara uygula
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
}

module.exports = nextConfig
