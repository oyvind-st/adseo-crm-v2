import { useState, useEffect } from 'react'
import { Plus, Ticket, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { StatCard } from '../shared'

// Status tabs — same pattern as TaskList
const TABS = [
  { key: 'apent',           label: 'Åpne saker' },
  { key: 'pagar',           label: 'Pågår' },
  { key: 'venter_pa_kunde', label: 'Venter på kunde' },
  { key: 'lukket',          label: 'Lukket' },
]

const PRIORITY_COLORS: Record<string, string> = {
  høy:    'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  lav:    'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400',
}

export function TicketListMVP() {
  const [tickets, setTickets] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('apent')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('tickets')
      .select('*, kunder(bedriftsnavn), kontakter(navn)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setTickets(data || []); setLoading(false) })
  }, [])

  const tabTickets = tickets.filter(t => t.status === activeTab)
  const counts = Object.fromEntries(TABS.map(t => [t.key, tickets.filter(x => x.status === t.key).length]))

  const timeAgo = (d: string) => {
    const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000)
    if (h < 1) return 'Akkurat nå'
    if (h < 24) return `${h}t siden`
    return `${Math.floor(h / 24)}d siden`
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header — same as TaskList */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tickets</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {tabTickets.length} {TABS.find(t => t.key === activeTab)?.label.toLowerCase()}
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ny ticket
        </button>
      </div>

      {/* Stats — same pattern as TaskList */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Åpne tickets" value={tickets.filter(t => t.status === 'apent').length}
          icon={<Ticket className="w-5 h-5 text-green-600 dark:text-green-400" />}
          iconColor="bg-green-50 dark:bg-green-900/30" />
        <StatCard label="Høy prioritet" value={tickets.filter(t => t.prioritet === 'høy' && t.status !== 'lukket').length}
          icon={<AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />}
          iconColor="bg-red-50 dark:bg-red-900/30" />
        <StatCard label="Ubesvarte" value={tickets.filter(t => t.status === 'apent').length}
          icon={<Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
          iconColor="bg-orange-50 dark:bg-orange-900/30" />
        <StatCard label="Lukket i dag" value={tickets.filter(t => t.status === 'lukket').length}
          icon={<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          iconColor="bg-blue-50 dark:bg-blue-900/30" />
      </div>

      {/* Tab + list — exactly same structure as TaskList */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        {/* Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-6 py-3 font-medium transition-colors text-sm ${
                activeTab === tab.key
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
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

        {/* Ticket rows */}
        {loading ? (
          <div className="p-10 text-center text-sm text-slate-400 dark:text-slate-500">Laster tickets...</div>
        ) : tabTickets.length === 0 ? (
          <div className="p-10 text-center text-sm text-slate-400 dark:text-slate-500">
            Ingen {TABS.find(t => t.key === activeTab)?.label.toLowerCase()} her
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {tabTickets.map(t => (
              <div key={t.id} className="flex items-start gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer">
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5">
                  {(t.kontakter?.navn || t.kunder?.bedriftsnavn || '?').slice(0, 2).toUpperCase()}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {t.kontakter?.navn || t.kunder?.bedriftsnavn || 'Ukjent'}
                    </span>
                    {t.prioritet === 'høy' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                        Høy prioritet
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">{t.tittel}</p>
                  {t.beskrivelse && (
                    <p className="text-xs text-slate-400 truncate max-w-xl mb-1.5">{t.beskrivelse}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    {t.kunder?.bedriftsnavn && (
                      <span className="font-medium text-slate-500 dark:text-slate-400">{t.kunder.bedriftsnavn}</span>
                    )}
                    {t.kategori && (
                      <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full text-slate-500 dark:text-slate-400">
                        {t.kategori}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className="text-xs text-slate-400">{timeAgo(t.created_at)}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${PRIORITY_COLORS[t.prioritet] || PRIORITY_COLORS.lav}`}>
                    {t.prioritet === 'høy' ? 'Høy' : t.prioritet === 'medium' ? 'Medium' : 'Lav'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
