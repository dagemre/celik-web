'use client'

import { useState } from 'react'

type Props = {
  ownerEmail?: string
  ownerId?: string
  onOnaylandi: () => void
}

export default function KVKKModal({ ownerEmail, ownerId, onOnaylandi }: Props) {
  const [metinAcik, setMetinAcik] = useState(false)
  const [onaylandi, setOnaylandi]  = useState(false)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata]            = useState('')

  const handleKaydet = async () => {
    if (!onaylandi) return
    setYukleniyor(true)
    setHata('')

    try {
      const res = await fetch('/api/kvkk-onay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ owner_id: ownerId ?? null, email: ownerEmail ?? null }),
      })
      const data = await res.json()

      if (data.success) {
        // localStorage'a da yaz — aynı cihazda tekrar sormasın
        localStorage.setItem('kvkk_onay', 'true')
        localStorage.setItem('kvkk_onay_tarih', new Date().toLocaleString('tr-TR'))
        onOnaylandi()
      } else {
        setHata('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.')
      }
    } catch {
      setHata('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.')
    } finally {
      setYukleniyor(false)
    }
  }

  return (
    // Arka plan — tıklanınca kapanmıyor, zorunlu onay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

        {/* Üst şerit */}
        <div className="bg-[#0A1F44] px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="1.8" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-white text-base">KVKK Aydınlatma Metni</h2>
            <p className="text-white/60 text-xs mt-0.5">Kişisel Verilerin Korunması — Zorunlu Onay</p>
          </div>
        </div>

        <div className="px-6 py-5">

          {/* Kısa açıklama */}
          <p className="text-sm text-neutral-600 mb-4 leading-relaxed">
            Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. olarak kişisel verilerinizi 6698 sayılı KVKK kapsamında işlemekteyiz.
            Sisteme giriş yapabilmek için aydınlatma metnini okumanız ve onaylamanız gerekmektedir.
          </p>

          {/* Metin aç/kapat */}
          <button
            onClick={() => setMetinAcik(a => !a)}
            className="w-full flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 mb-4 text-left hover:bg-neutral-100 transition-colors"
          >
            <span className="text-sm font-semibold text-[#0A1F44]">Aydınlatma Metnini Oku</span>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              className={`transition-transform flex-shrink-0 ${metinAcik ? 'rotate-180' : ''}`}
            >
              <path d="M6 9l6 6 6-6" stroke="#888780" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Aydınlatma Metni */}
          {metinAcik && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-4 max-h-52 overflow-y-auto text-xs text-neutral-600 leading-relaxed space-y-3">
              <p><strong className="text-neutral-800">Veri Sorumlusu:</strong> Çelik Taahhüt İnşaat San. Tic. Ltd. Şti., Zeytinlik Mah. Türkçü Sok. Kayalı Apt. B Blok No:6 D:4, Bakırköy/İstanbul</p>

              <p><strong className="text-neutral-800">İşlenen Kişisel Veriler:</strong> Ad-soyad, telefon numarası, e-posta adresi, daire/birim bilgisi, ödeme durumu ve bakiye bilgileriniz.</p>

              <p><strong className="text-neutral-800">İşleme Amaçları:</strong> Satın aldığınız konut/ticari birimin borcunuzu, bakiyenizi ve ödeme takvinizi size bildirmek; inşaat sürecindeki gelişmeler, duyurular ve resmi bildirimler hakkında sizi SMS ve/veya e-posta yoluyla bilgilendirmek.</p>

              <p><strong className="text-neutral-800">Hukuki Dayanak:</strong> KVKK md. 5/2-(c) — sözleşmenin ifası ve md. 5/2-(f) — meşru menfaat. SMS/E-posta iletişimi için ayrıca açık rızanız alınmaktadır.</p>

              <p><strong className="text-neutral-800">Veri Güvenliği:</strong> Verileriniz şifreli (SSL/TLS) bağlantı ile iletilmekte, Supabase altyapısında güvenli şekilde saklanmaktadır. Yetkisiz erişime karşı teknik ve idari tedbirler alınmaktadır.</p>

              <p><strong className="text-neutral-800">Aktarım:</strong> Kişisel verileriniz üçüncü taraflarla paylaşılmamaktadır. Yasal zorunluluk hâlinde ilgili kamu kurumlarıyla paylaşılabilir.</p>

              <p><strong className="text-neutral-800">Haklarınız (KVKK md. 11):</strong> Kişisel verilerinize erişim, düzeltme, silme, işlemenin kısıtlanması ve itiraz haklarına sahipsiniz. Talepleriniz için: <strong>snrclk@hotmail.com.tr</strong></p>

              <p><strong className="text-neutral-800">Onayın Kaydı:</strong> Bu onayın tarihi, saati ve IP adresi yasal ispat amacıyla kayıt altına alınmaktadır.</p>
            </div>
          )}

          {/* Onay kutusu */}
          <label className="flex items-start gap-3 cursor-pointer mb-5 group">
            <div
              onClick={() => setOnaylandi(v => !v)}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                onaylandi ? 'bg-[#0A1F44] border-[#0A1F44]' : 'border-neutral-300 group-hover:border-[#0A1F44]'
              }`}
            >
              {onaylandi && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-sm text-neutral-700 leading-relaxed" onClick={() => setOnaylandi(v => !v)}>
              <strong>Çelik Taahhüt Malik Paneli KVKK Aydınlatma Metni'ni okudum.</strong> Tarafıma borç, bakiye ve bilgilendirme amaçlı SMS/E-posta gönderilmesini onaylıyorum.
            </span>
          </label>

          {/* Hata */}
          {hata && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
              <p className="text-xs text-red-700">{hata}</p>
            </div>
          )}

          {/* Buton */}
          <button
            onClick={handleKaydet}
            disabled={!onaylandi || yukleniyor}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
              onaylandi && !yukleniyor
                ? 'bg-[#0A1F44] text-white hover:bg-[#152d5e]'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            {yukleniyor ? 'Kaydediliyor...' : 'Onayla ve Devam Et'}
          </button>

          <p className="text-center text-xs text-neutral-400 mt-3">
            Onaylamadan sisteme giriş yapılamaz.
          </p>
        </div>
      </div>
    </div>
  )
}
