import { ReactNode, HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: boolean
  hover?: boolean
}

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  action?: ReactNode
  border?: boolean
}

interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  noPadding?: boolean
}

export function Card({ children, padding = false, hover = false, className = '', ...props }: CardProps) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm
        ${hover ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, action, border = true, className = '', ...props }: CardHeaderProps) {
  return (
    <div
      className={`
        px-6 py-4 flex items-center justify-between
        ${border ? 'border-b border-slate-200 dark:border-slate-700' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="flex-1">{children}</div>
      {action && <div className="ml-4 flex-shrink-0">{action}</div>}
    </div>
  )
}

export function CardBody({ children, noPadding = false, className = '', ...props }: CardBodyProps) {
  return (
    <div className={`${noPadding ? '' : 'px-6 py-5'} ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`px-6 py-3 border-t border-slate-200 dark:border-slate-700 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
