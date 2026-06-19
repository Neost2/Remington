import Link from 'next/link'
import { Ambulance, ArrowRight, Bus, Car, HandHeart, ShieldCheck, TimerReset } from 'lucide-react'

const pillars = [
  {
    icon: Bus,
    title: 'Pool Every Existing Network',
    description: 'Bring Medicaid transport, clinic shuttles, and local providers into one dispatch decision layer.',
  },
  {
    icon: HandHeart,
    title: 'Activate Community Volunteers',
    description: 'Use vetted volunteers as fallback coverage before missed appointments become a care crisis.',
  },
  {
    icon: TimerReset,
    title: 'Intervene Before Failure',
    description: 'Surface risk signals early so teams can recover rides before the appointment window closes.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-teal-950 via-cyan-900 to-slate-950 text-slate-100">
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 pb-12 pt-10 md:px-10">
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl backdrop-blur-sm md:p-10">
          <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-teal-300/20 blur-3xl" />
          <div className="absolute -bottom-20 right-6 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">CarePath Dispatch Intelligence</p>
              <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-5xl">
                Build transportation certainty for medical care, even when traditional rides fall through.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-cyan-100/95 md:text-lg">
                CarePath pools medical transportation channels, including community volunteers, so wheelchair needs,
                same-day urgency, and long-distance specialty appointments are not left behind.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/coordinator/pooling"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-300 px-5 py-3 text-sm font-semibold text-teal-950 transition hover:bg-teal-200"
                >
                  Open Pooling Hub <ArrowRight size={16} />
                </Link>
                <a
                  href="#validation"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  View evidence signals
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-slate-950/30 p-5">
              <p className="text-sm font-semibold text-cyan-100">Current priority profile</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Wheelchair-dependent family routing</h2>
              <ul className="mt-4 space-y-2 text-sm text-cyan-100/90">
                <li className="flex items-start gap-2">
                  <Car size={14} className="mt-0.5 text-teal-200" />
                  Limited wheelchair van supply for specialty runs
                </li>
                <li className="flex items-start gap-2">
                  <Ambulance size={14} className="mt-0.5 text-teal-200" />
                  Avoid ambulance-only fallback by escalating same-day backup
                </li>
                <li className="flex items-start gap-2">
                  <ShieldCheck size={14} className="mt-0.5 text-teal-200" />
                  Prioritize medical visits over non-clinical scheduling conflict
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <article key={pillar.title} className="rounded-2xl border border-white/10 bg-slate-950/35 p-5 shadow-lg">
                <div className="inline-flex rounded-xl bg-teal-300/20 p-2 text-teal-100">
                  <Icon size={18} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-6 text-cyan-100/90">{pillar.description}</p>
              </article>
            )
          })}
        </section>

        <section id="validation" className="rounded-3xl border border-cyan-200/20 bg-slate-950/45 p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Validation-backed direction</p>
          <div className="mt-3 grid gap-4 text-sm text-cyan-50/95 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">Night-before no-provider calls repeatedly create no-recovery windows.</div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">Rigid 72-hour scheduling fails urgent but non-emergency medical events.</div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">Families absorb cost and stress when systems default to ambulance plus paid rideshare.</div>
          </div>
        </section>
      </main>
    </div>
  )
}
