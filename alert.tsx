import { useState } from 'react';
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

export function Dashboard() {
  const { isMVPMode } = useMVPMode();
  const teamMembers = ['Ola Nordmann', 'Kari Jensen', 'Per Hansen', 'Nina Olsen'];

  // Today's tasks for current user
  const [todaysTasks, setTodaysTasks] = useState([
    {
      id: '1',
      title: 'Send månedsrapport SEO',
      description: 'Første månedsrapport for Nordic Tech AS',
      customer: 'Nordic Tech AS',
      customerId: '1',
      service: 'SEO',
      assignee: 'Ola Nordmann',
      dueDate: 'I dag 15:00',
      priority: 'high' as const,
      status: 'In progress',
      created: '5 dager siden'
    },
    {
      id: '2',
      title: 'Oppfølging etter onboarding',
      description: 'Sjekk at alle tilganger er på plass',
      customer: 'Green Energy Norway',
      customerId: '2',
      service: 'Google Ads',
      assignee: 'Ola Nordmann',
      dueDate: 'I dag 16:00',
      priority: 'high' as const,
      status: 'Not started',
      created: '3 dager siden'
    },
    {
      id: '3',
      title: 'Gjennomgang av kampanjeresultater',
      description: 'Månedlig review med kunden',
      customer: 'Retail Solutions',
      customerId: '3',
      service: 'Meta Ads',
      assignee: 'Ola Nordmann',
      dueDate: 'Forfalt (I går)',
      priority: 'high' as const,
      status: 'Not started',
      created: '7 dager siden',
      overdue: true
    }
  ]);

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Er du sikker på at du vil slette denne oppgaven?')) {
      setTodaysTasks(todaysTasks.filter(t => t.id !== taskId));
    }
  };

  const handleEditTask = (taskId: string, updatedTask: any) => {
    setTodaysTasks(todaysTasks.map(t => t.id === taskId ? { ...t, ...updatedTask } : t));
  };

  const stats = [
    {
      label: 'Aktive Kunder',
      value: '47',
      change: '+3 denne måneden',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Pipeline-verdi',
      value: '2.4M kr',
      change: '12 aktive muligheter',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Åpne Tickets',
      value: '18',
      change: '4 med høy prioritet',
      trend: 'neutral',
      icon: AlertCircle,
      color: 'orange'
    },
    {
      label: 'Oppgaver i dag',
      value: '12',
      change: '8 gjenstår',
      trend: 'neutral',
      icon: CheckCircle2,
      color: 'purple'
    }
  ];

  const recentActivity = [
    {
      type: 'meeting',
      customer: 'Nordic Tech AS',
      description: 'Oppstartsmøte SEO-prosjekt',
      time: '10:00',
      today: true
    },
    {
      type: 'ticket',
      customer: 'Retail Solutions',
      description: 'Ny ticket: Rapportspørsmål',
      time: '2t siden',
      priority: 'high'
    },
    {
      type: 'deal',
      customer: 'Green Energy Norway',
      description: 'Tilbud signert - Google Ads',
      time: '3t siden',
      status: 'success'
    },
    {
      type: 'task',
      customer: 'Media Group AS',
      description: 'Oppfølging: Månedsrapport',
      time: 'I morgen',
      upcoming: true
    }
  ];

  const customersNeedingAttention = [
    {
      name: 'Retail Solutions',
      status: 'Active with risk',
      reason: 'Ingen kontakt siste 30 dager',
      health: 'warning'
    },
    {
      name: 'Nordic Tech AS',
      status: 'Onboarding',
      reason: '2 åpne onboarding-oppgaver',
      health: 'info'
    },
    {
      name: 'Travel Group',
      status: 'Churn risk',
      reason: 'Resultater under forventet',
      health: 'danger'
    }
  ];

  // MVP stats - only essential metrics
  const mvpStats = [
    {
      label: 'Aktive Kunder',
      value: '47',
      change: '+3 denne måneden',
      trend: 'up',
      icon: Users,
      color: 'blue'
    },
    {
      label: 'Pipeline-verdi',
      value: '2.4M kr',
      change: '12 aktive muligheter',
      trend: 'up',
      icon: DollarSign,
      color: 'green'
    },
    {
      label: 'Oppgaver i dag',
      value: '12',
      change: '8 gjenstår',
      trend: 'neutral',
      icon: CheckCircle2,
      color: 'purple'
    }
  ];

  const displayStats = isMVPMode ? mvpStats : stats;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          {isMVPMode ? 'Oversikt over dine oppgaver og kunder' : 'Oversikt over kunder, pipeline og oppfølging'}
        </p>
      </div>

      {/* Stats Grid */}
      <div className={`grid gap-4 ${isMVPMode ? 'grid-cols-3' : 'grid-cols-4'}`}>
        {displayStats.map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{stat.value}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{stat.change}</p>
              </div>
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'blue'
                    ? 'bg-blue-50 dark:bg-blue-900/30'
                    : stat.color === 'green'
                    ? 'bg-green-50 dark:bg-green-900/30'
                    : stat.color === 'orange'
                    ? 'bg-orange-50 dark:bg-orange-900/30'
                    : 'bg-purple-50 dark:bg-purple-900/30'
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${
                    stat.color === 'blue'
                      ? 'text-blue-600 dark:text-blue-400'
                      : stat.color === 'green'
                      ? 'text-green-600 dark:text-green-400'
                      : stat.color === 'orange'
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-purple-600 dark:text-purple-400'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isMVPMode && (
        <div className="grid grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="col-span-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Siste aktivitet</h2>
              <Link
                to="/customers"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
              >
                Se alle
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentActivity.map((activity, idx) => (
                <div key={idx} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        activity.type === 'meeting'
                          ? 'bg-blue-50 dark:bg-blue-900/30'
                          : activity.type === 'ticket'
                          ? 'bg-orange-50 dark:bg-orange-900/30'
                          : activity.type === 'deal'
                          ? 'bg-green-50 dark:bg-green-900/30'
                          : 'bg-purple-50 dark:bg-purple-900/30'
                      }`}
                    >
                      {activity.type === 'meeting' ? (
                        <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : activity.type === 'ticket' ? (
                        <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      ) : activity.type === 'deal' ? (
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{activity.customer}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400">{activity.time}</p>
                      {activity.priority === 'high' && (
                        <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400 mt-1">
                          <AlertCircle className="w-3 h-3" />
                          Høy prioritet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customers Needing Attention */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">Krever oppfølging</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {customersNeedingAttention.map((customer, idx) => (
                <div key={idx} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        customer.health === 'warning'
                          ? 'bg-yellow-500'
                          : customer.health === 'danger'
                          ? 'bg-red-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{customer.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{customer.status}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{customer.reason}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-700">
              <Link
                to="/customers"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center justify-center gap-1"
              >
                Se alle varsler
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mine oppgaver i dag */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900 dark:text-white">Mine oppgaver i dag ({todaysTasks.length})</h2>
          <Link
            to="/tasks"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
          >
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
              onReassign={(assignee) => {
                console.log(`Reassigning task ${task.id} to ${assignee}`);
              }}
              onReschedule={(date) => {
                console.log(`Rescheduling task ${task.id} to ${date}`);
              }}
              onEdit={(updatedTask) => handleEditTask(task.id, updatedTask)}
              onDelete={() => handleDeleteTask(task.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
