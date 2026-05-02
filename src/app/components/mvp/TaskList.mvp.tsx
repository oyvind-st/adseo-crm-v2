'use client'
import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Plus, ChevronDown, User, Clock, AlertCircle, CheckCircle2, ListTodo } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useCurrentUser } from '../../contexts/UserContext'
import { useProfiles } from '../../../lib/useProfiles'
import { Tabs, TabList, Tab } from '../shared/Tabs'
import { Avatar } from '../shared/Avatar'
import { PriorityBadge, StatCard } from '../shared'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Oppgave {
  id: string
  tittel: string
  beskrivelse?: string
  status: string
  prioritet?: string
  frist?: string
  type?: string
  kunde_id?: string
  ansvarlig_id?: string
  kunder?: { bedriftsnavn: string } | null
  ansvarlig?: { id: string; navn: string } | null
}

type TabKey = 'today' | 'upcoming' | 'overdue' | 'fullfort'

const ACTIVITY_TYPE_MAP: Record<string, string> = {
  'Ringte':    'call_answered',
  'Ikke svar': 'call_no_answer',
  'E-post':    'email',
  'Møte':      'meeting',
  'Annet':     'notat',
}

const TASK_TYPE_ICONS: Record<string, string> = {
  ring:    '📞',
  email:   '✉️',
  mote:    '🤝',
  rapport: '📊',
}

function getDefaultActivityType(taskType?: string): string {
  if (taskType === 'ring')  return 'Ringte'
  if (taskType === 'email') return 'E-post'
  if (taskType === 'mote')  return 'Møte'
  return 'Annet'
}

function formatDate(iso?: string): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

// ─── Inline Log Panel ─────────────────────────────────────────────────────────

interface LogPanelProps {
  task: Oppgave
  currentUserNavn: string
  onClose: () => void
  onDone: () => void
}

function LogPanel({ task, currentUserNavn, onClose, onDone }: LogPanelProps) {
  const [actType, setActType]         = useState(getDefaultActivityType(task.type))
  const [note, setNote]               = useState('')
  const [followUp, setFollowUp]       = useState(false)
  const [followUpTitle, setFollowUpTitle] = useState('')
  const [followUpDate, setFollowUpDate]   = useState('')
  const [saving, setSaving]           = useState(false)

  const actTypes = ['Ringte', 'Ikke svar', 'E-post', 'Møte', 'Annet']

  const handleComplete = async () => {
    setSaving(true)
    try {
      // 1. Mark task done
      await supabase.from('oppgaver').update({ status: 'fullfort' }).eq('id', task.id)

      // 2. Log activity
      await supabase.from('aktivitetslogg').insert({
        kunde_id:      task.kunde_id,
        type:          ACTIVITY_TYPE_MAP[actType] ?? 'notat',
        tittel:        task.tittel,
        beskrivelse:   note || null,
        utfort_av_navn: currentUserNavn,
      })

      // 3. Follow-up task
      if (followUp && followUpTitle) {
        await supabase.from('oppgaver').insert({
          tittel:       followUpTitle,
          frist:        followUpDate || null,
          kunde_id:     task.kunde_id,
          ansvarlig_id: task.ansvarlig_id,
          status:       'ikke_startet',
        })
      }

      onDone()
    } finally {
      setSaving(false)
    }
  }

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
  )
}

// ─── Task Row ─────────────────────────────────────────────────────────────────

interface TaskRowProps {
  task: Oppgave
  openLogId: string | null
  setOpenLogId: (id: string | null) => void
  currentUserNavn: string
  onReload: () => void
}

function TaskRow({ task, openLogId, setOpenLogId, currentUserNavn, onReload }: TaskRowProps) {
  const isOpen = openLogId === task.id
  const today  = todayStr()
  const isOverdue = task.frist && task.frist < today && task.status !== 'fullfort'

  const toggleLog = () => setOpenLogId(isOpen ? null : task.id)

  return (
    <div className="border-b border-slate-100 last:border-0">
      {/* Row */}
      <div
        className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer"
        onClick={toggleLog}
      >
        {/* Circle checkbox */}
        <div
          className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
            task.status === 'fullfort'
              ? 'bg-green-100 border-green-400'
              : isOpen
              ? 'bg-blue-100 border-blue-500'
              : 'border-slate-300 hover:border-blue-400'
          }`}
          onClick={e => { e.stopPropagation(); toggleLog() }}
          title="Åpne loggpanel"
        >
          {task.status === 'fullfort' && (
            <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isOpen && task.status !== 'fullfort' && (
            <div className="w-3 h-3 rounded-full bg-blue-500" />
          )}
        </div>

        {/* Title + customer */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`font-medium text-slate-900 truncate ${task.status === 'fullfort' ? 'line-through text-slate-400' : ''}`}>
              {task.tittel}
            </span>
            {task.type && TASK_TYPE_ICONS[task.type] && (
              <span title={task.type} className="text-base leading-none">{TASK_TYPE_ICONS[task.type]}</span>
            )}
            {isOverdue && (
              <span className="flex items-center gap-0.5 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full flex-shrink-0">
                <AlertCircle className="w-3 h-3" /> Forfalt
              </span>
            )}
          </div>
          {task.kunder?.bedriftsnavn && (
            <p className="text-sm text-slate-500 mt-0.5 truncate">{task.kunder.bedriftsnavn}</p>
          )}
        </div>

        {/* Right: priority + due date + avatar */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {task.prioritet && <PriorityBadge priority={task.prioritet} />}
          {task.frist && (
            <span className={`text-xs ${isOverdue ? 'text-red-600 font-medium' : 'text-slate-500'}`}>
              <Clock className="w-3 h-3 inline mr-0.5" />
              {formatDate(task.frist)}
            </span>
          )}
          {task.ansvarlig?.navn && (
            <Avatar name={task.ansvarlig.navn} size="xs" />
          )}
        </div>
      </div>

      {/* Inline log panel */}
      {isOpen && task.status !== 'fullfort' && (
        <LogPanel
          task={task}
          currentUserNavn={currentUserNavn}
          onClose={() => setOpenLogId(null)}
          onDone={() => { setOpenLogId(null); onReload() }}
        />
      )}
    </div>
  )
}

// ─── Quick Add Bar ────────────────────────────────────────────────────────────

interface QuickAddBarProps {
  onAdded: () => void
  currentUserId: string | null
}

function QuickAddBar({ onAdded, currentUserId }: QuickAddBarProps) {
  const [tittel, setTittel]     = useState('')
  const [kundeId, setKundeId]   = useState('')
  const [frist, setFrist]       = useState('')
  const [type, setType]         = useState('')
  const [expanded, setExpanded] = useState(false)
  const [prioritet, setPrioritet] = useState('')
  const [beskrivelse, setBeskrivelse] = useState('')
  const [kunder, setKunder]     = useState<{ id: string; bedriftsnavn: string }[]>([])
  const [adding, setAdding]     = useState(false)

  useEffect(() => {
    supabase.from('kunder').select('id, bedriftsnavn').order('bedriftsnavn')
      .then(({ data }) => { if (data) setKunder(data) })
  }, [])

  const handleAdd = async () => {
    if (!tittel.trim()) return
    setAdding(true)
    try {
      await supabase.from('oppgaver').insert({
        tittel:       tittel.trim(),
        kunde_id:     kundeId || null,
        frist:        frist || null,
        type:         type || null,
        prioritet:    prioritet || null,
        beskrivelse:  beskrivelse || null,
        ansvarlig_id: currentUserId || null,
        status:       'ikke_startet',
      })
      setTittel('')
      setKundeId('')
      setFrist('')
      setType('')
      setPrioritet('')
      setBeskrivelse('')
      setExpanded(false)
      onAdded()
    } finally {
      setAdding(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdd()
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-4">
      {/* Main bar */}
      <div className="flex items-center gap-2 px-4 py-3">
        <span className="text-base flex-shrink-0">📋</span>
        <input
          type="text"
          placeholder="Hva skal gjøres?"
          value={tittel}
          onChange={e => setTittel(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
        />
        <select
          value={kundeId}
          onChange={e => setKundeId(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 max-w-[160px]"
        >
          <option value="">Kunde ▼</option>
          {kunder.map(k => (
            <option key={k.id} value={k.id}>{k.bedriftsnavn}</option>
          ))}
        </select>
        <input
          type="date"
          value={frist}
          onChange={e => setFrist(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Type ▼</option>
          <option value="ring">📞 Ring</option>
          <option value="email">✉️ E-post</option>
          <option value="mote">🤝 Møte</option>
          <option value="rapport">📊 Rapport</option>
        </select>
        <button
          onClick={() => setExpanded(v => !v)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors whitespace-nowrap"
        >
          Mer info <ChevronDown className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
        <button
          onClick={handleAdd}
          disabled={adding || !tittel.trim()}
          className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {adding ? '…' : 'Legg til'}
        </button>
      </div>

      {/* Expanded section */}
      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 flex gap-3">
          <select
            value={prioritet}
            onChange={e => setPrioritet(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Prioritet</option>
            <option value="høy">Høy</option>
            <option value="medium">Medium</option>
            <option value="lav">Lav</option>
          </select>
          <input
            type="text"
            placeholder="Beskrivelse…"
            value={beskrivelse}
            onChange={e => setBeskrivelse(e.target.value)}
            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function TaskListMVP() {
  const { user }                        = useCurrentUser()
  const { profiles }                    = useProfiles()
  const [oppgaver, setOppgaver]         = useState<Oppgave[]>([])
  const [loading, setLoading]           = useState(true)
  const [activeTab, setActiveTab]       = useState<TabKey>('today')
  const [filterAssignee, setFilterAssignee] = useState<string>('alle')
  const [showAssigneeDD, setShowAssigneeDD] = useState(false)
  const [openLogId, setOpenLogId]       = useState<string | null>(null)
  const assigneeDDRef                   = useRef<HTMLDivElement>(null)

  const loadOppgaver = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('oppgaver')
      .select('*, kunder(bedriftsnavn), ansvarlig:ansvarlig_id(id, navn)')
      .order('frist', { ascending: true, nullsFirst: false })
    setOppgaver((data as Oppgave[]) || [])
    setLoading(false)
  }

  useEffect(() => { loadOppgaver() }, [])

  // Close assignee dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (assigneeDDRef.current && !assigneeDDRef.current.contains(e.target as Node)) {
        setShowAssigneeDD(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const today = todayStr()

  // Tab filters
  const isToday   = (o: Oppgave) => (!!o.frist && o.frist.slice(0, 10) === today) || o.status === 'pagar'
  const isOverdue = (o: Oppgave) => !!o.frist && o.frist.slice(0, 10) < today && o.status !== 'fullfort'
  const isUpcoming = (o: Oppgave) => !!o.frist && o.frist.slice(0, 10) > today && o.status !== 'fullfort'

  const allToday    = oppgaver.filter(o => isToday(o) && o.status !== 'fullfort')
  const allUpcoming = oppgaver.filter(isUpcoming)
  const allOverdue  = oppgaver.filter(isOverdue)
  const allDone     = oppgaver.filter(o => o.status === 'fullfort')

  // Assignee filter
  const applyAssignee = (list: Oppgave[]) => {
    if (filterAssignee === 'alle') return list
    return list.filter(o => o.ansvarlig?.id === filterAssignee)
  }

  const tabTasks: Oppgave[] = applyAssignee(
    activeTab === 'today'    ? allToday :
    activeTab === 'upcoming' ? allUpcoming :
    activeTab === 'overdue'  ? allOverdue :
    allDone
  )

  const selectedProfile = profiles.find(p => p.id === filterAssignee)
  const assigneeLabel = filterAssignee === 'alle'
    ? 'Alle brukere'
    : selectedProfile?.navn ?? 'Ukjent'

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Oppgaver</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
            <span><span className="font-semibold text-slate-700">{allToday.length}</span> i dag</span>
            <span><span className="font-semibold text-slate-700">{allUpcoming.length}</span> kommende</span>
            {allOverdue.length > 0 && (
              <span className="text-red-600">
                <span className="font-semibold">{allOverdue.length}</span> forfalt
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Assignee dropdown */}
          <div className="relative" ref={assigneeDDRef}>
            <button
              onClick={() => setShowAssigneeDD(v => !v)}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <User className="w-4 h-4 text-slate-400" />
              <span>{assigneeLabel}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            {showAssigneeDD && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-lg shadow-lg z-50 py-1">
                <button
                  onClick={() => { setFilterAssignee('alle'); setShowAssigneeDD(false) }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${filterAssignee === 'alle' ? 'text-blue-600 font-medium' : 'text-slate-700'}`}
                >
                  Alle brukere
                </button>
                <div className="border-t border-slate-100 my-1" />
                {profiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setFilterAssignee(p.id); setShowAssigneeDD(false) }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors flex items-center gap-2 ${filterAssignee === p.id ? 'text-blue-600 font-medium' : 'text-slate-700'}`}
                  >
                    <Avatar name={p.navn} size="xs" />
                    {p.navn}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            Ny oppgave
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Mine oppgaver"
          value={oppgaver.filter(o => o.ansvarlig_id === user?.id && o.status !== 'fullfort').length}
          icon={<ListTodo size={18} color="#2563eb" />}
          iconColor="bg-blue-50 dark:bg-blue-900/30"
          loading={loading}
        />
        <StatCard
          label="I dag"
          value={allToday.length}
          icon={<Clock size={18} color="#d97706" />}
          iconColor="bg-orange-50 dark:bg-orange-900/30"
          loading={loading}
        />
        <StatCard
          label="Forfalt"
          value={allOverdue.length}
          icon={<AlertCircle size={18} color="#dc2626" />}
          iconColor="bg-red-50 dark:bg-red-900/30"
          loading={loading}
        />
        <StatCard
          label="Fullført"
          value={allDone.length}
          icon={<CheckCircle2 size={18} color="#16a34a" />}
          iconColor="bg-green-50 dark:bg-green-900/30"
          loading={loading}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <Tabs value={activeTab} onChange={v => { setActiveTab(v as TabKey); setOpenLogId(null) }}>
          <TabList className="px-2">
            <Tab value="today"    count={allToday.length}>I dag</Tab>
            <Tab value="upcoming" count={allUpcoming.length}>Kommende</Tab>
            <Tab value="overdue"  count={allOverdue.length}>Forfalt</Tab>
            <Tab value="fullfort" count={allDone.length}>Fullført</Tab>
          </TabList>
        </Tabs>

        {/* Quick add */}
        <div className="px-4 pt-4 pb-0">
          <QuickAddBar onAdded={loadOppgaver} currentUserId={user?.id ?? null} />
        </div>

        {/* Task list */}
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Laster oppgaver…</div>
        ) : tabTasks.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">Ingen oppgaver her</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {tabTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                openLogId={openLogId}
                setOpenLogId={setOpenLogId}
                currentUserNavn={user?.navn ?? 'Ukjent'}
                onReload={loadOppgaver}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

