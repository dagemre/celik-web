'use client'

import { useState } from 'react'

type PolicyKey = 'gizlilik' | 'kvkk' | 'cerez' | null

const policies: Record<NonNullable<PolicyKey>, { title: string; content: string }> = {
  gizlilik: {
    title: 'Gizlilik Politikası',
    content: '<!-- İçerik yakında eklenecek -->',
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    content: '<!-- İçerik yakında eklenecek -->',
  },
  cerez: {
    title: 'Çerez Politikası',
    content: '<!-- İçerik yakında eklenecek -->',
  },
}

export default function FooterPolicyBar() {
  const [open, setOpen] = useState<PolicyKey>(null)

  const policy = open ? policies[open] : null

  return (
    <>
      {/* Alt bar */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
        <p>© 2026 Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. Tüm hakları saklıdır.</p>
        <div className="flex gap-5">
          <button onClick={() => setOpen('gizlilik')} className="hover:text-white transition-colors">
            Gizlilik Politikası
          </button>
          <button onClick={() => setOpen('kvkk')} className="hover:text-white transition-colors">
            KVKK
          </button>
          <button onClick={() => setOpen('cerez')} className="hover:text-white transition-colors">
            Çerez Politikası
          </button>
        </div>
      </div>

      {/* Modal */}
      {open && policy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setOpen(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Başlık */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="text-[#0A1F44] font-semibold text-lg">{policy.title}</h2>
              <button
                onClick={() => setOpen(null)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A1F44" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* İçerik */}
            <div className="overflow-y-auto px-6 py-6 text-sm text-neutral-600 leading-relaxed">
              {policy.content === '<!-- İçerik yakında eklenecek -->' ? (
                <p className="text-neutral-400 italic">İçerik yakında eklenecek.</p>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: policy.content }} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
