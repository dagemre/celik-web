-- =============================================
-- Çelik İnşaat — Evrak Yükleme Migrasyonu
-- Supabase SQL Editor'da çalıştır
-- =============================================

-- 1. documents tablosuna eksik kolonlar ekle
alter table documents
  add column if not exists folder       text,
  add column if not exists file_size    text,
  add column if not exists is_shared    boolean not null default false,
  add column if not exists storage_path text;

-- 2. Storage bucket oluştur (eğer yoksa)
insert into storage.buckets (id, name, public)
values ('documents', 'documents', true)
on conflict (id) do nothing;

-- 3. Storage politikaları (herkese açık okuma, authenticated upload/delete)
create policy "documents_public_read"
  on storage.objects for select
  using (bucket_id = 'documents');

create policy "documents_upload"
  on storage.objects for insert
  with check (bucket_id = 'documents');

create policy "documents_update"
  on storage.objects for update
  using (bucket_id = 'documents');

create policy "documents_delete"
  on storage.objects for delete
  using (bucket_id = 'documents');
