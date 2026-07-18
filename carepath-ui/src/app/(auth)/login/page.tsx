'use client'

import { FormEvent, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? 'http://localhost:3001/api'

const roleRedirect: Record<string, string> = {
  PATIENT:     '/patient/intake',
  DRIVER:      '/driver/dashboard',
  COORDINATOR: '/coordinator/pooling',
  ADMIN:       '/admin/credits',
  PARTNER:     '/admin/credits',
  ADVOCATE:    '/coordinator/pooling',
}

export default function LoginPage() {
  const router = useRouter()
  const [apiBase] = useState(DEFAULT_API_BASE)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message ?? `Login failed (${res.status}).`)
      }
      const { token, user } = await res.json()
      const role: string = user?.role ?? 'PATIENT'
      window.localStorage.setItem(`carepath.${role.toLowerCase()}.token`, token)
      router.push(roleRedirect[role] ?? '/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.')
    } finally { setIsSubmitting(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #052b56 0%, #0c6bc2 50%, #1b9c86 100%)', padding: 24 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(5,43,86,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <Image src="/carepath-logo.png" alt="CarePath" width={40} height={40} style={{ borderRadius: 10, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 20, color: '#0f172a' }}>CarePath</span>
        </div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Sign in</h1>
        <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Access your role-based dashboard.</p>

        {error && <div className="cp-alert cp-alert-error" style={{ marginBottom: 16 }}><AlertCircle size={16} />{error}</div>}

        <form className="cp-space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="cp-label">Email</label>
            <input type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} className="cp-input" placeholder="you@example.com" />
          </div>
          <div>
            <label className="cp-label">Password</label>
            <input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} className="cp-input" placeholder="••••••••" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="cp-btn-full">{isSubmitting ? 'Signing in…' : 'Sign in'}</Button>
        </form>
        <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 20, textAlign: 'center' }}>You will be redirected to your role dashboard after login.</p>
      </div>
    </div>
  )
}
