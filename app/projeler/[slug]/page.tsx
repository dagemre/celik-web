export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProjeDetayClient from './ProjeDetayClient'

// Bina özelliği → SVG ikon + etiket
const FEATURE_OPTIONS: Record<string, { icon: string; label: string }> = {
  'kapali-otopark':    { icon: 'bina-otopark',     label: 'Kapalı Otopark'      },
  'acik-otopark':      { icon: 'car',              label: 'Açık Otopark'        },
  'asansor':           { icon: 'elevator',         label: 'Asansör'             },
  'guvenlik-kamerasi': { icon: 'camera-security',  label: 'Güvenlik Kamerası'   },
  'gorevli-guvenlik':  { icon: 'security',         label: 'Görevli Güvenlik'    },
  'jenerator':         { icon: 'generator',        label: 'Jeneratör'           },
  'dogalgaz':          { icon: 'generator',        label: 'Doğalgaz'            },
  'kombili':           { icon: 'bina-klima',       label: 'Kombi (Her Daireye)' },
  'merkezi-isitma':    { icon: 'bina-klima',       label: 'Merkezi Isıtma'      },
  'interkom':          { icon: 'bell',             label: 'İnterkom / Diafon'   },
  'yangin-merdiveni':  { icon: 'building',         label: 'Yangın Merdiveni'    },
  'teras':             { icon: 'bina-balkon',      label: 'Teras / Çatı Katı'   },
  'bahce':             { icon: 'tree',             label: 'Bahçe / Yeşil Alan'  },
  'deprem-yalitim':    { icon: 'building',         label: 'Deprem Yalıtımı'     },
  'isı-yalitim':       { icon: 'bina-yerden',      label: 'Isı Yalıtımı'        },
  'isi-yalitim':       { icon: 'bina-yerden',      label: 'Isı Yalıtımı'        },
  'ses-yalitim':       { icon: 'bina-depo',        label: 'Ses Yalıtımı'        },
}

// Galeri resimleri — slug'a göre statik eşleme (public klasöründen)
const GALLERY_MAP: Record<string, string[]> = {
  'afacan-sokak': [
    '/projeler/afacan-sokak/DJI_20240921214713_0237_D.JPG',
    '/projeler/afacan-sokak/DJI_20240921214802_0240_D.JPG',
    '/projeler/afacan-sokak/DJI_20240921214845_0243_D.JPG',
  ],
  'cengiz-sokak': [
    '/projeler/cengiz-sokak/DJI_20240921220055_0248_D.jpg',
    '/projeler/cengiz-sokak/DJI_20240921220130_0251_D.JPG',
  ],
  'ds-ahmet-caddesi': [
    '/projeler/ds-ahmet-caddesi/DJI_20240920213730_0137_D.JPG',
    '/projeler/ds-ahmet-caddesi/DJI_20240920213735_0138_D.JPG',
    '/projeler/ds-ahmet-caddesi/DJI_20240920213824_0142_D.JPG',
    '/projeler/ds-ahmet-caddesi/DJI_20240920213833_0143_D.JPG',
    '/projeler/ds-ahmet-caddesi/DJI_20240920215003_0148_D.JPG',
  ],
  'degirmen-sokak': [
    '/projeler/degirmen-sokak/DJI_20240922001110_0317_D.JPG',
    '/projeler/degirmen-sokak/DJI_20240922001114_0318_D.JPG',
    '/projeler/degirmen-sokak/DJI_20240922001127_0319_D.JPG',
  ],
  'filiz-sokak': [
    '/projeler/filiz-sokak/DJI_20240920221911_0166_D.JPG',
    '/projeler/filiz-sokak/DJI_20240920222109_0170_D.JPG',
    '/projeler/filiz-sokak/DJI_20240920222124_0173_D.JPG',
  ],
  'gayretli-sokak': [
    '/projeler/gayretli-sokak/DJI_20240920224515_0189_D.JPG',
    '/projeler/gayretli-sokak/DJI_20240920224527_0190_D.JPG',
  ],
  'hacibey-sokak': [
    '/projeler/hacibey-sokak/DJI_20240921234703_0299_D.JPG',
    '/projeler/hacibey-sokak/DJI_20240921234742_0303_D.JPG',
  ],
  'inci-sokak': [
    '/projeler/inci-sokak/DJI_20240921214713_0237_D.JPG',
    '/projeler/inci-sokak/DJI_20240921214758_0239_D.JPG',
  ],
  'koroglu-sokak': [
    '/projeler/koroglu-sokak/DJI_20240921223036_0261_D.JPG',
    '/projeler/koroglu-sokak/DJI_20240921223054_0262_D.JPG',
    '/projeler/koroglu-sokak/DJI_20240921223110_0263_D.JPG',
  ],
  'kutlu-sokak': [
    '/projeler/kutlu-sokak/DJI_20240921230119_0278_D.JPG',
    '/projeler/kutlu-sokak/DJI_20240921230219_0281_D.JPG',
  ],
  'mahmutoglu-sokak': [
    '/projeler/mahmutoglu-sokak/DJI_20240921210940_0209_D.JPG',
    '/projeler/mahmutoglu-sokak/DJI_20240921211046_0210_D.JPG',
    '/projeler/mahmutoglu-sokak/DJI_20240921211051_0211_D.JPG',
    '/projeler/mahmutoglu-sokak/DJI_20240921211100_0212_D.JPG',
    '/projeler/mahmutoglu-sokak/DJI_20240921211103_0213_D.JPG',
    '/projeler/mahmutoglu-sokak/DJI_20240921211130_0214_D.JPG',
    '/projeler/mahmutoglu-sokak/DJI_20240921211139_0215_D.JPG',
  ],
  'menekse-sokak': [
    '/projeler/menekse-sokak/DJI_20240921212429_0222_D.JPG',
    '/projeler/menekse-sokak/DJI_20240921212446_0225_D.JPG',
    '/projeler/menekse-sokak/DJI_20240921212515_0227_D.JPG',
    '/projeler/menekse-sokak/DJI_20240921212527_0229_D.JPG',
  ],
  'oya-sokak': [
    '/projeler/oya-sokak/DJI_20240920222607_0175_D.JPG',
    '/projeler/oya-sokak/DJI_20240920222617_0177_D.JPG',
    '/projeler/oya-sokak/DJI_20240920222710_0178_D.JPG',
    '/projeler/oya-sokak/DJI_20240920223239_0184_D.JPG',
    '/projeler/oya-sokak/DJI_20240920223247_0185_D.JPG',
  ],
  'ozcan-sokak': [
    '/projeler/ozcan-sokak/DJI_20240921221610_0256_D.JPG',
    '/projeler/ozcan-sokak/DJI_20240921221620_0257_D.JPG',
  ],
  'papatya-sokak': [
    '/projeler/papatya-sokak/DJI_20240920224940_0193_D.JPG',
    '/projeler/papatya-sokak/DJI_20240920224952_0195_D.JPG',
    '/projeler/papatya-sokak/DJI_20240920225016_0196_D.JPG',
    '/projeler/papatya-sokak/DJI_20240920225028_0197_D.JPG',
    '/projeler/papatya-sokak/DJI_20240920225427_0199_D.JPG',
    '/projeler/papatya-sokak/DJI_20240920225436_0200_D.JPG',
    '/projeler/papatya-sokak/DJI_20240920225443_0201_D.JPG',
    '/projeler/papatya-sokak/DJI_20240920225532_0202_D.JPG',
    '/projeler/papatya-sokak/DJI_20240920225534_0203_D.JPG',
    '/projeler/papatya-sokak/DJI_20240920225539_0204_D.JPG',
  ],
  'sulun-sokak-2': [
    '/projeler/sulun-sokak-2/DJI_20240920211258_0123_D.JPG',
    '/projeler/sulun-sokak-2/DJI_20240920211424_0125_D.JPG',
  ],
  'sulun-sokak': [
    '/projeler/sulun-sokak/DJI_20240920210639_0114_D.JPG',
    '/projeler/sulun-sokak/DJI_20240920210700_0116_D.JPG',
  ],
  'sukrubey-caddesi': [
    '/projeler/sukrubey-caddesi/DJI_20240921231700_0289_D.JPG',
    '/projeler/sukrubey-caddesi/DJI_20240921231711_0291_D.JPG',
    '/projeler/sukrubey-caddesi/DJI_20240921231727_0292_D.JPG',
    '/projeler/sukrubey-caddesi/DJI_20240921231729_0293_D.JPG',
  ],
  'tavla-sokak': [
    '/projeler/tavla-sokak/DJI_20240920220107_0152_D.JPG',
    '/projeler/tavla-sokak/DJI_20240920220555_0157_D.JPG',
  ],
  'turna-sokak': [
    '/projeler/turna-sokak/DJI_20240920212530_0131_D.JPG',
    '/projeler/turna-sokak/DJI_20240920212547_0132_D.JPG',
    '/projeler/turna-sokak/DJI_20240920212556_0133_D.JPG',
  ],
  'uner-sokak': [
    '/projeler/uner-sokak/DJI_20240921224800_0270_D.JPG',
    '/projeler/uner-sokak/DJI_20240921224810_0272_D.JPG',
  ],
  'yazgan-sokak': [
    '/projeler/yazgan-sokak/DJI_20240920204659_0103_D.JPG',
    '/projeler/yazgan-sokak/DJI_20240920204726_0105_D.JPG',
  ],
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { data } = await supabase
    .from('projects')
    .select('name, location, description')
    .eq('slug', params.slug)
    .single()

  if (!data) return { title: 'Proje Bulunamadı' }

  return {
    title: `${data.name} | Çelik İnşaat`,
    description: data.description || `${data.name} — ${data.location}`,
  }
}

export default async function ProjeDetayPage({ params }: { params: { slug: string } }) {
  const { data: proje } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!proje) return notFound()

  // Durum etiketi
  const statusLabel =
    proje.status === 'devam'      ? 'Devam Ediyor' :
    proje.status === 'tamamlandi' ? 'Tamamlandı'   : 'Planlama'
  const statusBg =
    proje.status === 'devam'      ? 'bg-[#0A1F44]'    :
    proje.status === 'tamamlandi' ? 'bg-emerald-600'   : 'bg-warning-600'

  // Bina özellikleri
  const rawFeatures: string[] = Array.isArray(proje.features) ? proje.features : []
  const ozellikler = rawFeatures.map(key => ({
    icon:  FEATURE_OPTIONS[key]?.icon  ?? 'building',
    label: FEATURE_OPTIONS[key]?.label ?? key,
  }))

  // Galeri
  const gallery: string[] = GALLERY_MAP[params.slug] ?? (proje.image_url ? [proje.image_url] : [])
  const heroImage = gallery[0] ?? proje.image_url ?? ''

  // Stats bar için ek bilgiler
  const stats = [
    { icon: 'map-pin',  label: 'Konum',        value: `${proje.district ?? ''}, ${proje.city ?? 'İstanbul'}` },
    { icon: 'building', label: 'Kat Sayısı',   value: proje.floors ? `${proje.floors} Kat` : null },
    { icon: 'building', label: 'Daire Sayısı', value: proje.units_count ? `${proje.units_count} Daire` : null },
    { icon: 'check',    label: 'Alan',         value: proje.area ? `${proje.area} m²` : null },
    { icon: 'calendar', label: 'Teslim Yılı',  value: proje.delivery_year ?? null },
    { icon: 'check',    label: 'Durum',        value: statusLabel },
  ].filter(s => s.value)

  // Yapım aşamaları — Supabase'den geliyorsa onu kullan, yoksa varsayılan
  const defaultPhases = [
    { label: 'Temel Kazı',        done: false },
    { label: 'Betonarme',         done: false },
    { label: 'Duvar Örme',        done: false },
    { label: 'Elektrik Tesisatı', done: false },
    { label: 'İç Sıva',           done: false },
    { label: 'Dış Cephe',         done: false },
    { label: 'İç Mekan',          done: false },
    { label: 'Peyzaj',            done: false },
  ]
  const phases: { label: string; done: boolean }[] =
    Array.isArray(proje.phases) && proje.phases.length > 0
      ? proje.phases
      : defaultPhases.map((ph, i) => ({ ...ph, done: (proje.progress ?? 0) >= (i + 1) * 12.5 }))

  // Yakın yerler ve harita koordinatları
  const nearbyPlaces: { label: string; desc: string }[] =
    Array.isArray(proje.nearby_places) ? proje.nearby_places : []
  const mapLat: number | null = proje.map_lat ?? null
  const mapLng: number | null = proje.map_lng ?? null

  return (
    <ProjeDetayClient
      proje={{
        slug:         params.slug,
        name:         proje.name,
        location:     `${proje.district ?? ''}, ${proje.city ?? 'İstanbul'}`,
        description:  proje.description ?? 'Çelik İnşaat tarafından geliştirilen proje; modern cephe mimarisi ve yüksek kaliteli malzeme kullanımıyla inşa edilmiştir.',
        statusLabel,
        statusBg,
        ilerleme:     proje.progress ?? 0,
        ozellikler,
        phases,
        gallery,
        heroImage,
        stats,
        mapLat,
        mapLng,
        nearbyPlaces,
        floors:       proje.floors,
        unitsCount:   proje.units_count,
        deliveryYear: proje.delivery_year,
      }}
    />
  )
}
