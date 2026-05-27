// Firma bilgileri — Admin Ayarlar'dan localStorage'a yazılır,
// Footer ve İletişim sayfası buradan okur.

export interface FirmaConfig {
  sirketAdi: string
  telefon: string
  cepTelefonu: string
  eposta: string
  adres: string
}

export const DEFAULT_FIRMA: FirmaConfig = {
  sirketAdi: 'Çelik Taahhüt İnşaat San. Tic. Ltd. Şti.',
  telefon: '+90 212 421 02 88',
  cepTelefonu: '+90 532 272 30 33',
  eposta: 'snrclk@hotmail.com.tr',
  adres: 'Zeytinlik Mah. Türkçü Sok. Kayalı Apt. B Blok No:6 D:4, Bakırköy/İstanbul',
}

const STORAGE_KEY = 'celik_firma_config'
export const FIRMA_CHANGED_EVENT = 'celikFirmaConfigChanged'

export function getFirmaConfig(): FirmaConfig {
  if (typeof window === 'undefined') return DEFAULT_FIRMA
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return { ...DEFAULT_FIRMA, ...JSON.parse(stored) }
  } catch {}
  return DEFAULT_FIRMA
}

export function saveFirmaConfig(config: FirmaConfig) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  window.dispatchEvent(new CustomEvent(FIRMA_CHANGED_EVENT))
}
