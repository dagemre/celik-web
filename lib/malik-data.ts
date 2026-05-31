/**
 * Malik Dashboard — Supabase Veri Katmanı
 *
 * Tablo ilişkileri:
 *   owners → units (unit_id)  →  projects (project_id)
 *   payments (owner_id)
 *   announcements (project_id | null = tüm projeler)
 *
 * Auth kurulunca:  MOCK_OWNER_ID  →  supabase.auth.getUser() ile gelen id
 * Tablolar dolunca: mock fallback yerine gerçek veri gelecek
 */

import { supabase } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

export type MalikBilgi = {
  // owner
  id: string
  full_name: string
  email: string
  phone: string
  // unit
  unit_id: string
  unit_no: string
  floor: number
  unit_type: string   // '3+1' vb
  price: number       // satış bedeli = toplam borç
  gross_area: number
  net_area: number
  // project
  project_id: string
  project_name: string
  project_slug: string
  project_location: string
  project_status: string  // 'devam' | 'tamamlandi'
  project_image_url: string
  project_delivery_date: string  // teslim tarihi
  project_progress: number       // ilerleme yüzdesi (0-100)
}

export type MalikOdeme = {
  id: string
  amount: number
  paid_date: string   // ISO date
  source: string      // 'Havale' | 'Elden' | 'Banka'
  description: string
  status: string      // 'odendi'
}

export type MalikDuyuru = {
  id: string
  title: string
  content: string
  created_at: string
}

export type OdemeDurumu = {
  toplamBorc: number
  odenen: number
  kalan: number
  yuzdesi: number
}

// ─── Queries ──────────────────────────────────────────────────────────────────

/**
 * Malik'in kendi bilgilerini + daire + proje bilgilerini çeker.
 * authUserId: supabase.auth.getUser().id — owners.auth_user_id ile eşleşir.
 */
export async function getMalikBilgi(authUserId: string): Promise<MalikBilgi | null> {
  const { data, error } = await supabase
    .from('owners')
    .select(`
      id, full_name, email, phone, unit_id, project_id,
      unit:units ( unit_no, floor, type, price, gross_area, net_area ),
      project:projects ( name, slug, location, status, image_url, delivery_date, progress )
    `)
    .eq('auth_user_id', authUserId)
    .single()

  if (error || !data) return null

  const unit = Array.isArray(data.unit) ? data.unit[0] : data.unit
  const project = Array.isArray(data.project) ? data.project[0] : data.project

  if (!unit || !project) return null

  return {
    id: data.id,
    full_name: data.full_name,
    email: data.email ?? '',
    phone: data.phone ?? '',
    unit_id: data.unit_id,
    unit_no: unit.unit_no,
    floor: unit.floor,
    unit_type: unit.type ?? '',
    price: unit.price ?? 0,
    gross_area: unit.gross_area ?? 0,
    net_area: unit.net_area ?? 0,
    project_id: data.project_id,
    project_name: project.name,
    project_slug: project.slug,
    project_location: project.location ?? '',
    project_status: project.status ?? 'devam',
    project_image_url: project.image_url ?? '',
    project_delivery_date: project.delivery_date ?? '',
    project_progress: project.progress ?? 0,
  }
}

/**
 * getMalikOwnerId: auth_user_id ile owners.id'yi döner.
 * KVKK ve diğer işlemler için gerekli.
 */
export async function getMalikOwnerId(authUserId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('owners')
    .select('id')
    .eq('auth_user_id', authUserId)
    .single()

  if (error || !data) return null
  return data.id
}

/**
 * Malik'in ödenmiş ödemelerini son tarihten itibaren çeker.
 */
export async function getMalikOdemeleri(ownerId: string, limit = 10): Promise<MalikOdeme[]> {
  const { data, error } = await supabase
    .from('payments')
    .select('id, amount, paid_date, source, description, status')
    .eq('owner_id', ownerId)
    .eq('status', 'odendi')
    .order('paid_date', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data as MalikOdeme[]
}

/**
 * Toplam borç, ödenen, kalan hesabını döner.
 * toplamBorc: units.price (satış bedeli)
 * odenen: ödenmiş ödemelerin toplamı
 */
export function hesaplaOdemeDurumu(toplamBorc: number, odemeler: MalikOdeme[]): OdemeDurumu {
  const odenen = odemeler.reduce((sum, p) => sum + (p.amount ?? 0), 0)
  const kalan = toplamBorc - odenen
  const yuzdesi = toplamBorc > 0 ? Math.round((odenen / toplamBorc) * 100) : 0
  return { toplamBorc, odenen, kalan, yuzdesi }
}

/**
 * Proje duyurularını çeker.
 * project_id eşleşenleri + project_id null olanları (genel duyurular) getirir.
 */
export async function getProjeeDuyurulari(projectId: string, limit = 5): Promise<MalikDuyuru[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select('id, title, content, created_at')
    .or(`project_id.eq.${projectId},project_id.is.null`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) return []
  return data as MalikDuyuru[]
}

// ─── Tarih Formatı ────────────────────────────────────────────────────────────

/** '2026-05-04' → '04.05.2026' */
export function formatOdemeTarihi(isoDate: string): string {
  if (!isoDate) return '—'
  const d = new Date(isoDate)
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}
