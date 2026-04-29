import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types matching our database
export type Kunde = {
  id: string
  bedriftsnavn: string
  juridisk_navn?: string
  org_nummer?: string
  nettside?: string
  sted?: string
  mrr: number
  kunde_siden?: string
  helse_score: number
  kontakter?: Kontakt[]
  tjenester?: Tjeneste[]
}

export type Kontakt = {
  id: string
  kunde_id: string
  navn: string
  tittel?: string
  epost?: string
  telefon?: string
  er_primaer: boolean
}

export type Tjeneste = {
  id: string
  kunde_id: string
  navn: string
  status: string
  pris_per_mnd: number
}

export type Oppgave = {
  id: string
  tittel: string
  beskrivelse?: string
  prioritet: 'høy' | 'medium' | 'lav'
  status: 'ikke_startet' | 'pagar' | 'fullfort'
  frist?: string
  kunde_id?: string
  kunder?: { bedriftsnavn: string }
}

export type Ticket = {
  id: string
  tittel: string
  beskrivelse?: string
  prioritet: 'høy' | 'medium' | 'lav'
  status: 'apent' | 'pagar' | 'venter_pa_kunde' | 'lukket'
  kategori?: string
  kunde_id?: string
  kunder?: { bedriftsnavn: string }
  kontakter?: { navn: string }
  created_at: string
}

export type Leveranse = {
  id: string
  tittel: string
  type?: string
  status: 'ikke_startet' | 'pagar' | 'venter_pa_kunde' | 'ferdig'
  frist?: string
  kunde_id?: string
  kunder?: { bedriftsnavn: string }
  leveranse_oppgaver?: { id: string; fullfort: boolean }[]
}

export type Lead = {
  id: string
  bedriftsnavn: string
  kontaktperson?: string
  stilling?: string
  telefon?: string
  stage: string
  verdi: number
  sannsynlighet: number
  neste_steg?: string
  neste_steg_dato?: string
}
