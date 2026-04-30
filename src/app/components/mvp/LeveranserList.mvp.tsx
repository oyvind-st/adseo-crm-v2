// Layout based on Figma screenshot for Leveranser page

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, User, Clock, Ticket, ArrowRight, Package } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const STATUS_LABEL: Record<string, string> = {
  ikke_startet:    'Ikke startet',
  pagar:           'Pågår',
  venter_pa_kunde: 'Venter på kunde',
  ferdig:          'Ferdig',
}

const STATUS_BADGE: Record<string, string> = {
  ikke_startet:    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  pagar:           'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  venter_pa_kunde: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-600',
  ferdig:          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const TABS = [
  { key: 'alle', label: 'Alle' },
  { key: 'ikke_startet', label: 'Ikke startet' },
  { key: 'pagar', label: 'Pågår' },
  { key: 'venter_pa_kunde', label: 'Venter' },
  { key: 'ferdig', label: 'Ferdig' },
]

function getProgress(l: any) {
  const tasks = l.leveranse_oppgaver || []
  if (!tasks.length) return 0
  return Math.round((tasks.filter((t: any) => t.fullfort).length / tasks.length) * 100)
}

export function LeveranserListMVP() {
  const [leveranser, setLeveranser] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('alle')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('leveranser')
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
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {leveranser.filter(l => l.status !== 'ferdig').length} aktive leveranser
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
          <Plus size={16} /> Ny leveranse
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        {TABS.filter(t => t.key !== 'alle').map(t => (
          <div key={t.key} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              t.key === 'ferdig' ? 'bg-green-50 dark:bg-green-900/30' :
              t.key === 'pagar' ? 'bg-blue-50 dark:bg-blue-900/30' :
              t.key === 'venter_pa_kunde' ? 'bg-yellow-50 dark:bg-yellow-900/30' :
              'bg-slate-100 dark:bg-slate-700'
            }`}>
              <Package className={`w-5 h-5 ${
                t.key === 'ferdig' ? 'text-green-600 dark:text-green-400' :
                t.key === 'pagar' ? 'text-blue-600 dark:text-blue-400' :
                t.key === 'venter_pa_kunde' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-slate-500 dark:text-slate-400'
              }`} />
            </div>
            <div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{t.label}</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{counts[t.key]}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center justify-center gap-1.5 ${
                activeTab === t.key
                  ? 'text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t.label}
              {counts[t.key] > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === t.key
                    ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                }`}>
                  {counts[t.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400">Laster leveranser...</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">Ingen leveranser</div>
        ) : filtered.map((l, i) => {
          const progress = getProgress(l)
          const total = (l.leveranse_oppgaver || []).length
          const done  = (l.leveranse_oppgaver || []).filter((t: any) => t.fullfort).length
          const isLast = i === filtered.length - 1
          const isOverdue = l.frist && l.status !== 'ferdig' && new Date(l.frist) < new Date()

          return (
            <div
              key={l.id}
              onClick={() => navigate(`/leveranser/${l.id}`)}
              className={`px-6 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors${isLast ? '' : ' border-b border-slate-100 dark:border-slate-700'}`}
            >
              {/* Top row: icon + name + badges / status + arrow */}
              <div className="flex items-start justify-between gap-3 mb-1.5">

                {/* Left: icon + customer name + type + tickets badge */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Package className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">
                      {l.kunder?.bedriftsnavn}
                    </span>
                    {l.type && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                        {l.type}
                      </span>
                    )}
                    {isOverdue && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium flex items-center gap-1">
                        <Ticket className="w-3 h-3" /> Nye tickets
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: status badge + arrow */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${STATUS_BADGE[l.status] || STATUS_BADGE.ikke_startet}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              {/* Second row: assignee · deadline · task count */}
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3 pl-11">
                {l.ansvarlig?.navn && (
                  <>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {l.ansvarlig.navn}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">·</span>
                  </>
                )}
                {l.frist && (
                  <>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Frist: {new Date(l.frist).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    {total > 0 && <span className="text-slate-300 dark:text-slate-600">·</span>}
                  </>
                )}
                {total > 0 && (
                  <span>{done} av {total} oppgaver</span>
                )}
              </div>

              {/* Progress bar — full width */}
              <div className="pl-11 pr-10 flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                      background: progress === 100 ? '#22c55e' : 'linear-gradient(90deg, #3b82f6, #6366f1)'
                    }}
                  />
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 w-10 text-right tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
