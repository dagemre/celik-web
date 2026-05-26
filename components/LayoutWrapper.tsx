'use client'

import { usePathname } from 'next/navigation'
import Navbar from './Navbar'
import Footer from './Footer'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMalik = pathname.startsWith('/malik')
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      {!isMalik && !isAdmin && <Navbar />}
      {children}
      {!isMalik && !isAdmin && <Footer />}
    </>
  )
}
