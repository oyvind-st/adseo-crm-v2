import { useState, useEffect, useCallback, useRef } from 'react'
import {
  Search, Filter, RefreshCw, Building2, MapPin, Users,
  Calendar, CheckCircle, Plus, ChevronLeft, ChevronRight,
  X, ChevronDown, Zap, Globe, Phone, Mail, ExternalLink,
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
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const BRREG = 'https://data.brreg.no/enhetsregisteret/api/enheter'

const BRANSJER = [
  { gruppe: 'Bygg og anlegg', koder: [
    { kode: '41', navn: 'Oppføring av bygninger' },
    { kode: '43', navn: 'Spesialisert bygge- og anleggsvirksomhet' },
    { kode: '42', navn: 'Anleggsvirksomhet' },
  ]},
  { gruppe: 'IT og teknologi', koder: [
    { kode: '62', navn: 'Tjenester tilknyttet IT' },
    { kode: '63', navn: 'Informasjonstjenester' },
    { kode: '61', navn: 'Telekommunikasjon' },
  ]},
  { gruppe: 'Handel', koder: [
    { kode: '47', navn: 'Detaljhandel' },
    { kode: '46', navn: 'Engroshandel' },
    { kode: '45', navn: 'Handel med motorvogner' },
  ]},
  { gruppe: 'Regnskap og finans', koder: [
    { kode: '69.201', navn: 'Regnskap og bokføring' },
    { kode: '64', navn: 'Finansieringsvirksomhet' },
    { kode: '66', navn: 'Hjelpevirksomhet for finansiering' },
  ]},
  { gruppe: 'Konsulent og rådgivning', koder: [
    { kode: '70.22', navn: 'Bedriftsrådgivning' },
    { kode: '73', navn: 'Reklame og markedsundersøkelse' },
    { kode: '74', navn: 'Annen faglig, vitenskapelig virksomhet' },
  ]},
  { gruppe: 'Transport og logistikk', koder: [
    { kode: '49', navn: 'Landtransport og rørtransport' },
    { kode: '52', navn: 'Lagring og hjelpevirksom. for transport' },
    { kode: '53', navn: 'Post og distribusjonsvirksomhet' },
  ]},
  { gruppe: 'Restaurant og overnatting', koder: [
    { kode: '56', navn: 'Serveringsvirksomhet' },
    { kode: '55', navn: 'Overnattingsvirksomhet' },
  ]},
  { gruppe: 'Helse og velvære', koder: [
    { kode: '86', navn: 'Helsetjenester' },
    { kode: '96', navn: 'Personlig tjenesteytelse' },
    { kode: '88', navn: 'Sosiale omsorgstjenester uten botilbud' },
  ]},
  { gruppe: 'Industri og produksjon', koder: [
    { kode: '25', navn: 'Metallvareindustri' },
    { kode: '28', navn: 'Produksjon av maskiner og utstyr' },
    { kode: '10', navn: 'Næringsmiddelindustri' },
  ]},
  { gruppe: 'Eiendom', koder: [
    { kode: '68', navn: 'Omsetning og drift av fast eiendom' },
    { kode: '41.200', navn: 'Boligbyggelag' },
  ]},
]

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
  url.searchParams.set('size', '20')
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
}: {
  selected: string[]
  onChange: (koder: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const allKoder = BRANSJER.flatMap(g => g.koder)
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
          {selected.length === 0 ? 'Alle bransjer' : `${selected.length} valgt`}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
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
            {(filtered ? [{ gruppe: 'Søkeresultater', koder: filtered }] : BRANSJER).map(gruppe => (
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
                    <span className="text-xs text-slate-400 dark:text-slate-500">{k.kode}</span>
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
// Sub-component: KommuneCombobox
// ─────────────────────────────────────────────
// Kommuner loaded dynamically from Brreg
let _kommunerCache: { nr: string; navn: string }[] | null = null

async function loadKommuner() {
  if (_kommunerCache) return _kommunerCache
  try {
    const resp = await fetch('https://data.brreg.no/enhetsregisteret/api/kommuner', {
      headers: { Accept: 'application/json' }
    })
    const data = await resp.json()
    _kommunerCache = (data._embedded?.kommuner || [])
      .map((k: any) => ({ nr: k.nummer, navn: k.navn }))
      .sort((a: any, b: any) => a.navn.localeCompare(b.navn, 'nb'))
    return _kommunerCache
  } catch {
    return []
  }
}

function KommuneCombobox({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (nr: string[]) => void
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [kommuner, setKommuner] = useState<{ nr: string; navn: string }[]>([])
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadKommuner().then(setKommuner)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = kommuner.filter(k =>
    k.navn.toLowerCase().includes(query.toLowerCase()) || k.nr.includes(query)
  )

  const toggle = (nr: string) => {
    onChange(selected.includes(nr) ? selected.filter(k => k !== nr) : [...selected, nr])
  }

  const selectedNames = selected.map(nr => kommuner.find(k => k.nr === nr)?.navn || nr)

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-sm text-left hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <span className="text-slate-600 dark:text-slate-300 truncate">
          {selected.length === 0 ? 'Alle kommuner' : selectedNames.join(', ')}
        </span>
        <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 ml-1" />
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          <div className="p-2 border-b border-slate-100 dark:border-slate-700">
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Søk kommune..."
              className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 rounded bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="py-1">
            {filtered.map(k => (
              <button
                key={k.nr}
                type="button"
                onClick={() => toggle(k.nr)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors ${
                  selected.includes(k.nr) ? 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center text-xs ${
                  selected.includes(k.nr)
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-slate-300 dark:border-slate-500'
                }`}>
                  {selected.includes(k.nr) && '✓'}
                </span>
                {k.navn}
              </button>
            ))}
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
  onAdd: (c: Company) => void
  inRingeliste: boolean
  isKunde: boolean
}) {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchCompanyDetail(orgnr).then(c => { setCompany(c); setLoading(false) })
  }, [orgnr])

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
              onClick={() => onAdd(company)}
              className="w-full px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" /> Legg til ringeliste
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
  // Contact info filters (client-side post-filter)
  const [harHjemmeside, setHarHjemmeside] = useState(false)
  const [harTelefon, setHarTelefon] = useState(false)
  const [harEpost, setHarEpost] = useState(false)

  // Results
  const [result, setResult] = useState<BrregResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
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

  const doSearch = useCallback(async (pg: number) => {
    setLoading(true)
    setError('')
    try {
      const params: SearchParams = {
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
        page: pg,
      }
      const res = await searchBrreg(params)
      setResult(res)
      setPage(pg)
      setSelected(new Set())
    } catch {
      setError('Klarte ikke hente data fra Brreg. Prøv igjen.')
    } finally {
      setLoading(false)
    }
  }, [searchName, bransjer, orgFormer, kommuner, fraAnsatte, tilAnsatte, fraRegDato, tilRegDato, mvaRegistrert, foretaksReg])

  const handleSearch = () => {
    setSearchName(searchInput)
    setPage(0)
  }

  // Re-search when searchName changes
  useEffect(() => {
    if (searchName !== '' || bransjer.length || orgFormer.length || kommuner.length) {
      doSearch(0)
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

  // Client-side post-filter for contact info
  const displayItems = (result?.items || []).filter(c => {
    if (harHjemmeside && !c.hjemmeside) return false
    if (harTelefon && !c.telefon && !c.mobil) return false
    if (harEpost && !c.epost) return false
    return true
  })

  const addToRingeliste = async (company: Company) => {
    setAdding(prev => new Set([...prev, company.orgnr]))
    try {
      await supabase.from('ringeliste').insert({
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
      })
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
    if (!result) return
    const companies = result.items.filter(c => selected.has(c.orgnr) && !ringeliste.has(c.orgnr) && !kunder.has(c.orgnr))
    for (const company of companies) {
      await addToRingeliste(company)
    }
    setSelected(new Set())
  }

  const toggleAll = () => {
    if (!result) return
    const allOrgnr = result.items.map(c => c.orgnr)
    const allSelected = allOrgnr.every(o => selected.has(o))
    if (allSelected) {
      setSelected(new Set())
    } else {
      setSelected(new Set(allOrgnr))
    }
  }

  const newToRingeliste = selected.size > 0 && result
    ? result.items.filter(c => selected.has(c.orgnr) && !ringeliste.has(c.orgnr) && !kunder.has(c.orgnr)).length
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
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">Filtreres lokalt etter søk</p>
        </div>

        {/* Apply button */}
        <button
          onClick={() => doSearch(0)}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Søk med filtre
        </button>
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
        {result && (
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={result.items.length > 0 && result.items.every(c => selected.has(c.orgnr))}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                Velg alle
              </label>
              <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full px-2 text-xs font-medium py-0.5">
                {result.total.toLocaleString('nb')} treff
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

          {!loading && !error && !result && (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Søk etter bedriftsnavn eller bruk filtrene til venstre
              </p>
            </div>
          )}

          {!loading && result && result.items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <Search className="w-10 h-10 text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">Ingen resultater for dette søket</p>
            </div>
          )}

          {!loading && result && result.items.length > 0 && (
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
        </div>

        {/* Pagination */}
        {result && result.totalPages > 1 && (
          <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Side {page + 1} av {result.totalPages} · {result.total.toLocaleString('nb')} treff
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => doSearch(page - 1)}
                disabled={page === 0}
                className="p-1.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(7, result.totalPages) }, (_, i) => {
                const pg = Math.max(0, Math.min(result.totalPages - 7, page - 3)) + i
                return (
                  <button
                    key={pg}
                    onClick={() => doSearch(pg)}
                    className={`w-8 h-8 text-xs rounded border transition-colors ${
                      pg === page
                        ? 'bg-blue-600 border-blue-600 text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {pg + 1}
                  </button>
                )
              })}
              <button
                onClick={() => doSearch(page + 1)}
                disabled={page >= result.totalPages - 1}
                className="p-1.5 rounded border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      {selectedOrgnr && (
        <CompanyDetailPanel
          orgnr={selectedOrgnr}
          onClose={() => setSelectedOrgnr(null)}
          onAdd={(company) => { addToRingeliste(company); setSelectedOrgnr(null) }}
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
function NyregistrerteTab() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [syncInfo, setSyncInfo] = useState<{ sist_kjort?: string; antall_hentet?: number } | null>(null)
  const [period, setPeriod] = useState<7 | 30 | 90 | null>(30)
  const [bransjer, setBransjer] = useState<string[]>([])
  const [kommuner, setKommuner] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
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
    let query = supabase.from('nyregistrerte').select('*').order('registrert_dato', { ascending: false })

    if (period !== null) {
      const from = new Date(Date.now() - period * 86400000).toISOString().slice(0, 10)
      query = query.gte('registrert_dato', from)
    }
    if (bransjer.length) {
      query = query.in('bransje_kode', bransjer)
    }
    if (kommuner.length) {
      query = query.in('kommunenummer', kommuner)
    }

    const { data } = await query.limit(200)
    setRows(data || [])
    setLoading(false)
  }, [period, bransjer, kommuner])

  useEffect(() => { loadNyregistrerte() }, [loadNyregistrerte])

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
        mva_registrert: e.mvaRegistrert, hentet_dato: new Date().toISOString(),
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

  const addToRingeliste = async (row: any) => {
    setAdding(prev => new Set([...prev, row.orgnr]))
    try {
      await supabase.from('ringeliste').insert({
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
      })
      setRingeliste(prev => new Set([...prev, row.orgnr]))
    } catch {
      // ignore
    } finally {
      setAdding(prev => { const s = new Set(prev); s.delete(row.orgnr); return s })
    }
  }

  const addBulkToRingeliste = async () => {
    const companies = rows.filter(r => selected.has(r.orgnr) && !ringeliste.has(r.orgnr) && !kunder.has(r.orgnr))
    for (const row of companies) await addToRingeliste(row)
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

  return (
    <div className="p-5 space-y-4">
      {/* Controls */}
      <div className="flex items-center flex-wrap gap-3">
        {/* Period filter */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
          {([7, 30, 90, null] as const).map(p => (
            <button
              key={String(p)}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {p === null ? 'Alle' : `Siste ${p} dager`}
            </button>
          ))}
        </div>

        {/* Bransje filter */}
        <div className="w-52">
          <BransjeCombobox selected={bransjer} onChange={setBransjer} />
        </div>

        {/* Kommune filter */}
        <div className="w-44">
          <KommuneCombobox selected={kommuner} onChange={setKommuner} />
        </div>

        <div className="flex-1" />

        {syncInfo && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Sist synkronisert: {formatDate(syncInfo.sist_kjort)}
            {syncInfo.antall_hentet !== undefined && ` — ${syncInfo.antall_hentet} nye bedrifter`}
          </span>
        )}

        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          Synkroniser nå
        </button>
      </div>

      {/* Bulk action bar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600 dark:text-slate-400">
            <input
              type="checkbox"
              onChange={toggleAll}
              checked={rows.length > 0 && rows.every(r => selected.has(r.orgnr))}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Velg alle
          </label>
          <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full px-2 text-xs font-medium py-0.5">
            {rows.length} bedrifter
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
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
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

      {/* Detail panel */}
      {selectedOrgnr && (
        <CompanyDetailPanel
          orgnr={selectedOrgnr}
          onClose={() => setSelectedOrgnr(null)}
          onAdd={(company) => { addToRingeliste(company); setSelectedOrgnr(null) }}
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
