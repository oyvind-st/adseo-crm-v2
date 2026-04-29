import { ReactNode, createContext, useContext } from 'react'

// Tabs extracted exactly from Figma TaskList/TicketList design
// Active:   text-blue-600 dark:text-blue-400 border-b-2 border-blue-600
// Inactive: text-slate-600 dark:text-slate-400 hover:text-slate-900

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

export function TabList({ children, className = '' }: TabListProps) {
  return (
    <div className={`flex border-b border-slate-200 dark:border-slate-700 ${className}`}>
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
      className={`flex items-center gap-1.5 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
        isActive
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 -mb-px'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
      } ${className}`}
    >
      {children}
      {count !== undefined && count > 0 && (
        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
          isActive
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        }`}>
          {count}
        </span>
      )}
    </button>
  )
}
