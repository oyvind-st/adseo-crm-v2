import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Phone, PhoneCall, Building2, Calendar, MapPin, Users,
  CheckCircle, Clock, ArrowRight, Plus, Trash2,
  ExternalLink, Globe, Filter, RefreshCw, X,
  TrendingUp, BarChart3, AlertCircle, ChevronDown, ChevronUp,
  Briefcase, FileCheck, Mail, Loader2
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { useCurrentUser } from '../../contexts/UserContext'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type Kontakt = {
  navn: string
  rolle: string
  telefon?: string | null
  epost?: string | null
  fodselsdato?: string
}

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
  status: string | null
  kontaktperson_navn: string | null
  kontaktperson_rolle: string | null
  kontaktpersoner: Kontakt[] | null
  tildelt_bruker_id: string | null
  telefon?: string | null
  epost?: string | null
  hjemmeside?: string | null
  antall_forsok: number | null
  siste_ring_dato: string | null
}

type Profile = { id: string; navn: string; epost: string }

type Outcome = 'snakket' | 'mote' | 'callback' | 'kunde' | 'ikke_svar' | 'ikke_interessert'

const OUTCOME_LABEL: Record<Outcome, string> = {
  snakket: 'Snakket med',
  mote: 'Booket møte',
  callback: 'Avtalt callback',
  kunde: 'Ble kunde',
  ikke_svar: 'Ikke svar',
  ikke_interessert: 'Ikke interessert',
}

const OUTCOME_COLOR: Record<Outcome, string> = {
  snakket: 'bg-blue-600 hover:bg-blue-700',
  mote: 'bg-purple-600 hover:bg-purple-700',
  callback: 'bg-amber-600 hover:bg-amber-700',
  kunde: 'bg-green-600 hover:bg-green-700',
  ikke_svar: 'bg-slate-500 hover:bg-slate-600',
  ikke_interessert: 'bg-rose-600 hover:bg-rose-700',
}

// Outcomes som lager kundekort + oppgave
const KUNDE_OUTCOMES: Outcome[] = ['snakket', 'mote', 'callback', 'kunde']

// Default antall dager til oppgavens frist for hvert utfall
const DEFAULT_OPPGAVE_DAGER: Partial<Record<Outcome, number>> = {
  snakket: 7,
  mote: 1,
  callback: 7,
  kunde: 3,
}

const OPPGAVE_TITTEL: Partial<Record<Outcome, (navn: string) => string>> = {
  snakket: (n) => `Følg opp samtale med ${n}`,
  mote: (n) => `Forbered møte med ${n}`,
  callback: (n) => `Ring ${n} tilbake`,
  kunde: (n) => `Onboard ${n}`,
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

function plusDays(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() + n)
  // Strip seconds for datetime-local
  d.setSeconds(0, 0)
  return d.toISOString().slice(0, 16)
}

function daysSince(iso?: string | null): number | null {
  if (!iso) return null
  const t = new Date(iso).getTime()
  return Math.floor((Date.now() - t) / (1000 * 60 * 60 * 24))
}

function formatRelative(iso?: string | null): string | null {
  const days = daysSince(iso)
  if (days === null) return null
  if (days === 0) return 'i dag'
  if (days === 1) return 'i går'
  if (days < 7) return `${days} dager siden`
  if (days < 30) return `${Math.floor(days / 7)} uker siden`
  return `${Math.floor(days / 30)} mnd siden`
}

// ─────────────────────────────────────────────
// Brreg-roller — henter live kontaktpersoner med riktig prioritet.
// Speiler logikken i Prospects.mvp.tsx slik at Ringeliste alltid har
// oppdaterte roller (DAGL → INNH → KOMP → … → LEDE som siste fallback)
// uavhengig av hva som ble lagret i ringeliste.kontaktpersoner.
// ─────────────────────────────────────────────
const KONTAKT_PRIORITET: Record<string, number> = {
  DAGL: 1, INNH: 2, KOMP: 3, DTPR: 4, BSTV: 5, KONT: 6, FFGM: 7,
  POHV: 10, POFL: 20,
  // Tier 2 — fallback når ingen Tier-1 finnes
  LEDE: 50, NEST: 51,
  // Tier 3 — siste fallback for små selskap
  MEDL: 60,
}

interface BrregFullmaktData {
  fritekst?: string
  alenePersoner: Set<string>
  fellesPersoner: Set<string>
  personer: Array<{ key: string; navn: string; fodselsdato?: string; rolleKode: string; rolleTekst: string; alene: boolean }>
}

interface BrregKontakt {
  kode: string
  rolle: string
  navn: string
  fodselsdato?: string
  prioritet: number
  signaturAlene: boolean
  signaturFellesskap: boolean
  prokuraAlene: boolean
  prokuraFellesskap: boolean
}

function normFodselsdato(s?: string): string {
  if (!s) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(s)
  return m ? `${m[3]}-${m[2]}-${m[1]}` : s
}
function pkey(navn: string, fodselsdato?: string): string {
  const n = navn.trim().toLowerCase().replace(/\s+/g, ' ')
  return `${n}|${normFodselsdato(fodselsdato)}`
}

async function fetchFullmaktData(orgnr: string, type: 'signatur' | 'prokura'): Promise<BrregFullmaktData> {
  const empty: BrregFullmaktData = { alenePersoner: new Set(), fellesPersoner: new Set(), personer: [] }
  try {
    const resp = await fetch(`/api/brreg-fullmakt?orgnr=${encodeURIComponent(orgnr)}&type=${type}`,
      { headers: { Accept: 'application/json' } })
    if (!resp.ok) return empty
    const data = await resp.json()
    const grunnlag = data.signeringsGrunnlag
    if (!grunnlag) return empty
    const out: BrregFullmaktData = {
      fritekst: grunnlag.signaturProkuraRoller?.signaturProkuraFritekst,
      alenePersoner: new Set(), fellesPersoner: new Set(), personer: []
    }
    const seen = new Set<string>()
    for (const kombi of (data.signeringsKombinasjon?.kombinasjon || [])) {
      const personer = kombi.personRolleKombinasjon || []
      const alene = personer.length === 1
      const target = alene ? out.alenePersoner : out.fellesPersoner
      for (const p of personer) {
        const dob = normFodselsdato(p.fodselsdato)
        const key = pkey(p.navn, dob)
        target.add(key)
        if (!seen.has(key)) {
          seen.add(key)
          out.personer.push({
            key, navn: p.navn, fodselsdato: dob || undefined,
            rolleKode: p.rolle?.kode || '',
            rolleTekst: p.rolle?.tekstforklaring || p.rolle?.kode || '',
            alene
          })
        }
      }
    }
    return out
  } catch {
    return empty
  }
}

async function fetchBrregKontakter(orgnr: string): Promise<BrregKontakt[]> {
  try {
    const [rollerResp, signatur, prokura] = await Promise.all([
      fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}/roller`, { headers: { Accept: 'application/json' } }),
      fetchFullmaktData(orgnr, 'signatur'),
      fetchFullmaktData(orgnr, 'prokura'),
    ])
    if (!rollerResp.ok) return []
    const data = await rollerResp.json()
    const byKey = new Map<string, BrregKontakt>()

    for (const rg of data.rollegrupper || []) {
      for (const r of rg.roller || []) {
        if (r.fratraadt || r.avregistrert) continue
        const kode: string = r.type?.kode
        const prio = KONTAKT_PRIORITET[kode]
        if (prio === undefined) continue
        const p = r.person
        const e = r.enhet
        let navn = ''
        let fodselsdato: string | undefined
        if (p?.navn) {
          const parts = [p.navn.fornavn, p.navn.mellomnavn, p.navn.etternavn].filter(Boolean)
          navn = parts.join(' ').trim()
          if (p.fodselsdato) fodselsdato = normFodselsdato(String(p.fodselsdato))
        } else if (e?.navn) {
          navn = e.navn
        }
        if (!navn) continue
        const key = pkey(navn, fodselsdato)
        const prev = byKey.get(key)
        if (prev && prev.prioritet <= prio) continue
        byKey.set(key, {
          kode, rolle: r.type?.beskrivelse || kode, navn, fodselsdato, prioritet: prio,
          signaturAlene: signatur.alenePersoner.has(key),
          signaturFellesskap: signatur.fellesPersoner.has(key),
          prokuraAlene: prokura.alenePersoner.has(key),
          prokuraFellesskap: prokura.fellesPersoner.has(key),
        })
      }
    }
    // Add prokurister fra /fullmakt som ikke kom med i /roller
    for (const p of (prokura.personer || [])) {
      if (byKey.has(p.key)) continue
      const prio = p.alene ? KONTAKT_PRIORITET.POHV : KONTAKT_PRIORITET.POFL
      byKey.set(p.key, {
        kode: p.alene ? 'POHV' : 'POFL',
        rolle: p.rolleTekst || (p.alene ? 'Prokura hver for seg' : 'Prokura i fellesskap'),
        navn: p.navn,
        fodselsdato: p.fodselsdato,
        prioritet: prio,
        signaturAlene: signatur.alenePersoner.has(p.key),
        signaturFellesskap: signatur.fellesPersoner.has(p.key),
        prokuraAlene: p.alene,
        prokuraFellesskap: !p.alene,
      })
    }
    const all = Array.from(byKey.values())
    const hasTier1 = all.some(k => k.prioritet < 50)
    const hasTier2 = all.some(k => k.prioritet >= 50 && k.prioritet < 60)
    const filtered = hasTier1
      ? all.filter(k => k.prioritet < 50)
      : hasTier2
        ? all.filter(k => k.prioritet < 60)
        : all
    return filtered.sort((a, b) => {
      if (a.prioritet === b.prioritet) {
        if (a.signaturAlene !== b.signaturAlene) return a.signaturAlene ? -1 : 1
        return a.navn.localeCompare(b.navn, 'nb')
      }
      return a.prioritet - b.prioritet
    })
  } catch {
    return []
  }
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
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // filters
  const [brukerFilter, setBrukerFilter] = useState<'min' | 'alle' | string>('min')
  const [searchQ, setSearchQ] = useState('')

  // stats
  const [statsToday, setStatsToday] = useState({ totalt: 0, svar: 0, kunde: 0 })
  const [statsWeek, setStatsWeek] = useState({ totalt: 0, kunde: 0 })

  // Load profiles
  useEffect(() => {
    supabase.from('profiles').select('id, navn, epost').order('navn').then(({ data }) => {
      setProfiles((data || []) as Profile[])
    })
  }, [])

  // Load ringeliste — filter ut konvertert/avvist
  const loadRows = useCallback(async () => {
    if (brukerFilter === 'min' && !user?.id) return
    setLoading(true)
    let q = supabase
      .from('ringeliste')
      .select('*')
      .not('stage', 'in', '(konvertert,avvist)')
      .limit(500)

    if (brukerFilter === 'min' && user?.id) {
      q = q.or(`tildelt_bruker_id.eq.${user.id},tildelt_bruker_id.is.null`)
    } else if (brukerFilter !== 'alle' && brukerFilter !== 'min') {
      q = q.eq('tildelt_bruker_id', brukerFilter)
    }

    const { data, error } = await q
    if (error) {
      console.error('ringeliste load failed', error)
      alert('Kunne ikke laste ringeliste: ' + error.message)
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
      svar: t.filter((r: any) => r.utfall === 'snakket' || r.utfall === 'mote' || r.utfall === 'callback' || r.utfall === 'kunde').length,
      kunde: t.filter((r: any) => r.utfall === 'kunde' || r.utfall === 'mote').length,
    })
    setStatsWeek({
      totalt: w.length,
      kunde: w.filter((r: any) => r.utfall === 'kunde' || r.utfall === 'mote').length,
    })
  }, [user?.id])

  useEffect(() => { loadStats() }, [loadStats])

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

  const reassignTo = async (row: RingeRow, brukerId: string | null) => {
    await supabase.from('ringeliste').update({ tildelt_bruker_id: brukerId }).eq('id', row.id)
    await loadRows()
  }

  const removeFromRingeliste = async (row: RingeRow) => {
    if (!confirm(`Fjerne ${row.bedriftsnavn} fra ringelisten?`)) return
    await supabase.from('ringeliste').delete().eq('id', row.id)
    if (activeId === row.id) setActiveId(null)
    await loadRows()
  }

  const navnLookup = useMemo(() => {
    const m = new Map<string, string>()
    profiles.forEach(p => m.set(p.id, p.navn))
    return m
  }, [profiles])

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
        <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Med svar (i dag)" value={statsToday.svar} accent="emerald" />
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

      {/* Layout: list + always-visible right panel */}
      <div className="grid grid-cols-12 gap-4 min-h-[60vh]">
        <div className="col-span-7">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                    expanded={row.id === expandedId}
                    onSelect={() => {
                      setActiveId(row.id)
                      setExpandedId(prev => prev === row.id ? null : row.id)
                    }}
                    onRing={() => {
                      setActiveId(row.id)
                      setExpandedId(row.id)
                    }}
                    onReassign={(uid) => reassignTo(row, uid)}
                    onRemove={() => removeFromRingeliste(row)}
                    profiles={profiles}
                    navnLookup={navnLookup}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-span-5">
          {activeRow ? (
            <CallPanel
              row={activeRow}
              userId={user?.id || null}
              onClose={() => { setActiveId(null); setExpandedId(null) }}
              onSaved={async () => { await loadRows(); await loadStats() }}
              onConverted={(kundeId) => {
                navigate(`/customers/${kundeId}`)
              }}
            />
          ) : (
            <CallPanelPlaceholder />
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Placeholder for right panel when no row selected
// ─────────────────────────────────────────────
function CallPanelPlaceholder() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 h-full flex items-center justify-center p-8">
      <div className="text-center max-w-xs">
        <Phone className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Velg en bedrift fra listen for å forberede en samtale.
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
          Klikk på raden for å se mer info, eller trykk «Ring» for å starte forberedelsen.
        </p>
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
// Row card — viser antall_forsok + siste_ring_dato badge
// ─────────────────────────────────────────────
function RingeRowCard({
  row, index, active, expanded, onSelect, onRing, onReassign, onRemove, profiles, navnLookup
}: {
  row: RingeRow
  index: number
  active: boolean
  expanded: boolean
  onSelect: () => void
  onRing: () => void
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
  const forsok = row.antall_forsok || 0
  const sistRel = formatRelative(row.siste_ring_dato)

  return (
    <div className={`transition-colors ${active ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}>
      <div className="p-4 cursor-pointer" onClick={(e) => {
        // Don't trigger if clicking on a button/link/menu
        const target = e.target as HTMLElement
        if (target.closest('button') || target.closest('a')) return
        onSelect()
      }}>
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
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                {forsok > 0 ? (
                  <span className={`px-2 py-0.5 rounded font-medium ${forsok >= 3 ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}`}>
                    Forsøkt {forsok}{forsok === 1 ? 'x' : ' ganger'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    Ny
                  </span>
                )}
                {sistRel && (
                  <span className="text-slate-500 dark:text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Sist ringt {sistRel}
                  </span>
                )}
                <span className="text-slate-500 dark:text-slate-500">
                  Eier: {eierNavn}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); onRing() }}
                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md flex items-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4" /> {active ? 'Åpen' : 'Ring'}
              </button>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onRemove() }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-md transition-colors"
                  title="Fjern fra ringeliste"
                >
                  <Trash2 className="w-3.5 h-3.5" />
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
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
      {expanded && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 px-4 py-3">
          <BrregDetails orgnr={row.orgnr} />
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// BrregDetails — lazily fetches /enheter/{orgnr} and shows extra info
// ─────────────────────────────────────────────
type BrregEnhet = {
  organisasjonsnummer?: string
  navn?: string
  organisasjonsform?: { kode?: string; beskrivelse?: string }
  naeringskode1?: { kode?: string; beskrivelse?: string }
  forretningsadresse?: { adresse?: string[]; postnummer?: string; poststed?: string; kommune?: string }
  postadresse?: { adresse?: string[]; postnummer?: string; poststed?: string; kommune?: string }
  antallAnsatte?: number
  registreringsdatoEnhetsregisteret?: string
  stiftelsesdato?: string
  registrertIMvaregisteret?: boolean
  registrertIForetaksregisteret?: boolean
  registrertIFrivillighetsregisteret?: boolean
  konkurs?: boolean
  underAvvikling?: boolean
  underTvangsavviklingEllerTvangsopplosning?: boolean
  hjemmeside?: string
  telefon?: string
  mobil?: string
  epostadresse?: string
  vedtektsfestetFormaal?: string[]
  aktivitet?: string[]
}

function BrregDetails({ orgnr }: { orgnr: string }) {
  const [data, setData] = useState<BrregEnhet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancel = false
    setLoading(true)
    setError(null)
    fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`, {
      headers: { Accept: 'application/json' }
    })
      .then(r => r.ok ? r.json() : Promise.reject(new Error('Ikke funnet')))
      .then(j => { if (!cancel) { setData(j); setLoading(false) } })
      .catch(e => { if (!cancel) { setError(String(e.message || e)); setLoading(false) } })
    return () => { cancel = true }
  }, [orgnr])

  if (loading) {
    return (
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Loader2 className="w-3 h-3 animate-spin" /> Henter data fra Brønnøysundregistrene…
      </div>
    )
  }
  if (error || !data) {
    return (
      <div className="text-xs text-rose-600 dark:text-rose-400">
        Kunne ikke hente Brreg-data: {error || 'ukjent feil'}
      </div>
    )
  }

  const fa = data.forretningsadresse
  const adresse = fa ? [...(fa.adresse || []), `${fa.postnummer || ''} ${fa.poststed || ''}`.trim()].filter(Boolean).join(', ') : null
  const status = data.konkurs ? { label: 'Konkurs', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300' }
    : data.underAvvikling ? { label: 'Under avvikling', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' }
    : { label: 'Aktiv', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' }

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center gap-2">
        <span className="uppercase tracking-wide text-slate-500 dark:text-slate-400">Fra Brønnøysund</span>
        <span className={`px-2 py-0.5 rounded font-medium ${status.color}`}>{status.label}</span>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {data.organisasjonsform?.beskrivelse && (
          <DetailRow icon={<Briefcase className="w-3 h-3" />} label="Organisasjonsform">
            {data.organisasjonsform.beskrivelse}
            {data.organisasjonsform.kode && <span className="text-slate-400"> ({data.organisasjonsform.kode})</span>}
          </DetailRow>
        )}
        {typeof data.antallAnsatte === 'number' && (
          <DetailRow icon={<Users className="w-3 h-3" />} label="Ansatte">{data.antallAnsatte}</DetailRow>
        )}
        {data.naeringskode1 && (
          <DetailRow icon={<Briefcase className="w-3 h-3" />} label="Næringskode">
            {data.naeringskode1.kode} — {data.naeringskode1.beskrivelse}
          </DetailRow>
        )}
        {adresse && (
          <DetailRow icon={<MapPin className="w-3 h-3" />} label="Forretningsadresse">{adresse}</DetailRow>
        )}
        {data.registreringsdatoEnhetsregisteret && (
          <DetailRow icon={<Calendar className="w-3 h-3" />} label="Registrert">
            {new Date(data.registreringsdatoEnhetsregisteret).toLocaleDateString('nb-NO')}
          </DetailRow>
        )}
        {data.stiftelsesdato && (
          <DetailRow icon={<Calendar className="w-3 h-3" />} label="Stiftet">
            {new Date(data.stiftelsesdato).toLocaleDateString('nb-NO')}
          </DetailRow>
        )}
        <DetailRow icon={<FileCheck className="w-3 h-3" />} label="MVA-registrert">
          {data.registrertIMvaregisteret ? 'Ja' : 'Nei'}
        </DetailRow>
        {data.telefon && (
          <DetailRow icon={<Phone className="w-3 h-3" />} label="Telefon">
            <a href={`tel:${data.telefon.replace(/\s/g, '')}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.telefon}
            </a>
          </DetailRow>
        )}
        {data.epostadresse && (
          <DetailRow icon={<Mail className="w-3 h-3" />} label="E-post">
            <a href={`mailto:${data.epostadresse}`} className="text-blue-600 dark:text-blue-400 hover:underline">
              {data.epostadresse}
            </a>
          </DetailRow>
        )}
        {data.hjemmeside && (
          <DetailRow icon={<Globe className="w-3 h-3" />} label="Hjemmeside">
            <a href={data.hjemmeside.startsWith('http') ? data.hjemmeside : `https://${data.hjemmeside}`}
               target="_blank" rel="noopener noreferrer"
               className="text-blue-600 dark:text-blue-400 hover:underline truncate inline-block max-w-[12rem]">
              {data.hjemmeside}
            </a>
          </DetailRow>
        )}
      </div>
      {data.vedtektsfestetFormaal && data.vedtektsfestetFormaal.length > 0 && (
        <div>
          <div className="text-slate-500 dark:text-slate-400 mb-1">Vedtektsfestet formål</div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{data.vedtektsfestetFormaal.join(' ')}</p>
        </div>
      )}
      {data.aktivitet && data.aktivitet.length > 0 && (
        <div>
          <div className="text-slate-500 dark:text-slate-400 mb-1">Aktivitet</div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{data.aktivitet.join(' ')}</p>
        </div>
      )}
      <div className="text-slate-400 dark:text-slate-500 pt-1">
        Mer info kommer snart fra andre kilder (Proff, hjemmeside-analyse, etc).
      </div>
    </div>
  )
}

function DetailRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 mb-0.5">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-slate-700 dark:text-slate-200 truncate">{children}</div>
    </div>
  )
}

// ─────────────────────────────────────────────
// CallPanel: prep → call → outcome
// ─────────────────────────────────────────────
function CallPanel({
  row, userId, onClose, onSaved, onConverted
}: {
  row: RingeRow
  userId: string | null
  onClose: () => void
  onSaved: () => Promise<void>
  onConverted: (kundeId: string) => void
}) {
  // Phase: 'prep' → editing kontakter, 'active' → timer running, ready to log outcome
  const [phase, setPhase] = useState<'prep' | 'active'>('prep')
  const [callStart, setCallStart] = useState<number | null>(null)
  const [tick, setTick] = useState(0)

  // Editable contacts + chosen primary
  const initialContacts: Kontakt[] = useMemo(() => {
    if (row.kontaktpersoner && row.kontaktpersoner.length > 0) {
      return row.kontaktpersoner.map(k => ({
        navn: k.navn || '',
        rolle: k.rolle || '',
        telefon: k.telefon || row.telefon || '',
        epost: k.epost || row.epost || '',
        fodselsdato: k.fodselsdato,
      }))
    }
    if (row.kontaktperson_navn) {
      return [{
        navn: row.kontaktperson_navn,
        rolle: row.kontaktperson_rolle || '',
        telefon: row.telefon || '',
        epost: row.epost || '',
      }]
    }
    return []
  }, [row.id])

  const [kontakter, setKontakter] = useState<Kontakt[]>(initialContacts)
  const [valgtIdx, setValgtIdx] = useState<number>(0)
  const [notat, setNotat] = useState('')
  const [oppgaveDato, setOppgaveDato] = useState('')
  const [savingOutcome, setSavingOutcome] = useState<Outcome | null>(null)
  const [hentingKontakter, setHentingKontakter] = useState(false)

  // Reset state when row changes
  useEffect(() => {
    setPhase('prep')
    setCallStart(null)
    setTick(0)
    setKontakter(initialContacts)
    setValgtIdx(0)
    setNotat('')
    setOppgaveDato('')
  }, [row.id])

  // SAFETY NET: Hent live kontakter fra Brreg KUN hvis raden mangler kontakter
  // (legacy-rader fra før kontakter ble lagret i prospekteringen).
  // Nye rader har allerede kontaktpersoner fylt inn fra prospektering.
  useEffect(() => {
    if (initialContacts.length > 0) {
      setHentingKontakter(false)
      return
    }
    let cancelled = false
    setHentingKontakter(true)
    fetchBrregKontakter(row.orgnr).then(brregKontakter => {
      if (cancelled) return
      setKontakter(prev => {
        const byNavn = new Map<string, Kontakt>()
        // Start med eksisterende (bevarer user-edits)
        prev.forEach(k => {
          const key = k.navn.trim().toLowerCase()
          if (key) byNavn.set(key, k)
        })
        // Legg til/merge fra Brreg
        brregKontakter.forEach(bk => {
          const key = bk.navn.trim().toLowerCase()
          const eksisterende = byNavn.get(key)
          byNavn.set(key, {
            navn: bk.navn,
            // Behold eksisterende rolle hvis brukeren har endret den, ellers Brreg
            rolle: (eksisterende?.rolle && eksisterende.rolle !== bk.rolle) ? eksisterende.rolle : bk.rolle,
            telefon: eksisterende?.telefon || row.telefon || '',
            epost: eksisterende?.epost || row.epost || '',
            fodselsdato: bk.fodselsdato || eksisterende?.fodselsdato,
          })
        })
        // Sorter: Brreg-rekkefølgen først (ved å bruke prioritetsindeks),
        // deretter eventuelle frittstående kontakter brukeren har lagt til
        const brregOrder = new Map(brregKontakter.map((k, i) => [k.navn.trim().toLowerCase(), i]))
        const merged = Array.from(byNavn.values())
        merged.sort((a, b) => {
          const ai = brregOrder.has(a.navn.trim().toLowerCase()) ? brregOrder.get(a.navn.trim().toLowerCase())! : 1000
          const bi = brregOrder.has(b.navn.trim().toLowerCase()) ? brregOrder.get(b.navn.trim().toLowerCase())! : 1000
          return ai - bi
        })
        return merged
      })
      setHentingKontakter(false)
    }).catch(() => { if (!cancelled) setHentingKontakter(false) })
    return () => { cancelled = true }
  }, [row.id, row.orgnr])

  // Timer tick
  useEffect(() => {
    if (!callStart) return
    const t = setInterval(() => setTick(x => x + 1), 1000)
    return () => clearInterval(t)
  }, [callStart])

  const valgtKontakt = kontakter[valgtIdx]

  const updateKontakt = (idx: number, patch: Partial<Kontakt>) => {
    setKontakter(prev => prev.map((k, i) => i === idx ? { ...k, ...patch } : k))
  }

  const addKontakt = () => {
    setKontakter(prev => [...prev, { navn: '', rolle: '', telefon: row.telefon || '', epost: '' }])
    setValgtIdx(kontakter.length)
  }

  const removeKontakt = (idx: number) => {
    setKontakter(prev => prev.filter((_, i) => i !== idx))
    if (valgtIdx >= idx && valgtIdx > 0) setValgtIdx(valgtIdx - 1)
  }

  const persistKontakter = async () => {
    // Save edited contact list back to ringeliste so info is there next call
    const top = kontakter[valgtIdx] || kontakter[0]
    const upd: Record<string, unknown> = {
      kontaktpersoner: kontakter,
      kontaktperson_navn: top?.navn || null,
      kontaktperson_rolle: top?.rolle || null,
      telefon: top?.telefon || row.telefon || null,
      epost: top?.epost || row.epost || null,
    }
    const { error } = await supabase.from('ringeliste').update(upd).eq('id', row.id)
    if (error && /column/i.test(error.message)) {
      // Strip unknown columns and retry
      const safe: Record<string, unknown> = {}
      const m = error.message.match(/'([^']+)'/g) || []
      const blocked = new Set(m.map(s => s.replace(/'/g, '')))
      Object.entries(upd).forEach(([k, v]) => { if (!blocked.has(k)) safe[k] = v })
      await supabase.from('ringeliste').update(safe).eq('id', row.id)
    }
  }

  const startSamtale = async () => {
    if (!valgtKontakt || !valgtKontakt.telefon) {
      if (!confirm('Ingen telefonnummer valgt. Starte samtalen likevel?')) return
    }
    await persistKontakter()
    setCallStart(Date.now())
    setPhase('active')
    // Default oppfølgings-dato basert på Snakket med (vanligste utfall)
    setOppgaveDato(plusDays(7))
  }

  const cancelCall = () => {
    setPhase('prep')
    setCallStart(null)
    setTick(0)
  }

  const saveOutcome = async (utfall: Outcome) => {
    if (!userId) return
    setSavingOutcome(utfall)
    try {
      const sec = elapsedSec(callStart)
      const callbackForLog = utfall === 'callback' ? oppgaveDato : null

      // 1) ALWAYS log the call event
      const { error: logErr } = await supabase.from('ringelogg').insert({
        ringeliste_id: row.id,
        org_nummer: row.orgnr,
        bedriftsnavn: row.bedriftsnavn,
        bruker_id: userId,
        utfall,
        notat: notat || null,
        callback_dato: callbackForLog || null,
        varighet_sek: sec || null,
      })
      if (logErr) {
        alert('Kunne ikke lagre ringelogg: ' + logErr.message)
        return
      }

      // 2) Branch by outcome
      if (utfall === 'ikke_svar') {
        // Bump antall_forsok + siste_ring_dato, hold raden i ringelisten
        const nyForsok = (row.antall_forsok || 0) + 1
        await supabase.from('ringeliste').update({
          antall_forsok: nyForsok,
          siste_ring_dato: new Date().toISOString(),
          stage: 'ny_lead',
        }).eq('id', row.id)
        await onSaved()
        onClose()
        return
      }

      if (utfall === 'ikke_interessert') {
        await supabase.from('ringeliste').update({
          stage: 'avvist',
          siste_ring_dato: new Date().toISOString(),
        }).eq('id', row.id)
        await onSaved()
        onClose()
        return
      }

      // KUNDE_OUTCOMES → kundekort + oppgave
      const ins: Record<string, unknown> = {
        bedriftsnavn: row.bedriftsnavn,
        juridisk_navn: row.bedriftsnavn,
        org_nummer: row.orgnr,
        sted: row.kommune,
        kunde_status: utfall === 'kunde' ? 'aktiv' : 'lead',
        kilde: 'ringeliste',
        opprettet_av: userId,
        tildelt_bruker_id: row.tildelt_bruker_id || userId,
      }
      const { data: kunde, error: kErr } = await supabase
        .from('kunder')
        .insert(ins)
        .select('id')
        .single()
      if (kErr || !kunde?.id) {
        alert('Kunne ikke opprette kundekort: ' + (kErr?.message || 'ukjent'))
        return
      }

      // Insert kontakter
      if (kontakter.length > 0) {
        const ks = kontakter.slice(0, 5).map((k, i) => ({
          kunde_id: kunde.id,
          navn: k.navn,
          tittel: k.rolle,
          telefon: k.telefon || null,
          epost: k.epost || null,
          er_primaer: i === valgtIdx,
        }))
        await supabase.from('kontakter').insert(ks)
      }

      // Insert oppgave
      const oppgaveTittel = (OPPGAVE_TITTEL[utfall] || ((n: string) => `Følg opp ${n}`))(row.bedriftsnavn)
      const oppgaveBeskrivelse = [
        `Utfall: ${OUTCOME_LABEL[utfall]}`,
        valgtKontakt?.navn ? `Snakket med: ${valgtKontakt.navn}` : null,
        notat || null,
      ].filter(Boolean).join('\n')

      const oppgaveIns: Record<string, unknown> = {
        tittel: oppgaveTittel,
        beskrivelse: oppgaveBeskrivelse,
        prioritet: utfall === 'mote' || utfall === 'callback' ? 'hoy' : 'normal',
        status: 'aapen',
        frist: oppgaveDato ? new Date(oppgaveDato).toISOString() : null,
        kunde_id: kunde.id,
        assignee_id: userId,
        created_by: userId,
        type: utfall === 'mote' ? 'mote' : utfall === 'callback' ? 'callback' : 'oppfolging',
        kontekst: { ringeliste_id: row.id, ringelogg_utfall: utfall },
      }
      const { error: oppErr } = await supabase.from('oppgaver').insert(oppgaveIns)
      if (oppErr) {
        // Try with reduced field set if some columns are missing
        await supabase.from('oppgaver').insert({
          tittel: oppgaveTittel,
          beskrivelse: oppgaveBeskrivelse,
          status: 'aapen',
          frist: oppgaveDato ? new Date(oppgaveDato).toISOString() : null,
          kunde_id: kunde.id,
          assignee_id: userId,
        })
      }

      // Mark ringeliste row as konvertert + link kunde
      await supabase.from('ringeliste').update({
        stage: 'konvertert',
        kunde_id: kunde.id,
        siste_ring_dato: new Date().toISOString(),
      }).eq('id', row.id)

      await onSaved()

      if (utfall === 'kunde') {
        onConverted(kunde.id as string)
      } else {
        onClose()
      }
    } catch (e) {
      alert('Feil: ' + String(e))
    } finally {
      setSavingOutcome(null)
    }
  }

  const sec = elapsedSec(callStart)

  // ─── Render: Prep phase ───
  if (phase === 'prep') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 h-full flex flex-col">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Forbered samtale</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4 flex-1 overflow-y-auto">
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
              <a href={`https://www.proff.no/selskap/-/-/-/${row.orgnr}`} target="_blank" rel="noopener noreferrer"
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

          {(row.antall_forsok || 0) > 0 && (
            <div className="rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>
                Forsøkt {row.antall_forsok} {row.antall_forsok === 1 ? 'gang' : 'ganger'} tidligere
                {row.siste_ring_dato && ` — sist ${formatRelative(row.siste_ring_dato)}`}.
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                Kontakter — velg hvem du ringer
                {hentingKontakter && <Loader2 className="w-3 h-3 animate-spin text-slate-400" />}
              </p>
              <button
                onClick={addKontakt}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Legg til
              </button>
            </div>
            {kontakter.length === 0 ? (
              <div className="text-xs text-slate-500 dark:text-slate-400 italic px-3 py-4 border border-dashed border-slate-300 dark:border-slate-700 rounded-md text-center">
                Ingen kontakter registrert. Legg til en for å fortsette.
              </div>
            ) : (
              <div className="space-y-2">
                {kontakter.map((k, i) => (
                  <KontaktEditor
                    key={i}
                    kontakt={k}
                    selected={i === valgtIdx}
                    onSelect={() => setValgtIdx(i)}
                    onChange={(patch) => updateKontakt(i, patch)}
                    onRemove={kontakter.length > 1 ? () => removeKontakt(i) : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 p-3">
          <button
            onClick={startSamtale}
            disabled={kontakter.length === 0}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <PhoneCall className="w-4 h-4" /> Start samtale
            {valgtKontakt?.telefon && (
              <span className="text-xs opacity-90">— {formatTel(valgtKontakt.telefon)}</span>
            )}
          </button>
        </div>
      </div>
    )
  }

  // ─── Render: Active call phase ───
  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 h-full flex flex-col">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-green-600 animate-pulse" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Aktiv samtale</span>
          <span className="text-xs text-slate-500 ml-2 tabular-nums">{formatDuration(sec)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={cancelCall} className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
            ← Tilbake
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{row.bedriftsnavn}</h2>
          {valgtKontakt && (
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-0.5">
              {valgtKontakt.navn}
              {valgtKontakt.rolle && <span className="text-slate-500 dark:text-slate-400"> — {valgtKontakt.rolle}</span>}
            </p>
          )}
        </div>

        {valgtKontakt?.telefon && (
          <a
            href={telHref(valgtKontakt.telefon)}
            className="block w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white text-center rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> {formatTel(valgtKontakt.telefon)}
          </a>
        )}

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

        <div>
          <label className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-1.5 block flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Frist for oppfølgings-oppgave
          </label>
          <input
            type="datetime-local"
            value={oppgaveDato}
            onChange={e => setOppgaveDato(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-100"
          />
          <div className="flex flex-wrap gap-1 mt-1.5">
            {[1, 3, 7, 14, 30].map(d => (
              <button
                key={d}
                onClick={() => setOppgaveDato(plusDays(d))}
                type="button"
                className="px-2 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                +{d}d
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Brukes kun ved Snakket / Møte / Callback / Ble kunde
          </p>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-800 p-3 grid grid-cols-2 gap-2">
        {(Object.keys(OUTCOME_LABEL) as Outcome[]).map(u => (
          <button
            key={u}
            onClick={() => saveOutcome(u)}
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

function KontaktEditor({
  kontakt, selected, onSelect, onChange, onRemove
}: {
  kontakt: Kontakt
  selected: boolean
  onSelect: () => void
  onChange: (patch: Partial<Kontakt>) => void
  onRemove?: () => void
}) {
  return (
    <div className={`rounded-md border p-3 space-y-2 cursor-pointer transition-colors ${selected
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-1 ring-blue-500'
      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'}`}
         onClick={onSelect}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <input
            type="radio"
            checked={selected}
            onChange={onSelect}
            className="text-blue-600"
          />
          <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
            {selected ? 'Valgt' : 'Velg'}
          </div>
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            className="text-slate-400 hover:text-rose-600"
            title="Fjern kontakt"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2" onClick={e => e.stopPropagation()}>
        <input
          value={kontakt.navn}
          onChange={e => onChange({ navn: e.target.value })}
          placeholder="Navn"
          className="px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
        />
        <input
          value={kontakt.rolle}
          onChange={e => onChange({ rolle: e.target.value })}
          placeholder="Rolle / tittel"
          className="px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
        />
        <input
          value={kontakt.telefon || ''}
          onChange={e => onChange({ telefon: e.target.value })}
          placeholder="Telefon"
          className="px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
        />
        <input
          value={kontakt.epost || ''}
          onChange={e => onChange({ epost: e.target.value })}
          placeholder="E-post"
          className="px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-100"
        />
      </div>
    </div>
  )
}

export default RingelisteMVP
