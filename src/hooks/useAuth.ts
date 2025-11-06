'use client'

import { useSession } from 'next-auth/react'

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

/**
 * useAuth hook - compatible with existing codebase
 * Uses NextAuth's useSession under the hood
 */
export function useAuth(): AuthState {
  const { data: session, status } = useSession()

  // Transform NextAuth session to match existing User interface
  const user: User | null = session?.user
    ? {
        sub: session.user.id || session.user.email || '',
        email: session.user.email || '',
        name: session.user.name || '',
        picture: session.user.image || undefined,
        email_verified: (session.user as any).emailVerified ? true : undefined,
      }
    : null

  return {
    user,
    isLoading: status === 'loading',
    error: status === 'unauthenticated' ? new Error('Not authenticated') : null,
  }
}
