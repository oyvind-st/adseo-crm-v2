import { ReactNode, createContext, useContext } from 'react'

interface TabsContextType {
  active: string
  onChange: (value: string) => void
}

const TabsContext = createContext<TabsContextType>({ active: '', onChange: () => {} })

interface TabsProps {
  value: string
  onChange: (value: string) => void
  children: ReactNode
  className?: string
}

interface TabListProps {
  children: ReactNode
  className?: string
  border?: boolean
}

interface TabProps {
  value: string
  children: ReactNode
  count?: number
  className?: string
}

export function Tabs({ value, onChange, children, className = '' }: TabsProps) {
  return (
    <TabsContext.Provider value={{ active: value, onChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabList({ children, className = '', border = true }: TabListProps) {
  return (
    <div
      className={`
        flex overflow-x-auto
        ${border ? 'border-b border-slate-200 dark:border-slate-700' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}

export function Tab({ value, children, count, className = '' }: TabProps) {
  const { active, onChange } = useContext(TabsContext)
  const isActive = active === value

  return (
    <button
      onClick={() => onChange(value)}
      className={`
        flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px
        transition-colors whitespace-nowrap focus:outline-none
        ${isActive
          ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
          : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
        }
        ${className}
      `}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className={`
          text-xs px-1.5 py-0.5 rounded-full font-medium
          ${isActive
            ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
            : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
          }
        `}>
          {count}
        </span>
      )}
    </button>
  )
}
