import { useState, useRef, useEffect } from 'react';
import { Plus, CheckCircle2, Clock, AlertCircle, User, ChevronDown } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useProfiles } from '../../../lib/useProfiles';
import { useCurrentUser } from '../../contexts/UserContext';
import { TaskItem } from '../TaskItem';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
  id: string;
  title: string;
  description: string;
  customer?: string;
  customerId?: string;
  assignee: string;
  assigneeId?: string;
  dueDate: string;
  dueDateRaw?: string; // ISO date string for comparisons
  priority: 'high' | 'medium' | 'low';
  status: string;
  overdue?: boolean;
  type?: string;
}

function formatDate(iso?: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' });
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function mapPriority(prioritet?: string): 'high' | 'medium' | 'low' {
  if (prioritet === 'høy') return 'high';
  if (prioritet === 'lav') return 'low';
  return 'medium';
}

function mapStatus(status?: string): string {
  if (status === 'ikke_startet') return 'Not started';
  if (status === 'pagar') return 'In progress';
  if (status === 'fullfort') return 'Done';
  return 'Not started';
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TaskListMVP() {
  const { user } = useCurrentUser();
  const { profiles } = useProfiles();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'overdue' | 'completed'>('today');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [openLogId, setOpenLogId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load tasks from Supabase
  const loadTasks = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('oppgaver')
      .select('*, kunder(bedriftsnavn), ansvarlig:ansvarlig_id(id, navn)')
      .order('frist', { ascending: true, nullsFirst: false });

    if (data) {
      const today = todayStr();
      const mapped: Task[] = (data as any[]).map((row) => {
        const fristStr = row.frist ? row.frist.slice(0, 10) : undefined;
        const isOverdue = !!fristStr && fristStr < today && row.status !== 'fullfort';
        return {
          id: row.id,
          title: row.tittel,
          description: row.beskrivelse ?? '',
          customer: row.kunder?.bedriftsnavn,
          customerId: row.kunde_id,
          assignee: row.ansvarlig?.navn ?? '',
          assigneeId: row.ansvarlig?.id,
          dueDate: formatDate(row.frist),
          dueDateRaw: fristStr,
          priority: mapPriority(row.prioritet),
          status: mapStatus(row.status),
          overdue: isOverdue,
          type: row.type,
        };
      });
      setTasks(mapped);
    }
    setLoading(false);
  };

  useEffect(() => { loadTasks(); }, []);

  // Initialize selectedAssignees to all when profiles load
  useEffect(() => {
    if (profiles.length > 0 && selectedAssignees.length === 0) {
      setSelectedAssignees(profiles.map(p => p.navn));
    }
  }, [profiles]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAssigneeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const teamMemberNames = profiles.map(p => p.navn);
  const allSelected = selectedAssignees.length === teamMemberNames.length && teamMemberNames.length > 0;

  // Filter by selected assignees — tasks without an assignee always show
  const applyAssigneeFilter = (list: Task[]) => {
    if (selectedAssignees.length === 0) return list;
    return list.filter(t => !t.assignee || selectedAssignees.includes(t.assignee));
  };

  const toggleAssignee = (name: string) => {
    setSelectedAssignees(prev =>
      prev.includes(name) ? prev.filter(a => a !== name) : [...prev, name]
    );
  };

  const toggleAllAssignees = () => {
    if (allSelected) {
      setSelectedAssignees([]);
    } else {
      setSelectedAssignees([...teamMemberNames]);
    }
  };

  const today = todayStr();

  // Tab categorisation based on real ISO dates
  const todayTasks    = tasks.filter(t => t.dueDateRaw === today && t.status !== 'Done');
  const overdueTasks  = tasks.filter(t => !!t.dueDateRaw && t.dueDateRaw < today && t.status !== 'Done');
  // Upcoming = future date OR no date at all (unscheduled tasks are still upcoming)
  const upcomingTasks = tasks.filter(t => t.status !== 'Done' && t.dueDateRaw !== today && !(!!t.dueDateRaw && t.dueDateRaw < today));
  const completedTasks = tasks.filter(t => t.status === 'Done');

  const myTasks = tasks.filter(t => t.assigneeId === user?.id && t.status !== 'Done');

  let tabTasks: Task[] = [];
  if (activeTab === 'today')     tabTasks = applyAssigneeFilter(todayTasks);
  else if (activeTab === 'upcoming') tabTasks = applyAssigneeFilter(upcomingTasks);
  else if (activeTab === 'overdue')  tabTasks = applyAssigneeFilter(overdueTasks);
  else if (activeTab === 'completed') tabTasks = applyAssigneeFilter(completedTasks);

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (confirm(`Er du sikker på at du vil slette oppgaven "${taskTitle}"?`)) {
      await supabase.from('oppgaver').delete().eq('id', taskId);
      loadTasks();
    }
  };

  const handleEditTask = async (taskId: string, updatedTask: any) => {
    // Map back to DB fields for save
    await supabase.from('oppgaver').update({
      tittel: updatedTask.title,
      beskrivelse: updatedTask.description,
    }).eq('id', taskId);
    loadTasks();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Oppgaver</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {loading ? '…' : tabTasks.length} {
              activeTab === 'today' ? 'dagens oppgaver' :
              activeTab === 'upcoming' ? 'kommende oppgaver' :
              activeTab === 'overdue' ? 'forfalte oppgaver' :
              'fullførte oppgaver'
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Assignee Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowAssigneeDropdown(!showAssigneeDropdown)}
              className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">
                {allSelected ? 'Alle brukere' :
                 selectedAssignees.length === 1 ? selectedAssignees[0] :
                 selectedAssignees.length === 0 ? 'Ingen valgt' :
                 `${selectedAssignees.length} brukere`}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {showAssigneeDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50">
                <div className="p-2">
                  <label className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleAllAssignees}
                      className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-slate-900 dark:text-white">Alle brukere</span>
                  </label>
                  <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>
                  {teamMemberNames.map((name) => (
                    <label
                      key={name}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAssignees.includes(name)}
                        onChange={() => toggleAssignee(name)}
                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300">{name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" />
            Ny oppgave
          </button>
        </div>
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
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{loading ? '…' : myTasks.length}</p>
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
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{loading ? '…' : todayTasks.length}</p>
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
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{loading ? '…' : overdueTasks.length}</p>
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
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{loading ? '…' : completedTasks.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => { setActiveTab('today'); setOpenLogId(null); }}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'today'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dagens oppgaver ({todayTasks.length})
          </button>
          <button
            onClick={() => { setActiveTab('upcoming'); setOpenLogId(null); }}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'upcoming'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Kommende oppgaver ({upcomingTasks.length})
          </button>
          <button
            onClick={() => { setActiveTab('overdue'); setOpenLogId(null); }}
            className={`flex-1 px-6 py-3 font-medium transition-colors ${
              activeTab === 'overdue'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Forfalte oppgaver ({overdueTasks.length})
          </button>
          <button
            onClick={() => { setActiveTab('completed'); setOpenLogId(null); }}
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

      {/* Task List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Laster oppgaver…</div>
        ) : tabTasks.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">Ingen oppgaver her</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700">
            {tabTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                showCustomer={true}
                showService={false}
                showStatus={false}
                teamMembers={teamMemberNames}
                onReassign={(assignee) => {
                  console.log(`Reassigning task ${task.id} to ${assignee}`);
                }}
                onReschedule={(date) => {
                  console.log(`Rescheduling task ${task.id} to ${date}`);
                }}
                onEdit={(updatedTask) => handleEditTask(task.id, updatedTask)}
                onDelete={() => handleDeleteTask(task.id, task.title)}
                onLoggfor={(id) => {
                  if (id === '' || id === 'done') {
                    setOpenLogId(null);
                    if (id === 'done') loadTasks();
                  } else {
                    setOpenLogId(id);
                  }
                }}
                showLogPanel={openLogId === task.id}
                currentUserNavn={user?.navn ?? ''}
                kundeId={task.customerId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
