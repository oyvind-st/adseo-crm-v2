import { useState, useEffect, useRef, ReactNode } from 'react';
import {
  Plus, Package, Clock, CheckCircle2, AlertCircle, Search,
  Calendar, ChevronDown, ChevronRight, Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';

// ── Status config ──────────────────────────────────────────────────────────────
const DB_STATUS: Record<string, { label: string; dot: string; pill: string; border: string }> = {
  ikke_startet: {
    label:  'Ikke startet',
    dot:    'bg-slate-400',
    pill:   'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
    border: 'border-l-slate-300 dark:border-l-slate-600',
  },
  pagar: {
    label:  'Pågår',
    dot:    'bg-blue-500',
    pill:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    border: 'border-l-blue-500',
  },
  venter_pa_kunde: {
    label:  'Venter på kunde',
    dot:    'bg-amber-400',
    pill:   'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    border: 'border-l-amber-400',
  },
  ferdig: {
    label:  'Ferdig',
    dot:    'bg-green-500',
    pill:   'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    border: 'border-l-green-500',
  },
};

const STATUS_ORDER = ['pagar', 'ikke_startet', 'venter_pa_kunde', 'ferdig'];

function initials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' });
}


// ── Ny Leveranse Modal ─────────────────────────────────────────────────────────
const BLANK_FORM = {
  tittel: '', kunde_id: '', type: '', status: 'ikke_startet',
  ansvarlig_id: '', frist: '', beskrivelse: '',
};

function NyLeveranseModal({
  open, onClose, onSaved,
}: {
  open: boolean; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState(BLANK_FORM);
  const [kunder,   setKunder]   = useState<{ id: string; bedriftsnavn: string }[]>([]);
  const [profiles, setProfiles] = useState<{ id: string; navn: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    Promise.all([
      supabase.from('kunder').select('id, bedriftsnavn').order('bedriftsnavn'),
      supabase.from('profiles').select('id, navn').order('navn'),
    ]).then(([{ data: k }, { data: p }]) => {
      if (k) setKunder(k);
      if (p) setProfiles(p);
    });
  }, [open]);

  const handleClose = () => { setForm(BLANK_FORM); setError(''); onClose(); };

  const handleSave = async () => {
    if (!form.tittel.trim()) { setError('Tittel er påkrevd'); return; }
    setSaving(true);
    setError('');
    const { error: dbErr } = await supabase.from('leveranser').insert({
      tittel:       form.tittel.trim(),
      kunde_id:     form.kunde_id     || null,
      type:         form.type         || null,
      status:       form.status,
      ansvarlig_id: form.ansvarlig_id || null,
      frist:        form.frist || null,
      beskrivelse:  form.beskrivelse  || null,
    });
    setSaving(false);
    if (dbErr) { setError(dbErr.message); return; }
    onSaved();
    handleClose();
  };

  const inputCls = 'w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';

  function field(label: string, children: ReactNode, required = false) {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}{required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
        {children}
      </div>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Ny leveranse"
      description="Opprett en ny leveranse og knytt den til kunde og teammedlem."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={saving}>Avbryt</Button>
          <Button variant="primary" loading={saving} onClick={handleSave}>Opprett leveranse</Button>
        </>
      }
    >
      <div className="space-y-4">
        {field('Tittel', (
          <input
            className={inputCls}
            placeholder="Hva skal leveres?"
            value={form.tittel}
            onChange={e => setForm(f => ({ ...f, tittel: e.target.value }))}
            autoFocus
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
        ), true)}

        <div className="grid grid-cols-2 gap-4">
          {field('Kunde', (
            <select className={inputCls} value={form.kunde_id} onChange={e => setForm(f => ({ ...f, kunde_id: e.target.value }))}>
              <option value="">Velg kunde...</option>
              {kunder.map(k => <option key={k.id} value={k.id}>{k.bedriftsnavn}</option>)}
            </select>
          ))}
          {field('Type', (
            <input
              className={inputCls}
              placeholder="f.eks. SEO, Annonsering..."
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {field('Status', (
            <select className={inputCls} value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
              <option value="ikke_startet">Ikke startet</option>
              <option value="pagar">Pågår</option>
              <option value="venter_pa_kunde">Venter på kunde</option>
              <option value="ferdig">Ferdig</option>
            </select>
          ))}
          {field('Ansvarlig', (
            <select className={inputCls} value={form.ansvarlig_id} onChange={e => setForm(f => ({ ...f, ansvarlig_id: e.target.value }))}>
              <option value="">Velg ansvarlig...</option>
              {profiles.map(p => <option key={p.id} value={p.id}>{p.navn}</option>)}
            </select>
          ))}
        </div>

        {field('Frist (valgfri)', (
          <div className="relative">
            <div
              className={`${inputCls} flex items-center justify-between cursor-pointer`}
              onClick={() => dateRef.current?.showPicker()}
            >
              <span className={form.frist ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
                {form.frist
                  ? new Date(form.frist + 'T00:00:00').toLocaleDateString('no-NO', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : 'DD.MM.ÅÅÅÅ'}
              </span>
              <Calendar className="w-4 h-4 text-slate-400" />
            </div>
            <input
              ref={dateRef}
              type="date"
              className="absolute opacity-0 w-0 h-0 pointer-events-none"
              value={form.frist}
              onChange={e => setForm(f => ({ ...f, frist: e.target.value }))}
            />
          </div>
        ))}

        {field('Kommentar / beskrivelse', (
          <textarea
            className={`${inputCls} resize-none`}
            rows={3}
            placeholder="Legg til en beskrivelse eller kommentar..."
            value={form.beskrivelse}
            onChange={e => setForm(f => ({ ...f, beskrivelse: e.target.value }))}
          />
        ))}

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>
    </Modal>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export function LeveranserListMVP() {
  const navigate = useNavigate();
  const [leveranser, setLeveranser] = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [modalOpen,  setModalOpen]  = useState(false);
  const [collapsed,  setCollapsed]  = useState<Record<string, boolean>>({ ferdig: true });

  const fetchData = () => {
    supabase
      .from('leveranser')
      .select('*, kunder(bedriftsnavn), leveranse_oppgaver(id, fullfort), ansvarlig:ansvarlig_id(navn)')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setLeveranser(data);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const enriched = leveranser
    .map(l => {
      const tasks   = l.leveranse_oppgaver || [];
      const done    = tasks.filter((t: any) => t.fullfort).length;
      const total   = tasks.length;
      const pct     = total ? Math.round((done / total) * 100) : 0;
      const overdue = l.status !== 'ferdig' && l.frist && new Date(l.frist) < new Date();
      return { ...l, _done: done, _total: total, _pct: pct, _overdue: overdue };
    })
    .filter(l => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        (l.tittel || '').toLowerCase().includes(q) ||
        (l.kunder?.bedriftsnavn || '').toLowerCase().includes(q) ||
        (l.type || '').toLowerCase().includes(q)
      );
    });

  const byStatus: Record<string, any[]> = {};
  STATUS_ORDER.forEach(s => { byStatus[s] = enriched.filter(l => l.status === s); });

  const counts = {
    not_started: leveranser.filter(l => l.status === 'ikke_startet').length,
    in_progress: leveranser.filter(l => l.status === 'pagar').length,
    waiting:     leveranser.filter(l => l.status === 'venter_pa_kunde').length,
    completed:   leveranser.filter(l => l.status === 'ferdig').length,
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leveranser</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {counts.in_progress} aktive · {counts.completed} fullførte
          </p>
        </div>
        <Button
          variant="primary"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          Ny leveranse
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Ikke startet', value: counts.not_started, icon: <Package className="w-4 h-4 text-slate-500" />,       bg: 'bg-slate-50 dark:bg-slate-800/60' },
          { label: 'Pågår',        value: counts.in_progress, icon: <Clock className="w-4 h-4 text-blue-500" />,          bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Venter',       value: counts.waiting,     icon: <AlertCircle className="w-4 h-4 text-amber-500" />,   bg: 'bg-amber-50 dark:bg-amber-900/20' },
          { label: 'Ferdig',       value: counts.completed,   icon: <CheckCircle2 className="w-4 h-4 text-green-500" />,  bg: 'bg-green-50 dark:bg-green-900/20' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl border border-slate-200/80 dark:border-slate-700 p-4 flex items-center gap-3`}>
            {s.icon}
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
              <p className="text-xl font-semibold text-slate-900 dark:text-white">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Søk etter leveranse, kunde eller type..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_160px_160px_110px_110px] gap-4 px-5 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
          {['Leveranse', 'Status', 'Ansvarlig', 'Frist', 'Fremdrift'].map(h => (
            <span key={h} className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</span>
          ))}
        </div>

        {enriched.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            {search ? 'Ingen leveranser matcher søket.' : 'Ingen leveranser ennå.'}
          </div>
        ) : (
          STATUS_ORDER.map(statusKey => {
            const group = byStatus[statusKey];
            if (group.length === 0) return null;
            const cfg       = DB_STATUS[statusKey];
            const isCollapsed = collapsed[statusKey];

            return (
              <div key={statusKey}>
                {/* Group header */}
                <button
                  onClick={() => setCollapsed(c => ({ ...c, [statusKey]: !c[statusKey] }))}
                  className="w-full flex items-center gap-2 px-5 py-2.5 bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/40 transition-colors text-left"
                >
                  {isCollapsed
                    ? <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    : <ChevronDown  className="w-3.5 h-3.5 text-slate-400" />
                  }
                  <span className={`w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0`} />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{cfg.label}</span>
                  <span className="ml-1 text-xs text-slate-400 bg-slate-200 dark:bg-slate-700 rounded-full px-2 py-0.5 font-medium leading-none">{group.length}</span>
                </button>

                {/* Rows */}
                {!isCollapsed && group.map((l, idx) => (
                  <div
                    key={l.id}
                    onClick={() => navigate(`/leveranser/${l.id}`)}
                    className={`grid grid-cols-[1fr_160px_160px_110px_110px] gap-4 items-center px-5 py-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-l-2 ${cfg.border} ${idx < group.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''}`}
                  >
                    {/* Name */}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {l.tittel || l.kunder?.bedriftsnavn || '—'}
                      </p>
                      {l.tittel && l.kunder?.bedriftsnavn && (
                        <p className="text-xs text-slate-400 truncate mt-0.5">{l.kunder.bedriftsnavn}</p>
                      )}
                      {l.type && (
                        <span className="inline-flex mt-1 px-1.5 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-medium">
                          {l.type}
                        </span>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
                        {cfg.label}
                      </span>
                    </div>

                    {/* Ansvarlig */}
                    <div>
                      {l.ansvarlig?.navn ? (
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                            {initials(l.ansvarlig.navn)}
                          </div>
                          <span className="text-sm text-slate-600 dark:text-slate-300 truncate">{l.ansvarlig.navn}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </div>

                    {/* Frist */}
                    <div>
                      {l.frist ? (
                        <span className={`flex items-center gap-1.5 text-sm ${l._overdue ? 'text-red-600 dark:text-red-400 font-medium' : 'text-slate-600 dark:text-slate-400'}`}>
                          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                          {formatDate(l.frist)}
                        </span>
                      ) : (
                        <span className="text-sm text-slate-300 dark:text-slate-600">—</span>
                      )}
                    </div>

                    {/* Fremdrift */}
                    <div>
                      {l._total > 0 ? (
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{l._pct}%</span>
                            <span className="text-xs text-slate-400">{l._done}/{l._total}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all"
                              style={{ width: `${l._pct}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 dark:text-slate-600">Ingen oppgaver</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            );
          })
        )}

        {/* Inline add row */}
        <button
          onClick={() => setModalOpen(true)}
          className="w-full flex items-center gap-2 px-5 py-3.5 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors border-t border-slate-100 dark:border-slate-700/50"
        >
          <Plus className="w-4 h-4" />
          Legg til leveranse
        </button>
      </div>

      <NyLeveranseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchData}
      />
    </div>
  );
}
