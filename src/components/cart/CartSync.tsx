'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCartStore } from '@/lib/store/cart'

/**
 * CartSync component
 * Loads cart from Supabase when user logs in
 * Merges local cart with server cart
 */
export default function CartSync() {
  const { data: session } = useSession()
  const { items: localItems, loadFromServer, syncToServer } = useCartStore()

  useEffect(() => {
    // Only sync if user is logged in
    if (session?.user?.email) {
      // Load cart from server
      loadFromServer().then(() => {
        // After loading, sync current local items to merge
        if (localItems.length > 0 && session?.user?.email) {
          syncToServer(localItems, session.user.email)
        }
      })
    }
  }, [session?.user?.email, loadFromServer, syncToServer, localItems]) // Added localItems to dependencies

  return null // This component doesn't render anything
}


