import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'purple'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const variantClass: Record<string, string> = {
  primary:   'cp-btn cp-btn-primary',
  secondary: 'cp-btn cp-btn-secondary',
  ghost:     'cp-btn cp-btn-secondary',
  danger:    'cp-btn cp-btn-danger',
  purple:    'cp-btn cp-btn-purple',
}

const sizeClass: Record<string, string> = {
  sm: 'cp-btn-sm',
  md: '',
  lg: 'cp-btn-lg',
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  children,
  style,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${variantClass[variant]} ${sizeClass[size]}${className ? ' ' + className : ''}`}
      style={{ ...(fullWidth ? { width: '100%' } : {}), ...style }}
      {...props}
    >
      {children}
    </button>
  )
}
