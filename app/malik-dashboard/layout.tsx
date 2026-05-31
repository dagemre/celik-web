import type { Metadata } from 'next'
import MalikAuthGuard from '@/components/malik/MalikAuthGuard'

export const metadata: Metadata = {
  manifest: '/manifest-malik.json',
}

export default function MalikDashboardLayout({ children }: { children: React.ReactNode }) {
  return <MalikAuthGuard>{children}</MalikAuthGuard>
}
