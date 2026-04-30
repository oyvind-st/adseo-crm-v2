import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// LeveranseRow — extracted from Figma Leveranser design (leveranser/page.tsx)

export interface LeveranseRowProps {
  id: string
  tittel: string
  type?: string
  status: string
  frist?: string
  kunder?: { bedriftsnavn: string }
  leveranse_oppgaver?: { id: string; fullfort: boolean }[]
  last?: boolean
}

const STATUS_STYLE: Record<string, string> = {
  ikke_startet:    'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
  pagar:           'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  venter_pa_kunde: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  ferdig:          'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
}

const STATUS_LABEL: Record<string, string> = {
  ikke_startet:    'Ikke startet',
  pagar:           'Pågår',
  venter_pa_kunde: 'Venter på kunde',
  ferdig:          'Ferdig',
}

export function LeveranseRow({
  id, tittel, type, status, frist,
  kunder, leveranse_oppgaver = [], last = false
}: LeveranseRowProps) {
  const navigate = useNavigate()

  const total  = leveranse_oppgaver.length
  const done   = leveranse_oppgaver.filter(t => t.fullfort).length
  const pct    = total ? Math.round((done / total) * 100) : 0

  const deadlineStr = frist
    ? new Date(frist).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
    : null
  const isOverdue = frist && status !== 'ferdig' && new Date(frist) < new Date()

  const metaParts: string[] = []
  if (total > 0)      metaParts.push(`${done} av ${total} oppgaver`)
  if (deadlineStr)    metaParts.push(`Frist: ${deadlineStr}`)

  return (
    <div
      onClick={() => navigate(`/leveranser/${id}`)}
      className={`px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer${last ? '' : ' border-b border-slate-100 dark:border-slate-700'}`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        {/* Left: icon + name + title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
            style={{ background: '#ede9fe' }}
          >
            📦
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
              {kunder?.bedriftsnavn || '—'}
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
              {tittel}{type ? ` · ${type}` : ''}
            </div>
          </div>
          {isOverdue && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 whitespace-nowrap flex-shrink-0">
              Forfalt
            </span>
          )}
        </div>

        {/* Right: meta + status + arrow */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {metaParts.length > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
              {metaParts.join(' · ')}
            </span>
          )}
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[status] || STATUS_STYLE.ikke_startet}`}>
            {STATUS_LABEL[status] || status}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
        </div>
      </div>

      {/* Progress bar */}
      {total > 0 && (
        <>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${pct}%`,
                background: pct === 100
                  ? '#22c55e'
                  : 'linear-gradient(90deg, #3b82f6, #6366f1)',
              }}
            />
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">
            {pct}%
          </div>
        </>
      )}
    </div>
  )
}
