'use client'

import { useEffect, useRef, useState } from 'react'

type PolicyKey = 'gizlilik' | 'kvkk' | 'cerez' | null

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

export default function FooterPolicyBar() {
  const [open, setOpen] = useState<PolicyKey>(null)
  const mreRef = useRef<HTMLAnchorElement>(null)

  const policy = open ? policies[open] : null

  // Mobil: link %90 görünür olunca animasyonu 2.6 sn otomatik oynat
  useEffect(() => {
    const el = mreRef.current
    if (!el) return
    // Sadece hover desteği olmayan cihazlarda (mobil/tablet)
    if (window.matchMedia('(hover: hover)').matches) return

    let timer: ReturnType<typeof setTimeout>
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.9) {
          el.classList.add('is-beating')
          clearTimeout(timer)
          timer = setTimeout(() => el.classList.remove('is-beating'), 2600)
        } else {
          el.classList.remove('is-beating')
        }
      },
      { threshold: 0.9 }
    )
    observer.observe(el)
    return () => { observer.disconnect(); clearTimeout(timer) }
  }, [])

  return (
    <>
      {/* Alt bar */}
      <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/30 text-xs">
        {/* Sol — telif */}
        <p className="sm:w-1/3 text-center sm:text-left">© 2026 Çelik Taahhüt İnşaat San. Tic. Ltd. Şti. Tüm hakları saklıdır.</p>

        {/* Orta — Mre Creative */}
        <a
          ref={mreRef}
          href="https://m-re.org/"
          target="_blank"
          rel="noopener"
          className="madewith sm:w-1/3 justify-center"
        >
          Made with <span className="heart">❤</span> <span className="madewith__name">Mre Creative</span>
        </a>

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

      {/* Mre Creative link animasyonları */}
      <style>{`
        .madewith {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          line-height: 1rem;
          color: rgba(255, 255, 255, 0.3);
          transition: color 0.3s ease, transform 0.3s ease;
          will-change: transform;
        }
        .madewith .heart {
          color: #d6212a;
          display: inline-block;
          position: relative;
        }
        .madewith .heart::before,
        .madewith .heart::after {
          content: '❤';
          position: absolute;
          left: 50%;
          top: -2px;
          font-size: 8px;
          color: #d6212a;
          opacity: 0;
          pointer-events: none;
        }
        .madewith__name {
          position: relative;
          font-weight: 500;
        }
        .madewith__name::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: -2px;
          width: 100%;
          height: 1.5px;
          background: #d6212a;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s ease;
        }
        .madewith:hover,
        .madewith.is-beating {
          color: #ffffff;
          transform: translateY(-2px);
        }
        .madewith:hover .heart,
        .madewith.is-beating .heart {
          animation: mre-heartbeat 1.1s ease-in-out infinite;
        }
        .madewith:hover .heart::before,
        .madewith.is-beating .heart::before {
          animation: mre-heartfly-l 1.1s ease-out infinite;
        }
        .madewith:hover .heart::after,
        .madewith.is-beating .heart::after {
          animation: mre-heartfly-r 1.1s ease-out infinite;
          animation-delay: 0.55s;
        }
        .madewith:hover .madewith__name::after,
        .madewith.is-beating .madewith__name::after {
          transform: scaleX(1);
        }
        @keyframes mre-heartbeat {
          0%   { transform: scale(1); }
          20%  { transform: scale(1.4); }
          35%  { transform: scale(1); }
          55%  { transform: scale(1.3); }
          70%  { transform: scale(1); }
          100% { transform: scale(1); }
        }
        @keyframes mre-heartfly-l {
          0%   { opacity: 0; transform: translate(-50%, 0) rotate(0deg); }
          30%  { opacity: 0.9; }
          100% { opacity: 0; transform: translate(-110%, -24px) rotate(-18deg); }
        }
        @keyframes mre-heartfly-r {
          0%   { opacity: 0; transform: translate(-50%, 0) rotate(0deg); }
          30%  { opacity: 0.9; }
          100% { opacity: 0; transform: translate(10%, -24px) rotate(16deg); }
        }
      `}</style>

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
