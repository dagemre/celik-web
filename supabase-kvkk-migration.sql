-- =============================================
-- KVKK Onay Alanları — owners tablosuna eklenir
-- Supabase → SQL Editor'da çalıştır
-- =============================================

ALTER TABLE owners
  ADD COLUMN IF NOT EXISTS kvkk_onay        boolean     DEFAULT false,
  ADD COLUMN IF NOT EXISTS kvkk_onay_tarihi timestamptz DEFAULT null,
  ADD COLUMN IF NOT EXISTS kvkk_onay_ip     text        DEFAULT null;

-- Ayrıca denetim amaçlı ayrı bir log tablosu (önerilir)
-- Malik ilerleyen süreçte onayı geri çekse dahi geçmiş kayıt burada durur
CREATE TABLE IF NOT EXISTS kvkk_log (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid        REFERENCES owners(id) ON DELETE SET NULL,
  email       text,                          -- owner silinse bile email kalsın
  onay        boolean     NOT NULL,          -- true = onaylandı, false = geri çekildi
  ip_adresi   text,
  user_agent  text,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE kvkk_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_all" ON kvkk_log FOR ALL USING (true) WITH CHECK (true);

-- Index: owner bazlı hızlı sorgulama
CREATE INDEX IF NOT EXISTS kvkk_log_owner_idx ON kvkk_log (owner_id);
