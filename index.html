import { useState, useEffect } from 'react'
import { Plus, Clock, AlertCircle, CheckCircle2, ListTodo } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PageHeader } from '../shared/PageHeader'
import { StatCard } from '../shared/StatCard'
import { PriorityBadge } from '../shared/PriorityBadge'

const TABS = ['Alle', 'Ikke startet', 'Pågår', 'Fullført', 'Forfalt']

export function TaskListMVP() {
  const [oppgaver, setOppgaver] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('Alle')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('oppgaver').select('*, kunder(bedriftsnavn)').order('frist')
      .then(({ data }) => { setOppgaver(data || []); setLoading(false) })
  }, [])

  const now = new Date()
  const isOverdue = (o: any) => o.frist && new Date(o.frist) < now && o.status !== 'fullfort'

  const filtered = oppgaver.filter(o => {
    if (activeTab === 'Alle') return true
    if (activeTab === 'Forfalt') return isOverdue(o)
    if (activeTab === 'Ikke startet') return o.status === 'ikke_startet' && !isOverdue(o)
    if (activeTab === 'Pågår') return o.status === 'pagar'
    if (activeTab === 'Fullført') return o.status === 'fullfort'
    return true
  })

  const counts: Record<string, number> = {
    'Alle': oppgaver.length,
    'Ikke startet': oppgaver.filter(o => o.status === 'ikke_startet' && !isOverdue(o)).length,
    'Pågår': oppgaver.filter(o => o.status === 'pagar').length,
    'Fullført': oppgaver.filter(o => o.status === 'fullfort').length,
    'Forfalt': oppgaver.filter(isOverdue).length,
  }

  const toggleStatus = async (o: any) => {
    const newStatus = o.status === 'fullfort' ? 'ikke_startet' : 'fullfort'
    await supabase.from('oppgaver').update({ status: newStatus }).eq('id', o.id)
    setOppgaver(prev => prev.map(x => x.id === o.id ? { ...x, status: newStatus } : x))
  }

  return (
    <div className="p-8">
      <PageHeader
        title="Oppgaver"
        subtitle={`${oppgaver.filter(o => o.status !== 'fullfort').length} åpne oppgaver`}
        action={
          <button className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors shadow-sm">
            <Plus size={15} /> Ny oppgave
          </button>
        }
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Mine oppgaver" value={oppgaver.filter(o=>o.status!=='fullfort').length} icon={<ListTodo size={18} color="#7c3aed"/>} iconBg="#f5f3ff" loading={loading}/>
        <StatCard label="Pågår" value={oppgaver.filter(o=>o.status==='pagar').length} icon={<Clock size={18} color="#2563eb"/>} iconBg="#eff6ff" loading={loading}/>
        <StatCard label="Forfalt" value={oppgaver.filter(isOverdue).length} icon={<AlertCircle size={18} color="#dc2626"/>} iconBg="#fef2f2" loading={loading}/>
        <StatCard label="Fullført" value={oppgaver.filter(o=>o.status==='fullfort').length} icon={<CheckCircle2 size={18} color="#16a34a"/>} iconBg="#f0fdf4" loading={loading}/>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100 px-5">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t ? 'border-violet-600 text-violet-600' : 'border-transparent text-gray-400 hover:text-gray-600'
              }`}>
              {t}
              {counts[t] > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab===t?'bg-violet-100 text-violet-600':'bg-gray-100 text-gray-400'}`}>
                  {counts[t]}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? <div className="p-10 text-center text-gray-400 text-sm">Laster...</div> :
          filtered.length === 0 ? <div className="p-10 text-center text-gray-400 text-sm">Ingen oppgaver her</div> :
          filtered.map((o, i) => (
            <div key={o.id}
              className={`flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors ${i<filtered.length-1?'border-b border-gray-50':''}`}>
              <div className="flex items-center gap-3">
                <input type="checkbox" checked={o.status==='fullfort'} onChange={() => toggleStatus(o)}
                  className="w-4 h-4 rounded accent-violet-600 cursor-pointer flex-shrink-0"/>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${o.status==='fullfort'?'line-through text-gray-400':'text-gray-900'}`}>
                      {o.tittel}
                    </span>
                    {isOverdue(o) && <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Forfalt</span>}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 flex gap-2">
                    {o.kunder?.bedriftsnavn && <span>{o.kunder.bedriftsnavn}</span>}
                    {o.frist && <span>Frist {new Date(o.frist).toLocaleDateString('no-NO', {day:'numeric',month:'short',year:'numeric'})}</span>}
                  </div>
                </div>
              </div>
              <PriorityBadge priority={o.prioritet} />
            </div>
          ))
        }
      </div>
    </div>
  )
}
