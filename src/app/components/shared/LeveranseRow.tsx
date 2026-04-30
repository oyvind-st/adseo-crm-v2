// LeveranseRow — shared component extracted from LeveranserList.mvp.tsx
// Source: Figma Make export (Adseo CRM (1).zip)

import { useNavigate } from 'react-router-dom'
import { Package, User, Clock, Ticket as TicketIcon, ArrowRight } from 'lucide-react'

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
  not_started: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  in_progress: 'bg-blue-100 text-blue-700',
  waiting:     'bg-yellow-100 text-yellow-700',
  completed:   'bg-green-100 text-green-700',
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
      className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Purple package icon — from Figma */}
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>

          <div className="flex-1 min-w-0">
            {/* Row 1: customer + type badge + tickets badge */}
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-slate-900 dark:text-white">{customer}</h3>
              {type && (
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-medium">
                  {type}
                </span>
              )}
              {hasUnreadTickets && (
                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1">
                  <TicketIcon className="w-3 h-3" />
                  Nye tickets
                </span>
              )}
            </div>

            {/* Row 2: responsible · deadline · tasks */}
            <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
              {responsible && (
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  {responsible}
                </span>
              )}
              {responsible && deadline && <span>•</span>}
              {deadline && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Frist: {deadline}
                </span>
              )}
              {(responsible || deadline) && tasksTotal > 0 && <span>•</span>}
              {tasksTotal > 0 && (
                <span>{tasksCompleted} av {tasksTotal} oppgaver</span>
              )}
            </div>

            {/* Progress bar */}
            <div className="mt-2 flex items-center gap-3">
              <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 min-w-[3rem] text-right">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        {/* Status badge + arrow */}
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          <span className={`px-3 py-1 rounded text-sm font-medium ${STATUS_COLOR[status]}`}>
            {STATUS_LABEL[status]}
          </span>
          <ArrowRight className="w-5 h-5 text-slate-400" />
        </div>
      </div>
    </div>
  )
}
