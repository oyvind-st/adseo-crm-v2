import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  /** Tailwind bg class for icon container, e.g. 'bg-blue-50 dark:bg-blue-900/30' */
  iconColor?: string
  /** Legacy hex color support */
  iconBg?: string
  change?: string
  loading?: boolean
  /** 'side' = icon left, number right (matches Figma TaskList style)
   *  'top'  = icon top-right, label+number+change stacked (matches Dashboard style) */
  layout?: 'side' | 'top'
}

export function StatCard({
  label, value, icon, iconColor, iconBg, change, loading, layout = 'side'
}: StatCardProps) {
  const loadingVal = <span className="text-slate-200 dark:text-slate-600">—</span>

  const iconContainer = icon ? (
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor || ''}`}
      style={iconBg ? { background: iconBg } : undefined}
    >
      {icon}
    </div>
  ) : null

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
      {layout === 'side' ? (
        /* Icon left, label + number stacked to the right */
        <div className="flex items-center gap-3">
          {iconContainer}
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {loading ? loadingVal : value}
            </p>
          </div>
        </div>
      ) : (
        /* Icon top-right, label + number + change stacked on left */
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
              {loading ? loadingVal : value}
            </p>
            {change && !loading && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{change}</p>
            )}
          </div>
          {iconContainer && (
            <div
              className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColor || ''}`}
              style={iconBg ? { background: iconBg } : undefined}
            >
              {icon}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
