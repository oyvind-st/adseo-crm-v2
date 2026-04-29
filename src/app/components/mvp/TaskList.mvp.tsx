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

  return (
    <div className="p-8">
      <PageHeader title="Oppgaver" subtitle={`${oppgaver.filter(o => o.status !== 'fullfort').length} åpne oppgaver`}
        action={<button className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors shadow-sm"><Plus size={15} /> Ny oppgave</button>}/>
      <div className="p-10 text-center text-gray-400 text-sm">Laster...</div>
    </div>
  )
}
