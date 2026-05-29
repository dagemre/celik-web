import AddToHomeScreen from '@/components/AddToHomeScreen'

export default function MalikDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AddToHomeScreen />
    </>
  )
}
