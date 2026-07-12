type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'purple'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClass: Record<BadgeVariant, string> = {
  success: 'cp-badge cp-badge-success',
  warning: 'cp-badge cp-badge-warning',
  error:   'cp-badge cp-badge-error',
  info:    'cp-badge cp-badge-info',
  neutral: 'cp-badge cp-badge-neutral',
  purple:  'cp-badge cp-badge-purple',
}

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span className={`${variantClass[variant]}${className ? ' ' + className : ''}`}>
      {children}
    </span>
  )
}
