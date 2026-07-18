'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { loginUser } from '../../../services/auth'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setErrorMessage('')
    setIsLoading(true)

    try {
      const result = await loginUser({
        email,
        password,
      })

      console.log('Login result:', result)

      if (result.token) {
        localStorage.setItem('carepathToken', result.token)
      }

      const userRole = result.user?.role

      if (userRole === 'driver') {
        router.push('/driver/dashboard')
        return
      }

      if (userRole === 'coordinator') {
        router.push('/coordinator')
        return
      }

      router.push('/patient/dashboard')
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message)
      } else {
        setErrorMessage('Something went wrong while logging in.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'linear-gradient(135deg, #e5dbea 0%, #ede9f7 50%, #d2b9d8 100%)',
        padding: 24,
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 460,
          background: '#ffffff',
          borderRadius: 20,
          border: '1px solid #e2e8f0',
          boxShadow: '0 18px 50px rgba(69, 4, 102, 0.14)',
          padding: 32,
        }}
      >
        <div
          style={{
            textAlign: 'center',
            marginBottom: 28,
          }}
        >
          <p
            style={{
              color: '#1b9c86',
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            CarePath
          </p>

          <h1
            style={{
              color: '#0f172a',
              fontSize: 30,
              fontWeight: 800,
              marginBottom: 8,
            }}
          >
            Welcome back
          </h1>

          <p
            style={{
              color: '#a589b1',
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            Sign in to manage rides and transportation services.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
          }}
        >
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                color: '#334155',
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 7,
              }}
            >
              Email address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
              autoComplete="email"
              required
              style={{
                width: '100%',
                minHeight: 48,
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                padding: '10px 13px',
                color: '#0f172a',
                background: '#ffffff',
                fontSize: 15,
                outline: 'none',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                color: '#334155',
                fontSize: 14,
                fontWeight: 700,
                marginBottom: 7,
              }}
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                minHeight: 48,
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                padding: '10px 13px',
                color: '#0f172a',
                background: '#ffffff',
                fontSize: 15,
                outline: 'none',
              }}
            />
          </div>

          {errorMessage && (
            <div
              role="alert"
              style={{
                borderRadius: 10,
                border: '1px solid #fecaca',
                background: '#fef2f2',
                color: '#b91c1c',
                padding: '11px 13px',
                fontSize: 14,
              }}
            >
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              minHeight: 50,
              border: 'none',
              borderRadius: 11,
              background: isLoading ? '#94a3b8' : '#ae5a8b',
              color: '#ffffff',
              fontSize: 15,
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 12px rgba(85, 64, 161, 0.25)',
            }}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            color: '#64748b',
            fontSize: 14,
            marginTop: 22,
          }}
        >
          Need an account?{' '}
          <Link
            href="/register"
            style={{
              color: '#0c6bc2',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Register here
          </Link>
        </p>

        <div
          style={{
            textAlign: 'center',
            marginTop: 16,
          }}
        >
          <Link
            href="/"
            style={{
              color: '#64748b',
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            Return to the CarePath home page
          </Link>
        </div>
      </section>
    </main>
  )
}   