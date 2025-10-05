'use client'

import { useState, useEffect, useCallback } from 'react'

interface User {
  sub: string
  email: string
  name: string
  picture?: string
  email_verified?: boolean
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: Error | null
}

export function useAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/auth/profile', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      })
      
      if (!response.ok) {
        setAuthState({ user: null, isLoading: false, error: null })
        return
      }

      const data = await response.json()
      setAuthState({ 
        user: data.user || null, 
        isLoading: false, 
        error: null 
      })
    } catch (error) {
      setAuthState({ 
        user: null, 
        isLoading: false, 
        error: error instanceof Error ? error : new Error('Failed to fetch user') 
      })
    }
  }, [])

  useEffect(() => {
    // Initial fetch
    fetchUser()

    // Re-check auth when page becomes visible (after Auth0 redirect)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchUser()
      }
    }

    // Re-check auth when window gains focus (after Auth0 redirect in same tab)
    const handleFocus = () => {
      fetchUser()
    }

    // Re-check auth when navigating back to the page
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        fetchUser()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('pageshow', handlePageShow)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('pageshow', handlePageShow)
    }
  }, [fetchUser])

  return authState
}
