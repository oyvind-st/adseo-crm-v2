import { useState, useEffect } from 'react'
import { Plus, TrendingUp } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PageHeader, Button, Card, StatCard, Badge, Loading, EmptyState } from '../shared'

const STAGES = [
  { key: 'ny_lead',      label: 'Ny lead',      color: '#6b7280', bg: '#f9fafb' },
  { key: 'kvalifisering', label: 'Kvalifisering', color: '#3b82f6', bg: '#eff6ff' },
  { key: 'mote_booket',  label: 'Møte booket',  color: '#8b5cf6', bg: '#f5f3ff' },
  { key: 'tilbud_sendt', label: 'Tilbud sendt', color: '#f59e0b', bg: '#fffbeb' },
  { key: 'forhandling',  label: 'Forhandling',  color: '#f97316', bg: '#fff7ed' },
  { key: 'vunnet',       label: 'Vunnet',       color: '#10b981', bg: '#f0fdf4' },
]

export function LeadListMVP() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('*').neq('stage', 'tapt').order('created_at')
      .then(({ data }) => { setLeads(data || []); setLoading(false) })
  }, [])

  const tv = leads.reduce((s, l) => s + (l.verdi || 0), 0)
  const vv = leads.reduce((s, l) => s + (l.verdi * l.sannsynlighet / 100 || 0), 0)
  const fmt = (n: number) => n >= 1000000 ? `${(n / 1000000).toFixed(1)}M kr` : `${(n / 1000).toFixed(0)}k kr`

  if (loading) return <Loading fullPage text="Laster pipeline..." />

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Leads & Pipeline"
        subtitle={`${leads.filter(l => l.stage !== 'vunnet').length} aktive leads`}
        action={<Button icon={<Plus size={15} />}>Ny lead</Button>}
      />

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Aktive leads" value={leads.filter(l => l.stage !== 'vunnet').length}
          icon={<TrendingUp size={20} className="text-blue-600" />} iconBg="#eff6ff" />
        <StatCard label="Total pipeline" value={fmt(tv)}
          icon={<TrendingUp size={20} className="text-green-600" />} iconBg="#f0fdf4" />
        <StatCard label="Vektet verdi" value={fmt(vv)}
          icon={<TrendingUp size={20} className="text-purple-600" />} iconBg="#f5f3ff" />
      </div>

      <div className="flex gap-3.5 overflow-x-auto pb-4">
        {STAGES.map(stage => {
          const sl = leads.filter(l => l.stage === stage.key)
          const sv = sl.reduce((s, l) => s + (l.verdi || 0), 0)
          return (
            <div key={stage.key}
              className="min-w-[210px] flex-1 bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">{stage.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {sl.length} leads{sv > 0 ? ` · ${fmt(sv)}` : ''}
                  </div>
                </div>
                <div className="w-2.5 h-2.5 rounded-full mt-1" style={{ background: stage.color }} />
              </div>
              {sl.map(lead => (
                <div key={lead.id}
                  className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3.5 border border-slate-200 dark:border-slate-600 mb-2.5 cursor-pointer hover:shadow-md hover:-translate-y-px transition-all">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{lead.bedriftsnavn}</div>
                  {lead.kontaktperson && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      {lead.kontaktperson}{lead.stilling ? ` · ${lead.stilling}` : ''}
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{fmt(lead.verdi)}</span>
                    <Badge variant="slate" size="sm">{lead.sannsynlighet}%</Badge>
                  </div>
                  {lead.neste_steg && (
                    <div className="text-xs text-slate-500 bg-white dark:bg-slate-600 rounded-lg px-2.5 py-1.5 border border-slate-200 dark:border-slate-500">
                      <span className="font-medium">→ </span>{lead.neste_steg}
                    </div>
                  )}
                </div>
              ))}
              {sl.length === 0 && (
                <div className="text-xs text-slate-300 text-center py-5">Ingen leads</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
