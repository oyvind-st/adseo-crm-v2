// Based directly on Figma source: leveranser/page.tsx
// CSS class mappings from globals.css:
//   .stat-card        → bg-white rounded-xl border border-slate-200 p-5
//   .badge-gray       → bg-slate-100 text-slate-600
//   .badge-blue       → bg-blue-100 text-blue-700
//   .badge-yellow     → bg-yellow-100 text-yellow-700
//   .badge-green      → bg-green-100 text-green-700
//   .progress-bar     → h-1 bg-slate-200 rounded-full overflow-hidden
//   .progress-fill    → h-full bg-violet-600 (Figma primary = #7c3aed)
//   .tab.active       → text-violet-700 border-b-2 border-violet-700 (purple, not blue!)
//   .btn-primary      → bg-violet-700 hover:bg-violet-800

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowRight } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const STATUS_LABEL: Record<string, string> = {
  ikke_startet:    'Ikke startet',
  pagar:           'Pågår',
  venter_pa_kunde: 'Venter på kunde',
  ferdig:          'Ferdig',
}

// From globals.css badge colours
const STATUS_BADGE: Record<string, string> = {
  ikke_startet:    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
  pagar:           'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  venter_pa_kunde: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-600',
  ferdig:          'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

const TABS = ['Alle', 'Ikke startet', 'Pågår', 'Venter', 'Ferdig']
const TAB_TO_STATUS: Record<string, string> = {
  'Alle': '', 'Ikke startet': 'ikke_startet', 'Pågår': 'pagar',
  'Venter': 'venter_pa_kunde', 'Ferdig': 'ferdig',
}

function getProgress(l: any) {
  const tasks = l.leveranse_oppgaver || []
  if (!tasks.length) return 0
  return Math.round((tasks.filter((t: any) => t.fullfort).length / tasks.length) * 100)
}

export function LeveranserListMVP() {
  const [leveranser, setLeveranser] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('Alle')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('leveranser')
      .select('*, kunder(bedriftsnavn), leveranse_oppgaver(id,fullfort)')
      .order('frist')
      .then(({ data }) => { setLeveranser(data || []); setLoading(false) })
  }, [])

  const filtered = leveranser.filter(l => {
    if (activeTab === 'Alle') return true
    return l.status === TAB_TO_STATUS[activeTab]
  })

  return (
    <div className="p-8">
      {/* Header — from Figma */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leveranser</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {leveranser.filter(l => l.status !== 'ferdig').length} aktive leveranser
          </p>
        </div>
        <button className="bg-violet-700 hover:bg-violet-800 text-white text-sm font-medium px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors">
          <Plus size={16} /> Ny leveranse
        </button>
      </div>

      {/* Stat cards — .stat-card from globals.css */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(['ikke_startet', 'pagar', 'venter_pa_kunde', 'ferdig'] as const).map(s => (
          <div key={s} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-6 py-5">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{STATUS_LABEL[s]}</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {leveranser.filter(l => l.status === s).length}
            </div>
          </div>
        ))}
      </div>

      {/* Card container */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

        {/* Tab list — .tab-list / .tab / .tab.active from globals.css, active = violet */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-5">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 text-sm whitespace-nowrap transition-all border-b-2 ${
                activeTab === t
                  ? 'text-violet-700 dark:text-violet-400 border-violet-700 dark:border-violet-400 font-medium'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Rows */}
        {loading ? (
          <div className="py-10 text-center text-sm text-slate-400">Laster...</div>
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-400">Ingen leveranser</div>
        ) : filtered.map((l, i) => {
          const progress = getProgress(l)
          const total = (l.leveranse_oppgaver || []).length
          const done  = (l.leveranse_oppgaver || []).filter((t: any) => t.fullfort).length

          return (
            <div
              key={l.id}
              onClick={() => navigate(`/leveranser/${l.id}`)}
              className={`px-5 py-[18px] cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors${
                i < filtered.length - 1 ? ' border-b border-slate-100 dark:border-slate-700' : ''
              }`}
            >
              {/* Row header */}
              <div className="flex items-center justify-between mb-2.5">
                {/* Left: square icon + name + title */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center text-base flex-shrink-0">
                    📦
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {l.kunder?.bedriftsnavn}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                      {l.tittel}{l.type ? ` · ${l.type}` : ''}
                    </div>
                  </div>
                </div>

                {/* Right: meta + badge + arrow */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400 dark:text-slate-500 hidden md:block">
                    {total > 0 ? `${done} av ${total} oppgaver` : ''}
                    {l.frist ? `${total > 0 ? ' · ' : ''}Frist: ${new Date(l.frist).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })}` : ''}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE[l.status] || STATUS_BADGE.ikke_startet}`}>
                    {STATUS_LABEL[l.status]}
                  </span>
                  <ArrowRight size={14} className="text-slate-400 dark:text-slate-500" />
                </div>
              </div>

              {/* Progress bar — .progress-bar / .progress-fill, fill = violet */}
              <div className="h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${progress}%`, background: '#7c3aed' }}
                />
              </div>
              <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">
                {progress}%
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
