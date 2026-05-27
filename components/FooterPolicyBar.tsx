'use client'

import { useState } from 'react'

type PolicyKey = 'gizlilik' | 'kvkk' | 'cerez' | null

const MRE = {
  name: 'Emre Dağ',
  brand: 'Mre Creative',
  title: 'UI/UX ve Digital Tasarım Deneyimi',
  email: 'dagemre@gmail.com',
}

const policies: Record<NonNullable<PolicyKey>, { title: string; content: string }> = {
  gizlilik: {
    title: 'Gizlilik Politikası',
    content: `
      <h2 style="font-size:1rem;font-weight:700;color:#0A1F44;margin-bottom:4px;">GİZLİLİK POLİTİKASI</h2>
      <p style="font-size:0.8rem;font-weight:600;color:#0A1F44;margin-bottom:16px;">ÇELİK TAAHHÜT MALİK PANELİ GİZLİLİK SÖZLEŞMESİ VE POLİTİKASI</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">1. Veri Güvenliği ve İzolasyonu</h3>
      <p style="margin-bottom:16px;">Çelik Taahhüt, maliklerin panelde yer alan finansal ve kişisel verilerinin güvenliğine en üst düzeyde önem verir. Sistem, her malikin yalnızca kendi bağımsız bölümüne ait borç, bakiye ve detayları görebileceği şekilde izole edilmiştir. Hiçbir malik, bir diğer malikin kişisel veya finansal verisine erişemez.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">2. Şifreleme ve Altyapı Güvenliği</h3>
      <p style="margin-bottom:16px;">Sistemde kullanılan kullanıcı şifreleri, geri döndürülemez biçimde şifrelenerek (hashing yöntemiyle) veri tabanında saklanır. <strong>celiktaahhut.com</strong> ve <strong>celiktaahhut.com.tr</strong> üzerindeki tüm veri trafiği SSL (Secure Sockets Layer) sertifikası ile şifrelenerek korunmaktadır.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">3. Ödeme Güvenliği Hakkında Bilgilendirme</h3>
      <p style="margin-bottom:16px;">Bu web sitesi üzerinden kredi kartı, banka kartı veya herhangi bir online ödeme sistemi ile tahsilat yapılmamaktadır. Sitede yer alan ödeme paneli, yalnızca maliklerin banka yoluyla yaptığı ödemelerin takibi ve manuel beyanı (dekont/bildirim) amacıyla bilgilendirme odaklı çalışır. Sistem üzerinde kart bilgisi istenmez ve saklanmaz.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">4. Değişiklikler</h3>
      <p>Çelik Taahhüt, sistem özelliklerine veya yasal mevzuata uyum amacıyla bu Gizlilik Politikası'nı dilediği zaman güncelleme hakkını saklı tutar.</p>
    `,
  },
  kvkk: {
    title: 'KVKK Aydınlatma Metni',
    content: `
      <h2 style="font-size:1rem;font-weight:700;color:#0A1F44;margin-bottom:4px;">KVKK AYDINLATMA METNİ</h2>
      <p style="font-size:0.8rem;font-weight:600;color:#0A1F44;margin-bottom:16px;">ÇELİK TAAHHÜT – MALİK PANELİ KVKK AYDINLATMA METNİ</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">1. Veri Sorumlusu</h3>
      <p style="margin-bottom:16px;">6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu olarak [Şirket Tam Unvanı Yazılacak] ("Şirket" veya "Çelik Taahhüt") tarafından aşağıda açıklanan kapsamda işlenebilecektir.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">2. İşlenen Kişisel Verileriniz</h3>
      <p style="margin-bottom:16px;">Malik Paneli'ni kullanımınız kapsamında; Ad-Soyad, T.C. Kimlik No (gerekliyse), Telefon Numarası, E-posta Adresi, Bağımsız Bölüm (Daire/Dükkan) Numarası, Borç/Alacak/Bakiye Bilgileri ve Manuel Ödeme Bildirim Kayıtları işlenmektedir.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">3. Kişisel Verilerin İşlenme Amacı</h3>
      <p style="margin-bottom:8px;">Kişisel verileriniz;</p>
      <ul style="list-style:disc;padding-left:20px;margin-bottom:16px;display:flex;flex-direction:column;gap:6px;">
        <li>Maliklerin panele güvenli giriş yapabilmesi ve kimlik doğrulaması,</li>
        <li>Bina/site yönetimi kapsamındaki borç, aidat ve finansal durumların takibi,</li>
        <li>Maliklere borç, bakiye, genel kurul ve bina detaylarına ilişkin bilgilendirme ile bildirimlerin (SMS/E-posta) gönderilmesi,</li>
        <li>Yönetim ile malikler arasındaki iletişimin sağlıklı yürütülmesi</li>
      </ul>
      <p style="margin-bottom:16px;">yasal amaçlarıyla KVKK'nın 5. maddesinde belirtilen hukuki sebeplere uygun olarak işlenmektedir.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">4. İşlenen Kişisel Verilerin Kimlere ve Hangi Amaçla Aktarılabileceği</h3>
      <p style="margin-bottom:16px;">Kişisel verileriniz, üçüncü taraf reklam veya pazarlama şirketleriyle kesinlikle paylaşılmaz. Verileriniz yalnızca; bilgi teknolojileri altyapısının sağlanması amacıyla yurt içindeki güvenli sunucu (hosting) sağlayıcımıza ve yasal bir zorunluluk doğması halinde yetkili kamu kurum ve kuruluşlarına aktarılabilecektir.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">5. Kişisel Veri Toplamanın Yöntemi ve Hukuki Sebebi</h3>
      <p style="margin-bottom:16px;">Kişisel verileriniz, admin paneli üzerinden yönetim tarafından manuel olarak veya maliklerin siteye ilk kayıt/giriş esnasında elektronik ortamda veri formlarını doldurması yöntemiyle toplanmaktadır. Bu süreç, KVKK m.5/2-c uyarınca "Bir sözleşmenin kurulması veya ifasıyla doğrudan doğruya ilgili olması" ve "Veri sorumlusunun hukuki yükümlülüğü" hukuki sebeplerine dayanır.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">6. İlgili Kişinin (Malikin) Hakları</h3>
      <p>KVKK'nın 11. maddesi uyarınca, [Şirket E-posta Adresi] adresine yazılı başvuruda bulunarak; verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini talep etme hakkına sahipsiniz.</p>
    `,
  },
  cerez: {
    title: 'Çerez Politikası',
    content: `
      <h2 style="font-size:1rem;font-weight:700;color:#0A1F44;margin-bottom:4px;">ÇEREZ (COOKIE) POLİTİKASI</h2>
      <p style="font-size:0.8rem;font-weight:600;color:#0A1F44;margin-bottom:12px;">ÇELİK TAAHHÜT WEB SİTESİ ÇEREZ POLİTİKASI</p>
      <p style="margin-bottom:16px;">Çelik Taahhüt olarak, <strong>celiktaahhut.com</strong> ve <strong>celiktaahhut.com.tr</strong> web sitelerimizde kullanıcı deneyiminizi geliştirmek ve Malik Paneli'nin güvenli çalışmasını sağlamak adına çerezler (cookies) kullanmaktayız.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">1. Kullanılan Çerez Türleri ve Amaçları</h3>
      <p style="margin-bottom:8px;">Sitemizde yalnızca "Zorunlu ve Teknik Çerezler" kullanılmaktadır. Bu çerezler:</p>
      <ul style="list-style:disc;padding-left:20px;margin-bottom:16px;display:flex;flex-direction:column;gap:6px;">
        <li>Maliklerin panele giriş yaptıktan sonra oturumlarının açık kalmasını sağlamak,</li>
        <li>Sayfalar arası geçişte kullanıcının kimliğini doğrulamak,</li>
        <li>Panel güvenliğini korumak amacıyla zorunludur.</li>
      </ul>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">2. Üçüncü Taraf ve Reklam Çerezleri</h3>
      <p style="margin-bottom:16px;">Web sitemizde kullanıcıları takip eden, profil çıkaran veya reklam gösterimi amacıyla veri toplayan üçüncü taraf (pazarlama/reklam) çerezleri kullanılmamaktadır.</p>

      <h3 style="font-weight:600;color:#0A1F44;margin-bottom:6px;">3. Çerezleri Nasıl Kontrol Edebilirsiniz?</h3>
      <p>Kullandığınız internet tarayıcısının (Chrome, Safari, Edge vb.) ayarlar bölümünden çerezleri tamamen engelleyebilir veya silebilirsiniz. Ancak zorunlu teknik çerezleri engellemeniz halinde, Malik Paneli'ne giriş yapmanız ve paneli fonksiyonel kullanmanız teknik olarak mümkün olmayacaktır.</p>
    `,
  },
}

type FormState = { adSoyad: string; email: string; telefon: string; mesaj: string }
const EMPTY: FormState = { adSoyad: '', email: '', telefon: '', mesaj: '' }

export default function FooterPolicyBar() {
  const [open, setOpen] = useState<PolicyKey>(null)
  const [showMre, setShowMre] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const policy = open ? policies[open] : null

  function closeMre() {
    setShowMre(false)
    setTimeout(() => { setForm(EMPTY); setSent(false); setError('') }, 300)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setSent(true) }
      else { setError('Bir hata oluştu, lütfen tekrar dene.') }
    } catch {
      setError('Bağlantı hatası, lütfen tekrar dene.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      {/* Alt bar */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
        {/* Sol — telif */}
        <p className="sm:w-1/3 text-center sm:text-left">© 2026 Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. Tüm hakları saklıdır.</p>

        {/* Orta — Mre Creative */}
        <button
          onClick={() => setShowMre(true)}
          className="sm:w-1/3 flex items-center justify-center gap-1 text-white/20 hover:text-white/60 transition-colors group"
        >
          <span>Made with</span>
          <span className="text-rose-400/50 group-hover:text-rose-400 transition-colors">♥</span>
          <span className="font-medium text-white/30 group-hover:text-white/70 transition-colors">{MRE.brand}</span>
        </button>

        {/* Sağ — politika linkleri */}
        <div className="sm:w-1/3 flex justify-center sm:justify-end gap-5">
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

      {/* Mre Creative Modal */}
      {showMre && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={closeMre}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Üst gradient bant */}
            <div className="bg-gradient-to-br from-[#0A1F44] to-[#1E54C8] relative px-6 pt-8 pb-6 flex flex-col items-center text-center">
              <button
                onClick={closeMre}
                className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
              <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-4">
                <span className="text-xl font-bold text-[#0A1F44]">MC</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">{MRE.brand}</h3>
              <p className="text-sm text-white/70 mb-2">Markanız İçin Kreatif Çözümler ve Estetik Dokunuşlar.</p>
              <p className="text-xs font-semibold text-white/90 tracking-wide">Hemen İletişime Geçin.</p>
            </div>

            <div className="px-6 pt-5 pb-6">

              {sent ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <p className="font-semibold text-[#0A1F44] mb-1">Mesajın ulaştı!</p>
                  <p className="text-sm text-neutral-400">En kısa sürede geri döneceğim.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <input
                    required
                    type="text"
                    placeholder="Ad Soyad *"
                    value={form.adSoyad}
                    onChange={e => setForm(f => ({ ...f, adSoyad: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] transition-colors"
                  />
                  <input
                    required
                    type="email"
                    placeholder="E-posta *"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] transition-colors"
                  />
                  <input
                    type="tel"
                    placeholder="Telefon"
                    value={form.telefon}
                    onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] transition-colors"
                  />
                  <textarea
                    required
                    rows={4}
                    placeholder="Mesajınız *"
                    value={form.mesaj}
                    onChange={e => setForm(f => ({ ...f, mesaj: e.target.value }))}
                    className="w-full border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#0A1F44] transition-colors resize-none"
                  />
                  {error && <p className="text-red-500 text-xs">{error}</p>}
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-[#0A1F44] hover:bg-[#1E54C8] disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                  >
                    {sending ? 'Gönderiliyor...' : 'Mesaj Gönder'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Politika Modal */}
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
