// LeveranseRow — card style based on CustomerDetail "Aktive leveranser"
// Used in: CustomerDetail sidebar, LeveranserList, Dashboard

import { useNavigate } from 'react-router-dom'
import { Users, Calendar, Ticket as TicketIcon } from 'lucide-react'

export interface LeveranseRowProps {
  id: string
  customer: string
  type?: string
  status: 'not_started' | 'in_progress' | 'waiting' | 'completed'
  progress: number
  tasksCompleted: number
  tasksTotal: number
  responsible?: string
  deadline?: string
  hasUnreadTickets?: boolean
}

const STATUS_COLOR: Record<string, string> = {
  not_started: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  in_progress: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  waiting:     'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  completed:   'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
}

const STATUS_LABEL: Record<string, string> = {
  not_started: 'Ikke startet',
  in_progress: 'Pågår',
  waiting:     'Venter på kunde',
  completed:   'Ferdig',
}

export function LeveranseRow({
  id, customer, type, status, progress,
  tasksCompleted, tasksTotal, responsible, deadline, hasUnreadTickets,
}: LeveranseRowProps) {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/leveranser/${id}`)}
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
    >
      {/* Top: title + badges + status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h4 className="font-semibold text-slate-900 dark:text-white">{customer}</h4>
            {type && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">
                {type}
              </span>
            )}
            {hasUnreadTickets && (
              <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full font-medium border border-red-200 dark:border-red-800 flex items-center gap-1">
                <TicketIcon className="w-3 h-3" />
                Nye tickets
              </span>
            )}
          </div>
        </div>
        <span className={`ml-3 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${STATUS_COLOR[status]}`}>
          {STATUS_LABEL[status]}
        </span>
      </div>

      {/* Meta + progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            {responsible && (
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                {responsible}
              </span>
            )}
            {deadline && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                Frist: {deadline}
              </span>
            )}
          </div>
          {tasksTotal > 0 && (
            <span className="font-medium text-slate-900 dark:text-white">
              {tasksCompleted} av {tasksTotal} oppgaver
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
          <div
            className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
