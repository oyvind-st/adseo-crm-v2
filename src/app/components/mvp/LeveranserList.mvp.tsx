import { useState, useEffect } from 'react'
import { Plus, Package, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { StatCard, LeveranseRow } from '../shared'

const TABS = [
  { key: 'alle',            label: 'Alle' },
  { key: 'ikke_startet',    label: 'Ikke startet' },
  { key: 'pagar',           label: 'Pågår' },
  { key: 'venter_pa_kunde', label: 'Venter på kunde' },
  { key: 'ferdig',          label: 'Ferdig' },
]

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
          <LeveranseRow key={l.id} {...l} last={i === filtered.length - 1} />
        ))}
      </div>
    </div>
  )
}
