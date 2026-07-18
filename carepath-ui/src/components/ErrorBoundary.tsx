'use client'

import { Component, ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: '' }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{ padding: 24, background: '#fef2f2', borderRadius: 12, border: '1px solid #fecaca', margin: 16 }}>
          <p style={{ fontWeight: 700, color: '#991b1b', marginBottom: 4 }}>Something went wrong</p>
          <p style={{ fontSize: 13, color: '#b91c1c' }}>{this.state.message}</p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            style={{ marginTop: 12, padding: '8px 16px', borderRadius: 8, border: 'none', background: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: 600 }}
          >
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
