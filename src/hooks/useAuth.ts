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

    // Check if we just returned from Auth0 (has code or state in URL)
    const urlParams = new URLSearchParams(window.location.search)
    const hasAuthCallback = urlParams.has('code') || urlParams.has('state')
    
    // If we just returned from auth, poll for a few seconds to catch the session
    if (hasAuthCallback) {
      let pollCount = 0
      const maxPolls = 10 // Poll for up to 5 seconds (10 * 500ms)
      
      const pollInterval = setInterval(() => {
        pollCount++
        fetchUser()
        
        if (pollCount >= maxPolls) {
          clearInterval(pollInterval)
        }
      }, 500) // Check every 500ms

      return () => clearInterval(pollInterval)
    }

    // Set up periodic polling every 3 seconds to catch auth changes
    const pollInterval = setInterval(() => {
      fetchUser()
    }, 3000)

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

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      clearInterval(pollInterval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [fetchUser])

  return authState
}
