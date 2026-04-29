import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { TaskItem } from './TaskItem';
import { useMVPMode } from '../contexts/MVPContext';
import { supabase } from '../../lib/supabase';

function mapPriority(p: string): 'high' | 'medium' | 'low' {
  if (p === 'høy' || p === 'high') return 'high';
  if (p === 'medium') return 'medium';
  return 'low';
}

function formatDueDate(frist: string): string {
  const d = new Date(frist);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffH = Math.round(diffMs / 3600000);
  if (diffH < -24) return `Forfalt (${d.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })})`
  if (diffH < 0) return 'Forfalt (I går)';
  if (diffH < 6) return `I dag ${d.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffH < 24) return `I dag ${d.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffH < 48) return 'I morgen';
  return d.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' });
}

function formatCreated(created: string): string {
  const d = new Date(created);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diffDays === 0) return 'I dag';
  if (diffDays === 1) return 'I går';
  return `${diffDays} dager siden`;
}

export function Dashboard() {
  const { isMVPMode } = useMVPMode();
  const teamMembers = ['Ola Nordmann', 'Kari Jensen', 'Per Hansen', 'Nina Olsen'];
  const [loading, setLoading] = useState(true);
  const [realStats, setRealStats] = useState({ kunder: 0, pipeline: '—', tickets: 0, oppgaver: 0 });
  const [todaysTasks, setTodaysTasks] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const [
        { count: kundeCount },
        { data: leads },
        { count: ticketCount },
        { data: oppgaver }
      ] = await Promise.all([
        supabase.from('kunder').select('*', { count: 'exact', head: true }),
        supabase.from('leads').select('verdi').neq('stage', 'tapt'),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).eq('status', 'apent'),
        supabase.from('oppgaver').select('*, kunder(bedriftsnavn, id)')
          .neq('status', 'fullfort').order('frist').limit(8)
      ]);
      const pipeline = leads?.reduce((s: number, l: any) => s + (l.verdi || 0), 0) || 0;
      const formatKr = (n: number) => n >= 1000000 ? `${(n/1000000).toFixed(1)}M kr` : `${(n/1000).toFixed(0)}k kr`;
      setRealStats({ kunder: kundeCount || 0, pipeline: formatKr(pipeline), tickets: ticketCount || 0, oppgaver: oppgaver?.filter((o: any) => o.status !== 'fullfort').length || 0 });
      const mapped = (oppgaver || []).map((o: any) => ({
        id: o.id, title: o.tittel, description: o.beskrivelse || '',
        customer: o.kunder?.bedriftsnavn || '', customerId: o.kunder?.id || '',
        service: '', assignee: 'Ola Nordmann',
        dueDate: o.frist ? formatDueDate(o.frist) : 'Ingen frist',
        priority: mapPriority(o.prioritet),
        status: o.status === 'pagar' ? 'In progress' : 'Not started',
        created: formatCreated(o.created_at),
        overdue: o.frist ? new Date(o.frist) < new Date() : false
      }));
      setTodaysTasks(mapped);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Er du sikker på at du vil slette denne oppgaven?')) {
      setTodaysTasks(todaysTasks.filter(t => t.id !== taskId));
    }
  };

  const handleEditTask = (taskId: string, updatedTask: any) => {
    setTodaysTasks(todaysTasks.map(t => t.id === taskId ? { ...t, ...updatedTask } : t));
  };

  const stats = [
    { label: 'Aktive Kunder', value: loading ? '—' : String(realStats.kunder), change: '+3 denne måneden', trend: 'up', icon: Users, color: 'blue' },
    { label: 'Pipeline-verdi', value: loading ? '—' : realStats.pipeline, change: 'Aktive muligheter', trend: 'up', icon: DollarSign, color: 'green' },
    { label: 'Åpne Tickets', value: loading ? '—' : String(realStats.tickets), change: 'Venter på svar', trend: 'neutral', icon: AlertCircle, color: 'orange' },
    { label: 'Åpne oppgaver', value: loading ? '—' : String(realStats.oppgaver), change: 'Totalt ubehandlet', trend: 'neutral', icon: CheckCircle2, color: 'purple' }
  ];

  const mvpStats = [
    { label: 'Aktive Kunder', value: loading ? '—' : String(realStats.kunder), change: '+3 denne måneden', trend: 'up', icon: Users, color: 'blue' },
    { label: 'Pipeline-verdi', value: loading ? '—' : realStats.pipeline, change: 'Aktive muligheter', trend: 'up', icon: DollarSign, color: 'green' },
    { label: 'Åpne oppgaver', value: loading ? '—' : String(realStats.oppgaver), change: 'Totalt ubehandlet', trend: 'neutral', icon: CheckCircle2, color: 'purple' }
  ];

  const displayStats = isMVPMode ? mvpStats : stats;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {isMVPMode ? 'Oversikt over dine oppgaver og kunder' : 'Oversikt over kunder, pipeline og oppfølging'}
        </p>
      </div>
      <div className={`grid gap-4 ${isMVPMode ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {displayStats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Mine oppgaver i dag ({todaysTasks.length})</h2>
          <Link to="/tasks" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1">
            Se alle oppgaver
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {todaysTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              showCustomer={true}
              showService={!isMVPMode}
              showStatus={!isMVPMode}
              teamMembers={teamMembers}
              onReassign={(assignee) => { console.log(`Reassigning task ${task.id} to ${assignee}`); }}
              onReschedule={(date) => { console.log(`Rescheduling task ${task.id} to ${date}`); }}
              onEdit={(updatedTask) => handleEditTask(task.id, updatedTask)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
