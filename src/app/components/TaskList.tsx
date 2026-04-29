import { useState, useEffect } from 'react';
import { Plus, Filter, CheckCircle2, Clock, AlertCircle, User, X, Save } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { DateTimePicker } from './DateTimePicker';
import { supabase } from '../../lib/supabase';

function mapPriority(p: string): 'high' | 'medium' | 'low' {
  if (p === 'høy' || p === 'high') return 'high';
  if (p === 'medium') return 'medium';
  return 'low';
}

function formatDueDate(frist: string): string {
  const d = new Date(frist);
  const now = new Date();
  const diffH = Math.round((d.getTime() - now.getTime()) / 3600000);
  if (diffH < -48) return `Forfalt (${d.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })})`;
  if (diffH < -24) return 'Forfalt (I går)';
  if (diffH < 0) return 'Forfalt i dag';
  if (diffH < 24) return `I dag ${d.toLocaleTimeString('no-NO', { hour: '2-digit', minute: '2-digit' })}`;
  if (diffH < 48) return 'I morgen';
  const diffDays = Math.floor(diffH / 24);
  if (diffDays < 7) return `Om ${diffDays} dager`;
  if (diffDays < 14) return 'Neste uke';
  return d.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' });
}

export function TaskList() {
  const currentUser = 'Ola Nordmann';
  const teamMembers = ['Ola Nordmann', 'Kari Jensen', 'Per Hansen', 'Nina Olsen'];
  const filterOptions = ['Alle', ...teamMembers];
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed'>('today');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState(currentUser);
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState<{id: string, name: string}[]>([]);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '', description: '', customerId: '', service: '',
    assignee: currentUser, dueDate: '', priority: 'medium' as 'high' | 'medium' | 'low', status: 'Not started'
  });

  const services = ['SEO','Google Ads','Meta Ads','LinkedIn Ads','Content','Tracking','Analytics','Strategy','Onboarding','Support'];
  const [tasksList, setTasksList] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const [{ data: oppgaver }, { data: kunderData }] = await Promise.all([
        supabase.from('oppgaver').select('*, kunder(id, bedriftsnavn)').order('frist'),
        supabase.from('kunder').select('id, bedriftsnavn').order('bedriftsnavn')
      ]);
      if (kunderData) setCustomers(kunderData.map(k => ({ id: k.id, name: k.bedriftsnavn })));
      if (oppgaver) {
        const mapped = oppgaver.map(o => ({
          id: o.id, title: o.tittel, description: o.beskrivelse || '',
          customer: o.kunder?.bedriftsnavn || '', customerId: o.kunder?.id || '',
          service: '', assignee: 'Ola Nordmann',
          dueDate: o.frist ? formatDueDate(o.frist) : 'Ingen frist',
          priority: mapPriority(o.prioritet),
          status: o.status === 'fullfort' ? 'Done' : o.status === 'pagar' ? 'In progress' : 'Not started',
          created: new Date(o.created_at).toLocaleDateString('no-NO'),
          overdue: o.frist ? new Date(o.frist) < new Date() && o.status !== 'fullfort' : false
        }));
        setTasksList(mapped);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const todayTasks = tasksList.filter((t) => t.dueDate.includes('I dag') && t.status !== 'Done');
  const overdueTasks = tasksList.filter((t) => t.overdue && t.status !== 'Done');
  const upcomingTasks = tasksList.filter((t) => !t.overdue && !t.dueDate.includes('I dag') && t.status !== 'Done');
  const completedTasks = tasksList.filter((t) => t.status === 'Done');

  let tabTasks: any[] = [];
  if (activeTab === 'today') tabTasks = todayTasks;
  else if (activeTab === 'upcoming') tabTasks = upcomingTasks;
  else if (activeTab === 'overdue') tabTasks = overdueTasks;
  else if (activeTab === 'completed') tabTasks = completedTasks;

  const filteredTasks = tabTasks.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterAssignee !== 'Alle' && task.assignee !== filterAssignee) return false;
    return true;
  });

  const myTasks = tasksList.filter((t) => t.assignee === 'Ola Nordmann' && t.status !== 'Done');

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    if (confirm(`Er du sikker på at du vil slette oppgaven "${taskTitle}"?`)) {
      setTasksList(tasksList.filter(t => t.id !== taskId));
    }
  };

  const handleEditTask = (taskId: string, updatedTask: any) => {
    setTasksList(tasksList.map(t => t.id === taskId ? { ...t, ...updatedTask } : t));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Oppgaver</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {filteredTasks.length} {
              activeTab === 'today' ? 'dagens oppgaver' :
              activeTab === 'upcoming' ? 'kommende oppgaver' :
              activeTab === 'overdue' ? 'forfalte oppgaver' :
              'fullførte oppgaver'
            }
          </p>
        </div>
        <button onClick={() => setShowNewTaskModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ny oppgave
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Mine oppgaver</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{myTasks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Frist i dag</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{todayTasks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Forfalt</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{overdueTasks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Fullført totalt</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedTasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {(['today','upcoming','overdue','completed'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${activeTab === tab ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
              {tab === 'today' ? `Dagens oppgaver (${todayTasks.length})` :
               tab === 'upcoming' ? `Kommende oppgaver (${upcomingTasks.length})` :
               tab === 'overdue' ? `Forfalte oppgaver (${overdueTasks.length})` :
               `Fullførte oppgaver (${completedTasks.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filtre:</span>
          </div>
          <select value={filterAssignee} onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {filterOptions.map((member) => <option key={member} value={member}>{member}</option>)}
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Alle statuser</option>
            <option value="Not started">Ikke startet</option>
            <option value="In progress">Pågår</option>
            <option value="Blocked">Blokkert</option>
            <option value="Done">Fullført</option>
          </select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">Alle prioriteter</option>
            <option value="high">Høy prioritet</option>
            <option value="medium">Medium prioritet</option>
            <option value="low">Lav prioritet</option>
          </select>
          {(filterStatus !== 'all' || filterPriority !== 'all' || filterAssignee !== currentUser) && (
            <button onClick={() => { setFilterStatus('all'); setFilterPriority('all'); setFilterAssignee(currentUser); }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700">Nullstill filtre</button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} showCustomer={true} showService={true} showStatus={true}
              teamMembers={teamMembers}
              onReassign={(assignee) => { console.log(`Reassigning task ${task.id} to ${assignee}`); }}
              onReschedule={(date) => { console.log(`Rescheduling task ${task.id} to ${date}`); }}
              onEdit={(updatedTask) => handleEditTask(task.id, updatedTask)}
              onDelete={() => handleDeleteTask(task.id, task.title)}
            />
          ))}
        </div>
      </div>

      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Opprett ny oppgave</h3>
              <button onClick={() => { setShowNewTaskModal(false); setNewTask({ title: '', description: '', customerId: '', service: '', assignee: currentUser, dueDate: '', priority: 'medium', status: 'Not started' }); }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors">
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Oppgavetittel <span className="text-red-500">*</span></label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="F.eks. Send månedsrapport SEO"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Kunde <span className="text-red-500">*</span></label>
                <select value={newTask.customerId} onChange={(e) => setNewTask({ ...newTask, customerId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Velg kunde...</option>
                  {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tjeneste <span className="text-red-500">*</span></label>
                <select value={newTask.service} onChange={(e) => setNewTask({ ...newTask, service: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Velg tjeneste...</option>
                  {services.map((service) => <option key={service} value={service}>{service}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tildel til <span className="text-red-500">*</span></label>
                <select value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {teamMembers.map((member) => <option key={member} value={member}>{member}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Forfallsdato <span className="text-red-500">*</span></label>
                <DateTimePicker value={newTask.dueDate} onChange={(value) => setNewTask({ ...newTask, dueDate: value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Prioritet</label>
                <div className="flex gap-3">
                  {(['low','medium','high'] as const).map((p) => (
                    <button key={p} onClick={() => setNewTask({ ...newTask, priority: p })}
                      className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                        newTask.priority === p
                          ? p === 'low' ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                            : p === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                      }`}>
                      {p === 'low' ? 'Lav' : p === 'medium' ? 'Medium' : 'Høy'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button onClick={() => { setShowNewTaskModal(false); setNewTask({ title: '', description: '', customerId: '', service: '', assignee: currentUser, dueDate: '', priority: 'medium', status: 'Not started' }); }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Avbryt
              </button>
              <button onClick={() => {
                if (!newTask.title.trim()) { alert('Vennligst fyll ut oppgavetittel'); return; }
                if (!newTask.customerId) { alert('Vennligst velg en kunde'); return; }
                if (!newTask.service) { alert('Vennligst velg en tjeneste'); return; }
                if (!newTask.dueDate) { alert('Vennligst velg forfallsdato'); return; }
                const customer = customers.find(c => c.id === newTask.customerId);
                const task = {
                  id: String(Date.now()), title: newTask.title, description: newTask.description,
                  customer: customer?.name || '', customerId: newTask.customerId,
                  service: newTask.service, assignee: newTask.assignee,
                  dueDate: newTask.dueDate, priority: newTask.priority, status: newTask.status,
                  created: 'Nå nettopp', overdue: false
                };
                setTasksList([task, ...tasksList]);
                setShowNewTaskModal(false);
                setNewTask({ title: '', description: '', customerId: '', service: '', assignee: currentUser, dueDate: '', priority: 'medium', status: 'Not started' });
              }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Save className="w-4 h-4" />
                Opprett oppgave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
