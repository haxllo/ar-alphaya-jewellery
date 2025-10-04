'use client'

import { useState, useEffect } from 'react'

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

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch('/auth/profile')
        
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
    }

    fetchUser()
  }, [])

  return authState
}
