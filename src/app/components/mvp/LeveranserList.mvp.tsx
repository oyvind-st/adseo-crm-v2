import { useState, useEffect } from 'react'
import { Plus, ArrowRight } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PageHeader } from '../shared/PageHeader'
import { StatCard } from '../shared/StatCard'
import { StatusBadge } from '../shared/PriorityBadge'

const STATUS_LABEL: Record<string,string> = { ikke_startet:'Ikke startet', pagar:'Pågår', venter_pa_kunde:'Venter på kunde', ferdig:'Ferdig' }
const TABS = ['Alle','Ikke startet','Pågår','Venter','Ferdig']

export function LeveranserListMVP() {
  const [leveranser, setLeveranser] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('Alle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('leveranser').select('*, kunder(bedriftsnavn), leveranse_oppgaver(id,fullfort)').order('frist')
      .then(({ data }) => { setLeveranser(data||[]); setLoading(false) })
  }, [])

  const getProgress = (l: any) => {
    const t = l.leveranse_oppgaver || []
    return t.length ? Math.round(t.filter((x:any)=>x.fullfort).length/t.length*100) : 0
  }

  const filtered = leveranser.filter(l => {
    if (activeTab==='Alle') return true
    if (activeTab==='Ikke startet') return l.status==='ikke_startet'
    if (activeTab==='Pågår') return l.status==='pagar'
    if (activeTab==='Venter') return l.status==='venter_pa_kunde'
    if (activeTab==='Ferdig') return l.status==='ferdig'
    return true
  })

  return (
    <div className="p-8">
      <PageHeader title="Leveranser" subtitle={`${leveranser.filter(l=>l.status!=='ferdig').length} aktive leveranser`}
        action={<button className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors shadow-sm"><Plus size={15}/> Ny leveranse</button>}/>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {(['ikke_startet','pagar','venter_pa_kunde','ferdig'] as const).map(s => (
          <StatCard key={s} label={STATUS_LABEL[s]} value={leveranser.filter(l=>l.status===s).length} loading={loading}/>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 px-5">
          {TABS.map(t => (
            <button key={t} onClick={()=>setActiveTab(t)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${activeTab===t?'border-violet-600 text-violet-600':'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
