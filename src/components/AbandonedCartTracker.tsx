'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useAbandonedCart } from '@/hooks/useAbandonedCart'

export default function AbandonedCartTracker() {
  if (!process.env.NEXT_PUBLIC_ENABLE_ABANDONED_CART || process.env.NEXT_PUBLIC_ENABLE_ABANDONED_CART === 'false') {
    return null
  }
  const { user } = useUser()
  
  useAbandonedCart({
    email: user?.email,
    delay: 30 * 60 * 1000, // 30 minutes
  })

  return null // This component doesn't render anything
}
