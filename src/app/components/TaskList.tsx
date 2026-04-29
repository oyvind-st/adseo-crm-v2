import { useState } from 'react';
import { Plus, Filter, CheckCircle2, Clock, AlertCircle, User, X, Save } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { DateTimePicker } from './DateTimePicker';

export function TaskList() {
  const currentUser = 'Ola Nordmann'; // In a real app, this would come from auth context
  const teamMembers = ['Ola Nordmann', 'Kari Jensen', 'Per Hansen', 'Nina Olsen'];
  const filterOptions = ['Alle', ...teamMembers];
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed'>('today');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterAssignee, setFilterAssignee] = useState(currentUser);

  // New task modal state
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    customerId: '',
    service: '',
    assignee: currentUser,
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'Not started'
  });

  // Customer list - TODO: Fetch from API
  const customers = [
    { id: '1', name: 'Nordic Tech AS' },
    { id: '2', name: 'Green Energy Norway' },
    { id: '3', name: 'Retail Solutions' },
    { id: '4', name: 'Tech Startup AS' },
    { id: '5', name: 'Media Group AS' },
    { id: '6', name: 'E-commerce Pro AS' }
  ];

  // Service list - TODO: Fetch from API or config
  const services = [
    'SEO',
    'Google Ads',
    'Meta Ads',
    'LinkedIn Ads',
    'Content',
    'Tracking',
    'Analytics',
    'Strategy',
    'Onboarding',
    'Support'
  ];

  const [tasksList, setTasksList] = useState([
    {
      id: '1',
      title: 'Send månedsrapport SEO',
      description: 'Første månedsrapport for Nordic Tech AS',
      customer: 'Nordic Tech AS',
      customerId: '1',
      service: 'SEO',
      assignee: 'Ola Nordmann',
      dueDate: 'I dag 15:00',
      priority: 'high',
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
      assignee: 'Kari Jensen',
      dueDate: 'I dag 16:00',
      priority: 'high',
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
      priority: 'high',
      status: 'Not started',
      created: '7 dager siden',
      overdue: true
    },
    {
      id: '4',
      title: 'Optimalisering av kampanjestruktur',
      description: 'Revidering basert på resultater fra siste 30 dager',
      customer: 'Tech Startup AS',
      customerId: '4',
      service: 'Google Ads',
      assignee: 'Kari Jensen',
      dueDate: 'I morgen',
      priority: 'medium',
      status: 'In progress',
      created: '2 dager siden'
    },
    {
      id: '5',
      title: 'Kvartalsgjennomgang strategi',
      description: 'Forberede presentasjon for kunden',
      customer: 'Media Group AS',
      customerId: '5',
      service: 'SEO',
      assignee: 'Ola Nordmann',
      dueDate: 'Neste uke',
      priority: 'medium',
      status: 'Not started',
      created: '1 dag siden'
    },
    {
      id: '6',
      title: 'Sett opp tracking i GA4',
      description: 'Verifiser at alle conversions spores korrekt',
      customer: 'E-commerce Pro AS',
      customerId: '6',
      service: 'Tracking',
      assignee: 'Kari Jensen',
      dueDate: 'Om 3 dager',
      priority: 'high',
      status: 'Not started',
      created: '2 timer siden'
    },
    {
      id: '7',
      title: 'Innholdsplan Q2',
      description: 'Lage innholdskalender for neste kvartal',
      customer: 'Green Energy Norway',
      customerId: '2',
      service: 'Content',
      assignee: 'Ola Nordmann',
      dueDate: 'Om 5 dager',
      priority: 'low',
      status: 'Not started',
      created: '4 dager siden'
    },
    {
      id: '8',
      title: 'Teknisk SEO-audit',
      description: 'Fullstendig teknisk gjennomgang av nettsted',
      customer: 'Nordic Tech AS',
      customerId: '1',
      service: 'SEO',
      assignee: 'Ola Nordmann',
      dueDate: 'Om 2 uker',
      priority: 'medium',
      status: 'Not started',
      created: '1 dag siden'
    },
    // Completed tasks
    {
      id: '9',
      title: 'Sett opp Google Ads konverteringssporing',
      description: 'Implementert conversion tracking for alle kampanjer',
      customer: 'Tech Startup AS',
      customerId: '4',
      service: 'Google Ads',
      assignee: 'Kari Jensen',
      dueDate: 'Fullført i går',
      priority: 'high',
      status: 'Done',
      created: '5 dager siden',
      completedDate: 'I går 14:30'
    },
    {
      id: '10',
      title: 'Kvartalsrapport Q1',
      description: 'Utarbeidet og sendt Q1 rapport til kunden',
      customer: 'Green Energy Norway',
      customerId: '2',
      service: 'SEO',
      assignee: 'Ola Nordmann',
      dueDate: 'Fullført for 2 dager siden',
      priority: 'medium',
      status: 'Done',
      created: '1 uke siden',
      completedDate: 'For 2 dager siden'
    },
    {
      id: '11',
      title: 'Oppsett av nye kampanjer Meta',
      description: 'Lansert 3 nye kampanjer for vår-sesongen',
      customer: 'Retail Solutions',
      customerId: '3',
      service: 'Meta Ads',
      assignee: 'Per Hansen',
      dueDate: 'Fullført for 3 dager siden',
      priority: 'high',
      status: 'Done',
      created: '1 uke siden',
      completedDate: 'For 3 dager siden'
    },
    {
      id: '12',
      title: 'Keyword research for nye produkter',
      description: 'Fullført keyword analyse for produktlansering',
      customer: 'E-commerce Pro AS',
      customerId: '6',
      service: 'SEO',
      assignee: 'Ola Nordmann',
      dueDate: 'Fullført i forrige uke',
      priority: 'medium',
      status: 'Done',
      created: '2 uker siden',
      completedDate: 'For 1 uke siden'
    },
    {
      id: '13',
      title: 'Onboarding møte og strategi',
      description: 'Gjennomført onboarding og etablert strategi',
      customer: 'Media Group AS',
      customerId: '5',
      service: 'Strategy',
      assignee: 'Kari Jensen',
      dueDate: 'Fullført for 1 uke siden',
      priority: 'high',
      status: 'Done',
      created: '2 uker siden',
      completedDate: 'For 1 uke siden'
    }
  ]);

  // Categorize tasks by time
  const todayTasks = tasksList.filter((t) => t.dueDate.includes('I dag') && t.status !== 'Done');
  const overdueTasks = tasksList.filter((t) => t.overdue && t.status !== 'Done');
  const upcomingTasks = tasksList.filter((t) => !t.overdue && !t.dueDate.includes('I dag') && t.status !== 'Done');
  const completedTasks = tasksList.filter((t) => t.status === 'Done');

  // Select tasks based on active tab
  let tabTasks = [];
  if (activeTab === 'today') {
    tabTasks = todayTasks;
  } else if (activeTab === 'upcoming') {
    tabTasks = upcomingTasks;
  } else if (activeTab === 'overdue') {
    tabTasks = overdueTasks;
  } else if (activeTab === 'completed') {
    tabTasks = completedTasks;
  }

  // Apply filters on top of tab selection
  const filteredTasks = tabTasks.filter((task) => {
    if (filterStatus !== 'all' && task.status !== filterStatus) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (filterAssignee !== 'Alle' && task.assignee !== filterAssignee) return false;
    return true;
  });

  const myTasks = tasksList.filter((t) => t.assignee === 'Ola Nordmann' && t.status !== 'Done');

  const handleDeleteTask = (taskId: string, taskTitle: string) => {
    if (confirm(`Er du sikker på at du vil slette oppgaven "${taskTitle}"?`)) {
      // TODO: Backend - Delete task from database
      setTasksList(tasksList.filter(t => t.id !== taskId));
    }
  };

  const handleEditTask = (taskId: string, updatedTask: any) => {
    // TODO: Backend - Update task in database
    setTasksList(tasksList.map(t => t.id === taskId ? { ...t, ...updatedTask } : t));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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
        <button
          onClick={() => setShowNewTaskModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ny oppgave
        </button>
      </div>

      {/* Quick Stats */}
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

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'today'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dagens oppgaver ({todayTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Kommende oppgaver ({upcomingTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('overdue')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'overdue'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Forfalte oppgaver ({overdueTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'completed'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Fullførte oppgaver ({completedTasks.length})
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filtre:</span>
          </div>
          <select
            value={filterAssignee}
            onChange={(e) => setFilterAssignee(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filterOptions.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle statuser</option>
            <option value="Not started">Ikke startet</option>
            <option value="In progress">Pågår</option>
            <option value="Blocked">Blokkert</option>
            <option value="Done">Fullført</option>
          </select>
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle prioriteter</option>
            <option value="high">Høy prioritet</option>
            <option value="medium">Medium prioritet</option>
            <option value="low">Lav prioritet</option>
          </select>
          {(filterStatus !== 'all' || filterPriority !== 'all' || filterAssignee !== currentUser) && (
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterPriority('all');
                setFilterAssignee(currentUser);
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
            >
              Nullstill filtre
            </button>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              showCustomer={true}
              showService={true}
              showStatus={true}
              teamMembers={teamMembers}
              onReassign={(assignee) => {
                console.log(`Reassigning task ${task.id} to ${assignee}`);
              }}
              onReschedule={(date) => {
                console.log(`Rescheduling task ${task.id} to ${date}`);
              }}
              onEdit={(updatedTask) => handleEditTask(task.id, updatedTask)}
              onDelete={() => handleDeleteTask(task.id, task.title)}
            />
          ))}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Opprett ny oppgave</h3>
              <button
                onClick={() => {
                  setShowNewTaskModal(false);
                  setNewTask({
                    title: '',
                    description: '',
                    customerId: '',
                    service: '',
                    assignee: currentUser,
                    dueDate: '',
                    priority: 'medium',
                    status: 'Not started'
                  });
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Oppgavetittel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="F.eks. Send månedsrapport SEO"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Beskrivelse
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Beskriv oppgaven i detalj..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Customer */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kunde <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTask.customerId}
                  onChange={(e) => setNewTask({ ...newTask, customerId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Velg kunde...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tjeneste <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTask.service}
                  onChange={(e) => setNewTask({ ...newTask, service: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Velg tjeneste...</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Tildel til <span className="text-red-500">*</span>
                </label>
                <select
                  value={newTask.assignee}
                  onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {teamMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Forfallsdato <span className="text-red-500">*</span>
                </label>
                <DateTimePicker
                  value={newTask.dueDate}
                  onChange={(value) => setNewTask({ ...newTask, dueDate: value })}
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Prioritet
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setNewTask({ ...newTask, priority: 'low' })}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      newTask.priority === 'low'
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-green-300'
                    }`}
                  >
                    Lav
                  </button>
                  <button
                    onClick={() => setNewTask({ ...newTask, priority: 'medium' })}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      newTask.priority === 'medium'
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-yellow-300'
                    }`}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setNewTask({ ...newTask, priority: 'high' })}
                    className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                      newTask.priority === 'high'
                        ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-red-300'
                    }`}
                  >
                    Høy
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Oppgaven vil bli opprettet med status "Ikke startet" og kan endres senere.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowNewTaskModal(false);
                  setNewTask({
                    title: '',
                    description: '',
                    customerId: '',
                    service: '',
                    assignee: currentUser,
                    dueDate: '',
                    priority: 'medium',
                    status: 'Not started'
                  });
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  // Validation
                  if (!newTask.title.trim()) {
                    alert('Vennligst fyll ut oppgavetittel');
                    return;
                  }
                  if (!newTask.customerId) {
                    alert('Vennligst velg en kunde');
                    return;
                  }
                  if (!newTask.service) {
                    alert('Vennligst velg en tjeneste');
                    return;
                  }
                  if (!newTask.dueDate) {
                    alert('Vennligst velg forfallsdato');
                    return;
                  }

                  // TODO: Backend - Save task to database
                  const customer = customers.find(c => c.id === newTask.customerId);
                  const task = {
                    id: String(Date.now()),
                    title: newTask.title,
                    description: newTask.description,
                    customer: customer?.name || '',
                    customerId: newTask.customerId,
                    service: newTask.service,
                    assignee: newTask.assignee,
                    dueDate: newTask.dueDate,
                    priority: newTask.priority,
                    status: newTask.status,
                    created: 'Nå nettopp',
                    overdue: false
                  };

                  setTasksList([task, ...tasksList]);
                  setShowNewTaskModal(false);
                  setNewTask({
                    title: '',
                    description: '',
                    customerId: '',
                    service: '',
                    assignee: currentUser,
                    dueDate: '',
                    priority: 'medium',
                    status: 'Not started'
                  });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
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
