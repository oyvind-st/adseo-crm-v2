# Adseo CRM — Prosjektbriefing for Claude

## Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Lucide React
- **Backend/DB**: Supabase (PostgreSQL, Auth, RLS delvis aktivert)
- **Hosting**: Vercel (auto-deploy fra `main`-branch)
- **Repo**: https://github.com/oyvind-st/adseo-crm-v2
- **Live**: https://adseo-crm-v2.vercel.app
- **Supabase project**: `wqjomkmlgtuuhlkghnfr`

## Viktige miljøvariabler (Vercel)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — frontend
- `VITE_SUPABASE_SERVICE_KEY` — brukes i frontend (ikke ideelt, men intern app)
- `SUPABASE_SERVICE_KEY` — brukes i `/api/invite-user.ts` serverless function

## Auth
- Supabase Auth med magic link + passord
- Session leses **direkte fra localStorage** (`sb-wqjomkmlgtuuhlkghnfr-auth-token`) for å unngå Supabase auth lock-bug
- `autoRefreshToken: false` i Supabase-klienten
- `supabaseAdmin` klient (service key) brukes kun til admin-operasjoner

## Mappestruktur
```
src/app/
  components/
    mvp/           ← Alle hovedsider (Figma Make-baserte komponenter)
    shared/        ← Gjenbrukbare: TicketRow, LeveranseRow, Tabs, StatCard, etc.
    Layout.tsx     ← Meny + navigasjon
    TaskItem.tsx   ← Oppgave-rad med Loggfør-panel
  contexts/
    UserContext.tsx    ← Auth + stampActivity (sist aktiv tracking)
    DarkModeContext.tsx
  App.tsx          ← Ruter
api/
  invite-user.ts   ← Vercel serverless: bruker-invitasjon via admin API
supabase/
  functions/brreg-sync/  ← Edge function for daglig Brreg-sync (ikke deployet ennå)
```

## Database-tabeller (viktigste)
| Tabell | Formål |
|--------|--------|
| `kunder` | Kunder med MRR, helse-score |
| `kontakter` | Kontaktpersoner per kunde |
| `tickets` + `ticket_meldinger` | Support-tickets med samtalehistorikk, CC-støtte |
| `oppgaver` | Oppgaver med type, frist, ansvarlig_id |
| `leveranser` + `leveranse_oppgaver` | Leveranse-prosjekter |
| `leads` | Pipeline/salg |
| `ringeliste` | Prospekter lagt til ringekøen (inkl. Brreg-data) |
| `prospekter` | Cache av Brreg-søk |
| `nyregistrerte` | Daglig feed av nyregistrerte bedrifter |
| `brreg_fylker` | 16 fylker med sortering |
| `brreg_kommuner` | 353 kommuner koblet til fylke |
| `aktivitetslogg` | Kundekontakt-logg (type: call_answered/email/meeting/notat etc.) |
| `profiles` | Ansatte/brukere |
| `brreg_sync` | Tracking av siste Brreg-synkronisering |

## Nøkkelmønstre
- **Figma Make-filer** ligger i `/sessions/friendly-zen-cannon/mnt/uploads/` og i `/sessions/friendly-zen-cannon/figma-new/src/src/app/components/mvp/` — disse skal alltid brukes som utgangspunkt for nye komponenter
- **Vercel CDN-cache**: Etter push må man alltid gjøre **Redeploy uten «Use existing Build Cache»** for at endringer skal vises
- **Supabase `.rpc()`** er lazy — må kalle `.then(() => {})` for at spørringen faktisk sendes
- **Tabs**: Bruk inline `<button>`-tabs (samme stil som TicketList), ikke den shared Tabs-komponenten
- Shared komponenter: `LeveranseRow`, `TicketRow` i `src/app/components/shared/`

## Sider og ruter
| Rute | Komponent |
|------|-----------|
| `/` | Dashboard |
| `/tasks` | TaskListMVP |
| `/tickets` + `/:id` | TicketListMVP, TicketDetailMVP |
| `/leveranser` | LeveranserListMVP |
| `/customers` + `/:id` | CustomerListMVP, CustomerDetailMVP |
| `/leads` | LeadListMVP |
| `/prospects` | ProspectsMVP |
| `/settings` | Settings |
| `/design-system` | DesignSystemMVP |

## Prospekteringsverktøy (nylig bygget)
- `ProspectsMVP` har to tabs: **Prospektsøk** (live Brreg API) og **Nyregistrerte** (fra Supabase)
- Kommunefilter leser fra `brreg_fylker` + `brreg_kommuner` tabeller
- Klikk på bedrift → slide-in detaljpanel med full info + «Legg til ringeliste»
- Filtre: bransje (kategorisert), org.form, kommune/fylke, ansatte, dato, har hjemmeside/telefon/epost

## Aktivt arbeid
- Prospekteringsverktøy er ferdig — skal videreutvikles med Proff-integrasjon
- Leveranse-siden bruker Figma-design
- Oppgavesystem har inline Loggfør-panel (klikk «Loggfør» → logg + oppfølgingsoppgave)
- «Sist aktiv» trackes via `stampActivity()` i Layout ved navigasjon

## Bruker
- Øyvind Stangnes, oyvind@adseo.no, admin
