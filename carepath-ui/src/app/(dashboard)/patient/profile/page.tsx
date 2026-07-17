'use client'

import { FormEvent, useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, User } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

const DEFAULT_API_BASE = process.env.NEXT_PUBLIC_CAREPATH_API_URL ?? 'http://localhost:3001/api'

type Form = {
  county: string
  state: string
  zipCode: string
  primaryLanguage: string
  hasSmartphone: boolean
  prefersSms: boolean
  prefersVoice: boolean
  accessibilityRequirement: string
  schedulingConstraint: string
  defaultFundingSource: string
  primaryInsuranceProvider: string
  raceEthnicity: string
  disability: string
  incomeBracket: string
  barriers: string
  notes: string
}

const initial: Form = {
  county: '', state: 'AR', zipCode: '', primaryLanguage: 'English',
  hasSmartphone: true, prefersSms: true, prefersVoice: false,
  accessibilityRequirement: 'STANDARD', schedulingConstraint: 'STANDARD',
  defaultFundingSource: 'MEDICAID_NEMT', primaryInsuranceProvider: '',
  raceEthnicity: '', disability: '', incomeBracket: '', barriers: '', notes: '',
}

export default function PatientProfilePage() {
  const [mode, setMode] = useState<'demo' | 'live'>('demo')
  const [apiBase, setApiBase] = useState(DEFAULT_API_BASE)
  const [token, setToken] = useState('')
  const [form, setForm] = useState<Form>(initial)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const set = (p: Partial<Form>) => setForm(prev => ({ ...prev, ...p }))
  const headers = { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }

  useEffect(() => {
    const t = localStorage.getItem('carepath.patient.token')
    if (t) setToken(t)
  }, [])

  const load = async () => {
    if (mode === 'demo') { setResult('Demo mode: showing default profile.'); return }
    if (!token) { setError('Patient JWT token required.'); return }
    try {
      const res = await fetch(`${apiBase}/patients/profile`, { headers })
      if (!res.ok) throw new Error(`Load failed (${res.status})`)
      const d = await res.json()
      setForm({
        county: d.county ?? '', state: d.state ?? 'AR', zipCode: d.zipCode ?? '',
        primaryLanguage: d.primaryLanguage ?? 'English',
        hasSmartphone: d.hasSmartphone ?? true, prefersSms: d.prefersSms ?? true, prefersVoice: d.prefersVoice ?? false,
        accessibilityRequirement: d.accessibilityRequirement ?? 'STANDARD',
        schedulingConstraint: d.schedulingConstraint ?? 'STANDARD',
        defaultFundingSource: d.defaultFundingSource ?? 'MEDICAID_NEMT',
        primaryInsuranceProvider: d.primaryInsuranceProvider ?? '',
        raceEthnicity: d.raceEthnicity ?? '', disability: d.disability ?? '',
        incomeBracket: d.incomeBracket ?? '', barriers: d.barriers ?? '', notes: d.notes ?? '',
      })
      setResult('Profile loaded.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to load.') }
  }

  const save = async (e: FormEvent) => {
    e.preventDefault(); setError(null); setResult(null)
    if (mode === 'demo') { setResult('Demo: profile saved.'); return }
    if (!token) { setError('Patient JWT token required.'); return }
    setSaving(true)
    try {
      const res = await fetch(`${apiBase}/patients/profile`, { method: 'PUT', headers, body: JSON.stringify(form) })
      if (!res.ok) throw new Error(`Save failed (${res.status})`)
      setResult('Profile saved successfully.')
    } catch (e) { setError(e instanceof Error ? e.message : 'Failed to save.') }
    finally { setSaving(false) }
  }

  return (
    <DashboardLayout role="patient" title="My Profile" subtitle="Accessibility, communication, and funding preferences" userName="Patient">
      <div className="cp-space-y-4">
        <section style={{ borderRadius: 16, padding: 20, background: 'linear-gradient(135deg, #136e5e, #094f91)', color: '#fff' }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#99e6d8', marginBottom: 6 }}>Patient profile</p>
          <h2 style={{ fontSize: 20, fontWeight: 800 }}>Your profile helps coordinators match the right ride and driver for your needs.</h2>
        </section>

        <Card>
          <div className="cp-space-y-3">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge variant={mode === 'live' ? 'success' : 'warning'}>{mode === 'live' ? 'Live' : 'Demo'}</Badge>
              <Button size="sm" variant="secondary" onClick={() => setMode('demo')}>Demo</Button>
              <Button size="sm" onClick={() => setMode('live')}>Live</Button>
            </div>
            <input value={apiBase} onChange={e => setApiBase(e.target.value)} placeholder="API base URL" className="cp-input" />
            <input value={token} onChange={e => setToken(e.target.value)} placeholder="Patient JWT token" className="cp-input" />
            <div style={{ display: 'flex', gap: 8 }}>
              <Button size="sm" variant="secondary" onClick={() => { const t = localStorage.getItem('carepath.patient.token'); if (t) { setToken(t); setResult('Token loaded.') } }}>Load token</Button>
              <Button size="sm" onClick={() => { localStorage.setItem('carepath.patient.token', token); setResult('Token saved.') }}>Save token</Button>
              <Button size="sm" variant="secondary" onClick={load}>Load profile</Button>
            </div>
          </div>
        </Card>

        {result && <div className="cp-alert cp-alert-success"><CheckCircle2 size={16} />{result}</div>}
        {error && <div className="cp-alert cp-alert-error"><AlertCircle size={16} />{error}</div>}

        <Card>
          <CardHeader><CardTitle><User size={16} style={{ display: 'inline', marginRight: 8 }} />Profile setup</CardTitle></CardHeader>
          <form className="cp-space-y-4" onSubmit={save}>
            <div className="cp-grid-2">
              <div><label className="cp-label">County</label><input value={form.county} onChange={e => set({ county: e.target.value })} className="cp-input" /></div>
              <div><label className="cp-label">State</label><input value={form.state} onChange={e => set({ state: e.target.value })} className="cp-input" /></div>
            </div>
            <div className="cp-grid-2">
              <div><label className="cp-label">ZIP code</label><input value={form.zipCode} onChange={e => set({ zipCode: e.target.value })} className="cp-input" /></div>
              <div><label className="cp-label">Primary language</label><input value={form.primaryLanguage} onChange={e => set({ primaryLanguage: e.target.value })} className="cp-input" /></div>
            </div>
            <div className="cp-grid-2">
              <div>
                <label className="cp-label">Accessibility requirement</label>
                <select value={form.accessibilityRequirement} onChange={e => set({ accessibilityRequirement: e.target.value })} className="cp-select">
                  <option value="STANDARD">Standard</option>
                  <option value="WHEELCHAIR_ACCESSIBLE">Wheelchair accessible</option>
                  <option value="NON_TRANSFERABLE_WHEELCHAIR">Non-transferable wheelchair</option>
                  <option value="STRETCHER">Stretcher</option>
                </select>
              </div>
              <div>
                <label className="cp-label">Scheduling constraint</label>
                <select value={form.schedulingConstraint} onChange={e => set({ schedulingConstraint: e.target.value })} className="cp-select">
                  <option value="STANDARD">Standard</option>
                  <option value="SAME_DAY">Same day</option>
                  <option value="ADVANCE_48H">48h advance</option>
                  <option value="ADVANCE_72H">72h advance</option>
                </select>
              </div>
            </div>
            <div className="cp-grid-2">
              <div>
                <label className="cp-label">Default funding source</label>
                <select value={form.defaultFundingSource} onChange={e => set({ defaultFundingSource: e.target.value })} className="cp-select">
                  <option value="MEDICAID_NEMT">Medicaid NEMT</option>
                  <option value="MEDICARE">Medicare</option>
                  <option value="PRIVATE_INSURANCE">Private insurance</option>
                  <option value="FAMILY">Family</option>
                  <option value="GRANT">Grant</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div><label className="cp-label">Insurance provider</label><input value={form.primaryInsuranceProvider} onChange={e => set({ primaryInsuranceProvider: e.target.value })} className="cp-input" /></div>
            </div>
            <div><label className="cp-label">Disability / mobility notes</label><input value={form.disability} onChange={e => set({ disability: e.target.value })} className="cp-input" /></div>
            <div><label className="cp-label">Transportation barriers</label><input value={form.barriers} onChange={e => set({ barriers: e.target.value })} placeholder="e.g. no vehicle, no backup driver" className="cp-input" /></div>
            <div><label className="cp-label">Additional notes</label><textarea rows={2} value={form.notes} onChange={e => set({ notes: e.target.value })} className="cp-textarea" /></div>
            <div className="cp-grid-2">
              <label className="cp-checkbox-row"><input type="checkbox" checked={form.hasSmartphone} onChange={e => set({ hasSmartphone: e.target.checked })} />Has smartphone</label>
              <label className="cp-checkbox-row"><input type="checkbox" checked={form.prefersSms} onChange={e => set({ prefersSms: e.target.checked })} />Prefers SMS</label>
              <label className="cp-checkbox-row"><input type="checkbox" checked={form.prefersVoice} onChange={e => set({ prefersVoice: e.target.checked })} />Prefers voice call</label>
            </div>
            <Button type="submit" disabled={saving} className="cp-btn-full">{saving ? 'Saving…' : 'Save profile'}</Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}
