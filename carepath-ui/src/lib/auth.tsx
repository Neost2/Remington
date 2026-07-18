'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { ApiClient, ApiError, getToken, saveToken, clearToken, DEFAULT_API_BASE } from './api'

export type User = {
  id: string
  email: string
  phone: string
  role: string
  firstName: string
  lastName: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  role: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  api: ApiClient
  apiBaseUrl: string
  setApiBaseUrl: (url: string) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const roleRedirect: Record<string, string> = {
  PATIENT:     '/patient/intake',
  DRIVER:      '/driver/dashboard',
  COORDINATOR: '/coordinator/pooling',
  ADMIN:       '/admin/credits',
  PARTNER:     '/admin/credits',
  ADVOCATE:    '/coordinator/pooling',
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE)

  const api = new ApiClient({ baseUrl: apiBaseUrl })

  // Restore session from localStorage on mount
  useEffect(() => {
    const roles = ['patient', 'driver', 'coordinator', 'admin']
    for (const r of roles) {
      const t = getToken(r)
      if (t) {
        setTokenState(t)
        setRole(r.toUpperCase())
        api.setToken(t)
        break
      }
    }
    setIsLoading(false)
  }, [api])

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error(data?.error ?? data?.message ?? 'Login failed')
    }
    const data = await res.json()
    const userRole: string = data.user?.role ?? 'PATIENT'
    const userToken: string = data.token

    saveToken(userRole.toLowerCase(), userToken)
    setTokenState(userToken)
    setRole(userRole)
    setUser(data.user)
    api.setToken(userToken)

    const redirect = roleRedirect[userRole] ?? '/'
    router.push(redirect)
  }, [apiBaseUrl, router, api])

  const logout = useCallback(() => {
    if (role) clearToken(role.toLowerCase())
    setTokenState(null)
    setRole(null)
    setUser(null)
    api.clearToken()
    router.push('/login')
  }, [role, router, api])

  return (
    <AuthContext.Provider value={{
      user,
      token,
      role,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
      api,
      apiBaseUrl,
      setApiBaseUrl,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}