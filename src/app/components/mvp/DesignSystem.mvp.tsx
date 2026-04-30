import { useState } from 'react'
import {
  Plus, Search, Mail, Ticket, AlertTriangle, CheckCircle2, Clock,
  Users, TrendingUp, Settings, Loader2
} from 'lucide-react'
import {
  Button, Card, CardHeader, CardBody,
  Tabs, Tab, TabList,
  Avatar, Badge, PriorityBadge, StatusBadge, HealthScore,
  Input, SearchInput, Textarea, Select,
  StatCard, PageHeader,
  EmptyState, Loading, Skeleton,
  TicketRow,
  LeveranseRow,
} from '../shared'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{title}</h2>
      {children}
    </div>
  )
}

function Row({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {label && <span className="text-xs text-slate-400 w-20 flex-shrink-0">{label}</span>}
      {children}
    </div>
  )
}

export function DesignSystemMVP() {
  const [tab, setTab] = useState('knapper')
  const [tabDemo, setTabDemo] = useState('alle')

  return (
    <div className="p-6 space-y-10 max-w-4xl">
      <PageHeader
        title="Designsystem"
        subtitle="Oversikt over alle gjenbrukbare komponenter"
      />

      {/* ── KNAPPER ── */}
      <Section title="Knapper — Button">
        <Card padding>
          <div className="space-y-4">
            <Row label="Variants">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="success">Success</Button>
            </Row>
            <Row label="Med ikon">
              <Button icon={<Plus size={15} />}>Ny oppgave</Button>
              <Button variant="secondary" icon={<Search size={15} />}>Søk</Button>
              <Button variant="danger" icon={<AlertTriangle size={15} />}>Slett</Button>
            </Row>
            <Row label="Størrelse">
              <Button size="sm">Liten</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Stor</Button>
            </Row>
            <Row label="Tilstand">
              <Button loading>Laster</Button>
              <Button disabled>Deaktivert</Button>
            </Row>
          </div>
        </Card>
      </Section>

      {/* ── BADGES ── */}
      <Section title="Badges">
        <Card padding>
          <div className="space-y-4">
            <Row label="Prioritet">
              <PriorityBadge priority="høy" />
              <PriorityBadge priority="medium" />
              <PriorityBadge priority="lav" />
            </Row>
            <Row label="Status">
              <StatusBadge status="apent" />
              <StatusBadge status="pagar" />
              <StatusBadge status="venter_pa_kunde" />
              <StatusBadge status="lukket" />
              <StatusBadge status="ferdig" />
              <StatusBadge status="ikke_startet" />
            </Row>
            <Row label="Helse">
              <HealthScore score={92} />
              <HealthScore score={67} />
              <HealthScore score={34} />
            </Row>
            <Row label="Badge">
              <Badge variant="blue">Blå</Badge>
              <Badge variant="green">Grønn</Badge>
              <Badge variant="red">Rød</Badge>
              <Badge variant="orange">Orange</Badge>
              <Badge variant="yellow">Gul</Badge>
              <Badge variant="purple">Lilla</Badge>
              <Badge variant="slate">Grå</Badge>
            </Row>
            <Row label="Med prikk">
              <Badge variant="green" dot>Aktiv</Badge>
              <Badge variant="red" dot>Feil</Badge>
              <Badge variant="yellow" dot>Advarsel</Badge>
            </Row>
          </div>
        </Card>
      </Section>

      {/* ── STATS ── */}
      <Section title="StatCard">
        <div className="grid grid-cols-4 gap-4">
          <StatCard label="Aktive kunder" value={47}
            icon={<Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
            iconColor="bg-blue-50 dark:bg-blue-900/30"
            change="+3 denne måneden" />
          <StatCard label="Åpne tickets" value={12}
            icon={<Ticket className="w-5 h-5 text-green-600 dark:text-green-400" />}
            iconColor="bg-green-50 dark:bg-green-900/30" />
          <StatCard label="Høy prioritet" value={3}
            icon={<AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />}
            iconColor="bg-red-50 dark:bg-red-900/30" />
          <StatCard label="Laster..." value={0} loading />
        </div>
      </Section>

      {/* ── AVATAR ── */}
      <Section title="Avatar">
        <Card padding>
          <div className="space-y-4">
            <Row label="Størrelse">
              <Avatar name="Øyvind Andreassen" size="xs" />
              <Avatar name="Øyvind Andreassen" size="sm" />
              <Avatar name="Øyvind Andreassen" size="md" />
              <Avatar name="Øyvind Andreassen" size="lg" />
              <Avatar name="Øyvind Andreassen" size="xl" />
            </Row>
            <Row label="Form">
              <Avatar name="Nordic Tech AS" shape="circle" size="md" />
              <Avatar name="Nordic Tech AS" shape="rounded" size="md" />
            </Row>
            <Row label="Farger">
              <Avatar name="Ola Nordmann" color="blue" size="md" />
              <Avatar name="Kari Jensen" color="violet" size="md" />
              <Avatar name="Per Hansen" color="green" size="md" />
              <Avatar name="Nina Olsen" color="orange" size="md" />
            </Row>
          </div>
        </Card>
      </Section>

      {/* ── TABS ── */}
      <Section title="Tabs">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            {['Alle', 'Åpne', 'Pågår', 'Lukket'].map(t => (
              <button key={t} onClick={() => setTabDemo(t.toLowerCase())}
                className={`flex-1 px-6 py-3 font-medium transition-colors text-sm ${
                  tabDemo === t.toLowerCase()
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}>
                {t}
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">5</span>
              </button>
            ))}
          </div>
          <div className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
            Innhold for tab: <strong>{tabDemo}</strong>
          </div>
        </div>
      </Section>

      {/* ── KORT ── */}
      <Section title="Card">
        <div className="grid grid-cols-2 gap-4">
          <Card padding>
            <p className="text-sm text-slate-700 dark:text-slate-300">Enkel card med padding</p>
          </Card>
          <Card hover>
            <CardHeader action={<Button size="sm" variant="secondary">Handling</Button>}>
              <p className="font-semibold text-slate-900 dark:text-white">Card med header</p>
              <p className="text-sm text-slate-500">Undertittel her</p>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-slate-600 dark:text-slate-400">Innhold i CardBody</p>
            </CardBody>
          </Card>
        </div>
      </Section>

      {/* ── INPUT ── */}
      <Section title="Skjema — Input, Select, Textarea">
        <Card padding>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Tekstfelt" placeholder="Skriv noe..." />
            <SearchInput placeholder="Søk..." />
            <Select label="Velg alternativ">
              <option>Alternativ 1</option>
              <option>Alternativ 2</option>
              <option>Alternativ 3</option>
            </Select>
            <Input label="Med feil" placeholder="Feil her" error="Dette feltet er påkrevd" />
            <div className="col-span-2">
              <Textarea label="Tekstområde" placeholder="Skriv en lengre tekst..." rows={3} />
            </div>
          </div>
        </Card>
      </Section>

      {/* ── TICKET ROW ── */}
      <Section title="TicketRow — gjenbrukbar ticket-rad">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <TicketRow
            id="demo-1"
            tittel="Spørsmål om rapportdata"
            beskrivelse="Kunde lurer på hvorfor trafikktallene er annerledes enn i Google Analytics"
            prioritet="medium"
            status="apent"
            kategori="Rapport og tall"
            kunder={{ bedriftsnavn: 'Nordic Tech AS' }}
            kontakter={{ navn: 'Maria Hansen' }}
            created_at={new Date(Date.now() - 3600000 * 4).toISOString()}
          />
          <TicketRow
            id="demo-2"
            tittel="Teknisk feil på tracking"
            beskrivelse="Conversions registreres ikke korrekt i Google Analytics"
            prioritet="høy"
            status="pagar"
            kategori="Teknisk feil"
            kunder={{ bedriftsnavn: 'E-commerce Pro AS' }}
            created_at={new Date(Date.now() - 3600000 * 1).toISOString()}
            last
          />
        </div>
      </Section>

      {/* ── LEVERANSE ROW ── */}
      <Section title="LeveranseRow — gjenbrukbar leveranse-rad">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
          <LeveranseRow
            id="demo-1"
            customer="Nordic Tech AS"
            type="Hjemmeside"
            status="in_progress"
            progress={45}
            tasksCompleted={4}
            tasksTotal={9}
            responsible="Ola Nordmann"
            deadline="30. mai 2026"
            hasUnreadTickets
          />
          <LeveranseRow
            id="demo-2"
            customer="Green Energy Norway"
            type="Nettbutikk"
            status="not_started"
            progress={0}
            tasksCompleted={0}
            tasksTotal={12}
            responsible="Kari Jensen"
            deadline="15. juni 2026"
          />
          <LeveranseRow
            id="demo-3"
            customer="Tech Startup AS"
            type="Google Ads oppsett"
            status="completed"
            progress={100}
            tasksCompleted={5}
            tasksTotal={5}
            responsible="Kari Jensen"
            deadline="1. mai 2026"
          />
        </div>
      </Section>

      {/* ── LOADING / EMPTY ── */}
      <Section title="Loading & Empty states">
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <Loading text="Laster data..." />
          </Card>
          <Card>
            <EmptyState
              icon={<Ticket size={24} />}
              title="Ingen tickets"
              description="Det er ingen åpne tickets akkurat nå"
              action={{ label: 'Ny ticket', onClick: () => {}, icon: <Plus size={14} /> }}
            />
          </Card>
        </div>
        <Card padding>
          <p className="text-xs text-slate-400 mb-3">Skeleton loaders:</p>
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Card>
      </Section>
    </div>
  )
}
