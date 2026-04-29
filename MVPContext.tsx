import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, DollarSign, TrendingUp, Ticket, ArrowRight, AlertCircle } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { StatCard } from '../shared/StatCard'
import { PageHeader } from '../shared/PageHeader'
import { PriorityBadge } from '../shared/PriorityBadge'
import { TaskItem } from '../TaskItem'

export function DashboardMVP() {
  const [stats, setStats] = useState({ kunder: 0, mrr: 0, pipeline: 0, tickets: 0 })
  const [oppgaver, setOppgaver] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [
        { count: kunderCount },
        { data: kunderMrr },
        { count: oppgaverCount },
        { count: ticketsCount },
        { data: leads },
        { data: dagensOppgaver }
      ] = await Promise.all([
        supabase.from('kunder').select('*', { count: 'exact', head: true }),
        supabase.from('kunder').select('mrr'),
        supabase.from('oppgaver').select('*', { count: 'exact', head: true }).neq('status', 'fullfort'),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'apent'),
        supabase.from('leads').select('verdi, sannsynlighet').neq('stage', 'tapt'),
        supabase.from('oppgaver').select('*, kunder(bedriftsnavn)').neq('status', 'fullfort').order('frist').limit(6)
      ])
      const totalMrr = kunderMrr?.reduce((s, k) => s + (k.mrr || 0), 0) || 0
      const totalPipeline = leads?.reduce((s, l) => s + (l.verdi || 0), 0) || 0
      setStats({ kunder: kunderCount || 0, mrr: totalMrr, pipeline: totalPipeline, tickets: ticketsCount || 0 })
      setOppgaver(dagensOppgaver || [])
      setLoading(false)
    }
    load()
  }, [])

  const formatKr = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M kr` : `${(n/1000).toFixed(0)}k kr`
  const isOverdue = (frist: string) => new Date(frist) < new Date()

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
          iconBg="#ede9fe"
          change="+3 denne måneden"
          loading={loading}
        />
        <StatCard
          label="Total MRR"
          value={formatKr(stats.mrr)}
          icon={<DollarSign size={18} color="#16a34a" />}
          iconBg="#dcfce7"
          loading={loading}
        />
        <StatCard
          label="Pipeline"
          value={formatKr(stats.pipeline)}
          icon={<TrendingUp size={18} color="#2563eb" />}
          iconBg="#dbeafe"
          loading={loading}
        />
        <StatCard
          label="Åpne Tickets"
          value={stats.tickets}
          icon={<Ticket size={18} color="#ea580c" />}
          iconBg="#ffedd5"
          loading={loading}
        />
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
          <div>
            <div className="font-semibold text-gray-900">Mine oppgaver</div>
            <div className="text-xs text-gray-400 mt-0.5">
              {stats.kunder > 0 ? `${oppgaver.filter(o => o.frist && isOverdue(o.frist)).length} forfalt` : ''}
            </div>
          </div>
          <Link to="/tasks" className="text-sm text-violet-600 font-medium flex items-center gap-1 hover:text-violet-700">
            Se alle <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Laster...</div>
        ) : oppgaver.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">Ingen åpne oppgaver 🎉</div>
        ) : (
          <div>
            {oppgaver.map((o, i) => (
              <div key={o.id}
                className={`flex items-center justify-between px-5 py-3.5 ${i < oppgaver.length-1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                    o.prioritet === 'høy' ? 'bg-red-500' :
                    o.prioritet === 'medium' ? 'bg-amber-400' : 'bg-gray-300'
                  }`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{o.tittel}</span>
                      {o.frist && isOverdue(o.frist) && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                          <AlertCircle size={10} /> Forfalt
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex gap-2">
                      {o.kunder?.bedriftsnavn && <span>{o.kunder.bedriftsnavn}</span>}
                      {o.frist && <span>Frist {new Date(o.frist).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })}</span>}
                    </div>
                  </div>
                </div>
                <PriorityBadge priority={o.prioritet} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
