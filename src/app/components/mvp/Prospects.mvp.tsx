import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Search, Filter, RefreshCw, Building2, MapPin, Users,
  Calendar, CheckCircle, Plus, ChevronLeft, ChevronRight,
  X, ChevronDown, ChevronUp, ChevronsUpDown,
  Zap, Globe, Phone, Mail, ExternalLink,
  ArrowRight, FileText
} from 'lucide-react'
import { supabase } from '../../../lib/supabase'

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Company {
  orgnr: string
  navn: string
  orgForm?: string
  orgFormNavn?: string
  bransjeKode?: string
  bransjeNavn?: string
  kommune: string
  kommunenummer?: string
  postnummer?: string
  poststed?: string
  ansatte?: number
  registrertDato?: string
  stiftelsesdato?: string
  mvaRegistrert?: boolean
  foretaksRegistrert?: boolean
  hjemmeside?: string
  telefon?: string
  mobil?: string
  epost?: string
  adresse?: string
  postAdresse?: string
}

interface BrregResult {
  items: Company[]
  total: number
  totalPages: number
  page: number
}

interface SearchParams {
  navn?: string
  naeringskoder?: string[]
  organisasjonsformer?: string[]
  kommunenummer?: string[]
  fraAnsatte?: number
  tilAnsatte?: number
  fraRegistrert?: string
  tilRegistrert?: string
  mvaRegistrert?: boolean
  foretaksReg?: boolean
  harHjemmeside?: boolean
  harTelefon?: boolean
  harEpost?: boolean
  page?: number
  size?: number
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const BRREG = 'https://data.brreg.no/enhetsregisteret/api/enheter'

// Section names (NACE level 1, A-U) for grouping the divisions in BransjeCombobox.
// Loaded once from brreg_naeringskoder along with the level-2 divisions we use as
// the actual filterable bransje codes.
type BransjeGruppe = { gruppe: string; koder: { kode: string; navn: string }[] }
let _bransjerCache: BransjeGruppe[] | null = null

async function loadBransjerFromSupabase(): Promise<BransjeGruppe[]> {
  if (_bransjerCache) return _bransjerCache
  try {
    const { data, error } = await supabase
      .from('brreg_naeringskoder')
      .select('kode, parent_kode, level, navn')
      .lte('level', 2)
      .order('kode')
    if (error || !data) return []

    // Build section (level 1) and division (level 2) lookups
    const sections = new Map<string, string>()  // section letter → name
    const divisionsBySection: Record<string, { kode: string; navn: string }[]> = {}
    for (const r of data as any[]) {
      if (r.level === 1) sections.set(r.kode, r.navn)
    }
    for (const r of data as any[]) {
      if (r.level === 2 && r.parent_kode) {
        if (!divisionsBySection[r.parent_kode]) divisionsBySection[r.parent_kode] = []
        divisionsBySection[r.parent_kode].push({ kode: r.kode, navn: r.navn })
      }
    }

    _bransjerCache = Array.from(sections.entries())
      .filter(([letter]) => divisionsBySection[letter]?.length)
      .map(([letter, name]) => ({
        gruppe: name,
        koder: divisionsBySection[letter] || [],
      }))
    return _bransjerCache
  } catch {
    return []
  }
}

const ORG_FORMER = [
  { kode: 'AS',  label: 'AS' },
  { kode: 'ENK', label: 'ENK' },
  { kode: 'ASA', label: 'ASA' },
  { kode: 'DA',  label: 'DA' },
  { kode: 'ANS', label: 'ANS' },
]

// ─────────────────────────────────────────────
// Brreg API helpers
// ─────────────────────────────────────────────
function mapEnhet(e: any): Company {
  const fa = e.forretningsadresse
  const pa = e.postadresse
  return {
    orgnr: e.organisasjonsnummer,
    navn: e.navn,
    orgForm: e.organisasjonsform?.kode,
    orgFormNavn: e.organisasjonsform?.beskrivelse,
    bransjeKode: e.naeringskode1?.kode,
    bransjeNavn: e.naeringskode1?.beskrivelse,
    kommune: fa?.kommune || pa?.kommune || '—',
    kommunenummer: fa?.kommunenummer || pa?.kommunenummer,
    postnummer: fa?.postnummer || pa?.postnummer,
    poststed: fa?.poststed || pa?.poststed,
    ansatte: e.antallAnsatte,
    registrertDato: e.registreringsdatoEnhetsregisteret,
    stiftelsesdato: e.stiftelsesdato,
    mvaRegistrert: e.registrertIMvaregisteret,
    foretaksRegistrert: e.registrertIForetaksregisteret,
    hjemmeside: e.hjemmeside,
    telefon: e.telefon,
    mobil: e.mobil,
    epost: e.epostadresse,
    adresse: (fa?.adresse || []).join(', '),
    postAdresse: pa ? `${(pa.adresse || []).join(', ')}, ${pa.postnummer} ${pa.poststed}`.trim() : undefined,
  }
}

async function fetchCompanyDetail(orgnr: string): Promise<Company | null> {
  try {
    const resp = await fetch(
      `https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}`,
      { headers: { Accept: 'application/json' } }
    )
    if (!resp.ok) return null
    return mapEnhet(await resp.json())
  } catch { return null }
}

// ─────────────────────────────────────────────
// Kontaktpersoner (key contacts) from Brreg /roller
// ─────────────────────────────────────────────
interface Kontaktperson {
  kode: string                  // Brreg role code: DAGL, LEDE, INNH, etc.
  rolle: string                 // Display name: "Daglig leder", "Innehaver"
  navn: string                  // Full name
  fodselsdato?: string          // Normalized YYYY-MM-DD
  fodselsaar?: number
  prioritet: number             // Lower = higher priority
  // Authority flags from Brreg's /fullmakt API (authoritative — no heuristic)
  signaturAlene: boolean        // Can sign alone on behalf of the company
  signaturFellesskap: boolean   // Part of a multi-person signature combination
  prokuraAlene: boolean         // Has prokura alone
  prokuraFellesskap: boolean    // Part of a multi-person prokura combination
}

interface FullmaktPerson {
  key: string
  navn: string
  fodselsdato?: string          // YYYY-MM-DD (normalized)
  rolleKode: string             // e.g. POHV, DAGL, LEDE
  rolleTekst: string            // e.g. "Prokura hver for seg", "Daglig leder"
  alene: boolean                // true when in a 1-person combination
}

interface FullmaktData {
  fritekst?: string             // Free-text signing rule (e.g. "Daglig leder alene...")
  alenePersoner: Set<string>    // Persons in 1-person combinations (by personKey)
  fellesPersoner: Set<string>   // Persons in multi-person combinations
  personer: FullmaktPerson[]    // All persons we encountered with details
}

// Priority order based on Norwegian B2B sales reality. Tier 1 = primary
// contacts, Tier 2 = fallback only if no Tier 1 exists. MEDL/VARA/REVI are
// excluded entirely — we don't want to spam board members or auditors.
const KONTAKT_PRIORITET: Record<string, number> = {
  DAGL: 1,   // Daglig leder — top priority
  INNH: 2,   // Innehaver (ENK) — IS the business
  KOMP: 3,   // Komplementar (KS)
  DTPR: 4,   // Deltaker (DA/ANS)
  BSTV: 5,   // Bestyrende reder
  KONT: 6,   // Eksplisitt kontaktperson
  FFGM: 7,   // Forretningsfører
  POHV: 10,  // Prokura alene — typically C-suite (CFO/COO/legal)
  POFL: 20,  // Prokura i fellesskap — less actionable but still relevant
  // Tier 2 — only if no Tier 1 found
  LEDE: 50,  // Styreleder — fallback for small AS without DAGL
}

// Normalize the two date formats Brreg returns: /roller gives ISO "YYYY-MM-DD",
// /fullmakt gives Norwegian "DD.MM.YYYY". We normalize to ISO for matching.
function normalizeFodselsdato(s?: string): string {
  if (!s) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(s)
  return m ? `${m[3]}-${m[2]}-${m[1]}` : s
}

// Build a stable key for matching a person across the /roller and /fullmakt
// endpoints. Names are case- and whitespace-normalized.
function personKey(navn: string, fodselsdato?: string): string {
  const n = navn.trim().toLowerCase().replace(/\s+/g, ' ')
  return `${n}|${normalizeFodselsdato(fodselsdato)}`
}

async function fetchFullmakt(orgnr: string, type: 'signatur' | 'prokura'): Promise<FullmaktData> {
  const empty: FullmaktData = { alenePersoner: new Set(), fellesPersoner: new Set(), personer: [] }
  try {
    // Brreg's /fullmakt endpoint serves no Access-Control-Allow-Origin header,
    // so we route through our own /api/brreg-fullmakt proxy (a Vercel serverless
    // function that forwards the request server-side and adds the CORS headers).
    const resp = await fetch(
      `/api/brreg-fullmakt?orgnr=${encodeURIComponent(orgnr)}&type=${type}`,
      { headers: { Accept: 'application/json' } }
    )
    if (!resp.ok) return empty
    const data = await resp.json()
    const grunnlag = data.signeringsGrunnlag
    if (!grunnlag) return empty

    const result: FullmaktData = {
      fritekst: grunnlag.signaturProkuraRoller?.signaturProkuraFritekst,
      alenePersoner: new Set(),
      fellesPersoner: new Set(),
      personer: [],
    }

    const seen = new Set<string>()
    const kombinasjoner = data.signeringsKombinasjon?.kombinasjon || []
    for (const kombi of kombinasjoner) {
      const personer = kombi.personRolleKombinasjon || []
      const alene = personer.length === 1
      const target = alene ? result.alenePersoner : result.fellesPersoner
      for (const p of personer) {
        const dob = normalizeFodselsdato(p.fodselsdato)
        const key = personKey(p.navn, dob)
        target.add(key)
        if (!seen.has(key)) {
          seen.add(key)
          result.personer.push({
            key,
            navn: p.navn,
            fodselsdato: dob || undefined,
            rolleKode: p.rolle?.kode || '',
            rolleTekst: p.rolle?.tekstforklaring || p.rolle?.kode || '',
            alene,
          })
        }
      }
    }
    return result
  } catch {
    return empty
  }
}

interface KontakterResult {
  kontakter: Kontaktperson[]
  signaturFritekst?: string
  prokuraFritekst?: string
}

async function fetchKontaktpersoner(orgnr: string): Promise<KontakterResult> {
  try {
    const [rollerResp, signatur, prokura] = await Promise.all([
      fetch(`https://data.brreg.no/enhetsregisteret/api/enheter/${orgnr}/roller`, { headers: { Accept: 'application/json' } }),
      fetchFullmakt(orgnr, 'signatur'),
      fetchFullmakt(orgnr, 'prokura'),
    ])
    if (!rollerResp.ok) return { kontakter: [] }
    const data = await rollerResp.json()

    // First pass: build kontakter from /roller (typed Tier-1/Tier-2 roles)
    const byKey = new Map<string, Kontaktperson>()
    for (const rg of data.rollegrupper || []) {
      for (const r of rg.roller || []) {
        if (r.fratraadt || r.avregistrert) continue
        const kode: string = r.type?.kode
        const prio = KONTAKT_PRIORITET[kode]
        if (prio === undefined) continue  // Skip MEDL/VARA/REVI/REGN/etc.

        const p = r.person
        const e = r.enhet
        let navn = ''
        let fodselsdato: string | undefined
        let fodselsaar: number | undefined

        if (p?.navn) {
          const parts = [p.navn.fornavn, p.navn.mellomnavn, p.navn.etternavn].filter(Boolean)
          navn = parts.join(' ').trim()
          if (p.fodselsdato) {
            fodselsdato = normalizeFodselsdato(String(p.fodselsdato))
            fodselsaar = parseInt(fodselsdato.slice(0, 4))
          }
        } else if (e?.navn) {
          navn = e.navn
        }
        if (!navn) continue

        const key = personKey(navn, fodselsdato)
        // If the same person appears in multiple role groups, keep the
        // higher-priority one (lowest number wins).
        const prev = byKey.get(key)
        if (prev && prev.prioritet <= prio) continue

        byKey.set(key, {
          kode,
          rolle: r.type?.beskrivelse || kode,
          navn,
          fodselsdato,
          fodselsaar,
          prioritet: prio,
          signaturAlene: signatur.alenePersoner.has(key),
          signaturFellesskap: signatur.fellesPersoner.has(key),
          prokuraAlene: prokura.alenePersoner.has(key),
          prokuraFellesskap: prokura.fellesPersoner.has(key),
        })
      }
    }

    // Second pass: add prokurister from /prokura who weren't in /roller. These
    // are typically executives (CFO/COO/legal) and very relevant for B2B sales.
    for (const p of (prokura.personer || [])) {
      if (byKey.has(p.key)) continue  // already covered via /roller
      const prio = p.alene ? KONTAKT_PRIORITET.POHV : KONTAKT_PRIORITET.POFL
      const fodselsaar = p.fodselsdato ? parseInt(p.fodselsdato.slice(0, 4)) : undefined
      byKey.set(p.key, {
        kode: p.alene ? 'POHV' : 'POFL',
        rolle: p.rolleTekst || (p.alene ? 'Prokura hver for seg' : 'Prokura i fellesskap'),
        navn: p.navn,
        fodselsdato: p.fodselsdato,
        fodselsaar,
        prioritet: prio,
        signaturAlene: signatur.alenePersoner.has(p.key),
        signaturFellesskap: signatur.fellesPersoner.has(p.key),
        prokuraAlene: p.alene,
        prokuraFellesskap: !p.alene,
      })
    }

    const all = Array.from(byKey.values())
    // Tier-2 (LEDE) is fallback only when no Tier-1 contact exists.
    const hasTier1 = all.some(k => k.prioritet < 50)
    const filtered = hasTier1 ? all.filter(k => k.prioritet < 50) : all
    const kontakter = filtered.sort((a, b) => {
      // Boost people with signaturrett alene to the top of equal-priority groups
      if (a.prioritet === b.prioritet) {
        if (a.signaturAlene !== b.signaturAlene) return a.signaturAlene ? -1 : 1
        return a.navn.localeCompare(b.navn, 'nb')
      }
      return a.prioritet - b.prioritet
    })

    return {
      kontakter,
      signaturFritekst: signatur.fritekst,
      prokuraFritekst: prokura.fritekst,
    }
  } catch {
    return { kontakter: [] }
  }
}

async function searchBrreg(params: SearchParams): Promise<BrregResult> {
  const url = new URL(BRREG)
  if (params.navn) url.searchParams.set('navn', params.navn)
  if (params.naeringskoder?.length) url.searchParams.set('naeringskode', params.naeringskoder.join(','))
  if (params.organisasjonsformer?.length) url.searchParams.set('organisasjonsform', params.organisasjonsformer.join(','))
  if (params.kommunenummer?.length) url.searchParams.set('kommunenummer', params.kommunenummer.join(','))
  if (params.fraAnsatte !== undefined) url.searchParams.set('fraAntallAnsatte', String(params.fraAnsatte))
  if (params.tilAnsatte !== undefined) url.searchParams.set('tilAntallAnsatte', String(params.tilAnsatte))
  if (params.fraRegistrert) url.searchParams.set('fraRegistreringsdatoEnhetsregisteret', params.fraRegistrert)
  if (params.tilRegistrert) url.searchParams.set('tilRegistreringsdatoEnhetsregisteret', params.tilRegistrert)
  if (params.mvaRegistrert) url.searchParams.set('registrertIMvaregisteret', 'true')
  if (params.foretaksReg) url.searchParams.set('registrertIForetaksregisteret', 'true')
  url.searchParams.set('konkurs', 'false')
  url.searchParams.set('underAvvikling', 'false')
  url.searchParams.set('size', String(params.size || 20))
  url.searchParams.set('page', String(params.page || 0))
  url.searchParams.set('sort', 'navn,asc')

  const resp = await fetch(url.toString(), { headers: { Accept: 'application/json' } })
  const data = await resp.json()
  return {
    items: (data._embedded?.enheter || []).map(mapEnhet),
    total: data.page?.totalElements || 0,
    totalPages: data.page?.totalPages || 0,
    page: data.page?.number || 0,
  }
}

// ─────────────────────────────────────────────
// Sub-component: BransjeCombobox
// ─────────────────────────────────────────────
function BransjeCombobox({
  selected,
  onChange,
  counts,
}: {
  selected: string[]
  onChange: (koder: string[]) => void
  counts?: Record<string, number>  // bransje code (or prefix) → number of matching companies
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [bransjer, setBransjer] = useState<BransjeGruppe[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { loadBransjerFromSupabase().then(setBransjer) }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const allKoder = bransjer.flatMap(g => g.koder)
  const filtered = query
    ? allKoder.filter(k => k.navn.toLowerCase().includes(query.toLowerCase()) || k.kode.includes(query))
    : null

  const toggle = (kode: string) => {
    onChange(selected.includes(kode) ? selected.filter(k => k !== kode) : [...selected, kode])
  }

  const selectedNames = selected.map(k => allKoder.find(b => b.kode === k)?.navn || k)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-left hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <span className="text-slate-600 dark:text-slate-300 truncate">
          {selected.length === 0
            ? 'Alle bransjer'
            : selected.length === 1
              ? selectedNames[0]
              : `${selected.length} bransjer valgt`}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
          {selected.length > 0 && (
            <span className="bg-blue-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
              {selected.length}
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </button>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {selectedNames.slice(0, 2).map((name, i) => (
            <span key={i} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
              {name.length > 18 ? name.slice(0, 17) + '…' : name}
              <button type="button" onClick={() => toggle(selected[i])}><X className="w-3 h-3" /></button>
            </span>
          ))}
          {selectedNames.length > 2 && (
            <span className="text-xs text-slate-500 dark:text-slate-400 py-0.5">+{selectedNames.length - 2} til</span>
          )}
        </div>
      )}

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Søk bransje..."
              className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="py-1">
            {(filtered ? [{ gruppe: 'Søkeresultater', koder: filtered }] : bransjer).map(gruppe => (
              <div key={gruppe.gruppe}>
                <div className="px-3 py-1 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
                  {gruppe.gruppe}
                </div>
                {gruppe.koder.map(k => (
                  <button
                    key={k.kode}
                    type="button"
                    onClick={() => toggle(k.kode)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                      selected.includes(k.kode) ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs ${
                      selected.includes(k.kode)
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-slate-300 dark:border-slate-500'
                    }`}>
                      {selected.includes(k.kode) && '✓'}
                    </span>
                    <span className="flex-1 truncate">{k.navn}</span>
                    <span className={`text-xs tabular-nums ${
                      counts && (counts[k.kode] ?? 0) > 0
                        ? 'text-slate-500 dark:text-slate-400 font-medium'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}>
                      {counts ? (counts[k.kode] ?? 0).toLocaleString('nb') : k.kode}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// Sub-component: KommuneCombobox (with fylke grouping)
// ─────────────────────────────────────────────

// Fylke mapping — both current (31-56) and legacy (01-20) codes from Brreg
// Brreg mixes old and new codes during the ongoing administrative reform
const FYLKE_NAVN: Record<string, string> = {
  // Legacy codes (still used by many communes in Brreg)
  '01': 'Østfold',
  '02': 'Akershus',
  '03': 'Oslo',
  '04': 'Innlandet',        // Hedmark
  '05': 'Innlandet',        // Oppland
  '06': 'Buskerud',
  '07': 'Vestfold',
  '08': 'Telemark',
  '09': 'Agder',            // Aust-Agder
  '10': 'Agder',            // Vest-Agder
  '11': 'Rogaland',
  '12': 'Vestland',         // Hordaland
  '14': 'Vestland',         // Sogn og Fjordane
  '15': 'Møre og Romsdal',
  '16': 'Trøndelag',        // Sør-Trøndelag
  '17': 'Trøndelag',        // Nord-Trøndelag
  '18': 'Nordland',
  '19': 'Troms',
  '20': 'Finnmark',
  '21': 'Svalbard',
  '22': 'Jan Mayen',
  // Current codes (2024 reform)
  '31': 'Østfold',
  '32': 'Akershus',
  '33': 'Buskerud',
  '34': 'Innlandet',
  '39': 'Vestfold',
  '40': 'Telemark',
  '42': 'Agder',
  '46': 'Vestland',
  '50': 'Trøndelag',
  '55': 'Troms',
  '56': 'Finnmark',
}

// Fylke sort order — deduplicated names, south to north
const FYLKE_ORDER = [
  '03','01','31', // Oslo, Østfold (legacy+new)
  '02','32',      // Akershus
  '06','33',      // Buskerud
  '07','39',      // Vestfold
  '08','40',      // Telemark
  '09','10','42', // Agder
  '04','05','34', // Innlandet
  '11',           // Rogaland
  '12','14','46', // Vestland
  '15',           // Møre og Romsdal
  '16','17','50', // Trøndelag
  '18',           // Nordland
  '19','55',      // Troms
  '20','56',      // Finnmark
  '21','22',      // Svalbard/Jan Mayen
]

function getFylke(nr: string) {
  return FYLKE_NAVN[nr.slice(0, 2)] || `Fylke ${nr.slice(0, 2)}`
}

// Cache: { fylkenavn → Kommune[] }
let _grupperCache: { kode: string; navn: string; kommuner: { nr: string; navn: string }[] }[] | null = null

async function loadGrupperFromSupabase() {
  if (_grupperCache) return _grupperCache
  try {
    const [fylkerResp, kommunerResp] = await Promise.all([
      supabase.from('brreg_fylker').select('nr, navn, sortering').order('sortering'),
      supabase.from('brreg_kommuner').select('nr, navn, fylke_nr').order('navn'),
    ])
    const fylker = fylkerResp.data || []
    const kommuner = kommunerResp.data || []

    _grupperCache = fylker.map((f: any) => ({
      kode: f.nr,
      navn: f.navn,
      kommuner: kommuner
        .filter((k: any) => k.fylke_nr === f.nr)
        .map((k: any) => ({ nr: k.nr, navn: k.navn }))
    })).filter((g: any) => g.kommuner.length > 0)

    return _grupperCache
  } catch { return [] }
}

function KommuneCombobox({
  selected,
  onChange,
  counts,
}: {
  selected: string[]
  onChange: (nr: string[]) => void
  counts?: Record<string, number>  // kommunenummer → number of matching companies
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [grupper, setGrupper] = useState<{ kode: string; navn: string; kommuner: { nr: string; navn: string }[] }[]>([])
  const [collapsedFylker, setCollapsedFylker] = useState<Set<string>>(new Set())
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => { loadGrupperFromSupabase().then(setGrupper) }, [])

  // Flat list of all communes for search + name lookup
  const alleKommuner = grupper.flatMap(g => g.kommuner)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const toggle = (nr: string) =>
    onChange(selected.includes(nr) ? selected.filter(k => k !== nr) : [...selected, nr])

  const toggleFylke = (fylkenavn: string, kommunerInFylke: { nr: string; navn: string }[]) => {
    const nrs = kommunerInFylke.map(k => k.nr)
    const allSelected = nrs.every(nr => selected.includes(nr))
    if (allSelected) onChange(selected.filter(nr => !nrs.includes(nr)))
    else onChange([...new Set([...selected, ...nrs])])
  }

  const toggleCollapse = (fylke: string) => {
    setCollapsedFylker(prev => {
      const s = new Set(prev)
      if (s.has(fylke)) s.delete(fylke)
      else s.add(fylke)
      return s
    })
  }

  // Use grupper directly (already sorted from Supabase by sortering)
  const grouped = grupper

  // Searching: flat list across all fylker
  const isSearching = query.trim().length > 0
  const searchResults = alleKommuner.filter(k =>
    k.navn.toLowerCase().includes(query.toLowerCase()) || k.nr.includes(query)
  )

  const selectedNames = selected.map(nr => alleKommuner.find(k => k.nr === nr)?.navn || nr)
  const selectedCount = selected.length

  const CheckBox = ({ checked, partial }: { checked: boolean; partial?: boolean }) => (
    <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs ${
      checked ? 'bg-blue-600 border-blue-600 text-white'
      : partial ? 'bg-blue-100 border-blue-400 text-blue-600'
      : 'border-slate-300 dark:border-slate-500'
    }`}>
      {checked ? '✓' : partial ? '–' : ''}
    </span>
  )

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-left hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <span className="text-slate-600 dark:text-slate-300 truncate">
          {selectedCount === 0 ? 'Alle kommuner' :
           selectedCount === 1 ? selectedNames[0] :
           `${selectedCount} kommuner valgt`}
        </span>
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-1">
          {selectedCount > 0 && (
            <span className="bg-blue-600 text-white text-xs font-medium rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center">
              {selectedCount}
            </span>
          )}
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-96 overflow-hidden flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Søk kommune eller fylke..."
              className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Clear button */}
          {selectedCount > 0 && (
            <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
              <button onClick={() => onChange([])} className="text-xs text-red-500 hover:text-red-700">
                Fjern alle ({selectedCount})
              </button>
            </div>
          )}

          <div className="overflow-y-auto flex-1">
            {grupper.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-400 text-center">Laster kommuner...</div>
            ) : isSearching ? (
              // Flat search results
              <div className="py-1">
                {searchResults.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-slate-400">Ingen treff</div>
                ) : searchResults.map(k => (
                  <button key={k.nr} type="button" onClick={() => toggle(k.nr)}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                      selected.includes(k.nr) ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'
                    }`}>
                    <CheckBox checked={selected.includes(k.nr)} />
                    <span className="flex-1">{k.navn}</span>
                    <span className="text-xs text-slate-400">{getFylke(k.nr)}</span>
                    {counts && (
                      <span className={`text-xs tabular-nums ${
                        (counts[k.nr] ?? 0) > 0 ? 'text-slate-500 dark:text-slate-400 font-medium' : 'text-slate-300 dark:text-slate-600'
                      }`}>
                        {(counts[k.nr] ?? 0).toLocaleString('nb')}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              // Grouped by fylke
              <div className="py-1">
                {grouped.map(({ kode, navn: fylkenavn, kommuner: koms }) => {
                  const selectedInFylke = koms.filter(k => selected.includes(k.nr)).length
                  const allInFylke = selectedInFylke === koms.length
                  const someInFylke = selectedInFylke > 0 && !allInFylke
                  const collapsed = collapsedFylker.has(kode)
                  return (
                    <div key={kode}>
                      {/* Fylke header */}
                      <div className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-700/50 sticky top-0 z-10">
                        <button type="button" onClick={() => toggleFylke(fylkenavn, koms)}
                          className="flex items-center gap-2 flex-1 text-left">
                          <CheckBox checked={allInFylke} partial={someInFylke} />
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            {fylkenavn}
                          </span>
                          {selectedInFylke > 0 && (
                            <span className="text-xs text-blue-600 dark:text-blue-400">({selectedInFylke}/{koms.length})</span>
                          )}
                        </button>
                        <button type="button" onClick={() => toggleCollapse(kode)}
                          className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${collapsed ? '-rotate-90' : ''}`} />
                        </button>
                      </div>
                      {/* Communes */}
                      {!collapsed && koms.map(k => (
                        <button key={k.nr} type="button" onClick={() => toggle(k.nr)}
                          className={`w-full flex items-center gap-2 pl-7 pr-3 py-1.5 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                            selected.includes(k.nr) ? 'text-blue-700 dark:text-blue-300 bg-blue-50/50 dark:bg-blue-900/10' : 'text-slate-700 dark:text-slate-300'
                          }`}>
                          <CheckBox checked={selected.includes(k.nr)} />
                          <span className="flex-1">{k.navn}</span>
                          {counts && (
                            <span className={`text-xs tabular-nums ${
                              (counts[k.nr] ?? 0) > 0 ? 'text-slate-500 dark:text-slate-400 font-medium' : 'text-slate-300 dark:text-slate-600'
                            }`}>
                              {(counts[k.nr] ?? 0).toLocaleString('nb')}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-component: CompanyDetailPanel
// ─────────────────────────────────────────────
function CompanyDetailPanel({
  orgnr, onClose, onAdd, inRingeliste, isKunde
}: {
  orgnr: string
  onClose: () => void
  onAdd: (c: Company, kontakter: Kontaktperson[]) => void
  inRingeliste: boolean
  isKunde: boolean
}) {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [kontakter, setKontakter] = useState<Kontaktperson[]>([])
  const [signaturFritekst, setSignaturFritekst] = useState<string | undefined>()
  const [prokuraFritekst, setProkuraFritekst] = useState<string | undefined>()
  const [kontakterLoading, setKontakterLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setKontakterLoading(true)
    setSignaturFritekst(undefined)
    setProkuraFritekst(undefined)
    fetchCompanyDetail(orgnr).then(c => { setCompany(c); setLoading(false) })
    fetchKontaktpersoner(orgnr).then(res => {
      setKontakter(res.kontakter)
      setSignaturFritekst(res.signaturFritekst)
      setProkuraFritekst(res.prokuraFritekst)
      setKontakterLoading(false)
    })
  }, [orgnr])

  // Auto-pick the top 1–3 contacts that make sense for B2B outreach. Prefer
  // people with real signaturrett alene; otherwise rank by KONTAKT_PRIORITET.
  // (Already pre-sorted by fetchKontaktpersoner.)
  const foreslatteKontakter = kontakter.slice(0, 3)

  const InfoRow = ({ icon, label, value, href }: { icon: React.ReactNode, label: string, value?: string | null, href?: string }) => {
    if (!value) return null
    return (
      <div className="flex items-start gap-3 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0">
        <div className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate">
              {value} <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          ) : (
            <p className="text-sm text-slate-900 dark:text-white">{value}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20" />
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-800 shadow-2xl flex flex-col h-full overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-800 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="min-w-0">
              {loading ? (
                <div className="h-5 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
              ) : (
                <>
                  <h2 className="font-semibold text-slate-900 dark:text-white truncate">{company?.navn}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Org.nr: {orgnr}</p>
                </>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 bg-slate-100 dark:bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        ) : company ? (
          <div className="flex-1 p-6 space-y-6">
            {/* Status badges */}
            <div className="flex flex-wrap gap-2">
              {company.orgForm && (
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                  {company.orgFormNavn || company.orgForm}
                </span>
              )}
              {company.mvaRegistrert && (
                <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                  MVA-registrert
                </span>
              )}
              {company.foretaksRegistrert && (
                <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium">
                  Foretaksregistrert
                </span>
              )}
            </div>

            {/* Kontaktinfo */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Kontaktinformasjon</h3>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg px-4">
                <InfoRow icon={<Globe className="w-4 h-4" />} label="Hjemmeside" value={company.hjemmeside}
                  href={company.hjemmeside ? (company.hjemmeside.startsWith('http') ? company.hjemmeside : `https://${company.hjemmeside}`) : undefined} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Telefon" value={company.telefon}
                  href={company.telefon ? `tel:${company.telefon}` : undefined} />
                <InfoRow icon={<Phone className="w-4 h-4" />} label="Mobil" value={company.mobil}
                  href={company.mobil ? `tel:${company.mobil}` : undefined} />
                <InfoRow icon={<Mail className="w-4 h-4" />} label="E-post" value={company.epost}
                  href={company.epost ? `mailto:${company.epost}` : undefined} />
                {!company.hjemmeside && !company.telefon && !company.mobil && !company.epost && (
                  <p className="py-3 text-sm text-slate-400 dark:text-slate-500">Ingen kontaktinfo registrert</p>
                )}
              </div>
            </div>

            {/* Adresse */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Adresse</h3>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg px-4">
                <InfoRow icon={<MapPin className="w-4 h-4" />} label="Forretningsadresse"
                  value={company.adresse ? `${company.adresse}, ${company.postnummer || ''} ${company.poststed || ''}`.trim() : undefined} />
                <InfoRow icon={<MapPin className="w-4 h-4" />} label="Postadresse" value={company.postAdresse} />
                <InfoRow icon={<Building2 className="w-4 h-4" />} label="Kommune" value={company.kommune} />
              </div>
            </div>

            {/* Virksomhetinfo */}
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Virksomhet</h3>
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg px-4">
                <InfoRow icon={<FileText className="w-4 h-4" />} label="Næringskode"
                  value={company.bransjeKode ? `${company.bransjeKode} – ${company.bransjeNavn}` : company.bransjeNavn} />
                <InfoRow icon={<Users className="w-4 h-4" />} label="Ansatte"
                  value={company.ansatte != null ? `${company.ansatte} ansatte` : 'Ikke oppgitt'} />
                <InfoRow icon={<Calendar className="w-4 h-4" />} label="Registrert i Enhetsregisteret"
                  value={company.registrertDato ? new Date(company.registrertDato).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined} />
                <InfoRow icon={<Calendar className="w-4 h-4" />} label="Stiftelsesdato"
                  value={company.stiftelsesdato ? new Date(company.stiftelsesdato).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' }) : undefined} />
              </div>
            </div>

            {/* Nøkkelpersoner — auto-foreslåtte kontaktpersoner (topp 1-3) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Foreslåtte kontaktpersoner
                </h3>
                {foreslatteKontakter.length > 0 && (
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    Topp {foreslatteKontakter.length} av {kontakter.length}
                  </span>
                )}
              </div>
              {kontakterLoading ? (
                <div className="space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-14 bg-slate-100 dark:bg-slate-700 rounded-lg animate-pulse" />
                  ))}
                </div>
              ) : foreslatteKontakter.length === 0 ? (
                <p className="text-sm text-slate-400 dark:text-slate-500 italic">Ingen relevante roller funnet i Brreg.</p>
              ) : (
                <div className="space-y-1.5">
                  {foreslatteKontakter.map((k, i) => (
                    <div
                      key={`${k.kode}-${k.navn}-${i}`}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-slate-50 dark:bg-slate-700/30 border-slate-200 dark:border-slate-700"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm text-slate-900 dark:text-white">{k.navn}</span>
                          {k.fodselsaar && (
                            <span className="text-xs text-slate-400 dark:text-slate-500">f. {k.fodselsaar}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                            {k.rolle}
                          </span>
                          {k.signaturAlene && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              Signerer alene
                            </span>
                          )}
                          {!k.signaturAlene && k.signaturFellesskap && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              Signerer i fellesskap
                            </span>
                          )}
                          {k.prokuraAlene && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                              Prokura alene
                            </span>
                          )}
                          {!k.prokuraAlene && k.prokuraFellesskap && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300">
                              Prokura i fellesskap
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Signaturbestemmelse fritekst (når Brreg har det) */}
              {!kontakterLoading && signaturFritekst && (
                <div className="mt-3 px-3 py-2 bg-slate-100 dark:bg-slate-700/50 border-l-2 border-slate-300 dark:border-slate-600 rounded text-xs">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Signaturbestemmelse</p>
                  <p className="text-slate-600 dark:text-slate-400">{signaturFritekst}</p>
                </div>
              )}
              {!kontakterLoading && prokuraFritekst && (
                <div className="mt-2 px-3 py-2 bg-slate-100 dark:bg-slate-700/50 border-l-2 border-slate-300 dark:border-slate-600 rounded text-xs">
                  <p className="font-semibold text-slate-700 dark:text-slate-300 mb-0.5">Prokura</p>
                  <p className="text-slate-600 dark:text-slate-400">{prokuraFritekst}</p>
                </div>
              )}
            </div>

            {/* Brreg-lenke */}
            <a
              href={`https://www.brreg.no/lookup/?startswith=${orgnr}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Se på Brønnøysundregistrene
            </a>
          </div>
        ) : (
          <div className="p-6 text-center text-slate-400">Kunne ikke hente bedriftsinfo</div>
        )}

        {/* Footer action */}
        <div className="sticky bottom-0 px-6 py-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
          {isKunde ? (
            <div className="text-center text-sm text-slate-400">Allerede registrert som kunde</div>
          ) : inRingeliste ? (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle className="w-4 h-4" /> Lagt til i ringelisten
            </div>
          ) : company ? (
            <button
              onClick={() => onAdd(company, foreslatteKontakter)}
              className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Legg til ringeliste
              {foreslatteKontakter.length > 0 && (
                <span className="text-xs opacity-90">— {foreslatteKontakter[0].navn.split(' ')[0]}</span>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Sub-component: ResultRow
// ─────────────────────────────────────────────
function ResultRow({
  company,
  checked,
  onCheck,
  inRingeliste,
  isKunde,
  onAdd,
  adding,
  onRowClick,
}: {
  company: Company
  checked: boolean
  onCheck: (checked: boolean) => void
  inRingeliste: boolean
  isKunde: boolean
  onAdd: () => void
  adding: boolean
  onRowClick: () => void
}) {
  return (
    <tr
      onClick={onRowClick}
      className={`border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer ${
        checked ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500' : ''
      }`}
    >
      <td className="pl-4 pr-2 py-3" onClick={e => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onCheck(e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
      </td>
      <td className="px-3 py-3">
        <div className="font-medium text-slate-900 dark:text-white text-sm leading-tight">{company.navn}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-400 dark:text-slate-500">{company.orgnr}</span>
          {/* Contact info indicators */}
          <div className="flex items-center gap-1">
            {company.hjemmeside && <Globe className="w-3 h-3 text-blue-400" title="Har hjemmeside" />}
            {(company.telefon || company.mobil) && <Phone className="w-3 h-3 text-green-400" title="Har telefon" />}
            {company.epost && <Mail className="w-3 h-3 text-purple-400" title="Har e-post" />}
          </div>
        </div>
      </td>
      <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400 max-w-[140px] truncate">
        {company.bransjeNavn
          ? <span title={company.bransjeNavn}>{company.bransjeNavn.length > 28 ? company.bransjeNavn.slice(0, 27) + '…' : company.bransjeNavn}</span>
          : <span className="text-slate-300 dark:text-slate-600">—</span>}
      </td>
      <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
          {company.kommune}
        </div>
      </td>
      <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400 text-right">
        {company.ansatte !== undefined ? company.ansatte : '—'}
      </td>
      <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-500">
        {company.registrertDato || '—'}
      </td>
      <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
        {isKunde ? (
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
            Allerede kunde
          </span>
        ) : inRingeliste ? (
          <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg flex items-center gap-1 inline-flex">
            <CheckCircle className="w-3 h-3" />
            I ringeliste
          </span>
        ) : (
          <button
            onClick={onAdd}
            disabled={adding}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
          >
            {adding ? '…' : 'Legg til'}
          </button>
        )}
      </td>
    </tr>
  )
}

// ─────────────────────────────────────────────
// Tab 1: Prospektsøk
// ─────────────────────────────────────────────
function ProspektSok() {
  const [searchInput, setSearchInput] = useState('')
  const [searchName, setSearchName] = useState('')

  // Filters
  const [bransjer, setBransjer] = useState<string[]>([])
  const [orgFormer, setOrgFormer] = useState<string[]>([])
  const [kommuner, setKommuner] = useState<string[]>([])
  const [fraAnsatte, setFraAnsatte] = useState('')
  const [tilAnsatte, setTilAnsatte] = useState('')
  const [fraRegDato, setFraRegDato] = useState('')
  const [tilRegDato, setTilRegDato] = useState('')
  const [mvaRegistrert, setMvaRegistrert] = useState(true)
  const [foretaksReg, setForetaksReg] = useState(true)
  // Contact info filters — UI state (checkboxes). These DON'T auto-trigger
  // a search; they're snapshotted into `appliedHar*` when the user clicks
  // "Søk med filtre" (or hits Enter on the name search), so toggling a box
  // doesn't kick off a long Brreg over-fetch loop.
  const [harHjemmeside, setHarHjemmeside] = useState(false)
  const [harTelefon, setHarTelefon] = useState(false)
  const [harEpost, setHarEpost] = useState(false)

  // Applied snapshot — what's actually used to filter the buffer + decide
  // whether to over-fetch from Brreg.
  const [appliedHarHjemmeside, setAppliedHarHjemmeside] = useState(false)
  const [appliedHarTelefon, setAppliedHarTelefon] = useState(false)
  const [appliedHarEpost, setAppliedHarEpost] = useState(false)

  // Pagination (logical — across filtered results)
  const [pageSize, setPageSize] = useState(20)
  const [page, setPage] = useState(0)

  // Result accumulator (across multiple Brreg pages).
  //
  // Brreg's search API doesn't support filtering on contact info (hjemmeside,
  // telefon, epost), so we fetch a big chunk from Brreg in one go and paginate
  // locally. size=10000 (Brreg's max) → ~16 MB / ~830 ms per call, but for
  // typical queries everything fits in the very first call and all subsequent
  // pagination is instant. Memory: ~5 MB per chunk as JS objects — fine.
  const BRREG_FETCH_SIZE = 10000
  // If, after applying the contact-info filter, we have fewer than this many
  // matches and there are more Brreg pages available, fetch another chunk.
  const MIN_FILTERED_BEFORE_FETCH_MORE = 100
  const [buffer, setBuffer] = useState<Company[]>([])
  const [brregNextPage, setBrregNextPage] = useState(0)
  const [brregTotal, setBrregTotal] = useState(0)
  const [brregTotalPages, setBrregTotalPages] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  // Loading + error
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState('')

  // Selection
  const [selected, setSelected] = useState<Set<string>>(new Set())

  // Detail panel
  const [selectedOrgnr, setSelectedOrgnr] = useState<string | null>(null)

  // Status tracking
  const [ringeliste, setRingeliste] = useState<Set<string>>(new Set())
  const [kunder, setKunder] = useState<Set<string>>(new Set())
  const [adding, setAdding] = useState<Set<string>>(new Set())

  // Load existing orgnr sets
  useEffect(() => {
    supabase.from('ringeliste').select('orgnr').then(({ data }) => {
      if (data) setRingeliste(new Set(data.map((r: any) => r.orgnr)))
    })
    supabase.from('kunder').select('org_nummer').then(({ data }) => {
      if (data) setKunder(new Set(data.map((k: any) => k.org_nummer).filter(Boolean)))
    })
  }, [])

  // Build current search params (without page/size)
  const buildBaseParams = useCallback((): SearchParams => ({
    navn: searchName || undefined,
    naeringskoder: bransjer.length ? bransjer : undefined,
    organisasjonsformer: orgFormer.length ? orgFormer : undefined,
    kommunenummer: kommuner.length ? kommuner : undefined,
    fraAnsatte: fraAnsatte ? Number(fraAnsatte) : undefined,
    tilAnsatte: tilAnsatte ? Number(tilAnsatte) : undefined,
    fraRegistrert: fraRegDato || undefined,
    tilRegistrert: tilRegDato || undefined,
    mvaRegistrert: mvaRegistrert || undefined,
    foretaksReg: foretaksReg || undefined,
  }), [searchName, bransjer, orgFormer, kommuner, fraAnsatte, tilAnsatte, fraRegDato, tilRegDato, mvaRegistrert, foretaksReg])

  // Keep latest params accessible to fetch loops without forcing useEffect re-runs
  const paramsRef = useRef<SearchParams>(buildBaseParams())
  paramsRef.current = buildBaseParams()

  // Reset and re-fetch from Brreg page 0. Snapshots the contact-info checkboxes
  // into the "applied" state at the moment of search so toggling a checkbox
  // afterwards doesn't change what's filtered until the user explicitly searches
  // again.
  const doSearch = useCallback(async () => {
    setLoading(true)
    setError('')
    setBuffer([])
    setPage(0)
    setBrregNextPage(0)
    setBrregTotal(0)
    setBrregTotalPages(0)
    setSelected(new Set())
    setHasSearched(true)
    loadingMoreRef.current = false
    setLoadingMore(false)
    setAppliedHarHjemmeside(harHjemmeside)
    setAppliedHarTelefon(harTelefon)
    setAppliedHarEpost(harEpost)
    setExtraPagesAllowed(0)
    try {
      const res = await searchBrreg({ ...paramsRef.current, page: 0, size: BRREG_FETCH_SIZE })
      setBuffer(res.items)
      setBrregTotal(res.total)
      setBrregTotalPages(res.totalPages)
      setBrregNextPage(1)
    } catch {
      setError('Klarte ikke hente data fra Brreg. Prøv igjen.')
    } finally {
      setLoading(false)
    }
  }, [harHjemmeside, harTelefon, harEpost])

  const handleSearch = () => {
    setSearchName(searchInput)
  }

  // Re-search when searchName changes (after Enter / Søk button)
  useEffect(() => {
    if (searchName !== '' || bransjer.length || orgFormer.length || kommuner.length) {
      doSearch()
    }
  }, [searchName]) // eslint-disable-line react-hooks/exhaustive-deps

  const resetFilters = () => {
    setBransjer([])
    setOrgFormer([])
    setKommuner([])
    setFraAnsatte('')
    setTilAnsatte('')
    setFraRegDato('')
    setTilRegDato('')
    setMvaRegistrert(true)
    setForetaksReg(true)
    setHarHjemmeside(false)
    setHarTelefon(false)
    setHarEpost(false)
  }

  // Client-side post-filter for contact info — uses the APPLIED snapshot, not
  // the live checkbox values, so toggling a box after search doesn't shrink
  // the result set until the user clicks "Søk med filtre" again.
  const hasContactFilter = appliedHarHjemmeside || appliedHarTelefon || appliedHarEpost

  const filteredItems = buffer.filter(c => {
    if (appliedHarHjemmeside && !c.hjemmeside) return false
    if (appliedHarTelefon && !c.telefon && !c.mobil) return false
    if (appliedHarEpost && !c.epost) return false
    return true
  })

  // Has the user changed contact filters since last search? (Used to nudge them
  // to click "Søk med filtre" again.)
  const contactFilterDirty =
    harHjemmeside !== appliedHarHjemmeside ||
    harTelefon !== appliedHarTelefon ||
    harEpost !== appliedHarEpost

  const exhausted = hasSearched && brregNextPage >= brregTotalPages

  // What we display: the slice of filtered items for the current logical page
  const displayItems = filteredItems.slice(page * pageSize, (page + 1) * pageSize)

  // Total count + total pages
  // - No contact filter: trust Brreg's totals directly
  // - Contact filter on, exhausted: filteredItems.length is the real total
  // - Contact filter on, not exhausted: we don't know the true total; keep showing "+1" page until exhausted
  const totalCount = hasContactFilter ? filteredItems.length : brregTotal
  const totalPages = hasContactFilter
    ? (exhausted
        ? Math.max(1, Math.ceil(filteredItems.length / pageSize))
        : Math.max(page + 2, Math.ceil(filteredItems.length / pageSize) + 1))
    : Math.max(1, Math.ceil(brregTotal / pageSize))

  // Bound the locally available pages by what's actually in the buffer (Brreg
  // pagination can yield more rows than we've fetched so far). Without a
  // contact filter this lets us page through the buffer instantly and only hit
  // Brreg again when we run out.
  const localTotalPages = Math.max(1, Math.ceil(buffer.length / pageSize))

  // Soft cap on auto-fetching. Each fetch grabs BRREG_FETCH_SIZE (10 000)
  // records, so 3 fetches = 30 000 records scanned before we ask the user
  // to confirm scanning more.
  const AUTO_FETCH_CAP_PAGES = 3
  const [extraPagesAllowed, setExtraPagesAllowed] = useState(0)
  const fetchCap = AUTO_FETCH_CAP_PAGES + extraPagesAllowed
  const cappedByUser = brregNextPage >= fetchCap && !exhausted && (
    // Capped if contact filter on and we still need more matches, OR
    // user has paged beyond what the buffer covers.
    (hasContactFilter && filteredItems.length < (page + 1) * pageSize) ||
    (!hasContactFilter && buffer.length < (page + 1) * pageSize)
  )

  // Auto-fetch more Brreg pages when we don't have enough buffered items for
  // the current logical page (with or without contact filter). Each fetch
  // grabs BRREG_FETCH_SIZE records in one round trip.
  //
  // We gate concurrent fetches via `loadingMoreRef.current`, NOT via the
  // `loadingMore` state, because including the state in the dependency array
  // makes React re-run the effect when we set it true — which would invoke
  // the cleanup function and cancel our own in-flight fetch.
  const loadingMoreRef = useRef(false)
  useEffect(() => {
    if (!hasSearched) return
    if (loading) return
    if (loadingMoreRef.current) return
    if (brregNextPage >= brregTotalPages) return
    if (brregNextPage >= fetchCap) return

    const needed = (page + 2) * pageSize  // current page + one extra so "Next" is responsive
    const haveEnough = hasContactFilter
      ? (filteredItems.length >= needed && filteredItems.length >= MIN_FILTERED_BEFORE_FETCH_MORE)
      : buffer.length >= needed
    if (haveEnough) return

    loadingMoreRef.current = true
    setLoadingMore(true)
    ;(async () => {
      try {
        const res = await searchBrreg({ ...paramsRef.current, page: brregNextPage, size: BRREG_FETCH_SIZE })
        setBuffer(prev => [...prev, ...res.items])
        setBrregNextPage(prev => prev + 1)
        // Keep brregTotal/totalPages in sync if Brreg shifts (shouldn't, but safe):
        if (res.totalPages !== brregTotalPages) setBrregTotalPages(res.totalPages)
        if (res.total !== brregTotal) setBrregTotal(res.total)
      } catch {
        // network blip — user can retry by clicking next page or "Last flere"
      } finally {
        loadingMoreRef.current = false
        setLoadingMore(false)
      }
    })()
  }, [hasSearched, hasContactFilter, page, pageSize, filteredItems.length, buffer.length, brregNextPage, brregTotalPages, loading, brregTotal, fetchCap])

  // Page navigation. The buffer is contiguous (no padding), so just moving the
  // logical page is enough — the auto-fetch effect tops up the buffer when
  // we run out.
  const goToPage = useCallback((newPage: number) => {
    const target = Math.max(0, newPage)
    setSelected(new Set())
    setPage(target)
  }, [])

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setPage(0)
    setSelected(new Set())
  }

  // Insert into ringeliste. If `kontakter` is provided we save the top one as
  // the primary contact + the full list as JSON for later kundekort-creation.
  // If `kontakter` is omitted (e.g. from bulk-add to keep things fast), the
  // contact data is left null — slide-in / kundekort can enrich it later.
  const addToRingeliste = async (company: Company, kontakter?: Kontaktperson[]) => {
    setAdding(prev => new Set([...prev, company.orgnr]))
    try {
      const top = kontakter && kontakter.length > 0 ? kontakter[0] : null
      const insert: Record<string, unknown> = {
        bedriftsnavn: company.navn,
        orgnr: company.orgnr,
        bransje_kode: company.bransjeKode,
        bransje_navn: company.bransjeNavn,
        kommune: company.kommune,
        kommunenummer: company.kommunenummer,
        ansatte: company.ansatte,
        registrert_dato: company.registrertDato,
        mva_registrert: company.mvaRegistrert,
        kilde: 'brreg',
        stage: 'ny_lead',
      }
      if (top) {
        insert.kontaktperson_navn = top.navn
        insert.kontaktperson_rolle = top.rolle
      }
      if (kontakter && kontakter.length > 0) {
        insert.kontaktpersoner = kontakter
      }

      const { error } = await supabase.from('ringeliste').insert(insert)
      // If the new columns don't exist yet (migration not run), retry without them.
      if (error && /kontaktperson|kontaktpersoner/i.test(error.message)) {
        await supabase.from('ringeliste').insert({
          bedriftsnavn: insert.bedriftsnavn,
          orgnr: insert.orgnr,
          bransje_kode: insert.bransje_kode,
          bransje_navn: insert.bransje_navn,
          kommune: insert.kommune,
          kommunenummer: insert.kommunenummer,
          ansatte: insert.ansatte,
          registrert_dato: insert.registrert_dato,
          mva_registrert: insert.mva_registrert,
          kilde: insert.kilde,
          stage: insert.stage,
        })
      }

      // Also upsert into prospekter
      await supabase.from('prospekter').upsert({
        orgnr: company.orgnr,
        navn: company.navn,
        bransje_kode: company.bransjeKode,
        bransje_navn: company.bransjeNavn,
        kommune: company.kommune,
        sett_dato: new Date().toISOString(),
      }, { onConflict: 'orgnr' })

      setRingeliste(prev => new Set([...prev, company.orgnr]))
    } catch {
      // silently fail — user sees the button not changing
    } finally {
      setAdding(prev => { const s = new Set(prev); s.delete(company.orgnr); return s })
    }
  }

  const addBulkToRingeliste = async () => {
    const companies = displayItems.filter(c => selected.has(c.orgnr) && !ringeliste.has(c.orgnr) && !kunder.has(c.orgnr))
    // Run with limited concurrency: each `addToRingeliste` call also fetches kontakter
    // (3 Brreg API calls). 3 workers in parallel keeps things responsive without
    // hammering Brreg.
    const CONCURRENCY = 3
    const queue = [...companies]
    const worker = async () => {
      while (queue.length) {
        const c = queue.shift()
        if (!c) break
        const res = await fetchKontaktpersoner(c.orgnr).catch(() => ({ kontakter: [] as Kontaktperson[] }))
        await addToRingeliste(c, res.kontakter.slice(0, 3))
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    setSelected(new Set())
  }

  const toggleAll = () => {
    if (displayItems.length === 0) return
    const allOrgnr = displayItems.map(c => c.orgnr)
    const allSelected = allOrgnr.every(o => selected.has(o))
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(allOrgnr))
    }
  }

  const newToRingeliste = selected.size > 0
    ? displayItems.filter(c => selected.has(c.orgnr) && !ringeliste.has(c.orgnr) && !kunder.has(c.orgnr)).length
    : 0

  return (
    <div className="flex gap-0">
      {/* Filter panel */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 p-5 space-y-5 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtre
          </h3>
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Nullstill
          </button>
        </div>

        {/* Bransje */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            Bransje
          </label>
          <BransjeCombobox selected={bransjer} onChange={setBransjer} />
        </div>

        {/* Organisasjonsform */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            Organisasjonsform
          </label>
          <div className="flex flex-wrap gap-2">
            {ORG_FORMER.map(of => (
              <button
                key={of.kode}
                type="button"
                onClick={() => setOrgFormer(prev =>
                  prev.includes(of.kode) ? prev.filter(k => k !== of.kode) : [...prev, of.kode]
                )}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  orgFormer.includes(of.kode)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-blue-400'
                }`}
              >
                {of.label}
              </button>
            ))}
          </div>
        </div>

        {/* Kommune */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            Kommune
          </label>
          <KommuneCombobox selected={kommuner} onChange={setKommuner} />
        </div>

        {/* Ansatte */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            Ansatte
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Fra"
              value={fraAnsatte}
              onChange={e => setFraAnsatte(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-slate-400 text-xs">–</span>
            <input
              type="number"
              placeholder="Til"
              value={tilAnsatte}
              onChange={e => setTilAnsatte(e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Registrert dato */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            Registrert
          </label>
          <div className="space-y-1.5">
            <input
              type="date"
              value={fraRegDato}
              onChange={e => setFraRegDato(e.target.value)}
              placeholder="f.o.m."
              className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={tilRegDato}
              onChange={e => setTilRegDato(e.target.value)}
              placeholder="t.o.m."
              className="w-full px-2.5 py-1.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Checkboxes */}
        <div className="space-y-2">
          {[
            { label: 'MVA-registrert', val: mvaRegistrert, set: setMvaRegistrert },
            { label: 'Foretaksregistrert', val: foretaksReg, set: setForetaksReg },
          ].map(({ label, val, set }) => (
            <label key={label} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={val}
                onChange={e => set(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {label}
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input type="checkbox" checked={true} readOnly className="w-4 h-4 rounded border-slate-300 text-blue-600" />
            <span className="text-sm text-slate-600 dark:text-slate-400">Ekskluder konkurs</span>
          </label>
        </div>

        {/* Contact info filters */}
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Kontaktinfo tilgjengelig
          </p>
          <div className="space-y-2">
            {[
              { label: 'Har hjemmeside', val: harHjemmeside, set: setHarHjemmeside, icon: <Globe className="w-3.5 h-3.5 text-blue-400" /> },
              { label: 'Har telefon', val: harTelefon, set: setHarTelefon, icon: <Phone className="w-3.5 h-3.5 text-green-400" /> },
              { label: 'Har e-post', val: harEpost, set: setHarEpost, icon: <Mail className="w-3.5 h-3.5 text-purple-400" /> },
            ].map(({ label, val, set, icon }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={val} onChange={e => set(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <div className="flex items-center gap-1.5">
                  {icon}
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
            Brreg støtter ikke filtrering på kontaktinfo — vi henter sider og filtrerer lokalt når du klikker «Søk med filtre»
          </p>
        </div>

        {/* Apply button */}
        <button
          onClick={() => doSearch()}
          className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            contactFilterDirty
              ? 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-300 dark:ring-amber-600'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <Search className="w-4 h-4" />
          {contactFilterDirty ? 'Søk med oppdaterte filtre' : 'Søk med filtre'}
        </button>
        {contactFilterDirty && hasSearched && (
          <p className="text-xs text-amber-600 dark:text-amber-400 -mt-2">
            Du har endret kontaktinfo-filteret — klikk «Søk» for å bruke det.
          </p>
        )}
      </div>

      {/* Results panel */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Search bar */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Søk på bedriftsnavn..."
              className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Søk
          </button>
        </div>

        {/* Bulk action bar */}
        {hasSearched && (
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={displayItems.length > 0 && displayItems.every(c => selected.has(c.orgnr))}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Velg alle på siden
              </label>
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full px-2 text-xs font-medium py-0.5">
                {hasContactFilter && !exhausted
                  ? `${totalCount.toLocaleString('nb')}+ treff (filtrerer…)`
                  : `${totalCount.toLocaleString('nb')} treff${hasContactFilter ? ` (av ${brregTotal.toLocaleString('nb')})` : ''}`}
              </span>
              {loadingMore && (
                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                  <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                  Henter flere…
                </span>
              )}
            </div>
            {selected.size > 0 && (
              <button
                onClick={addBulkToRingeliste}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Legg til ringeliste ({newToRingeliste})
              </button>
            )}
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {loading && (
            <div className="flex items-center justify-center h-48 gap-3">
              <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-sm text-slate-500 dark:text-slate-400">Henter fra Brreg...</span>
            </div>
          )}

          {error && (
            <div className="m-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {!loading && !error && !hasSearched && (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Søk etter bedriftsnavn eller bruk filtrene til venstre
              </p>
            </div>
          )}

          {!loading && hasSearched && displayItems.length === 0 && exhausted && (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                {hasContactFilter
                  ? 'Ingen treff matcher kontaktinfo-filteret'
                  : 'Ingen resultater for dette søket'}
              </p>
            </div>
          )}

          {!loading && hasSearched && displayItems.length === 0 && !exhausted && loadingMore && (
            <div className="flex items-center justify-center h-48 gap-3">
              <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Filtrerer treff med kontaktinfo…
              </span>
            </div>
          )}

          {!loading && hasSearched && displayItems.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 sticky top-0">
                  <th className="pl-4 pr-2 py-3 w-10" />
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Bedriftsnavn
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Bransje
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Kommune
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Ans.
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Reg.dato
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Handling
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {displayItems.map(company => (
                  <ResultRow
                    key={company.orgnr}
                    company={company}
                    checked={selected.has(company.orgnr)}
                    onCheck={checked => {
                      setSelected(prev => {
                        const s = new Set(prev)
                        if (checked) s.add(company.orgnr)
                        else s.delete(company.orgnr)
                        return s
                      })
                    }}
                    inRingeliste={ringeliste.has(company.orgnr)}
                    isKunde={kunder.has(company.orgnr)}
                    onAdd={() => addToRingeliste(company)}
                    adding={adding.has(company.orgnr)}
                    onRowClick={() => setSelectedOrgnr(company.orgnr)}
                  />
                ))}
              </tbody>
            </table>
          )}

          {/* Soft-cap notice — user can opt in to scanning more Brreg pages */}
          {cappedByUser && (
            <div className="m-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg flex items-center justify-between gap-4">
              <div className="text-sm text-amber-800 dark:text-amber-300">
                Skannet {(brregNextPage * BRREG_FETCH_SIZE).toLocaleString('nb')} av {brregTotal.toLocaleString('nb')} Brreg-bedrifter
                {hasContactFilter && ` og funnet ${filteredItems.length.toLocaleString('nb')} treff med kontaktinfo`}
                . Skann flere?
              </div>
              <button
                onClick={() => setExtraPagesAllowed(n => n + 25)}
                className="flex-shrink-0 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Last flere fra Brreg
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {hasSearched && totalCount > 0 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800 flex-wrap gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Side {page + 1}
              {hasContactFilter
                ? (!exhausted ? ' av ?' : ` av ${Math.max(1, Math.ceil(totalCount / pageSize))}`)
                : ` av ${Math.max(1, Math.ceil(totalCount / pageSize))} (${localTotalPages.toLocaleString('nb')} buffret)`}
              {' · '}
              {hasContactFilter && !exhausted
                ? `${totalCount.toLocaleString('nb')}+ treff`
                : `${totalCount.toLocaleString('nb')} treff`}
            </span>
            <div className="flex items-center gap-3">
              {/* Page size selector */}
              <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <span>Per side:</span>
                <select
                  value={pageSize}
                  onChange={e => handlePageSizeChange(Number(e.target.value))}
                  className="px-2 py-1 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                  <option value={200}>200</option>
                </select>
              </label>

              {/* Page buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 0 || loading}
                  className="p-1.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const pg = Math.max(0, Math.min(totalPages - 7, page - 3)) + i
                  return (
                    <button
                      key={pg}
                      onClick={() => goToPage(pg)}
                      disabled={loading}
                      className={`w-8 h-8 text-xs rounded border transition-colors ${
                        pg === page
                          ? 'bg-blue-600 border-blue-600 text-white font-semibold'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40'
                      }`}
                    >
                      {pg + 1}
                    </button>
                  )
                })}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={(exhausted && page >= totalPages - 1) || loading}
                  className="p-1.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedOrgnr && (
        <CompanyDetailPanel
          orgnr={selectedOrgnr}
          onClose={() => setSelectedOrgnr(null)}
          onAdd={(company, kontakter) => { addToRingeliste(company, kontakter); setSelectedOrgnr(null) }}
          inRingeliste={ringeliste.has(selectedOrgnr)}
          isKunde={kunder.has(selectedOrgnr)}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Tab 2: Nyregistrerte
// ─────────────────────────────────────────────
type SortField = 'registrert_dato' | 'navn' | 'bransje_navn' | 'kommune' | 'ansatte'

function SortableTh({ label, field, align = 'left', sortField, sortAsc, onSort }: {
  label: string
  field: SortField
  align?: 'left' | 'right'
  sortField: SortField
  sortAsc: boolean
  onSort: (f: SortField) => void
}) {
  const active = sortField === field
  const Icon = active ? (sortAsc ? ChevronUp : ChevronDown) : ChevronsUpDown
  const justify = align === 'right' ? 'justify-end' : 'justify-start'
  return (
    <th className={`px-3 py-3 text-${align} text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide`}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 ${justify} w-full uppercase tracking-wide hover:text-slate-900 dark:hover:text-white transition-colors`}
      >
        <span>{label}</span>
        <Icon className={`w-3 h-3 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'}`} />
      </button>
    </th>
  )
}

function NyregistrerteTab() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncInfo, setSyncInfo] = useState<{ sist_kjort?: string; antall_hentet?: number } | null>(null)
  const [period, setPeriod] = useState<7 | 30 | 90 | null>(30)
  const [bransjer, setBransjer] = useState<string[]>([])
  const [kommuner, setKommuner] = useState<string[]>([])
  // Contact-info filters — applied at the Supabase query level.
  const [harHjemmeside, setHarHjemmeside] = useState(false)
  const [harTelefon, setHarTelefon] = useState(false)
  const [harEpost, setHarEpost] = useState(false)
  // Sort state. Default: newest first, with orgnr as a stable tiebreaker so the
  // order doesn't shuffle on every refresh when many rows share registrert_dato.
  const [sortField, setSortField] = useState<SortField>('registrert_dato')
  const [sortAsc, setSortAsc] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  // Live counts for the bransje + kommune dropdowns so the user sees how many
  // companies match each option under the OTHER currently active filters.
  const [bransjeCounts, setBransjeCounts] = useState<Record<string, number>>({})
  const [kommuneCounts, setKommuneCounts] = useState<Record<string, number>>({})
  const [ringeliste, setRingeliste] = useState<Set<string>>(new Set())
  const [kunder, setKunder] = useState<Set<string>>(new Set())
  const [adding, setAdding] = useState<Set<string>>(new Set())
  const [selectedOrgnr, setSelectedOrgnr] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('ringeliste').select('orgnr').then(({ data }) => {
      if (data) setRingeliste(new Set(data.map((r: any) => r.orgnr)))
    })
    supabase.from('kunder').select('org_nummer').then(({ data }) => {
      if (data) setKunder(new Set(data.map((k: any) => k.org_nummer).filter(Boolean)))
    })
    supabase.from('brreg_sync').select('sist_kjort, antall_hentet').eq('type', 'nyregistrerte').single()
      .then(({ data }) => { if (data) setSyncInfo(data) })
  }, [])

  const loadNyregistrerte = useCallback(async () => {
    setLoading(true)
    // Sort by the user's chosen field, then ALWAYS by orgnr ascending as a
    // tiebreaker so two rows with identical registrert_dato don't swap places
    // between refreshes.
    let query = supabase.from('nyregistrerte').select('*')
      .order(sortField, { ascending: sortAsc, nullsFirst: false })
      .order('orgnr', { ascending: true })

    if (period !== null) {
      const from = new Date(Date.now() - period * 86400000).toISOString().slice(0, 10)
      query = query.gte('registrert_dato', from)
    }
    if (bransjer.length) query = query.in('bransje_kode', bransjer)
    if (kommuner.length) query = query.in('kommunenummer', kommuner)
    if (harHjemmeside)   query = query.not('hjemmeside', 'is', null)
    if (harTelefon)      query = query.or('telefon.not.is.null,mobil.not.is.null')
    if (harEpost)        query = query.not('epost', 'is', null)

    const { data } = await query.limit(200)
    setRows(data || [])
    setLoading(false)
  }, [period, bransjer, kommuner, harHjemmeside, harTelefon, harEpost, sortField, sortAsc])

  useEffect(() => { loadNyregistrerte() }, [loadNyregistrerte])

  // Recompute bransje + kommune counts whenever filters change. Each query
  // EXCLUDES the corresponding selector's own filter, so the count shows
  // "how many companies would I add if I picked this one too".
  useEffect(() => {
    const fromDate = period !== null
      ? new Date(Date.now() - period * 86400000).toISOString().slice(0, 10)
      : null

    const applyShared = <T extends { gte: any; in: any; not: any; or: any }>(q: T): T => {
      let r: any = q
      if (fromDate) r = r.gte('registrert_dato', fromDate)
      if (harHjemmeside) r = r.not('hjemmeside', 'is', null)
      if (harTelefon)    r = r.or('telefon.not.is.null,mobil.not.is.null')
      if (harEpost)      r = r.not('epost', 'is', null)
      return r
    }

    // Bransje counts: keep kommune filter, drop bransje filter
    let q1: any = supabase.from('nyregistrerte').select('bransje_kode')
    q1 = applyShared(q1)
    if (kommuner.length) q1 = q1.in('kommunenummer', kommuner)

    loadBransjerFromSupabase().then(grupper => {
      const koderList = grupper.flatMap(g => g.koder.map(k => k.kode))
      q1.limit(50000).then(({ data }: { data: any[] | null }) => {
        const counts: Record<string, number> = {}
        for (const r of data || []) {
          const code: string | null = r.bransje_kode
          if (!code) continue
          // A row with naeringskode "47.110" matches the level-2 prefix "47" — count under each match.
          for (const k of koderList) {
            if (code === k || code.startsWith(k + '.') || code.startsWith(k)) {
              counts[k] = (counts[k] || 0) + 1
            }
          }
        }
        setBransjeCounts(counts)
      })
    })

    // Kommune counts: keep bransje filter, drop kommune filter
    let q2: any = supabase.from('nyregistrerte').select('kommunenummer')
    q2 = applyShared(q2)
    if (bransjer.length) q2 = q2.in('bransje_kode', bransjer)

    q2.limit(50000).then(({ data }: { data: any[] | null }) => {
      const counts: Record<string, number> = {}
      for (const r of data || []) {
        const nr: string | null = r.kommunenummer
        if (!nr) continue
        counts[nr] = (counts[nr] || 0) + 1
      }
      setKommuneCounts(counts)
    })
  }, [period, bransjer, kommuner, harHjemmeside, harTelefon, harEpost])

  const handleSync = async () => {
    setSyncing(true)
    try {
      const today = new Date().toISOString().slice(0, 10)
      const from = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10)
      const url = `${BRREG}?fraRegistreringsdatoEnhetsregisteret=${from}&sort=registreringsdatoEnhetsregisteret,desc&size=200&konkurs=false&underAvvikling=false`
      const resp = await fetch(url, { headers: { Accept: 'application/json' } })
      const data = await resp.json()
      const fetchedRows = (data._embedded?.enheter || []).map(mapEnhet).map((e: Company) => ({
        orgnr: e.orgnr, navn: e.navn, org_form: e.orgForm,
        bransje_kode: e.bransjeKode, bransje_navn: e.bransjeNavn,
        kommune: e.kommune, kommunenummer: e.kommunenummer,
        ansatte: e.ansatte, registrert_dato: e.registrertDato,
        mva_registrert: e.mvaRegistrert,
        hjemmeside: e.hjemmeside, telefon: e.telefon, mobil: e.mobil, epost: e.epost,
        hentet_dato: new Date().toISOString(),
      }))
      await supabase.from('nyregistrerte').upsert(fetchedRows, { onConflict: 'orgnr' })
      await supabase.from('brreg_sync').upsert(
        { type: 'nyregistrerte', sist_kjort: new Date().toISOString(), antall_hentet: fetchedRows.length, siste_dato: today, status: 'ok' },
        { onConflict: 'type' }
      )
      setSyncInfo({ sist_kjort: new Date().toISOString(), antall_hentet: fetchedRows.length })
      loadNyregistrerte()
    } catch {
      // ignore
    } finally {
      setSyncing(false)
    }
  }

  const addToRingeliste = async (row: any, kontakter?: Kontaktperson[]) => {
    setAdding(prev => new Set([...prev, row.orgnr]))
    try {
      const top = kontakter && kontakter.length > 0 ? kontakter[0] : null
      const insert: Record<string, unknown> = {
        bedriftsnavn: row.navn,
        orgnr: row.orgnr,
        bransje_kode: row.bransje_kode,
        bransje_navn: row.bransje_navn,
        kommune: row.kommune,
        kommunenummer: row.kommunenummer,
        ansatte: row.ansatte,
        registrert_dato: row.registrert_dato,
        mva_registrert: row.mva_registrert,
        kilde: 'brreg',
        stage: 'ny_lead',
      }
      if (top) {
        insert.kontaktperson_navn = top.navn
        insert.kontaktperson_rolle = top.rolle
      }
      if (kontakter && kontakter.length > 0) {
        insert.kontaktpersoner = kontakter
      }
      const { error } = await supabase.from('ringeliste').insert(insert)
      if (error && /kontaktperson|kontaktpersoner/i.test(error.message)) {
        await supabase.from('ringeliste').insert({
          bedriftsnavn: insert.bedriftsnavn,
          orgnr: insert.orgnr,
          bransje_kode: insert.bransje_kode,
          bransje_navn: insert.bransje_navn,
          kommune: insert.kommune,
          kommunenummer: insert.kommunenummer,
          ansatte: insert.ansatte,
          registrert_dato: insert.registrert_dato,
          mva_registrert: insert.mva_registrert,
          kilde: insert.kilde,
          stage: insert.stage,
        })
      }
      setRingeliste(prev => new Set([...prev, row.orgnr]))
    } catch {
      // ignore
    } finally {
      setAdding(prev => { const s = new Set(prev); s.delete(row.orgnr); return s })
    }
  }

  const addBulkToRingeliste = async () => {
    const companies = rows.filter(r => selected.has(r.orgnr) && !ringeliste.has(r.orgnr) && !kunder.has(r.orgnr))
    const CONCURRENCY = 3
    const queue = [...companies]
    const worker = async () => {
      while (queue.length) {
        const r = queue.shift()
        if (!r) break
        const res = await fetchKontaktpersoner(r.orgnr).catch(() => ({ kontakter: [] as Kontaktperson[] }))
        await addToRingeliste(r, res.kontakter.slice(0, 3))
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker))
    setSelected(new Set())
  }

  const newToRingeliste = rows.filter(r => selected.has(r.orgnr) && !ringeliste.has(r.orgnr) && !kunder.has(r.orgnr)).length

  const toggleAll = () => {
    const allOrgnr = rows.map(r => r.orgnr)
    const allSelected = allOrgnr.every(o => selected.has(o))
    setSelected(allSelected ? new Set() : new Set(allOrgnr))
  }

  const formatDate = (d?: string) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  const resetFilters = () => {
    setPeriod(30)
    setBransjer([])
    setKommuner([])
    setHarHjemmeside(false)
    setHarTelefon(false)
    setHarEpost(false)
  }

  return (
    <div className="flex gap-0">
      {/* Filter panel */}
      <div className="w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 p-5 space-y-5 bg-slate-50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtre
          </h3>
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Nullstill
          </button>
        </div>

        {/* Periode */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            Periode
          </label>
          <div className="flex flex-col gap-1 bg-white dark:bg-slate-700 rounded-lg p-1 border border-slate-200 dark:border-slate-600">
            {([7, 30, 90, null] as const).map(p => (
              <button
                key={String(p)}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors text-left ${
                  period === p
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600'
                }`}
              >
                {p === null ? 'Alle' : `Siste ${p} dager`}
              </button>
            ))}
          </div>
        </div>

        {/* Bransje */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            Bransje
          </label>
          <BransjeCombobox selected={bransjer} onChange={setBransjer} counts={bransjeCounts} />
        </div>

        {/* Kommune */}
        <div>
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
            Kommune
          </label>
          <KommuneCombobox selected={kommuner} onChange={setKommuner} counts={kommuneCounts} />
        </div>

        {/* Kontaktinfo tilgjengelig */}
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Kontaktinfo tilgjengelig
          </p>
          <div className="space-y-2">
            {[
              { label: 'Har hjemmeside', val: harHjemmeside, set: setHarHjemmeside, icon: <Globe className="w-3.5 h-3.5 text-blue-400" /> },
              { label: 'Har telefon',    val: harTelefon,    set: setHarTelefon,    icon: <Phone className="w-3.5 h-3.5 text-green-400" /> },
              { label: 'Har e-post',     val: harEpost,      set: setHarEpost,      icon: <Mail  className="w-3.5 h-3.5 text-purple-400" /> },
            ].map(({ label, val, set, icon }) => (
              <label key={label} className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" checked={val} onChange={e => set(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                <div className="flex items-center gap-1.5">
                  {icon}
                  <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
            Filtreres på lagrede kolonner — bare rader synkronisert etter at funksjonen ble lagt til vil ha data her.
          </p>
        </div>

        {/* Sync info + button */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
          {syncInfo && (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sist synkronisert: {formatDate(syncInfo.sist_kjort)}
              {syncInfo.antall_hentet !== undefined && ` — ${syncInfo.antall_hentet} bedrifter`}
            </p>
          )}
          <button
            onClick={handleSync}
            disabled={syncing}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Synkroniserer…' : 'Synkroniser nå'}
          </button>
        </div>
      </div>

      {/* Main panel */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Bulk action bar */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
              <input
                type="checkbox"
                onChange={toggleAll}
                checked={rows.length > 0 && rows.every(r => selected.has(r.orgnr))}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Velg alle på siden
            </label>
            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full px-2 text-xs font-medium py-0.5">
              {rows.length.toLocaleString('nb')} bedrifter
            </span>
          </div>
          {selected.size > 0 && (
            <button
              onClick={addBulkToRingeliste}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Legg til ringeliste ({newToRingeliste})
            </button>
          )}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-40 gap-3">
            <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm text-slate-500 dark:text-slate-400">Laster nyregistrerte...</span>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <Zap className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Ingen bedrifter funnet. Prøv å synkronisere.
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th className="pl-4 pr-2 py-3 w-10" />
                <SortableTh label="Bedriftsnavn" field="navn"          sortField={sortField} sortAsc={sortAsc} onSort={f => { if (f === sortField) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(true) } }} />
                <SortableTh label="Bransje"      field="bransje_navn"  sortField={sortField} sortAsc={sortAsc} onSort={f => { if (f === sortField) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(true) } }} />
                <SortableTh label="Kommune"      field="kommune"       sortField={sortField} sortAsc={sortAsc} onSort={f => { if (f === sortField) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(true) } }} />
                <SortableTh label="Ans."         field="ansatte"       align="right"  sortField={sortField} sortAsc={sortAsc} onSort={f => { if (f === sortField) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(false) } }} />
                <SortableTh label="Reg.dato"     field="registrert_dato" sortField={sortField} sortAsc={sortAsc} onSort={f => { if (f === sortField) setSortAsc(!sortAsc); else { setSortField(f); setSortAsc(false) } }} />
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                  Handling
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {rows.map(row => {
                const checked = selected.has(row.orgnr)
                const inRL = ringeliste.has(row.orgnr)
                const isK = kunder.has(row.orgnr)
                return (
                  <tr
                    key={row.orgnr}
                    onClick={() => setSelectedOrgnr(row.orgnr)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer ${
                      checked ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-l-blue-500' : ''
                    }`}
                  >
                    <td className="pl-4 pr-2 py-3" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={e => {
                          setSelected(prev => {
                            const s = new Set(prev)
                            if (e.target.checked) s.add(row.orgnr)
                            else s.delete(row.orgnr)
                            return s
                          })
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-slate-900 dark:text-white text-sm">{row.navn}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{row.orgnr}</div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400 max-w-[140px] truncate">
                      {row.bransje_navn
                        ? <span title={row.bransje_navn}>{row.bransje_navn.length > 28 ? row.bransje_navn.slice(0, 27) + '…' : row.bransje_navn}</span>
                        : <span className="text-slate-300 dark:text-slate-600">—</span>}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        {row.kommune || '—'}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-600 dark:text-slate-400 text-right">
                      {row.ansatte !== null && row.ansatte !== undefined ? row.ansatte : '—'}
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-500 dark:text-slate-500">
                      {row.registrert_dato || '—'}
                    </td>
                    <td className="px-4 py-3 text-right" onClick={e => e.stopPropagation()}>
                      {isK ? (
                        <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-lg">
                          Allerede kunde
                        </span>
                      ) : inRL ? (
                        <span className="text-xs text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-lg inline-flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          I ringeliste
                        </span>
                      ) : (
                        <button
                          onClick={() => addToRingeliste(row)}
                          disabled={adding.has(row.orgnr)}
                          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                        >
                          {adding.has(row.orgnr) ? '…' : 'Legg til'}
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedOrgnr && (
        <CompanyDetailPanel
          orgnr={selectedOrgnr}
          onClose={() => setSelectedOrgnr(null)}
          onAdd={(company, kontakter) => {
            // For nyregistrerte, the "row" object has different field names than Company.
            // Build a synthetic row from the Company object.
            const row = {
              orgnr: company.orgnr,
              navn: company.navn,
              bransje_kode: company.bransjeKode,
              bransje_navn: company.bransjeNavn,
              kommune: company.kommune,
              kommunenummer: company.kommunenummer,
              ansatte: company.ansatte,
              registrert_dato: company.registrertDato,
              mva_registrert: company.mvaRegistrert,
            }
            addToRingeliste(row, kontakter)
            setSelectedOrgnr(null)
          }}
          inRingeliste={ringeliste.has(selectedOrgnr)}
          isKunde={kunder.has(selectedOrgnr)}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────
export function ProspectsMVP() {
  const [activeTab, setActiveTab] = useState<'sok' | 'nyregistrerte'>('sok')

  const tabs = [
    { key: 'sok' as const, label: 'Prospektsøk', icon: <Search className="w-4 h-4" /> },
    { key: 'nyregistrerte' as const, label: 'Nyregistrerte', icon: <Zap className="w-4 h-4" /> },
  ]

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prospektering</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Søk i Brønnøysundregistrene og finn nye kunder
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-500 dark:text-slate-400">Brreg API</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mt-5">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto bg-white dark:bg-slate-800">
        {activeTab === 'sok' && <ProspektSok />}
        {activeTab === 'nyregistrerte' && <NyregistrerteTab />}
      </div>
    </div>
  )
}
