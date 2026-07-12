'use client'

import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, Car, Clock3, HandHeart, Route, ShieldCheck, UserRoundCheck, WifiOff } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { demoPendingRides, demoPoolingOptions, PendingRide, PoolCandidate, PoolingOptionsResponse } from '@/lib/pooling'

type DataMode = 'demo' | 'live'

const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? 'http://localhost:3000/api'

const urgencyVariant: Record<PoolingOptionsResponse['urgencyLevel'], 'error' | 'warning' | 'info'> = {
  critical: 'error',
  high: 'warning',
  normal: 'info',
}

const toDisplayDate = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

const fullName = (ride: PendingRide): string => `${ride.patient.user.firstName} ${ride.patient.user.lastName}`

const flattenCandidates = (poolingData: PoolingOptionsResponse | null): PoolCandidate[] => {
  if (!poolingData) return []
  return [...poolingData.pools.community.candidates, ...poolingData.pools.primary.candidates]
}

export default function CoordinatorPoolingPage() {
  const [mode, setMode] = useState<DataMode>('demo')
  const [apiBaseUrl, setApiBaseUrl] = useState(DEFAULT_API_BASE)
  const [token, setToken] = useState('')
  const [pendingRides, setPendingRides] = useState<PendingRide[]>(demoPendingRides)
  const [selectedRideId, setSelectedRideId] = useState<string>(demoPendingRides[0]?.id ?? '')
  const [poolingOptions, setPoolingOptions] = useState<PoolingOptionsResponse | null>(demoPoolingOptions)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [actionMessage, setActionMessage] = useState<string | null>(null)

  useEffect(() => {
    const savedToken = window.localStorage.getItem('carepath.coordinator.token')
    if (savedToken) setToken(savedToken)
  }, [])

  const selectedRide = useMemo(() => pendingRides.find((r) => r.id === selectedRideId) ?? null, [pendingRides, selectedRideId])
  const allCandidates = useMemo(() => flattenCandidates(poolingOptions), [poolingOptions])
  const authHeaders = useMemo(() => {
    const h: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token.trim()) h.Authorization = `Bearer ${token.trim()}`
    return h
  }, [token])

  const runLiveLoad = async (): Promise<void> => {
    if (!token.trim()) { setErrorMessage('A coordinator JWT token is required for live mode.'); return }
    setIsLoading(true); setErrorMessage(null); setActionMessage(null)
    try {
      const pendingRes = await fetch(`${apiBaseUrl}/rides/pending`, { headers: authHeaders, cache: 'no-store' })
      if (!pendingRes.ok) throw new Error(`Unable to load pending rides (${pendingRes.status}).`)
      const rides = (await pendingRes.json()) as PendingRide[]
      setPendingRides(rides)
      const targetId = rides[0]?.id ?? ''
      setSelectedRideId(targetId)
      if (!targetId) { setPoolingOptions(null); setActionMessage('No pending rides available right now.'); return }
      const optRes = await fetch(`${apiBaseUrl}/rides/${targetId}/pooling-options`, { headers: authHeaders, cache: 'no-store' })
      if (!optRes.ok) throw new Error(`Unable to load pooling options (${optRes.status}).`)
      setPoolingOptions((await optRes.json()) as PoolingOptionsResponse)
      setActionMessage('Live data loaded successfully.')
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to load live data.')
    } finally { setIsLoading(false) }
  }

  const loadRideOptions = async (rideId: string): Promise<void> => {
    setSelectedRideId(rideId)
    if (mode === 'demo') { setPoolingOptions({ ...demoPoolingOptions, rideId }); return }
    try {
      const res = await fetch(`${apiBaseUrl}/rides/${rideId}/pooling-options`, { headers: authHeaders, cache: 'no-store' })
      if (!res.ok) throw new Error(`Unable to load pooling options (${res.status}).`)
      setPoolingOptions((await res.json()) as PoolingOptionsResponse)
    } catch (err) { setErrorMessage(err instanceof Error ? err.message : 'Unable to load pooling options.') }
  }

  const handleAssign = async (driverId: string): Promise<void> => {
    if (!selectedRideId) return
    if (mode === 'demo') { setActionMessage(`Demo: assigned ${driverId} to ${selectedRideId}.`); return }
    setActionLoading(true); setErrorMessage(null)
    try {
      const res = await fetch(`${apiBaseUrl}/rides/${selectedRideId}/assign`, { method: 'PATCH', headers: authHeaders, body: JSON.stringify({ driverId }) })
      if (!res.ok) throw new Error(`Assign failed (${res.status}).`)
      await runLiveLoad(); setActionMessage('Driver assigned successfully.')
    } catch (err) { setErrorMessage(err instanceof Error ? err.message : 'Failed to assign driver.') }
    finally { setActionLoading(false) }
  }

  const handleFallback = async (): Promise<void> => {
    if (!selectedRideId) return
    if (mode === 'demo') { setActionMessage(`Demo: fallback triggered for ${selectedRideId}.`); return }
    setActionLoading(true); setErrorMessage(null)
    try {
      const res = await fetch(`${apiBaseUrl}/rides/${selectedRideId}/fallback`, { method: 'PATCH', headers: authHeaders })
      if (!res.ok) throw new Error(`Fallback trigger failed (${res.status}).`)
      await runLiveLoad(); setActionMessage('Fallback mode triggered for this ride.')
    } catch (err) { setErrorMessage(err instanceof Error ? err.message : 'Failed to trigger fallback.') }
    finally { setActionLoading(false) }
  }

  const switchToDemo = (): void => {
    setMode('demo'); setErrorMessage(null); setActionMessage('Demo mode active.')
    setPendingRides(demoPendingRides); setSelectedRideId(demoPendingRides[0]?.id ?? ''); setPoolingOptions(demoPoolingOptions)
  }

  const totalPrimary = poolingOptions?.pools.primary.count ?? 0
  const totalCommunity = poolingOptions?.pools.community.count ?? 0

  return (
    <DashboardLayout role="coordinator" title="Pooled Transport Hub" subtitle="Dispatch before care is missed" userName="Coordinator">
      <div className="cp-space-y-4">

        {/* Hero banner */}
        <section style={{
          borderRadius: 16, padding: '20px',
          background: 'linear-gradient(135deg, #136e5e, #094f91)',
          color: '#fff',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#99e6d8', marginBottom: 6 }}>
            Operational mode
          </p>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Unified dispatch for medical transportation continuity
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <Badge variant={mode === 'live' ? 'success' : 'warning'}>{mode === 'live' ? 'Live API' : 'Demo'}</Badge>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" variant="secondary" onClick={switchToDemo}>Demo</Button>
              <Button size="sm" onClick={() => { setMode('live'); runLiveLoad() }} disabled={isLoading}>Live</Button>
            </div>
          </div>
        </section>

        {/* API setup */}
        <Card>
          <CardHeader>
            <CardTitle>Live coordinator setup</CardTitle>
          </CardHeader>
          <div className="cp-space-y-3">
            <input value={apiBaseUrl} onChange={(e) => setApiBaseUrl(e.target.value)}
              placeholder="http://localhost:3000/api" className="cp-input" />
            <input value={token} onChange={(e) => setToken(e.target.value)}
              placeholder="Coordinator JWT token" className="cp-input" />
            <Button size="sm" onClick={() => { window.localStorage.setItem('carepath.coordinator.token', token); setActionMessage('Token saved.') }}>
              Save token
            </Button>
          </div>
          <p style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8', marginTop: 10 }}>
            <ShieldCheck size={13} /> Stored locally in your browser only.
          </p>
        </Card>

        <StatCard label="Pending rides" value={pendingRides.length} icon={AlertTriangle} color="amber" />

        {errorMessage && (
          <div className="cp-alert cp-alert-error"><WifiOff size={16} /> {errorMessage}</div>
        )}
        {actionMessage && (
          <div className="cp-alert cp-alert-success">{actionMessage}</div>
        )}

        {/* Ride queue */}
        <Card>
          <CardHeader>
            <CardTitle>Ride queue</CardTitle>
          </CardHeader>
          <div className="cp-space-y-3">
            {pendingRides.length === 0 && (
              <p style={{ fontSize: 14, color: '#64748b', padding: '12px 0' }}>No pending rides.</p>
            )}
            {pendingRides.map((ride) => {
              const isSelected = ride.id === selectedRideId
              return (
                <button key={ride.id} onClick={() => loadRideOptions(ride.id)}
                  className={`cp-ride-item${isSelected ? ' selected' : ''}`}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                    <p style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{fullName(ride)}</p>
                    <Badge variant={ride.status === 'FALLBACK_NEEDED' ? 'error' : 'info'}>{ride.status}</Badge>
                  </div>
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{ride.appointment.clinicName}, {ride.appointment.clinicCity}</p>
                  <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                    <Badge variant="neutral"><Clock3 size={11} style={{ marginRight: 3 }} />{toDisplayDate(ride.pickupTime)}</Badge>
                  </div>
                </button>
              )
            })}
          </div>
        </Card>

        {/* Pooled matching */}
        <Card>
          <CardHeader>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <CardTitle>Pooled matching options</CardTitle>
              {poolingOptions && <Badge variant={urgencyVariant[poolingOptions.urgencyLevel]}>Urgency: {poolingOptions.urgencyLevel}</Badge>}
            </div>
          </CardHeader>

          {!selectedRide || !poolingOptions ? (
            <p style={{ fontSize: 14, color: '#64748b' }}>Select a ride to view matching options.</p>
          ) : (
            <div className="cp-space-y-4">
              <div className="cp-grid-3">
                <StatCard label="Primary pool" value={totalPrimary} icon={Route} color="blue" />
                <StatCard label="Community pool" value={totalCommunity} icon={HandHeart} color="teal" />
                <StatCard label="Total candidates" value={allCandidates.length} icon={UserRoundCheck} color="amber" />
              </div>

              <div className="cp-space-y-3">
                {allCandidates.map((candidate) => (
                  <div key={candidate.id} className="cp-candidate">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{candidate.name}</p>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Badge variant={candidate.poolType === 'community' ? 'success' : 'info'}>
                          {candidate.poolType === 'community' ? 'Community' : 'Primary'}
                        </Badge>
                        <Badge variant={candidate.canServeDistance ? 'success' : 'warning'}>
                          score {candidate.matchScore}
                        </Badge>
                      </div>
                    </div>
                    <p style={{ fontSize: 13, color: '#64748b', marginTop: 6 }}>
                      {candidate.phone} · {candidate.maxMilesOneWay} mi max · reliability {candidate.reliabilityScore.toFixed(1)}
                    </p>
                    {candidate.communityNotes && <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{candidate.communityNotes}</p>}
                    <div style={{ marginTop: 10 }}>
                      <Button size="sm" onClick={() => handleAssign(candidate.id)} disabled={actionLoading || isLoading}>
                        Assign driver
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: '#f8fafc', borderRadius: 12, padding: 16, border: '1px solid #e2e8f0' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Recommended actions</p>
                <ul className="cp-space-y-3" style={{ paddingLeft: 4 }}>
                  {poolingOptions.recommendedActions.map((action) => (
                    <li key={action} style={{ fontSize: 13, color: '#475569' }}>— {action}</li>
                  ))}
                </ul>
                <div style={{ marginTop: 12 }}>
                  <Button size="sm" variant="danger" onClick={handleFallback} disabled={actionLoading || isLoading}>
                    Trigger fallback escalation
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>

      </div>
    </DashboardLayout>
  )
}
