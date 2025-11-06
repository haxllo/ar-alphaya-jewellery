'use client'

import { useSession } from 'next-auth/react'
import { useAbandonedCart } from '@/hooks/useAbandonedCart'
import { useEffect, useState } from 'react'

export default function AbandonedCartTracker() {
  const [isClient, setIsClient] = useState(false)
  const { data: session } = useSession()
  const user = session?.user
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const isEnabled =
    isClient &&
    !!process.env.NEXT_PUBLIC_ENABLE_ABANDONED_CART &&
    process.env.NEXT_PUBLIC_ENABLE_ABANDONED_CART !== 'false'

  useAbandonedCart({
    email: isEnabled ? user?.email ?? undefined : undefined,
    delay: 30 * 60 * 1000, // 30 minutes
    enabled: isEnabled,
  })

  return null // This component doesn't render anything
}
