import { ReactNode } from 'react'
interface StatCardProps { label: string; value: string | number; icon?: ReactNode; iconBg?: string; change?: string; loading?: boolean; }
export function StatCard({ label, value, icon, iconBg = '#f5f3ff', change, loading }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2.5">{label}</div>
          <div className="text-3xl font-bold text-gray-900 tracking-tight leading-none">
            {loading ? <span className="text-gray-200">–</span> : value}
          </div>
          {change && !loading && <div className="text-xs text-gray-400 mt-1.5">{change}</div>}
        </div>
        {icon && <div className="p-2.5 rounded-xl flex-shrink-0" style={{background: iconBg}}>{icon}</div>}
      </div>
    </div>
  )
}
