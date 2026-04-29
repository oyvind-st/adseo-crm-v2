import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PageHeader } from '../shared/PageHeader'
import { StatCard } from '../shared/StatCard'

const STABE = [
  { key: 'ny_lead',       label: 'Ny lead',       color: '#6b7280' },
  { key: 'kvalifisering', label: 'Kvalifisering',  color: '#7c3aed' },
  { key: 'mote_booket',   label: 'Møte booket',    color: '#2563eb' },
  { key: 'tilbud_sendt',  label: 'Tilbud sendt',   color: '#d97706' },
  { key: 'forhandling',   label: 'Forhandling',    color: '#ea580c' },
  { key: 'vunnet',        label: 'Vunnet',         color: '#16a34a' },
]

export function LeadListMVP() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leads').select('*').neq('stage','tapt').order('created_at')
      .then(({ data }) => { setLeads(data||[]); setLoading(false) })
  }, [])

  const tv = leads.reduce((s,l)=>s+(l.verdi||0),0)
  const vv = leads.reduce((s,l)=>s+(l.verdi*l.sannsynlighet/100||0),0)
  const fmt = (n:number) => n>=1000000?`${n/1000000}.toFixed(1)}M kr`:`${(n/1000).toFixed(0)}k kr`

  return (
    <div className="p-8">
      <PageHeader title="Leads & Pipeline" subtitle={`${leads.filter(l=>l.stage!=='vunnet').length} aktive leads`}
        action={<button className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors shadow-sm"><Plus size={15}/> Ny lead</button>}/>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatCard label="Aktive leads" value={leads.filter(l=>l.stage!=='vunnet').length} loading={loading}/>
        <StatCard label="Total pipeline" value={fmt(tv)} loading={loading}/>
        <StatCard label="Vektet verdi" value={fmt(vv)} loading={loading}/>
      </div>

      {loading ? <div className="p-10 text-center text-gray-400 text-sm">Laster pipeline...</div> : (
        <div className="flex gap-3.5 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const sl = leads.filter(l=>l.stage===stage.key)
            const sv = sl.reduce((s,l)=>s+(l.verdi||0),0)
            return (
              <div key={stage.key} className="min-w-[210px] flex-1 bg-gray-50 rounded-xl p-3 border border-gray-100">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-700">{stage.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{sl.length} leads{sv>0?` · ${fmt(sv)}`:''}</div>
                  </div>
                  <div className="w-2.5 h-2.5 rounded-full mt-1" style={{background:stage.color}}/>
                </div>
                {sl.map(lead => (
                  <div key={lead.id} className="bg-white rounded-xl p-3.5 border border-gray-100 mb-2.5 cursor-pointer hover:shadow-md hover:-vranslate-y-px transition-all">
                    <div className="font-semibold text-sm text-gray-900 mb-1">{lead.bedriftsnavn}</div>
                    {lead.kontaktperson&&<div className="text-xs text-gray-500 mb-2">{lead.kontaktperson}{lead.stilling?` · ${lead.stilling}`:''}</div>}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-gray-900">{fmt(lead.verdi)}</span>
                      <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{lead.sannsynlighet}%</span>
                    </div>
                    {lead.neste_steg&&(
                      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg px-2.5 py-1.5 border border-gray-100">
                        <span className="font-medium">→ </span>{lead.neste_steg}
                      </div>
                    )}
                  </div>
                ))}
                {sl.length===0&&<div className="text-xs text-gray-300 text-center py-5">Ingen leads</div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
