'use client'

import { useUser } from '@auth0/nextjs-auth0/client'
import { useRouter } from 'next/navigation'
import { useCallback } from 'react'

interface Auth0SessionHook {
  user: any
  error: any
  isLoading: boolean
  isAuthenticated: boolean
  checkRequiredAuth: () => boolean
  loginWithRedirect: (returnTo?: string) => void
  logout: (returnTo?: string) => void
  getDisplayName: () => string
  getInitials: () => string
  hasRole: (role: string) => boolean
  hasPermission: (permission: string) => boolean
  getUserMetadata: (key?: string) => any
  getAppMetadata: (key?: string) => any
}

export function useAuth0Session(): Auth0SessionHook {
  // Temporarily disable Auth0 until properly configured
  // const { user, error, isLoading } = useUser()
  const user = null
  const error = null
  const isLoading = false
  const router = useRouter()

  const isAuthenticated = !isLoading && !error && !!user

  const checkRequiredAuth = useCallback(() => {
    if (!isLoading && !user) {
      router.push('/api/auth/login')
      return false
    }
    return true
  }, [isLoading, user, router])

  const loginWithRedirect = useCallback((returnTo?: string) => {
    const loginUrl = returnTo 
      ? `/api/auth/login?returnTo=${encodeURIComponent(returnTo)}`
      : '/api/auth/login'
    window.location.href = loginUrl
  }, [])

  const logout = useCallback((returnTo?: string) => {
    const logoutUrl = returnTo 
      ? `/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`
      : '/api/auth/logout'
    window.location.href = logoutUrl
  }, [])

  const getDisplayName = useCallback(() => {
    if (!user) return ''
    const u = user as any
    return u?.name || u?.nickname || u?.email || 'User'
  }, [user])

  const getInitials = useCallback(() => {
    if (!user) return ''
    const name = getDisplayName()
    return name
      .split(' ')
      .map((n: string) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }, [user, getDisplayName])

  const hasRole = useCallback((role: string) => {
    if (!user) return false
    const u = user as any
    const roles = u['https://example.com/roles'] || u.roles || []
    return Array.isArray(roles) && roles.includes(role)
  }, [user])

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false
    const u = user as any
    const permissions = u['https://example.com/permissions'] || u.permissions || []
    return Array.isArray(permissions) && permissions.includes(permission)
  }, [user])

  const getUserMetadata = useCallback((key?: string) => {
    if (!user) return null
    const u = user as any
    const metadata = u.user_metadata || {}
    return key ? (metadata as any)[key] : metadata
  }, [user])

  const getAppMetadata = useCallback((key?: string) => {
    if (!user) return null
    const u = user as any
    const metadata = u.app_metadata || {}
    return key ? (metadata as any)[key] : metadata
  }, [user])

  return {
    user,
    error,
    isLoading,
    isAuthenticated,
    checkRequiredAuth,
    loginWithRedirect,
    logout,
    getDisplayName,
    getInitials,
    hasRole,
    hasPermission,
    getUserMetadata,
    getAppMetadata,
  }
}
