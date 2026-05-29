import type { Metadata } from 'next'

export const metadata: Metadata = {
  manifest: '/manifest-malik.json',
}

export default function MalikDashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
