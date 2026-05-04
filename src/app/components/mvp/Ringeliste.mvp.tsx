import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Phone, PhoneCall, PhoneOff, Building2, Calendar, MapPin, Users,
  CheckCircle, XCircle, Clock, MessageSquare, ArrowRight, Plus,
  ExternalLink, Globe, Mail, RefreshCw, Filter, ChevronDown,
  TrendingUp, BarChart3, User as UserIcon
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useCurrentUser } from '../../contexts/UserContext'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Kontakt = { navn: string; rolle: string; fodselsdato?: string }

type RingeRow = {
  id: string
  orgnr: string
  bedriftsnavn: string
  bransje_kode: string | null
  bransje_navn: string | null
  kommune: string | null
  ansatte: number | null
  registrert_dato: string | null
  stage: string | null
  kontaktperson_navn: string | null
  kontaktperson_rolle: string | null
  kontaktpersoner: Kontakt[] | null
  tildelt_bruker_id: string | null
  hjemmeside?: string | null
  telefon?: string | null
  epost?: string | null
}

type Profile = { id: string; navn: string; epost: string }

type Outcome = 'svar' | 'beskjed' | 'ikke_svar' | 'callback' | 'kunde' | 'ikke_interessert'

const OUTCOME_LABEL: Record<Outcome, string> = {
  svar: 'Snakket med',
  beskjed: 'La beskjed',
  ikke_svar: 'Ikke svar',
  callback: 'Avtalt callback',
  kunde: 'Ble kunde',
  ikke_interessert: 'Ikke interessert',
}

const OUTCOME_COLOR: Record<Outcome, string> = {
  svar: 'bg-blue-600 hover:bg-blue-700',
  beskjed: 'bg-slate-600 hover:bg-slate-700',
  ikke_svar: 'bg-slate-500 hover:bg-slate-600',
  callback: 'bg-amber-600 hover:bg-amber-700',
  kunde: 'bg-green-600 hover:bg-green-700',
  ikke_interessert: 'bg-rose-600 hover:bg-rose-700',
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatTel(num?: string | null): string {
  if (!num) return ''
  const digits = num.replace(/\D/g, '')
  if (!digits) return num
  if (digits.startsWith('47') && digits.length === 10) return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7)}`
  if (digits.length === 8) return `${digits.slice(0, 3)} ${digits.slice(3, 5)} ${digits.slice(5)}`
  return num
}

function telHref(num?: string | null): string {
  if (!num) return ''
  return 'tel:' + num.replace(/\s/g, '')
}

function elapsedSec(start: number | null): number {
  if (!start) return 0
  return Math.max(0, Math.floor((Date.now() - start) / 1000))
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = (sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function startOfDayISO(): string {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function startOfWeekISO(): string {
  const d = new Date()
  const day = d.getDay() || 7
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - (day - 1))
  return d.toISOString()
}

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
export function RingelisteMVP() {
  const navigate = useNavigate()
  const { user } = useCurrentUser()

  const [rows, setRows] = useState<RingeRow[]>([])
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [callStart, setCallStart] = useState<number | null>(null)
  const [callTick, setCallTick] = useState(0)
  const [notat, setNotat] = useState('')
  const [callbackDato, setCallbackDato] = useState('')
  const [savingOutcome, setSavingOutcome] = useState<Outcome | null>(null)

  // filters
  const [brukerFilter, setBrukerFilter] = useState<'min' | 'alle' | string>('min')
  const [searchQ, setSearchQ] = useState('')

  // stats
  const [statsToday, setStatsToday] = useState({ totalt: 0, svar: 0, kunde: 0 })
  const [statsWeek, setStatsWeek] = useState({ totalt: 0, kunde: 0 })

  // call timer tick
  useEffect(() => {
    if (!callStart) return
    const t = setInterval(() => setCallTick(x => x + 1), 1000)
    return () => clearInterval(t)
  }, [callStart])

  // Load profiles for filter
  useEffect(() => {
    supabase.from('profiles').select('id, navn, epost').order('navn').then(({ data }) => {
      setProfiles((data || []) as Profile[])
    })
  }, [])

  // Load ringeliste
  const loadRows = useCallback(async () => {
    setLoading(true)
    let q = supabase
      .from('ringeliste')
      .select('*')
      .limit(500)

    if (brukerFilter === 'min' && user?.id) {
      // Show rows assigned to me OR unassigned
      q = q.or(`tildelt_bruker_id.eq.${user.id},tildelt_bruker_id.is.null`)
    } else if (brukerFilter !== 'alle' && brukerFilter !== 'min') {
      q = q.eq('tildelt_bruker_id', brukerFilter)
    }

    const { data, error } = await q
    if (error) {
      console.error('ringeliste load failed', error)
      setRows([])
    } else {
      setRows((data || []) as RingeRow[])
    }
    setLoading(false)
  }, [brukerFilter, user?.id])

  useEffect(() => { loadRows() }, [loadRows])

  // Load stats
  const loadStats = useCallback(async () => {
    if (!user?.id) return
    const today = startOfDayISO()
    const week = startOfWeekISO()
    const [{ data: todayLogs }, { data: weekLogs }] = await Promise.all([
      supabase.from('ringelogg').select('utfall').eq('bruker_id', user.id).gte('opprettet_at', today),
      supabase.from('ringelogg').select('utfall').eq('bruker_id', user.id).gte('opprettet_at', week),
    ])
    const t = todayLogs || []
    const w = weekLogs || []
    setStatsToday({
      totalt: t.length,
      svar: t.filter((r: any) => r.utfall === 'svar' || r.utfall === 'kunde').length,
      kunde: t.filter((r: any) => r.utfall === 'kunde').length,
    })
    setStatsWeek({
      totalt: w.length,
      kunde: w.filter((r: any) => r.utfall === 'kunde').length,
    })
  }, [user?.id])

  useEffect(() => { loadStats() }, [loadStats])

  // Filter rows by search
  const visibleRows = useMemo(() => {
    if (!searchQ.trim()) return rows
    const q = searchQ.toLowerCase()
    return rows.filter(r =>
      r.bedriftsnavn?.toLowerCase().includes(q) ||
      r.orgnr?.includes(q) ||
      r.kommune?.toLowerCase().includes(q) ||
      r.kontaktperson_navn?.toLowerCase().includes(q)
    )
  }, [rows, searchQ])

  const activeRow = useMemo(() => rows.find(r => r.id === activeId) || null, [rows, activeId])

  const startCall = (row: RingeRow) => {
    setActiveId(row.id)
    setCallStart(Date.now())
    setNotat('')
    setCallbackDato('')
    setCallTick(0)
  }

  const cancelCall = () => {
    setActiveId(null)
    setCallStart(null)
    setNotat('')
    setCallbackDato('')
  }

  const saveOutcome = async (utfall: Outcome) => {
    if (!activeRow || !user?.id) return
    if (utfall === 'callback' && !callbackDato) {
      alert('Velg en dato/tid for callback')
      return
    }
    setSavingOutcome(utfall)
    try {
      const sec = elapsedSec(callStart)
      const { error: logErr } = await supabase.from('ringelogg').insert({
        ringeliste_id: activeRow.id,
        org_nummer: activeRow.orgnr,
        bedriftsnavn: activeRow.bedriftsnavn,
        bruker_id: user.id,
        utfall,
        notat: notat || null,
        callback_dato: utfall === 'callback' ? callbackDato : null,
        varighet_sek: sec || null,
      })
      if (logErr) {
        alert('Kunne ikke lagre ringelogg: ' + logErr.message)
        return
      }

      // Update ringeliste.stage based on outcome
      const stageMap: Record<Outcome, string> = {
        svar: 'kontaktet',
        beskjed: 'beskjed_lagt',
        ikke_svar: 'ny_lead',
        callback: 'callback',
        kunde: 'konvertert',
        ikke_interessert: 'avvist',
      }
      const upd: Record<string, unknown> = {
        stage: stageMap[utfall],
        sist_kontaktet: new Date().toISOString(),
      }
      const { error: updErr } = await supabase.from('ringeliste').update(upd).eq('id', activeRow.id)
      if (updErr && /sist_kontaktet/i.test(updErr.message)) {
        await supabase.from('ringeliste').update({ stage: stageMap[utfall] }).eq('id', activeRow.id)
      }

      // If "ble kunde" → create kundekort and navigate
      if (utfall === 'kunde') {
        const ins: Record<string, unknown> = {
          bedriftsnavn: activeRow.bedriftsnavn,
          juridisk_navn: activeRow.bedriftsnavn,
          org_nummer: activeRow.orgnr,
          sted: activeRow.kommune,
          kunde_status: 'lead',
          kilde: 'ringeliste',
          opprettet_av: user.id,
          tildelt_bruker_id: user.id,
        }
        const { data: kunde } = await supabase.from('kunder').insert(ins).select('id').single()
        if (kunde?.id) {
          const ks = (activeRow.kontaktpersoner || []).slice(0, 3).map((k, i) => ({
            kunde_id: kunde.id,
            navn: k.navn,
            tittel: k.rolle,
            telefon: activeRow.telefon || null,
            epost: activeRow.epost || null,
            er_primaer: i === 0,
          }))
          if (ks.length > 0) await supabase.from('kontakter').insert(ks)
          await loadStats()
          await loadRows()
          cancelCall()
          navigate(`/customers/${kunde.id}`)
          return
        }
      }

      await loadStats()
      await loadRows()
      cancelCall()
    } catch (e) {
      alert('Feil: ' + String(e))
    } finally {
      setSavingOutcome(null)
    }
  }

  const reassignTo = async (row: RingeRow, brukerId: string | null) => {
    await supabase.from('ringeliste').update({ tildelt_bruker_id: brukerId }).eq('id', row.id)
    await loadRows()
  }

  const removeFromRingeliste = async (row: RingeRow) => {
    if (!confirm(`Fjerne ${row.bedriftsnavn} fra ringelisten?`)) return
    await supabase.from('ringeliste').delete().eq('id', row.id)
    if (activeId === row.id) cancelCall()
    await loadRows()
  }

  const navnLookup = useMemo(() => {
    const m = new Map<string, string>()
    profiles.forEach(p => m.set(p.id, p.navn))
    return m
  }, [profiles])

  // ─────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────
  return (
    <div className="p-6 space-y-4 min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ringeliste</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1 text-sm">
            {visibleRows.length} bedrifter klare for ringing
          </p>
        </div>
        <button
          onClick={() => { loadRows(); loadStats() }}
          className="px-3 py-2 text-sm border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-200"
        >
          <RefreshCw className="w-4 h-4" /> Oppdater
        </button>
      </div>

      {/* Stats stripe */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard icon={<Phone className="w-5 h-5" />} label="Samtaler i dag" value={statsToday.totalt} accent="blue" />
        <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Snakket med (i dag)" value={statsToday.svar} accent="emerald" />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Konverteringer (uke)" value={statsWeek.kunde} accent="amber" />
        <StatCard icon={<BarChart3 className="w-5 h-5" />} label="Totalt (uke)" value={statsWeek.totalt} accent="slate" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
        <Filter className="w-4 h-4 text-slate-500" />
        <select
          value={brukerFilter}
          onChange={e => setBrukerFilter(e.target.value)}
          className="text-sm bg-transparent border-0 focus:outline-none text-slate-700 dark:text-slate-200"
        >
          <option value="min">Mine + uten eier</option>
          <option value="alle">Alle ({rows.length})</option>
          {profiles.map(p => (
            <option key={p.id} value={p.id}>{p.navn}</option>
          ))}
        </select>
        <div className="flex-1" />
        <input
          type="search"
          value={searchQ}
          onChange={e => setSearchQ(e.target.value)}
          placeholder="Søk bedrift, orgnr, kommune…"
          className="px-3 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-100 w-72"
        />
      </div>

      {/* Split-screen */}
      <div className="grid grid-cols-12 gap-4 min-h-[60vh]">
        {/* List */}
        <div className="col-span-7 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200">
            Neste i køen
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-slate-500">Laster…</div>
          ) : visibleRows.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Ingen bedrifter i ringelisten med disse filtrene.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[70vh] overflow-y-auto">
              {visibleRows.map((row, i) => (
                <RingeRowCard
                  key={row.id}
                  row={row}
                  index={i}
                  active={row.id === activeId}
                  onCall={() => startCall(row)}
                  onReassign={(uid) => reassignTo(row, uid)}
                  onRemove={() => removeFromRingeliste(row)}
                  profiles={profiles}
                  navnLookup={navnLookup}
                />
              ))}
            </div>
          )}
        </div>

        {/* Cockpit */}
        <div className="col-span-5">
          {activeRow ? (
            <CallCockpit
              row={activeRow}
              callStart={callStart}
              tick={callTick}
              notat={notat}
              setNotat={setNotat}
              callbackDato={callbackDato}
              setCallbackDato={setCallbackDato}
              onCancel={cancelCall}
              onOutcome={saveOutcome}
              savingOutcome={savingOutcome}
            />
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 h-full flex items-center justify-center p-8">
              <div className="text-center max-w-xs">
                <Phone className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Velg en bedrift fra listen for å starte en samtale.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
                  Når du trykker «Ring», åpnes telefon-app via tel:-link og timer/notat aktiveres her.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Stat card
// ─────────────────────────────────────────────
function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number; accent: 'blue' | 'emerald' | 'amber' | 'slate' }) {
  const accentBg: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  }
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${accentBg[accent]}`}>
          {icon}
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Row card
// ─────────────────────────────────────────────
function RingeRowCard({
  row, index, active, onCall, onReassign, onRemove, profiles, navnLookup
}: {
  row: RingeRow
  index: number
  active: boolean
  onCall: () => void
  onReassign: (uid: string | null) => void
  onRemove: () => void
  profiles: Profile[]
  navnLookup: Map<string, string>
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!menuOpen) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [menuOpen])

  const eierNavn = row.tildelt_bruker_id ? navnLookup.get(row.tildelt_bruker_id) || '—' : 'Ikke tildelt'

  return (
    <div className={`p-4 transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-semibold flex items-center justify-center shrink-0">
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-semibold text-slate-900 dark:text-white truncate">{row.bedriftsnavn}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-slate-600 dark:text-slate-400">
                {row.bransje_navn && <span className="truncate">{row.bransje_navn}</span>}
                {row.kommune && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {row.kommune}
                  </span>
                )}
                {typeof row.ansatte === 'number' && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {row.ansatte}
                  </span>
                )}
              </div>
              {row.kontaktperson_navn && (
                <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  <span className="font-medium">{row.kontaktperson_navn}</span>
                  {row.kontaktperson_rolle && (
                    <span className="text-slate-500 dark:text-slate-400"> — {row.kontaktperson_rolle}</span>
                  )}
                </div>
              )}
              <div className="mt-2 flex items-center gap-2 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {row.stage || 'ny_lead'}
                </span>
                <span className="text-slate-500 dark:text-slate-500">
                  Eier: {eierNavn}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <button
                onClick={onCall}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" /> Ring
              </button>
              <div className="relative" ref={ref}>
                <button
                  onClick={() => setMenuOpen(o => !o)}
                  className="px-2 py-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Mer ▾
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-1 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-lg z-10 py-1 text-sm">
                    <div className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                      Tildel til
                    </div>
                    <button
                      onClick={() => { onReassign(null); setMenuOpen(false) }}
                      className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                    >
                      Ikke tildelt
                    </button>
                    {profiles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => { onReassign(p.id); setMenuOpen(false) }}
                        className="w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        {p.navn}
                      </button>
                    ))}
                    <div className="border-t border-slate-200 dark:border-slate-700 my-1" />
                    <button
                      onClick={() => { onRemove(); setMenuOpen(false) }}
                      className="w-full text-left px-3 py-1.5 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400"
                    >
                      Fjern fra ringeliste
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Cockpit
// ─────────────────────────────────────────────
function CallCockpit({
  row, callStart, tick, notat, setNotat, callbackDato, setCallbackDato, onCancel, onOutcome, savingOutcome
}: {
  row: RingeRow
  callStart: number | null
  tick: number
  notat: string
  setNotat: (s: string) => void
  callbackDato: string
  setCallbackDato: (s: string) => void
  onCancel: () => void
  onOutcome: (u: Outcome) => void
  savingOutcome: Outcome | null
}) {
  // tick is included to force re-render every second
  void tick
  const sec = elapsedSec(callStart)
  const tel = row.telefon || (row.kontaktpersoner && row.kontaktpersoner.length > 0 ? null : null)
  const kontakter = row.kontaktpersoner || []

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Aktiv samtale</span>
          <span className="text-xs text-slate-500 ml-2 tabular-nums">{formatDuration(sec)}</span>
        </div>
        <button onClick={onCancel} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
          Avbryt
        </button>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        {/* Company header */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{row.bedriftsnavn}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Org.nr {row.orgnr}
            {row.bransje_navn && ` • ${row.bransje_navn}`}
          </p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs">
            <a href={`https://w2.brreg.no/enhet/sok/detalj.jsp?orgnr=${row.orgnr}`} target="_blank" rel="noopener noreferrer"
               className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Brreg
            </a>
            <a href={`https://www.proff.no/bransjes%C3%B8k?q=${row.orgnr}`} target="_blank" rel="noopener noreferrer"
               className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              <ExternalLink className="w-3 h-3" /> Proff
            </a>
            {row.hjemmeside && (
              <a href={row.hjemmeside.startsWith('http') ? row.hjemmeside : `https://${row.hjemmeside}`} target="_blank" rel="noopener noreferrer"
                 className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <Globe className="w-3 h-3" /> Hjemmeside
              </a>
            )}
          </div>
        </div>

        {/* Contacts */}
        {kontakter.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5">Kontakter</p>
            <div className="space-y-1.5">
              {kontakter.slice(0, 4).map((k, i) => (
                <div key={i} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-slate-50 dark:bg-slate-800">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800 dark:text-slate-100 truncate">{k.navn}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{k.rolle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Phone */}
        {tel && (
          <a
            href={telHref(tel)}
            className="block w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-center rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> {formatTel(tel)}
          </a>
        )}
        {!tel && (
          <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded px-3 py-2">
            Ingen telefonnummer registrert. Slå opp via Brreg/Proff lenkene over.
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 block">Notat</label>
          <textarea
            value={notat}
            onChange={e => setNotat(e.target.value)}
            placeholder="Hva ble sagt? Innvendinger, neste skritt …"
            rows={4}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Callback date */}
        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 block flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Callback (valgfritt)
          </label>
          <input
            type="datetime-local"
            value={callbackDato}
            onChange={e => setCallbackDato(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Outcome buttons */}
      <div className="border-t border-slate-200 dark:border-slate-800 p-3 grid grid-cols-2 gap-2">
        {(Object.keys(OUTCOME_LABEL) as Outcome[]).map(u => (
          <button
            key={u}
            onClick={() => onOutcome(u)}
            disabled={savingOutcome !== null}
            className={`px-3 py-2 text-white text-sm rounded-md font-medium transition-opacity disabled:opacity-50 ${OUTCOME_COLOR[u]}`}
          >
            {savingOutcome === u ? 'Lagrer…' : OUTCOME_LABEL[u]}
          </button>
        ))}
      </div>
    </div>
  )
}

export default RingelisteMVP
