import { ReactNode, HTMLAttributes } from 'react'

type BadgeVariant = 'blue' | 'green' | 'red' | 'orange' | 'yellow' | 'purple' | 'slate'
type BadgeSize = 'sm' | 'md'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  children: ReactNode
}

const variants: Record<BadgeVariant, string> = {
  blue:   'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  green:  'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  red:    'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  yellow: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  slate:  'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
}

const dotColors: Record<BadgeVariant, string> = {
  blue:   'bg-blue-500',
  green:  'bg-green-500',
  red:    'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
  slate:  'bg-slate-400',
}

const sizes: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
}

export function Badge({ variant = 'slate', size = 'md', dot = false, children, className = '', ...props }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded-full
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}

// Convenience: priority badge
type Priority = 'høy' | 'high' | 'medium' | 'lav' | 'low'

export function PriorityBadge({ priority }: { priority: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    høy:    { variant: 'red',    label: 'Høy' },
    high:   { variant: 'red',    label: 'Høy' },
    medium: { variant: 'orange', label: 'Medium' },
    lav:    { variant: 'slate',  label: 'Lav' },
    low:    { variant: 'slate',  label: 'Lav' },
  }
  const cfg = map[priority?.toLowerCase()] || { variant: 'slate' as BadgeVariant, label: priority }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

// Convenience: status badge
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    apent:           { variant: 'blue',   label: 'Åpen' },
    pagar:           { variant: 'purple', label: 'Pågår' },
    venter_pa_kunde: { variant: 'yellow', label: 'Venter' },
    lukket:          { variant: 'green',  label: 'Lukket' },
    ikke_startet:    { variant: 'slate',  label: 'Ikke startet' },
    ferdig:          { variant: 'green',  label: 'Ferdig' },
    active:          { variant: 'green',  label: 'Aktiv' },
    onboarding:      { variant: 'blue',   label: 'Onboarding' },
  }
  const cfg = map[status?.toLowerCase()] || { variant: 'slate' as BadgeVariant, label: status }
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>
}

// Health score circle
export function HealthScore({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-600 border-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-400 dark:border-green-500'
    : score >= 60 ? 'text-yellow-600 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-500'
    : 'text-red-600 border-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-500'
  return (
    <div className={`w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold ${color}`}>
      {score}
    </div>
  )
}
