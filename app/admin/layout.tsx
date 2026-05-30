import type { Metadata } from 'next'
import AdminClientLayout from '@/components/admin/AdminClientLayout'

export const metadata: Metadata = {
  manifest: '/manifest-admin.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Çelik Admin',
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>
}
