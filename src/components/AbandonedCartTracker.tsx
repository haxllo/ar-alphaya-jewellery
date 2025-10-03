'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useAbandonedCart } from '@/hooks/useAbandonedCart'
import { useEffect, useState } from 'react'

export default function AbandonedCartTracker() {
  const [isClient, setIsClient] = useState(false)
  const { user } = useUser()
  
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
