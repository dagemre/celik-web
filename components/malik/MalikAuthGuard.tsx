'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import AddToHomeScreen from '@/components/AddToHomeScreen'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import PushNotificationPrompt from '@/components/PushNotificationPrompt'

export default function MalikAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // İlk kontrol
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/malik-giris')
      } else {
        setLoading(false)
      }
    })

    // Session değişimlerini dinle (çıkış vb.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace('/malik-giris')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F4F6FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-[#0A1F44] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {children}
      <AddToHomeScreen />
      <ServiceWorkerRegister />
      <PushNotificationPrompt />
    </>
  )
}
