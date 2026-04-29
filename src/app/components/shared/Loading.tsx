import { Loader2 } from 'lucide-react'

interface LoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  fullPage?: boolean
}

export function Loading({ text = 'Laster...', size = 'md', fullPage = false }: LoadingProps) {
  const iconSizes = { sm: 16, md: 24, lg: 32 }
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' }

  const content = (
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={iconSizes[size]} className="animate-spin text-blue-600 dark:text-blue-400" />
      {text && <p className={`${textSizes[size]} text-slate-500 dark:text-slate-400`}>{text}</p>}
    </div>
  )

  if (fullPage) {
    return (
      <div className="flex items-center justify-center h-64">
        {content}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {content}
    </div>
  )
}

// Inline skeleton for loading states in lists
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
  )
}
