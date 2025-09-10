'use client'

/**
 * Auth0 Fallback Component
 * Used when Auth0 is not available or configured
 */

import React, { createContext, useContext, ReactNode } from 'react'

interface User {
  name?: string
  email?: string
  picture?: string
  sub?: string
  email_verified?: boolean
  updated_at?: string
}

interface UserContextValue {
  user?: User
  error?: Error
  isLoading: boolean
}

const UserContext = createContext<UserContextValue>({
  isLoading: false
})

export function UserProvider({ children }: { children: ReactNode }) {
  return (
    <UserContext.Provider value={{ isLoading: false }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser(): UserContextValue {
  return useContext(UserContext)
}

// Mock withPageAuthRequired for development
export function withPageAuthRequired<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthRequired(props: P) {
    const { user, isLoading } = useUser()
    
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      )
    }
    
    if (!user) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
            <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
            <a 
              href="/api/auth/login" 
              className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      )
    }
    
    return <Component {...props} />
  }
}
