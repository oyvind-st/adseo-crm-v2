// Source: Figma Make export — LeveranserList.mvp.tsx (Adseo CRM (1).zip)
// Adapted: mock data → Supabase, status keys mapped to DB values

import { useState, useEffect } from 'react';
import { Plus, Package, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { LeveranseRow } from '../shared';

// DB status → Figma status
const toFigmaStatus = (s: string) => {
  if (s === 'ikke_startet')    return 'not_started' as const;
  if (s === 'pagar')           return 'in_progress' as const;
  if (s === 'venter_pa_kunde') return 'waiting' as const;
  if (s === 'ferdig')          return 'completed' as const;
  return 'not_started' as const;
};

export function LeveranserListMVP() {
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState<'all' | 'not_started' | 'in_progress' | 'waiting' | 'completed'>('all');
  const [leveranser, setLeveranser] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('leveranser')
      .select('*, kunder(bedriftsnavn), leveranse_oppgaver(id, fullfort), ansvarlig:ansvarlig_id(navn)')
      .order('frist')
      .then(({ data }) => {
        if (data) {
          setLeveranser(data.map(l => {
            const tasks = l.leveranse_oppgaver || [];
            const done  = tasks.filter((t: any) => t.fullfort).length;
            const total = tasks.length;
            const pct   = total ? Math.round((done / total) * 100) : 0;
            return {
              id:               l.id,
              customer:         l.kunder?.bedriftsnavn || '—',
              type:             l.type || '',
              status:           toFigmaStatus(l.status),
              progress:         pct,
              tasksCompleted:   done,
              tasksTotal:       total,
              responsible:      l.ansvarlig?.navn || '',
              deadline:         l.frist
                ? new Date(l.frist).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' })
                : '',
              hasUnreadTickets: l.status !== 'ferdig' && l.frist && new Date(l.frist) < new Date(),
            };
          }));
        }
        setLoading(false);
      });
  }, []);

  const filteredLeveranser = leveranser.filter(l =>
    filterStatus === 'all' || l.status === filterStatus
  );

  const notStartedCount = leveranser.filter(l => l.status === 'not_started').length;
  const inProgressCount = leveranser.filter(l => l.status === 'in_progress').length;
  const waitingCount    = leveranser.filter(l => l.status === 'waiting').length;
  const completedCount  = leveranser.filter(l => l.status === 'completed').length;

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <p className="text-slate-400">Laster leveranser...</p>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leveranser</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{filteredLeveranser.length} aktive leveranser</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ny leveranse
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Package className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Ikke startet</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{notStartedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Pågår</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{inProgressCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Venter på kunde</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{waitingCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Ferdig</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          {([
            ['all',         `Alle (${leveranser.length})`],
            ['not_started', `Ikke startet (${notStartedCount})`],
            ['in_progress', `Pågår (${inProgressCount})`],
            ['waiting',     `Venter (${waitingCount})`],
            ['completed',   `Ferdig (${completedCount})`],
          ] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                filterStatus === key
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Leveranser List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filteredLeveranser.length === 0 ? (
            <div className="p-10 text-center text-sm text-slate-400">Ingen leveranser</div>
          ) : filteredLeveranser.map((leveranse) => (
            <LeveranseRow key={leveranse.id} {...leveranse} />
          ))}
        </div>
      </div>
    </div>
  );
}
