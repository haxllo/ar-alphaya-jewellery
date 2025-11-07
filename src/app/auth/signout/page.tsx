'use client'

import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SignOutPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        // Get the base URL for callback
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
        const callbackUrl = `${baseUrl}/`
        
        await signOut({ 
          callbackUrl,
          redirect: true 
        })
      } catch (err) {
        console.error('Sign out error:', err)
        setError('Failed to sign out. Please try again.')
        // Fallback: redirect after 2 seconds
        setTimeout(() => {
          router.push('/')
        }, 2000)
      }
    }

    handleSignOut()
  }, [router])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <p className="text-gray-600">Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  )
}

