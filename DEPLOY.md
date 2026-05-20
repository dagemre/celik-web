# 🚀 Canlıya Alma Talimatları

## Adım 1 — GitHub'a Yükle

1. github.com adresine git → "New repository" tıkla
2. İsim: `celik-taahhut-web` → Create repository
3. Terminali aç (Mac'te Spotlight → Terminal):

```bash
cd ~/Desktop/celik-app/Celik\ Insaat
git init
git add .
git commit -m "ilk yükleme"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/celik-taahhut-web.git
git push -u origin main
```

---

## Adım 2 — Vercel'e Deploy Et

1. vercel.com → "Add New Project"
2. GitHub repo'nu seç: `celik-taahhut-web`
3. Framework: **Next.js** (otomatik tanır)
4. "Deploy" tıkla → 2-3 dakikada hazır

---

## Adım 3 — GoDaddy Domain Bağla

1. Vercel → Project → Settings → Domains
2. `celiktaahhut.com` ekle
3. Vercel sana şunu gösterir: `76.76.21.21` (A Record)

**GoDaddy panelinde:**
1. godaddy.com → Hesabım → Domain → DNS
2. Mevcut A Record'u düzenle → Value: `76.76.21.21`
3. CNAME www: `cname.vercel-dns.com`
4. Kaydet → 10-30 dakika bekle

---

✅ Site yayında: https://celiktaahhut.com
