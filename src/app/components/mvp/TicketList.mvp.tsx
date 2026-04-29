import { useState, useEffect } from 'react'
import { Plus, CheckCircle2, AlertTriangle, Clock } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PageHeader, Button, Card, Tabs, Tab, TabList, Avatar, Badge, PriorityBadge, StatCard, Loading, EmptyState } from '../shared'
import { Ticket } from 'lucide-react'

const STATUS_MAP: Record<string, string> = {
  'Åpne saker': 'apent', 'Pågår': 'pagar',
  'Venter på kunde': 'venter_pa_kunde', 'Lukket': 'lukket'
}

export function TicketListMVP() {
  const [tickets, setTickets] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('Åpne saker')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('tickets').select('*, kunder(bedriftsnavn), kontakter(navn)')
      .order('created_at', { ascending: false })
      .then(({ data }) => { setTickets(data || []); setLoading(false) })
  }, [])

  const filtered = tickets.filter(t => t.status === STATUS_MAP[activeTab])
  const counts = Object.fromEntries(
    Object.entries(STATUS_MAP).map(([tab, status]) => [tab, tickets.filter(t => t.status === status).length])
  )

  const timeAgo = (d: string) => {
    const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000)
    if (h < 1) return 'Akkurat nå'
    if (h < 24) return `${h}t siden`
    return `${Math.floor(h / 24)}d siden`
  }

  if (loading) return <Loading fullPage text="Laster tickets..." />

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Tickets"
        subtitle={`${tickets.filter(t => t.status === 'apent').length} åpne saker`}
        action={<Button icon={<Plus size={15} />}>Ny ticket</Button>}
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Åpne tickets" value={tickets.filter(t => t.status === 'apent').length}
          icon={<CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          iconColor="bg-blue-50 dark:bg-blue-900/30" />
        <StatCard label="Høy prioritet" value={tickets.filter(t => t.prioritet === 'høy' && t.status !== 'lukket').length}
          icon={<AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />}
          iconColor="bg-red-50 dark:bg-red-900/30" />
        <StatCard label="Ubesvarte" value={tickets.filter(t => t.status === 'apent').length}
          icon={<Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />}
          iconColor="bg-orange-50 dark:bg-orange-900/30" />
      </div>

      <Card>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList className="px-2">
            {Object.keys(STATUS_MAP).map(tab => (
              <Tab key={tab} value={tab} count={counts[tab]}>{tab}</Tab>
            ))}
          </TabList>
        </Tabs>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Ticket size={28} />}
            title="Ingen tickets her"
            description={`Ingen tickets med status "${activeTab}"`}
          />
        ) : filtered.map((t, i) => (
          <div key={t.id}
            className={`flex items-start gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${i < filtered.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
            <Avatar
              name={t.kontakter?.navn || t.kunder?.bedriftsnavn || '?'}
              size="sm"
              className="mt-0.5"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-slate-900 dark:text-white">
                  {t.kontakter?.navn || t.kunder?.bedriftsnavn || 'Ukjent'}
                </span>
                {t.prioritet === 'høy' && (
                  <Badge variant="red" size="sm">Høy prioritet</Badge>
                )}
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300 mb-1">{t.tittel}</div>
              {t.beskrivelse && (
                <div className="text-xs text-slate-400 truncate max-w-lg mb-1.5">{t.beskrivelse}</div>
              )}
              <div className="flex gap-2 text-xs text-slate-400 items-center">
                {t.kunder?.bedriftsnavn && (
                  <span className="font-medium text-slate-500 dark:text-slate-400">{t.kunder.bedriftsnavn}</span>
                )}
                {t.kategori && (
                  <Badge variant="slate" size="sm">{t.kategori}</Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <span className="text-xs text-slate-400">{timeAgo(t.created_at)}</span>
              <PriorityBadge priority={t.prioritet} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  )
}
