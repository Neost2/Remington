import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: { value: string; positive: boolean }
  color?: 'teal' | 'blue' | 'amber' | 'rose' | 'purple'
}

const colorMap: Record<string, { bg: string; color: string }> = {
  teal:   { bg: '#d0f4ee', color: '#136e5e' },
  blue:   { bg: '#dbeafe', color: '#1d4ed8' },
  amber:  { bg: '#fef3c7', color: '#d97706' },
  rose:   { bg: '#ffe4e6', color: '#e11d48' },
  purple: { bg: '#ede9f7', color: '#5540a1' },
}

export function StatCard({ label, value, icon: Icon, trend, color = 'teal' }: StatCardProps) {
  const { bg, color: iconColor } = colorMap[color]
  return (
    <div className="cp-stat">
      <div className="cp-stat-icon" style={{ background: bg, color: iconColor }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p className="cp-stat-label">{label}</p>
        <p className="cp-stat-value">{value}</p>
        {trend && (
          <p style={{ fontSize: 12, marginTop: 4, fontWeight: 600, color: trend.positive ? '#059669' : '#dc2626' }}>
            {trend.positive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </div>
  )
}
