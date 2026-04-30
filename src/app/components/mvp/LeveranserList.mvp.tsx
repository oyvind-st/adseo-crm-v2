import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Package, CheckCircle2, Clock, AlertCircle, Loader2, Calendar } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { StatCard } from '../shared'

const STATUS_LABEL: Record<string, string> = {
  ikke_startet: 'Ikke startet',
  pagar: 'Pågår',
  venter_pa_kunde: 'Venter på kunde',
  ferdig: 'Ferdig',
}

const STATUS_STYLE: Record<string, string> = {
  ikke_startet: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  pagar:        'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  venter_pa_kunde: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  ferdig:       'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400',
}

const TABS = [
  { key: 'alle',           label: 'Alle' },
  { key: 'ikke_startet',   label: 'Ikke startet' },
  { key: 'pagar',          label: 'Pågår' },
  { key: 'venter_pa_kunde',label: 'Venter på kunde' },
  { key: 'ferdig',         label: 'Ferdig' },
]

function getProgress(l: any) {
  const tasks = l.leveranse_oppgaver || []
  if (!tasks.length) return null
  const done = tasks.filter((t: any) => t.fullfort).length
  return { pct: Math.round((done / tasks.length) * 100), done, total: tasks.length }
}

function LeveranseRow({ l, last }: { l: any; last: boolean }) {
  const navigate = useNavigate()
  const progress = getProgress(l)
  const initials = (l.kunder?.bedriftsnavn || '?').slice(0, 2).toUpperCase()

  return (
    <div
      onClick={() => navigate(`/leveranser/${l.id}`)}
      className={`flex items-start gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer${last ? '' : ' border-b border-slate-100 dark:border-slate-700'}`}
    >
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center text-xs font-bold text-violet-600 dark:text-violet-400 flex-shrink-0 mt-0.5">
        {initials}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-slate-900 dark:text-white">
            {l.kunder?.bedriftsnavn || '—'}
          </span>
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">{l.tittel}</p>
        <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
          {l.type && (
            <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">
              {l.type}
            </span>
          )}
          {l.frist && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              Frist {new Date(l.frist).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })}
            </span>
          )}
          {progress && (
            <span>{progress.done}/{progress.total} oppgaver</span>
          )}
        </div>

        {/* Progress bar */}
        {progress && (
          <div className="mt-2.5 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progress.pct}%`,
                  background: progress.pct === 100
                    ? '#22c55e'
                    : 'linear-gradient(90deg,#3b82f6,#6366f1)'
                }}
              />
            </div>
            <span className="text-xs text-slate-400 w-8 text-right">{progress.pct}%</span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_STYLE[l.status] || STATUS_STYLE.ikke_startet}`}>
          {STATUS_LABEL[l.status] || l.status}
        </span>
      </div>
    </div>
  )
}

export function LeveranserListMVP() {
  const [leveranser, setLeveranser] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('alle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leveranser')
      .select('*, kunder(bedriftsnavn), leveranse_oppgaver(id,fullfort)')
      .order('frist')
      .then(({ data }) => { setLeveranser(data || []); setLoading(false) })
  }, [])

  const filtered = activeTab === 'alle'
    ? leveranser
    : leveranser.filter(l => l.status === activeTab)

  const counts: Record<string, number> = Object.fromEntries(
    TABS.map(t => [t.key, t.key === 'alle' ? leveranser.length : leveranser.filter(l => l.status === t.key).length])
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leveranser</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {leveranser.filter(l => l.status !== 'ferdig').length} aktive leveranser
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          Ny leveranse
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Ikke startet"
          value={counts['ikke_startet']}
          icon={<Package className="w-5 h-5 text-slate-600 dark:text-slate-400" />}
          iconColor="bg-slate-100 dark:bg-slate-700"
        />
        <StatCard
          label="Pågår"
          value={counts['pagar']}
          icon={<Loader2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          iconColor="bg-blue-50 dark:bg-blue-900/30"
        />
        <StatCard
          label="Venter på kunde"
          value={counts['venter_pa_kunde']}
          icon={<AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />}
          iconColor="bg-yellow-50 dark:bg-yellow-900/30"
        />
        <StatCard
          label="Ferdig"
          value={counts['ferdig']}
          icon={<CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />}
          iconColor="bg-green-50 dark:bg-green-900/30"
        />
      </div>

      {/* Tabs — standalone container matching TicketList */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-6 py-3 font-medium transition-colors text-sm flex items-center justify-center gap-1.5 ${
                activeTab === tab.key
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400">Laster leveranser...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Package className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-400">
              Ingen leveranser{activeTab !== 'alle' ? ` med status "${TABS.find(t => t.key === activeTab)?.label}"` : ''}
            </p>
          </div>
        ) : filtered.map((l, i) => (
          <LeveranseRow key={l.id} l={l} last={i === filtered.length - 1} />
        ))}
      </div>
    </div>
  )
}
