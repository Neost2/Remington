import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Bus, HandHeart, TimerReset, CheckCircle } from 'lucide-react'

const pillars = [
  {
    icon: Bus,
    color: '#0c6bc2',
    bg: '#dbeafe',
    title: 'Pool Every Network',
    description: 'Medicaid transport, clinic shuttles, and local providers unified in one dispatch layer.',
  },
  {
    icon: HandHeart,
    color: '#1b9c86',
    bg: '#d0f4ee',
    title: 'Activate Volunteers',
    description: 'Vetted community volunteers as fallback coverage before missed appointments become a crisis.',
  },
  {
    icon: TimerReset,
    color: '#5540a1',
    bg: '#ede9f7',
    title: 'Intervene Early',
    description: 'Surface risk signals so teams can recover rides before the appointment window closes.',
  },
]

const stats = [
  { value: '15', label: 'Validation interviews', color: '#5540a1' },
  { value: '13', label: 'Strong signal cases', color: '#1b9c86' },
  { value: '4+', label: 'Patient segments', color: '#0c6bc2' },
  { value: '0', label: 'Dominant solutions', color: '#052b56' },
]

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, -apple-system, sans-serif' }}>

      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e2e8f0',
        padding: '0 32px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Image src="/carepath-logo.png" alt="CarePath" width={36} height={36}
            style={{ borderRadius: 8, objectFit: 'contain' }} />
          <span style={{ fontWeight: 800, fontSize: 18, color: '#0f172a' }}>CarePath</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/coordinator/pooling" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            background: '#5540a1', color: '#fff', textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(85,64,161,0.3)',
          }}>
            Coordinator Hub
          </Link>
          <Link href="/patient/intake" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 18px', borderRadius: 10, fontSize: 14, fontWeight: 600,
            background: '#1b9c86', color: '#fff', textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(27,156,134,0.3)',
          }}>
            Request a Ride
          </Link>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Hero */}
        <section style={{
          marginTop: 32,
          borderRadius: 20,
          background: 'linear-gradient(135deg, #052b56 0%, #0c6bc2 40%, #5540a1 70%, #1b9c86 100%)',
          padding: '40px 24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(5,43,86,0.3)',
        }}>
          <div style={{ position: 'absolute', top: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(85,64,161,0.3)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: -80, right: 40, width: 280, height: 280, borderRadius: '50%', background: 'rgba(27,156,134,0.25)', filter: 'blur(60px)' }} />

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Image src="/carepath-logo.png" alt="CarePath" width={48} height={48}
                style={{ borderRadius: 12, objectFit: 'contain', background: 'rgba(255,255,255,0.1)' }} />
              <span style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>CarePath</span>
            </div>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em', color: '#93c5fd', marginBottom: 10 }}>
              Transportation Coordination for Medical Care
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
              Reliable rides to medical appointments, anywhere.
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, marginBottom: 24, maxWidth: 520 }}>
              CarePath removes the transportation and communication failures that cause missed care.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link href="/coordinator/pooling" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 22px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: '#1b9c86', color: '#fff', textDecoration: 'none',
                minHeight: 48, touchAction: 'manipulation',
              }}>
                Open Pooling Hub <ArrowRight size={16} />
              </Link>
              <a href="#validation" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '13px 22px', borderRadius: 12, fontSize: 15, fontWeight: 700,
                background: 'rgba(255,255,255,0.12)', color: '#fff', textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.25)',
                minHeight: 48, touchAction: 'manipulation',
              }}>
                View evidence
              </a>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="cp-grid-4" style={{ marginTop: 20 }}>
          {stats.map(({ value, label, color }) => (
            <div key={label} style={{
              background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: '16px 20px',
              borderTop: `3px solid ${color}`,
            }}>
              <p style={{ fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: 13, color: '#64748b', marginTop: 6, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </section>

        {/* Pillars */}
        <section className="cp-grid-3" style={{ marginTop: 20 }}>
          {pillars.map(({ icon: Icon, color, bg, title, description }) => (
            <div key={title} style={{
              background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: 20,
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>{description}</p>
            </div>
          ))}
        </section>

        {/* Validation signals */}
        <section id="validation" style={{
          marginTop: 32, borderRadius: 20,
          background: '#fff', border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)', padding: 32,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 4, height: 24, borderRadius: 2, background: '#1b9c86' }} />
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#1b9c86' }}>
              Validation-backed direction — 15 interviews, 13 strong signals
            </p>
          </div>
          <div className="cp-grid-3" style={{ marginTop: 16 }}>
            {[
              'Night-before no-provider calls repeatedly create no-recovery windows for caregivers.',
              'Rigid 72-hour scheduling rules fail urgent but non-emergency medical events.',
              'Families absorb cost and stress when systems default to ambulance plus paid rideshare.',
            ].map((text) => (
              <div key={text} style={{
                background: '#f8fafc', borderRadius: 12, padding: 16,
                border: '1px solid #e2e8f0', display: 'flex', gap: 10,
              }}>
                <CheckCircle size={16} style={{ color: '#1b9c86', flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          marginTop: 20, borderRadius: 18, padding: '32px 24px',
          background: 'linear-gradient(135deg, #5540a1, #0c6bc2)',
          boxShadow: '0 8px 32px rgba(85,64,161,0.25)',
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 8 }}>
            Ready to coordinate care transport?
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginBottom: 20 }}>
            Open the pooling hub or submit a patient ride request.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/coordinator/pooling" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', borderRadius: 12, fontSize: 14, fontWeight: 700,
              background: '#fff', color: '#5540a1', textDecoration: 'none',
              minHeight: 48, touchAction: 'manipulation',
            }}>
              Coordinator Hub <ArrowRight size={15} />
            </Link>
            <Link href="/patient/intake" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 22px', borderRadius: 12, fontSize: 14, fontWeight: 700,
              background: 'rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              minHeight: 48, touchAction: 'manipulation',
            }}>
              Patient Intake
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
