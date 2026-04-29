import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

// Shared ticket row — use in TicketList, CustomerDetail, Dashboard etc.

interface TicketRowProps {
  id: string
  tittel: string
  beskrivelse?: string
  prioritet: string
  status: string
  kategori?: string
  kunder?: { bedriftsnavn: string }
  kontakter?: { navn: string }
  created_at: string
  last?: boolean
}

const PRIORITY_STYLE: Record<string, string> = {
  høy:    'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  lav:    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
}

const PRIORITY_LABEL: Record<string, string> = {
  høy: 'Høy', medium: 'Medium', lav: 'Lav'
}

function timeAgo(d: string) {
  const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000)
  if (h < 1) return 'Akkurat nå'
  if (h < 24) return `${h}t siden`
  return `${Math.floor(h / 24)}d siden`
}

export function TicketRow({ id, tittel, beskrivelse, prioritet, kategori, kunder, kontakter, created_at, last = false }: TicketRowProps) {
  const navigate = useNavigate()
  const displayName = kontakter?.navn || kunder?.bedriftsnavn || 'Ukjent'

  return (
    <div
      onClick={() => navigate(`/tickets/${id}`)}
      className={`flex items-start gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer${last ? '' : ' border-b border-slate-100 dark:border-slate-700'}`}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
        {displayName.slice(0, 2).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-slate-900 dark:text-white">{displayName}</span>
          {prioritet === 'høy' && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
              Høy prioritet
            </span>
          )}
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">{tittel}</p>
        {beskrivelse && (
          <p className="text-xs text-slate-400 truncate max-w-xl mb-1.5">{beskrivelse}</p>
        )}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          {kunder?.bedriftsnavn && (
            <span className="font-medium text-slate-500 dark:text-slate-400">{kunder.bedriftsnavn}</span>
          )}
          {kategori && (
            <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">
              {kategori}
            </span>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className="text-xs text-slate-400">{timeAgo(created_at)}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_STYLE[prioritet] || PRIORITY_STYLE.lav}`}>
          {PRIORITY_LABEL[prioritet] || prioritet}
        </span>
      </div>
    </div>
  )
}
