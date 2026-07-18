// Shared API client for CarePath frontend
// Handles auth tokens, base URL, error handling, and role-based storage

const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? 'http://localhost:3000/api'

export type ApiOptions = {
  baseUrl?: string
  token?: string
  role?: string
}

function getToken(role: string): string | null {
  if (typeof window === 'undefined') return null
  return window.localStorage.getItem(`carepath.${role.toLowerCase()}.token`)
}

function saveToken(role: string, token: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(`carepath.${role.toLowerCase()}.token`, token)
}

function clearToken(role: string): void {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(`carepath.${role.toLowerCase()}.token`)
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class ApiClient {
  private baseUrl: string
  private token: string | null
  private role: string

  constructor(opts: ApiOptions = {}) {
    this.baseUrl = opts.baseUrl ?? DEFAULT_API_BASE
    this.role = opts.role ?? ''
    this.token = opts.token ?? (this.role ? getToken(this.role) : null)
  }

  setToken(token: string): void {
    this.token = token
    if (this.role) saveToken(this.role, token)
  }

  clearToken(): void {
    this.token = null
    if (this.role) clearToken(this.role)
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url
  }

  private headers(extra: Record<string, string> = {}): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json', ...extra }
    if (this.token) h.Authorization = `Bearer ${this.token}`
    return h
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`
    const res = await fetch(url, {
      method,
      headers: this.headers(),
      body: body ? JSON.stringify(body) : undefined,
      cache: 'no-store',
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new ApiError(data?.error ?? data?.message ?? `Request failed (${res.status})`, res.status)
    }
    return res.json() as Promise<T>
  }

  get<T>(path: string): Promise<T> { return this.request<T>('GET', path) }
  post<T>(path: string, body?: unknown): Promise<T> { return this.request<T>('POST', path, body) }
  put<T>(path: string, body?: unknown): Promise<T> { return this.request<T>('PUT', path, body) }
  patch<T>(path: string, body?: unknown): Promise<T> { return this.request<T>('PATCH', path, body) }
  delete<T>(path: string): Promise<T> { return this.request<T>('DELETE', path) }
}

// Singleton instances per role
let _patientApi: ApiClient | null = null
let _driverApi: ApiClient | null = null
let _coordinatorApi: ApiClient | null = null
let _adminApi: ApiClient | null = null

export function getApi(role: string): ApiClient {
  switch (role) {
    case 'PATIENT':
      if (!_patientApi) _patientApi = new ApiClient({ role: 'patient' })
      return _patientApi
    case 'DRIVER':
      if (!_driverApi) _driverApi = new ApiClient({ role: 'driver' })
      return _driverApi
    case 'COORDINATOR':
      if (!_coordinatorApi) _coordinatorApi = new ApiClient({ role: 'coordinator' })
      return _coordinatorApi
    case 'ADMIN':
      if (!_adminApi) _adminApi = new ApiClient({ role: 'admin' })
      return _adminApi
    default:
      return new ApiClient()
  }
}

export { getToken, saveToken, clearToken, DEFAULT_API_BASE }