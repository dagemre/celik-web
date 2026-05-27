'use client'

import { useFirmaConfig } from './FirmaIletisimBilgi'

export default function FooterIletisim() {
  const firma = useFirmaConfig()

  return (
    <div>
      <h4 className="text-white text-sm font-semibold mb-4">İletişim</h4>
      <ul className="space-y-3">
        <li className="flex items-start gap-2.5 text-white/50 text-sm">
          <svg width="15" height="15" className="mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span dangerouslySetInnerHTML={{ __html: firma.adres.replace(/,/g, '<br />') }} />
        </li>
        <li>
          <a href={`tel:${firma.telefon.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-white/50 hover:text-white text-sm transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.72 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.63 1.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {firma.telefon}
          </a>
        </li>
        {firma.cepTelefonu && (
          <li>
            <a href={`tel:${firma.cepTelefonu.replace(/\s/g, '')}`} className="flex items-center gap-2.5 text-white/50 hover:text-white text-sm transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
              {firma.cepTelefonu}
            </a>
          </li>
        )}
        <li>
          <a href={`mailto:${firma.eposta}`} className="flex items-center gap-2.5 text-white/50 hover:text-white text-sm transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
            {firma.eposta}
          </a>
        </li>
      </ul>
    </div>
  )
}
