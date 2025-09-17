'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useAbandonedCart } from '@/hooks/useAbandonedCart'
import { useEffect, useState } from 'react'

export default function AbandonedCartTracker() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient || !process.env.NEXT_PUBLIC_ENABLE_ABANDONED_CART || process.env.NEXT_PUBLIC_ENABLE_ABANDONED_CART === 'false') {
    return null
  }
  
  const { user } = useUser()
  
  useAbandonedCart({
    email: user?.email ?? undefined,
    delay: 30 * 60 * 1000, // 30 minutes
  })

  return null // This component doesn't render anything
}
