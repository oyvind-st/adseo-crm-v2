import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users, DollarSign, TrendingUp, Ticket, ArrowRight, AlertCircle } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { StatCard } from '../shared/StatCard'
import { PageHeader } from '../shared/PageHeader'
import { PriorityBadge } from '../shared/PriorityBadge'

type Task = {
  id: string
  title: string
  customer?: string
  dueDateRaw?: string
  priority: 'high' | 'medium' | 'low'
  status: string
  overdue: boolean
  leveranseId?: string
}

function todayStr() { return new Date().toISOString().slice(0, 10) }
function mapPriority(p?: string): 'high' | 'medium' | 'low' {
  if (p === 'høy' || p === 'hoy' || p === 'high') return 'high'
  if (p === 'lav' || p === 'low') return 'low'
  return 'medium'
}
function mapStatus(s?: string): string {
  if (s === 'fullfort' || s === 'Done') return 'Done'
  if (s === 'pagar' || s === 'In progress') return 'In progress'
  return 'Not started'
}

export function DashboardMVP() {
  const [stats, setStats] = useState({ kunder: 0, mrr: 0, pipeline: 0, tickets: 0 })
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'completed'>('today')

  useEffect(() => {
    async function load() {
      const today = todayStr()
      const [
        { count: kunderCount },
        { data: kunderMrr },
        { count: ticketsCount },
        { data: leads },
        { data: oppgaverData },
        { data: levOppgData },
        { data: leveranserData }
      ] = await Promise.all([
        supabase.from('kunder').select('*', { count: 'exact', head: true }),
        supabase.from('kunder').select('mrr'),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'apent'),
        supabase.from('leads').select('verdi, sannsynlighet').neq('stage', 'tapt'),
        supabase.from('oppgaver')
          .select('id, tittel, prioritet, frist, status, kunder(bedriftsnavn)')
          .order('frist', { ascending: true, nullsFirst: false }),
        supabase.from('leveranse_oppgaver')
          .select('id, tittel, prioritet, frist, status, fullfort, assignee, leveranse_id')
          .order('frist', { ascending: true, nullsFirst: false }),
        supabase.from('leveranser').select('id, tittel, kunder(bedriftsnavn)'),
      ])

      const totalMrr = kunderMrr?.reduce((s, k) => s + (k.mrr || 0), 0) || 0
      const totalPipeline = leads?.reduce((s, l) => s + (l.verdi || 0), 0) || 0
      setStats({ kunder: kunderCount || 0, mrr: totalMrr, pipeline: totalPipeline, tickets: ticketsCount || 0 })

      const levMap = new Map<string, string>()
      for (const l of (leveranserData as any[] || [])) {
        const kunde = (l.kunder as any)?.bedriftsnavn
        levMap.set(l.id, kunde ? `${kunde} · ${l.tittel}` : l.tittel)
      }

      const fromOppgaver: Task[] = (oppgaverData as any[] || []).map(row => {
        const d = row.frist ? row.frist.slice(0, 10) : undefined
        return {
          id: row.id,
          title: row.tittel,
          customer: (row.kunder as any)?.bedriftsnavn,
          dueDateRaw: d,
          priority: mapPriority(row.prioritet),
          status: mapStatus(row.status),
          overdue: !!d && d < today && row.status !== 'fullfort',
        }
      })

      const fromLeveranser: Task[] = (levOppgData as any[] || []).map(row => {
        const d = row.frist ? row.frist.slice(0, 10) : undefined
        const done = row.fullfort || row.status === 'Done'
        return {
          id: `lev-${row.id}`,
          title: row.tittel,
          customer: levMap.get(row.leveranse_id),
          dueDateRaw: d,
          priority: mapPriority(row.prioritet),
          status: done ? 'Done' : mapStatus(row.status),
          overdue: !!d && d < today && !done,
          leveranseId: row.leveranse_id,
        }
      })

      setTasks([...fromOppgaver, ...fromLeveranser])
      setLoading(false)
    }
    load()
  }, [])

  const today = todayStr()
  const todayTasks    = tasks.filter(t => t.dueDateRaw === today && t.status !== 'Done')
  const overdueTasks  = tasks.filter(t => t.overdue)
  const upcomingTasks = tasks.filter(t => t.status !== 'Done' && t.dueDateRaw !== today && !t.overdue)
  const completedTasks = tasks.filter(t => t.status === 'Done')

  const tabTasks = activeTab === 'today'
    ? [...overdueTasks, ...todayTasks]
    : activeTab === 'upcoming' ? upcomingTasks
    : completedTasks

  const formatKr = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M kr` : `${(n/1000).toFixed(0)}k kr`
  const navigate = useNavigate()

  return (
    <div className="p-8">
      <PageHeader
        title="Dashboard"
        subtitle="Oversikt over dine oppgaver og kunder"
      />

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Aktive Kunder"
          value={stats.kunder}
          icon={<Users size={18} color="#7c3aed" />}
          iconColor="bg-violet-50 dark:bg-violet-900/30"
          loading={loading}
        />
        <StatCard
          label="Total MRR"
          value={formatKr(stats.mrr)}
          icon={<DollarSign size={18} color="#16a34a" />}
          iconColor="bg-green-50 dark:bg-green-900/30"
          loading={loading}
        />
        <StatCard
          label="Pipeline"
          value={formatKr(stats.pipeline)}
          icon={<TrendingUp size={18} color="#2563eb" />}
          iconColor="bg-blue-50 dark:bg-blue-900/30"
          loading={loading}
        />
        <StatCard
          label="Åpne Tickets"
          value={stats.tickets}
          icon={<Ticket size={18} color="#ea580c" />}
          iconColor="bg-orange-50 dark:bg-orange-900/30"
          loading={loading}
        />
      </div>

      {/* Tasks */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-slate-700">
          <div className="font-semibold text-gray-900 dark:text-white">Oppgaver</div>
          <Link to="/tasks" className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:text-violet-700">
            Se alle <ArrowRight size={14} />
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 dark:border-slate-700">
          {([
            { id: 'today',    label: 'I dag',     count: todayTasks.length + overdueTasks.length },
            { id: 'upcoming', label: 'Kommende',  count: upcomingTasks.length },
            { id: 'completed',label: 'Fullført',  count: completedTasks.length },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === tab.id
                  ? 'text-violet-600 border-b-2 border-violet-600'
                  : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                }`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Laster...</div>
        ) : tabTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            {activeTab === 'today' ? 'Ingen oppgaver i dag' :
             activeTab === 'upcoming' ? 'Ingen kommende oppgaver' :
             'Ingen fullførte oppgaver'}
          </div>
        ) : (
          <div>
            {tabTasks.map((o, i) => (
                <div key={o.id}
                  onClick={() => o.leveranseId && navigate(`/leveranser/${o.leveranseId}`)}
                  className={`flex items-center justify-between px-5 py-3.5 ${i < tabTasks.length - 1 ? 'border-b border-gray-50 dark:border-slate-700' : ''} ${o.leveranseId ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50' : ''}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      o.priority === 'high' ? 'bg-red-500' :
                      o.priority === 'medium' ? 'bg-amber-400' : 'bg-gray-300'
                    }`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{o.title}</span>
                        {o.overdue && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                            <AlertCircle size={10} /> Forfalt
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5 flex gap-2">
                        {o.customer && <span>{o.customer}</span>}
                        {o.dueDateRaw && <span>Frist {new Date(o.dueDateRaw + 'T00:00:00').toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })}</span>}
                      </div>
                    </div>
                  </div>
                  <PriorityBadge priority={o.priority === 'high' ? 'høy' : o.priority === 'low' ? 'lav' : 'medium'} />
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
