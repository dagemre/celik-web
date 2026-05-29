import type { Metadata } from 'next'
import AdminClientLayout from '@/components/admin/AdminClientLayout'

export const metadata: Metadata = {
  manifest: '/manifest-admin.json',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminClientLayout>{children}</AdminClientLayout>
}
