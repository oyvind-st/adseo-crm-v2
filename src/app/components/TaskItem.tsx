import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, Building2, AlertCircle, Trash2, Edit, Save, X, CheckCircle2 } from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';
import { supabase } from '../../lib/supabase';

// ─── Activity type mapping ─────────────────────────────────────────────────────

const ACTIVITY_TYPE_MAP: Record<string, string> = {
  'Ringte':    'call_answered',
  'Ikke svar': 'call_no_answer',
  'E-post':    'email',
  'Møte':      'meeting',
  'Annet':     'notat',
};

function getDefaultActivityType(taskType?: string): string {
  if (taskType === 'ring')  return 'Ringte';
  if (taskType === 'email') return 'E-post';
  if (taskType === 'mote')  return 'Møte';
  return 'Annet';
}

// ─── LogPanel ─────────────────────────────────────────────────────────────────

interface LogPanelProps {
  taskId?: string;
  taskTitle: string;
  taskType?: string;
  kundeId?: string;
  currentUserNavn: string;
  onClose: () => void;
  onDone: () => void;
}

function LogPanel({ taskId, taskTitle, taskType, kundeId, currentUserNavn, onClose, onDone }: LogPanelProps) {
  const [actType, setActType]             = useState(getDefaultActivityType(taskType));
  const [note, setNote]                   = useState('');
  const [followUp, setFollowUp]           = useState(false);
  const [followUpTitle, setFollowUpTitle] = useState('');
  const [followUpDate, setFollowUpDate]   = useState('');
  const [saving, setSaving]               = useState(false);

  const actTypes = ['Ringte', 'Ikke svar', 'E-post', 'Møte', 'Annet'];

  const handleComplete = async () => {
    setSaving(true);
    try {
      // 1. Mark task done
      if (taskId) {
        await supabase.from('oppgaver').update({ status: 'fullfort' }).eq('id', taskId);
      }

      // 2. Log activity
      await supabase.from('aktivitetslogg').insert({
        kunde_id:       kundeId || null,
        type:           ACTIVITY_TYPE_MAP[actType] ?? 'notat',
        tittel:         taskTitle,
        beskrivelse:    note || null,
        utfort_av_navn: currentUserNavn,
      });

      // 3. Follow-up task
      if (followUp && followUpTitle) {
        await supabase.from('oppgaver').insert({
          tittel:    followUpTitle,
          frist:     followUpDate || null,
          kunde_id:  kundeId || null,
          status:    'ikke_startet',
        });
      }

      onDone();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border-t border-blue-100 bg-blue-50/50 px-6 py-4 space-y-4">
      {/* Activity type buttons */}
      <div className="flex flex-wrap gap-2">
        {actTypes.map(t => (
          <button
            key={t}
            onClick={() => setActType(t)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              actType === t
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Note */}
      <textarea
        autoFocus
        rows={3}
        value={note}
        onChange={e => setNote(e.target.value)}
        placeholder="Hva skjedde? Skriv et kort notat..."
        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
      />

      {/* Follow-up checkbox */}
      <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
        <input
          type="checkbox"
          checked={followUp}
          onChange={e => setFollowUp(e.target.checked)}
          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>Oppfølgingsoppgave</span>
      </label>

      {/* Follow-up fields */}
      {followUp && (
        <div className="flex gap-2 pl-6">
          <input
            type="text"
            placeholder="Hva skal følges opp?"
            value={followUpTitle}
            onChange={e => setFollowUpTitle(e.target.value)}
            className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="date"
            value={followUpDate}
            onChange={e => setFollowUpDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleComplete}
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? 'Lagrer…' : 'Fullfør og loggfør'}
        </button>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Avbryt
        </button>
      </div>
    </div>
  );
}

// ─── TaskItem ─────────────────────────────────────────────────────────────────

interface TaskItemProps {
  task: {
    id?: string;
    title: string;
    description: string;
    customer?: string;
    customerId?: string;
    service?: string;
    assignee: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    status?: string;
    overdue?: boolean;
    type?: string;
  };
  onClick?: () => void;
  showCustomer?: boolean;
  showService?: boolean;
  showStatus?: boolean;
  teamMembers?: string[];
  onReassign?: (assignee: string) => void;
  onReschedule?: (date: string) => void;
  onDelete?: () => void;
  onEdit?: (updatedTask: any) => void;
  onLoggfor?: (taskId: string) => void;
  showLogPanel?: boolean;
  currentUserNavn?: string;
  kundeId?: string;
}

export function TaskItem({
  task,
  onClick,
  showCustomer = false,
  showService = false,
  showStatus = false,
  teamMembers = ['Ola Nordmann', 'Kari Jensen', 'Per Hansen', 'Nina Olsen'],
  onReassign,
  onReschedule,
  onDelete,
  onEdit,
  onLoggfor,
  showLogPanel = false,
  currentUserNavn = '',
  kundeId,
}: TaskItemProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: task.title,
    description: task.description,
    assignee: task.assignee,
    dueDate: '', // Initialize as empty for DateTimePicker
    priority: task.priority,
    status: task.status || 'Not started'
  });

  const handleTaskClick = () => {
    if (onClick) {
      onClick();
    } else if (task.customerId) {
      // Navigate to customer detail with state to open quick log
      navigate(`/customers/${task.customerId}`, {
        state: {
          openQuickLog: true,
          taskData: {
            title: task.title,
            description: task.description
          }
        }
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In progress':
        return 'bg-blue-100 text-blue-700';
      case 'Done':
        return 'bg-green-100 text-green-700';
      case 'Blocked':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const handleSaveEdit = () => {
    if (onEdit) {
      onEdit({ ...task, ...editedTask });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedTask({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      dueDate: '',
      priority: task.priority,
      status: task.status || 'Not started'
    });
    setIsEditing(false);
  };

  const startEditing = () => {
    // Reset the form with current task values
    setEditedTask({
      title: task.title,
      description: task.description,
      assignee: task.assignee,
      dueDate: '', // Start with empty date for fresh selection
      priority: task.priority,
      status: task.status || 'Not started'
    });
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className={`px-6 py-4 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 relative ${
        task.overdue ? 'bg-red-50 dark:bg-red-900/30' : ''
      }`}>
        <div className="space-y-3 relative z-0">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Tittel
            </label>
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
              Beskrivelse
            </label>
            <textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Assignee */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tildel til
              </label>
              <select
                value={editedTask.assignee}
                onChange={(e) => setEditedTask({ ...editedTask, assignee: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {teamMembers.map((member) => (
                  <option key={member} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Prioritet
              </label>
              <select
                value={editedTask.priority}
                onChange={(e) => setEditedTask({ ...editedTask, priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="low">Lav</option>
                <option value="medium">Medium</option>
                <option value="high">Høy</option>
              </select>
            </div>

            {/* Status */}
            {showStatus && (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editedTask.status}
                    onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="Not started">Ikke startet</option>
                    <option value="In progress">Pågår</option>
                    <option value="Blocked">Blokkert</option>
                    <option value="Done">Fullført</option>
                  </select>
                </div>
                {/* Due Date with Status */}
                <div className="relative z-10">
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Forfallsdato
                  </label>
                  <DateTimePicker
                    value={editedTask.dueDate}
                    onChange={(value) => setEditedTask({ ...editedTask, dueDate: value })}
                  />
                </div>
              </>
            )}
          </div>

          {/* Due Date without Status - full width */}
          {!showStatus && (
            <div className="relative z-10">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Forfallsdato
              </label>
              <DateTimePicker
                value={editedTask.dueDate}
                onChange={(value) => setEditedTask({ ...editedTask, dueDate: value })}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleCancelEdit}
              className="px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Avbryt
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-1"
            >
              <Save className="w-4 h-4" />
              Lagre endringer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
        task.overdue ? 'bg-red-50 dark:bg-red-900/30' : ''
      }`}
    >
      {/* Main row */}
      <div className="px-6 py-4 flex items-start gap-3">
        <div className="flex-1" onClick={handleTaskClick}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900 dark:text-white">
                  {task.title}
                </p>
                {task.overdue && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    Forfalt
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {task.description}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                {showCustomer && task.customer && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5" />
                    {task.customer}
                  </span>
                )}
                {showService && task.service && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    {task.service}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {task.dueDate}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {task.assignee}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(
                  task.priority
                )}`}
              >
                {task.priority === 'high' ? 'Høy' : task.priority === 'medium' ? 'Medium' : 'Lav'}
              </span>
              {showStatus && task.status && (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 ml-2">
          {onLoggfor && (
            <button
              onClick={(e) => { e.stopPropagation(); onLoggfor(task.id ?? ''); }}
              className="px-2 py-1 text-xs text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3" />
              Loggfør
            </button>
          )}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                startEditing();
              }}
              className="px-2 py-1 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex items-center gap-1"
            >
              <Edit className="w-3 h-3" />
              Rediger
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="px-2 py-1 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" />
              Slett
            </button>
          )}
        </div>
      </div>

      {/* Inline log panel */}
      {showLogPanel && (
        <LogPanel
          taskId={task.id}
          taskTitle={task.title}
          taskType={task.type}
          kundeId={kundeId}
          currentUserNavn={currentUserNavn}
          onClose={() => onLoggfor && onLoggfor('')}
          onDone={() => onLoggfor && onLoggfor('done')}
        />
      )}
    </div>
  );
}
