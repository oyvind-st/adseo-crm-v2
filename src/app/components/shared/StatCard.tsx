import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  iconBg?: string
  change?: string
  loading?: boolean
}

export function StatCard({ label, value, icon, iconBg, change, loading }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2 tracking-tight">
            {loading ? <span className="text-slate-200 dark:text-slate-600">—</span> : value}
          </p>
          {change && !loading && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">{change}</p>
          )}
        </div>
        {icon && (
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
            style={iconBg ? { background: iconBg } : undefined}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
