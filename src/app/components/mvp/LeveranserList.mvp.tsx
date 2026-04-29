import { useState, useEffect } from 'react'
import { Plus, Package } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PageHeader, Button, Card, Tabs, Tab, TabList, StatCard, StatusBadge, Loading, EmptyState } from '../shared'

const STATUS_LABEL: Record<string, string> = {
  ikke_startet: 'Ikke startet', pagar: 'Pågår',
  venter_pa_kunde: 'Venter på kunde', ferdig: 'Ferdig'
}

export function LeveranserListMVP() {
  const [leveranser, setLeveranser] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('Alle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leveranser')
      .select('*, kunder(bedriftsnavn), leveranse_oppgaver(id,fullfort)')
      .order('frist')
      .then(({ data }) => { setLeveranser(data || []); setLoading(false) })
  }, [])

  const getProgress = (l: any) => {
    const t = l.leveranse_oppgaver || []
    return t.length ? Math.round(t.filter((x: any) => x.fullfort).length / t.length * 100) : 0
  }

  const TABS = ['Alle', 'Ikke startet', 'Pågår', 'Venter', 'Ferdig']
  const TAB_MAP: Record<string, string> = {
    'Alle': '', 'Ikke startet': 'ikke_startet', 'Pågår': 'pagar',
    'Venter': 'venter_pa_kunde', 'Ferdig': 'ferdig'
  }

  const filtered = leveranser.filter(l =>
    activeTab === 'Alle' || l.status === TAB_MAP[activeTab]
  )

  if (loading) return <Loading fullPage text="Laster leveranser..." />

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Leveranser"
        subtitle={`${leveranser.filter(l => l.status !== 'ferdig').length} aktive leveranser`}
        action={<Button icon={<Plus size={15} />}>Ny leveranse</Button>}
      />

      <div className="grid grid-cols-4 gap-4">
        {(['ikke_startet', 'pagar', 'venter_pa_kunde', 'ferdig'] as const).map(s => (
          <StatCard key={s} label={STATUS_LABEL[s]} value={leveranser.filter(l => l.status === s).length} />
        ))}
      </div>

      <Card>
        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabList className="px-2">
            {TABS.map(t => <Tab key={t} value={t}>{t}</Tab>)}
          </TabList>
        </Tabs>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package size={28} />}
            title="Ingen leveranser"
            description={`Ingen leveranser med status "${activeTab}"`}
          />
        ) : filtered.map((l, i) => {
          const p = getProgress(l)
          const tot = (l.leveranse_oppgaver || []).length
          const done = (l.leveranse_oppgaver || []).filter((x: any) => x.fullfort).length
          return (
            <div key={l.id} className={`px-5 py-4 ${i < filtered.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' }}>📦</div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      {l.kunder?.bedriftsnavn}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {l.tittel}{l.type ? ` · ${l.type}` : ''}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {tot > 0 ? `${done}/${tot} oppgaver` : ''}
                    {l.frist ? `  ·  Frist ${new Date(l.frist).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })}` : ''}
                  </span>
                  <StatusBadge status={l.status} />
                </div>
              </div>
              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${p}%`, background: 'linear-gradient(90deg,#3b82f6,#6366f1)' }} />
              </div>
              {tot > 0 && (
                <div className="text-xs text-slate-400 mt-1 text-right">{p}%</div>
              )}
            </div>
          )
        })}
      </Card>
    </div>
  )
}
