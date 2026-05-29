// Ödeme bilgileri — Admin Ayarlar → Ödeme Bilgileri tab'ından localStorage'a yazılır,
// Malik → Ödeme Yap sayfası buradan okur.

export interface OdemeBank {
  id: string
  name: string
  type: string
  iban: string
  sube: string
  isAna: boolean
}

export interface OdemeConfig {
  sirketAdi: string
  adres: string
  vergiDairesi: string
  vergiNo: string
  mersisNo: string
  kurulusYili: string
  telefon: string
  eposta: string
  iletisimAdres: string
  odemNotu: string
  banks: OdemeBank[]
}

export const DEFAULT_ODEME_CONFIG: OdemeConfig = {
  sirketAdi: 'Çelik İnşaat San. Tic. Ltd. Şti.',
  adres: 'Zeytinlik Mah. Türkçü Sok. Kayalı Apt. B Blok No:6 D:4, Bakırköy / İstanbul',
  vergiDairesi: 'Büyükçekmece',
  vergiNo: '123 456 7890',
  mersisNo: '0123 4567 8900',
  kurulusYili: '2008',
  telefon: '+90 212 421 02 88',
  eposta: 'snrclk@hotmail.com.tr',
  iletisimAdres: 'Zeytinlik Mah. Türkçü Sok. Kayalı Apt. B Blok No:6 D:4, Bakırköy / İstanbul',
  odemNotu: 'Tüm ödemelerinizde açıklama kısmına daire no ve isim yazmayı unutmayınız.',
  banks: [
    { id: 'is',      name: 'Türkiye İş Bankası', type: 'TL Hesabı', iban: 'TR32 0006 4000 0011 1234 5678 90', sube: 'Avcılar Şubesi (1123)', isAna: true  },
    { id: 'garanti', name: 'Garanti BBVA',        type: 'TL Hesabı', iban: 'TR48 0006 2000 1230 0006 8901 23', sube: 'Avcılar Şubesi (629)',  isAna: false },
    { id: 'yk',      name: 'Yapı Kredi Bankası',  type: 'TL Hesabı', iban: 'TR61 0006 7010 0000 0032 4567 89', sube: 'Avcılar Şubesi (7010)', isAna: false },
    { id: 'ziraat',  name: 'Ziraat Bankası',       type: 'TL Hesabı', iban: 'TR17 0001 0012 3456 7890 1234 56', sube: 'Avcılar Şubesi (1234)', isAna: false },
  ],
}

const STORAGE_KEY = 'celik_odeme_config'
export const ODEME_CHANGED_EVENT = 'celikOdemeConfigChanged'

export function getOdemeConfig(): OdemeConfig {
  if (typeof window === 'undefined') return DEFAULT_ODEME_CONFIG
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { ...DEFAULT_ODEME_CONFIG, ...parsed }
    }
  } catch {}
  return DEFAULT_ODEME_CONFIG
}

export function saveOdemeConfig(config: OdemeConfig) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
  window.dispatchEvent(new CustomEvent(ODEME_CHANGED_EVENT))
}
