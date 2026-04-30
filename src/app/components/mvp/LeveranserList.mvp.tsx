// Direct translation of Figma Make export: leveranser/page.tsx
// CSS class → Tailwind mappings from globals.css:
//   .stat-card           → bg-white rounded-xl p-5 border border-slate-200
//   .tab-list            → flex border-b border-slate-200 px-5
//   .tab                 → px-5 py-2.5 text-sm text-slate-500 border-b-2 border-transparent
//   .tab.active          → text-violet-700 border-violet-700 font-medium
//   .badge               → inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
//   .badge-gray          → bg-slate-100 text-slate-600
//   .badge-blue          → bg-blue-100 text-blue-700
//   .badge-yellow        → bg-yellow-100 text-yellow-700
//   .badge-green         → bg-green-100 text-green-700
//   .badge-red           → bg-red-100 text-red-600
//   .progress-bar        → h-1 bg-slate-200 rounded-full overflow-hidden
//   .progress-fill       → h-full bg-violet-600 rounded-full
//   .btn-primary         → bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ArrowRight } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

const STATUS_LABEL: Record<string, string> = {
  ikke_startet: 'Ikke startet', pagar: 'Pågår',
  venter_pa_kunde: 'Venter på kunde', ferdig: 'Ferdig'
}

// .badge-* classes from globals.css
const STATUS_BADGE: Record<string, string> = {
  ikke_startet:    'bg-slate-100 text-slate-600',
  pagar:           'bg-blue-100 text-blue-700',
  venter_pa_kunde: 'bg-yellow-100 text-yellow-700',
  ferdig:          'bg-green-100 text-green-700',
}

const TABS = ['Alle', 'Ikke startet', 'Pågår', 'Venter', 'Ferdig']

export function LeveranserListMVP() {
  const [leveranser, setLeveranser] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('Alle')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.from('leveranser')
      .select('*, kunder(bedriftsnavn), leveranse_oppgaver(id,fullfort)')
      .order('frist')
      .then(({ data }) => { setLeveranser(data || []); setLoading(false) })
  }, [])

  const getProgress = (l: any) => {
    const tasks = l.leveranse_oppgaver || []
    if (tasks.length === 0) return 0
    return Math.round((tasks.filter((t: any) => t.fullfort).length / tasks.length) * 100)
  }

  const filtered = leveranser.filter(l => {
    if (activeTab === 'Alle') return true
    if (activeTab === 'Ikke startet') return l.status === 'ikke_startet'
    if (activeTab === 'Pågår') return l.status === 'pagar'
    if (activeTab === 'Venter') return l.status === 'venter_pa_kunde'
    if (activeTab === 'Ferdig') return l.status === 'ferdig'
    return true
  })

  return (
    // style={{ padding: 32 }}
    <div className="p-8 dark:bg-slate-900 min-h-full">

      {/* Header — style={{ display:'flex', justifyContent:'space-between', ... marginBottom:24 }} */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leveranser</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {leveranser.filter(l => l.status !== 'ferdig').length} aktive leveranser
          </p>
        </div>
        {/* .btn-primary → bg-violet-700 */}
        <button className="bg-violet-700 hover:bg-violet-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors">
          <Plus size={16} /> Ny leveranse
        </button>
      </div>

      {/* Stat cards — gridTemplateColumns: 'repeat(4,1fr)', gap:16, marginBottom:24 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {(['ikke_startet', 'pagar', 'venter_pa_kunde', 'ferdig'] as const).map(s => (
          // .stat-card style={{ padding: '16px 20px' }}
          <div key={s} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-5 py-4">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">{STATUS_LABEL[s]}</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {leveranser.filter(l => l.status === s).length}
            </div>
          </div>
        ))}
      </div>

      {/* Main card — .stat-card style={{ padding:0, overflow:'hidden' }} */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">

        {/* .tab-list style={{ padding: '0 20px' }} */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 px-5">
          {TABS.map(t => (
            // .tab / .tab.active → violet active
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2.5 text-sm whitespace-nowrap border-b-2 transition-all ${
                activeTab === t
                  ? 'text-violet-700 dark:text-violet-400 border-violet-700 dark:border-violet-400 font-medium'
                  : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {loading
          ? <div className="p-8 text-center text-sm text-slate-400">Laster...</div>
          : filtered.length === 0
          ? <div className="p-8 text-center text-sm text-slate-400">Ingen leveranser</div>
          : filtered.map(l => {
              const progress = getProgress(l)
              const total = (l.leveranse_oppgaver || []).length
              const done  = (l.leveranse_oppgaver || []).filter((t: any) => t.fullfort).length

              return (
                // style={{ padding: '18px 20px', borderBottom: '1px solid #f3f4f6' }}
                <div
                  key={l.id}
                  onClick={() => navigate(`/leveranser/${l.id}`)}
                  className="px-5 py-[18px] border-b border-slate-100 dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer"
                >
                  {/* style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }} */}
                  <div className="flex items-center justify-between mb-2.5">

                    {/* LEFT — style={{ display:'flex', alignItems:'center', gap:10 }} */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* style={{ width:36, height:36, background:'#ede9fe', borderRadius:8, ... }} */}
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                        style={{ background: '#ede9fe' }}>
                        📦
                      </div>
                      <div className="min-w-0">
                        {/* style={{ fontWeight:500, fontSize:14 }} */}
                        <div className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {l.kunder?.bedriftsnavn}
                        </div>
                        {/* style={{ fontSize:12, color:'#9ca3af' }} */}
                        <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                          {l.tittel}{l.type ? ` · ${l.type}` : ''}
                        </div>
                      </div>
                      {/* .badge.badge-red when overdue + incomplete tasks */}
                      {l.leveranse_oppgaver?.some((t: any) => !t.fullfort) && l.frist && new Date(l.frist) < new Date() && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600 flex-shrink-0">
                          Nye tickets
                        </span>
                      )}
                    </div>

                    {/* RIGHT — style={{ display:'flex', alignItems:'center', gap:12 }} */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* style={{ fontSize:12, color:'#9ca3af' }} */}
                      <span className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
                        {total > 0 ? `${done} av ${total} oppgaver` : ''}
                        {l.frist ? `${total > 0 ? ' · ' : ''}Frist: ${new Date(l.frist).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })}` : ''}
                      </span>
                      {/* .badge .badge-* */}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE[l.status] || STATUS_BADGE.ikke_startet}`}>
                        {STATUS_LABEL[l.status]}
                      </span>
                      {/* ArrowRight size={14} color="#9ca3af" */}
                      <ArrowRight size={14} className="text-slate-400 dark:text-slate-500" />
                    </div>
                  </div>

                  {/* .progress-bar → h-1 bg-slate-200 rounded-full overflow-hidden */}
                  <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    {/* .progress-fill → bg-violet-600 */}
                    <div
                      className="h-full bg-violet-600 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {/* style={{ fontSize:11, color:'#9ca3af', marginTop:4, textAlign:'right' }} */}
                  <div className="text-xs text-slate-400 dark:text-slate-500 mt-1 text-right">
                    {progress}%
                  </div>
                </div>
              )
            })
        }
      </div>
    </div>
  )
}
