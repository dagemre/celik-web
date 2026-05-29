import AddToHomeScreen from '@/components/AddToHomeScreen'
import ManifestOverride from '@/components/ManifestOverride'

export default function MalikDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AddToHomeScreen />
      {/* Malik manifest: start_url /malik-dashboard olarak ayarla */}
      <ManifestOverride href="/manifest-malik.json" />
    </>
  )
}
