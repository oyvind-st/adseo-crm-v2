import { ReactNode, HTMLAttributes } from 'react'

// Table wrapper
export function Table({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

// Column header row
interface TableHeaderProps {
  columns: Array<{ label: string; align?: 'left' | 'right' | 'center'; className?: string }>
  className?: string
}

export function TableHeader({ columns, className = '' }: TableHeaderProps) {
  const alignMap = { left: 'text-left', right: 'text-right', center: 'text-center' }
  return (
    <div className={`grid px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700 ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns.length}, 1fr)` }}>
      {columns.map((col, i) => (
        <span key={i} className={`text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider ${alignMap[col.align || 'left']} ${col.className || ''}`}>
          {col.label}
        </span>
      ))}
    </div>
  )
}

// Table row
interface TableRowProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  clickable?: boolean
  border?: boolean
  last?: boolean
}

export function TableRow({ children, clickable = false, border = true, last = false, className = '', ...props }: TableRowProps) {
  return (
    <div
      className={`
        flex items-center px-5 py-3.5
        ${border && !last ? 'border-b border-slate-100 dark:border-slate-700' : ''}
        ${clickable ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

// Empty row (for "no results")
export function TableEmpty({ message = 'Ingen resultater' }: { message?: string }) {
  return (
    <div className="py-12 text-center text-sm text-slate-400 dark:text-slate-500">
      {message}
    </div>
  )
}
