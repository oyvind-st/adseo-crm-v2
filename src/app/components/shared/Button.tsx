import { ReactNode, ButtonHTMLAttributes } from 'react'
import { Loader2 } from 'lucide-react'

// Button extracted exactly from Figma design
// Primary: px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'success'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: ReactNode
  iconRight?: ReactNode
  children?: ReactNode
}

const variants: Record<Variant, string> = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700 dark:hover:bg-blue-500',
  secondary: 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  ghost:     'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800',
  success:   'bg-green-600 text-white hover:bg-green-700',
}

const sizes: Record<Size, string> = {
  sm:  'px-3 py-1.5 text-xs gap-1.5',
  md:  'px-4 py-2 text-sm gap-2',
  lg:  'px-5 py-2.5 text-sm gap-2',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconRight,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 size={14} className="animate-spin" />
      ) : icon ? icon : null}
      {children}
      {iconRight && !loading && iconRight}
    </button>
  )
}
