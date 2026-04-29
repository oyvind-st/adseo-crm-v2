import { ReactNode } from 'react'

// StatCard extracted exactly from Figma TaskList design
// https://github.com/oyvind-st/adseo-crm-v2 — src/app/components/TaskList.tsx

interface StatCardProps {
  label: string
  value: string | number
  icon?: ReactNode
  /** Tailwind bg class for icon container, e.g. 'bg-blue-50 dark:bg-blue-900/30' */
  iconColor?: string
  change?: string
  loading?: boolean
}

export function StatCard({ label, value, icon, iconColor, change, loading }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
      <div className="flex items-center gap-3">
        {icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconColor || 'bg-slate-100 dark:bg-slate-700'}`}>
            {icon}
          </div>
        )}
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {loading ? <span className="text-slate-300 dark:text-slate-600">—</span> : value}
          </p>
          {change && !loading && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{change}</p>
          )}
        </div>
      </div>
    </div>
  )
}
