interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  style?: React.CSSProperties
}

export function Card({ children, className, hover, style }: CardProps) {
  return (
    <div className={`cp-card${hover ? ' cp-card-hover' : ''}${className ? ' ' + className : ''}`} style={style}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div style={{ marginBottom: 16, ...style }} className={className}>{children}</div>
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }} className={className}>{children}</h3>
}
