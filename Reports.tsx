import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Filter,
  UserPlus,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  Building,
  Globe,
  Briefcase,
  Activity,
  Eye,
  FileText,
  MousePointerClick,
  CheckCircle2,
  AlertCircle,
  Info,
  Search,
  MapPin,
  TrendingDown,
  Target,
  BarChart3,
  RefreshCw,
  Download,
  Zap,
  Award,
  Edit,
  Trash2
} from 'lucide-react';

export function LeadList() {
  const navigate = useNavigate();
  const [view, setView] = useState<'pipeline' | 'list' | 'intelligence'>('pipeline');
  const [selectedLead, setSelectedLead] = useState<string | null>(null);

  const pipelineStages = [
    { id: 'new', label: 'New lead', color: 'bg-slate-100 dark:bg-slate-700' },
    { id: 'qualification', label: 'Under qualification', color: 'bg-blue-100' },
    { id: 'meeting', label: 'Meeting booked', color: 'bg-purple-100' },
    { id: 'proposal', label: 'Proposal sent', color: 'bg-yellow-100' },
    { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-100' },
    { id: 'won', label: 'Vunnet', color: 'bg-green-100' },
    { id: 'lost', label: 'Tapt', color: 'bg-red-100' }
  ];

  // TODO: Backend - Fetch leads from database
  const [leads, setLeads] = useState([
    {
      id: '1',
      name: 'Digital Solutions AS',
      contact: 'Anders Johnsen',
      email: 'anders@digitalsolutions.no',
      phone: '+47 555 11 222',
      stage: 'proposal',
      value: 180000,
      probability: 70,
      source: 'Inbound',
      assignedTo: 'Kari Jensen',
      nextAction: 'Oppfølging etter tilbud',
      dueDate: 'I dag',
      services: ['SEO', 'Google Ads'],
      score: 85,
      companyInfo: {
        website: 'digitalsolutions.no',
        industry: 'SaaS / Programvare',
        employees: '25-50',
        revenue: '15-30M NOK'
      },
      digitalHealth: {
        score: 78,
        websiteVisits: 12,
        emailOpens: 8,
        contentDownloads: 3,
        lastActivity: '2 timer siden'
      },
      intelligence: {
        positive: ['Høy engasjement på prissidevisninger', 'Lastet ned case study', 'Besøkt karrieresider (vekst-signal)'],
        concerns: ['Ikke åpnet siste 2 e-poster'],
        opportunities: ['Konkurrent nevnt i LinkedIn-post', 'Budsjett for Q2 åpen']
      }
    },
    {
      id: '2',
      name: 'Innovation Hub',
      contact: 'Lise Strand',
      email: 'lise@innovationhub.no',
      phone: '+47 666 22 333',
      stage: 'meeting',
      value: 95000,
      probability: 50,
      source: 'Referral',
      assignedTo: 'Ola Nordmann',
      nextAction: 'Behovskartlegging',
      dueDate: 'I morgen 14:00',
      services: ['SEO'],
      score: 72,
      companyInfo: {
        website: 'innovationhub.no',
        industry: 'Konsulent / Rådgivning',
        employees: '10-25',
        revenue: '5-10M NOK'
      },
      digitalHealth: {
        score: 65,
        websiteVisits: 5,
        emailOpens: 4,
        contentDownloads: 1,
        lastActivity: '1 dag siden'
      },
      intelligence: {
        positive: ['Anbefalt av eksisterende kunde', 'Deltok på webinar'],
        concerns: ['Lav aktivitet siste uke'],
        opportunities: ['Nevnte ekspansjonsplaner i første møte']
      }
    },
    {
      id: '3',
      name: 'Growth Company',
      contact: 'Martin Berg',
      email: 'martin@growth.no',
      phone: '+47 777 33 444',
      stage: 'new',
      value: 50000,
      probability: 20,
      source: 'Cold outreach',
      assignedTo: 'Ola Nordmann',
      nextAction: 'Førstegangs kontakt',
      dueDate: 'I dag',
      services: ['Google Ads'],
      score: 45,
      companyInfo: {
        website: 'growth.no',
        industry: 'E-handel',
        employees: '5-10',
        revenue: '2-5M NOK'
      },
      digitalHealth: {
        score: 38,
        websiteVisits: 1,
        emailOpens: 0,
        contentDownloads: 0,
        lastActivity: '5 dager siden'
      },
      intelligence: {
        positive: ['Vekstbedrift med potensial'],
        concerns: ['Ingen respons på e-post', 'Lav engasjement'],
        opportunities: ['Har annonsert på Google før (erfaring)']
      }
    },
    {
      id: '4',
      name: 'E-commerce Pro AS',
      contact: 'Nina Hansen',
      email: 'nina@ecommercepro.no',
      phone: '+47 888 44 555',
      stage: 'negotiation',
      value: 240000,
      probability: 80,
      source: 'Inbound',
      assignedTo: 'Kari Jensen',
      nextAction: 'Kontraktforhandling',
      dueDate: 'Om 2 dager',
      services: ['SEO', 'Google Ads', 'Meta Ads'],
      score: 92,
      companyInfo: {
        website: 'ecommercepro.no',
        industry: 'E-handel',
        employees: '50-100',
        revenue: '50-100M NOK'
      },
      digitalHealth: {
        score: 88,
        websiteVisits: 18,
        emailOpens: 12,
        contentDownloads: 5,
        lastActivity: '30 minutter siden'
      },
      intelligence: {
        positive: ['Flere beslutningstakere involvert', 'Aktiv på alle kanaler', 'Budsjett bekreftet', 'Deadline for oppstart satt'],
        concerns: [],
        opportunities: ['Potensial for upsell til CRO senere', 'Nevnt interesse for content marketing']
      }
    },
    {
      id: '5',
      name: 'Local Services',
      contact: 'Tom Olsen',
      email: 'tom@localservices.no',
      phone: '+47 999 55 666',
      stage: 'qualification',
      value: 60000,
      probability: 40,
      source: 'Partner',
      assignedTo: 'Ola Nordmann',
      nextAction: 'Kvalifiseringssamtale',
      dueDate: 'Neste uke',
      services: ['SEO'],
      score: 58,
      companyInfo: {
        website: 'localservices.no',
        industry: 'Lokale tjenester',
        employees: '5-10',
        revenue: '3-5M NOK'
      },
      digitalHealth: {
        score: 52,
        websiteVisits: 3,
        emailOpens: 2,
        contentDownloads: 1,
        lastActivity: '3 dager siden'
      },
      intelligence: {
        positive: ['Anbefalt av partner', 'God lokal tilstedeværelse'],
        concerns: ['Begrenset budsjett indikert'],
        opportunities: ['Kan starte småskala og vokse']
      }
    },
    {
      id: '6',
      name: 'TechCorp AS',
      contact: 'Hans Pettersen',
      email: 'hans@techcorp.no',
      phone: '+47 111 66 777',
      stage: 'won',
      value: 320000,
      probability: 100,
      source: 'Inbound',
      assignedTo: 'Kari Jensen',
      nextAction: 'Onboarding starter',
      dueDate: 'Denne uken',
      services: ['SEO', 'Google Ads'],
      score: 95,
      companyInfo: {
        website: 'techcorp.no',
        industry: 'Teknologi',
        employees: '50-100',
        revenue: '30-50M NOK'
      },
      digitalHealth: {
        score: 92,
        websiteVisits: 20,
        emailOpens: 15,
        contentDownloads: 6,
        lastActivity: '1 time siden'
      },
      intelligence: {
        positive: ['Høyt engasjement', 'Rask beslutningsprosess'],
        concerns: [],
        opportunities: ['Upsell potensial']
      }
    },
    {
      id: '7',
      name: 'Budget Retail',
      contact: 'Anne Nilsen',
      email: 'anne@budgetretail.no',
      phone: '+47 222 77 888',
      stage: 'lost',
      value: 80000,
      probability: 0,
      source: 'Cold outreach',
      assignedTo: 'Ola Nordmann',
      nextAction: 'Tapt - for dyrt',
      dueDate: 'Avsluttet',
      services: ['Google Ads'],
      score: 35,
      companyInfo: {
        website: 'budgetretail.no',
        industry: 'Detaljhandel',
        employees: '10-25',
        revenue: '5-10M NOK'
      },
      digitalHealth: {
        score: 42,
        websiteVisits: 4,
        emailOpens: 2,
        contentDownloads: 0,
        lastActivity: '2 uker siden'
      },
      intelligence: {
        positive: ['Interesse for digital markedsføring'],
        concerns: ['Begrenset budsjett', 'Lav engasjement'],
        opportunities: []
      }
    },
    {
      id: '8',
      name: 'Nordic Fashion Group',
      contact: 'Lisa Berg',
      email: 'lisa@nordicfashion.no',
      phone: '+47 333 88 999',
      stage: 'won',
      value: 450000,
      probability: 100,
      source: 'Referral',
      assignedTo: 'Kari Jensen',
      nextAction: 'Kontrakt signert',
      dueDate: 'Start neste måned',
      services: ['SEO', 'Google Ads', 'Meta Ads'],
      score: 98,
      companyInfo: {
        website: 'nordicfashion.no',
        industry: 'E-handel / Mote',
        employees: '100+',
        revenue: '100M+ NOK'
      },
      digitalHealth: {
        score: 95,
        websiteVisits: 25,
        emailOpens: 18,
        contentDownloads: 8,
        lastActivity: 'I dag'
      },
      intelligence: {
        positive: ['Stort budsjett', 'Erfaring med digital markedsføring', 'Langsiktig samarbeid'],
        concerns: [],
        opportunities: ['Content marketing', 'Influencer marketing']
      }
    }
  ]);

  const handleDeleteLead = (leadId: string, leadName: string) => {
    if (confirm(`Er du sikker på at du vil slette lead "${leadName}"?`)) {
      // TODO: Backend - Delete lead from database
      setLeads(leads.filter(l => l.id !== leadId));
    }
  };

  // Prospects have been moved to /prospects route (Prospects.tsx component)

  const groupedLeads = pipelineStages.map((stage) => ({
    ...stage,
    leads: leads.filter((lead) => lead.stage === stage.id),
    totalValue: leads
      .filter((lead) => lead.stage === stage.id)
      .reduce((sum, lead) => sum + lead.value, 0)
  }));

  const totalPipelineValue = leads.reduce((sum, lead) => sum + lead.value, 0);
  const weightedValue = leads.reduce((sum, lead) => sum + lead.value * (lead.probability / 100), 0);

  // Win rate beregninger - denne måneden
  const wonThisMonth = leads.filter(l => l.stage === 'won').length;
  const lostThisMonth = leads.filter(l => l.stage === 'lost').length;
  const closedThisMonth = wonThisMonth + lostThisMonth;
  const winRate = closedThisMonth > 0 ? Math.round((wonThisMonth / closedThisMonth) * 100) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads & Pipeline</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{leads.length} aktive leads</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setView('pipeline')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'pipeline' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'list' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setView('intelligence')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'intelligence' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Intelligence
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ny lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Aktive leads</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{leads.filter(l => l.stage !== 'won' && l.stage !== 'lost').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total pipeline-verdi</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {(totalPipelineValue / 1000000).toFixed(1)}M kr
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Vektet verdi</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {(weightedValue / 1000).toFixed(0)}k kr
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Win Rate</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{winRate}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{wonThisMonth}/{closedThisMonth} vunnet</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tapte leads</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{lostThisMonth}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Denne måneden</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline View */}
      {view === 'pipeline' && (
        <div className="grid grid-cols-7 gap-4">
          {groupedLeads.map((stage) => (
            <div key={stage.id} className="space-y-3">
              <div className={`rounded-lg p-3 ${stage.color}`}>
                <h3 className="font-semibold text-slate-900 dark:text-white">{stage.label}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stage.leads.length} leads</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {(stage.totalValue / 1000).toFixed(0)}k kr
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                {stage.leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 dark:text-white">{lead.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{lead.contact}</p>
                      </div>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                          lead.score >= 80
                            ? 'bg-green-100 text-green-700'
                            : lead.score >= 60
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {lead.score}
                      </div>
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <DollarSign className="w-4 h-4" />
                        <span className="font-medium">{lead.value.toLocaleString('nb-NO')} kr</span>
                        <span className="text-slate-400">•</span>
                        <span>{lead.probability}%</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span>{lead.assignedTo}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Neste steg:</p>
                      <p className="text-sm text-slate-900 dark:text-white mt-0.5">{lead.nextAction}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{lead.dueDate}</p>
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Navigate to edit lead (could be a modal or separate page)
                          navigate(`/leads/${lead.id}/edit`);
                        }}
                        className="flex-1 p-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3 h-3" />
                        Rediger
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLead(lead.id, lead.name);
                        }}
                        className="flex-1 p-1.5 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        Slett
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Intelligence View */}
      {view === 'intelligence' && (
        <div className="space-y-4">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                      <Building className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{lead.name}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{lead.contact}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:text-blue-400">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </a>
                        <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:text-blue-400">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Lead Score</p>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mt-1 ${
                        lead.score >= 80
                          ? 'bg-green-100 text-green-700'
                          : lead.score >= 60
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}>
                        {lead.score}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600 dark:text-slate-400">Digital Health</p>
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mt-1 ${
                        lead.digitalHealth.score >= 70
                          ? 'bg-green-100 text-green-700'
                          : lead.digitalHealth.score >= 50
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {lead.digitalHealth.score}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Company Info & Deal Info */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Selskapsinformasjon</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <a href={`https://${lead.companyInfo.website}`} className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                          {lead.companyInfo.website}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 dark:text-white">{lead.companyInfo.industry}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 dark:text-white">{lead.companyInfo.employees} ansatte</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <DollarSign className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-900 dark:text-white">{lead.companyInfo.revenue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Deal-informasjon</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Stadium:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{pipelineStages.find(s => s.id === lead.stage)?.label}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Verdi:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lead.value.toLocaleString('nb-NO')} kr</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Sannsynlighet:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lead.probability}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Kilde:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lead.source}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Ansvarlig:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lead.assignedTo}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Digital engasjement</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">Nettside-besøk:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lead.digitalHealth.websiteVisits}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">E-post åpnet:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lead.digitalHealth.emailOpens}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">Innhold lastet ned:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lead.digitalHealth.contentDownloads}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400">Siste aktivitet:</span>
                        <span className="font-medium text-slate-900 dark:text-white">{lead.digitalHealth.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Intelligence Signals */}
                <div className="grid grid-cols-3 gap-4">
                  {/* Positive Signals */}
                  <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-medium text-green-900 dark:text-green-300">Positive signaler</h4>
                    </div>
                    {lead.intelligence.positive.length > 0 ? (
                      <ul className="space-y-2">
                        {lead.intelligence.positive.map((signal, idx) => (
                          <li key={idx} className="text-sm text-green-800 dark:text-green-300 flex items-start gap-2">
                            <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                            <span>{signal}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-green-700 dark:text-green-400">Ingen registrert</p>
                    )}
                  </div>

                  {/* Concerns */}
                  <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      <h4 className="font-medium text-red-900 dark:text-red-300">Bekymringer</h4>
                    </div>
                    {lead.intelligence.concerns.length > 0 ? (
                      <ul className="space-y-2">
                        {lead.intelligence.concerns.map((concern, idx) => (
                          <li key={idx} className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
                            <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                            <span>{concern}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-red-700 dark:text-red-400">Ingen registrert</p>
                    )}
                  </div>

                  {/* Opportunities */}
                  <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <h4 className="font-medium text-blue-900 dark:text-blue-300">Muligheter</h4>
                    </div>
                    {lead.intelligence.opportunities.length > 0 ? (
                      <ul className="space-y-2">
                        {lead.intelligence.opportunities.map((opportunity, idx) => (
                          <li key={idx} className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                            <span>{opportunity}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-blue-700 dark:text-blue-400">Ingen registrert</p>
                    )}
                  </div>
                </div>

                {/* Next Action */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Neste steg:</p>
                    <p className="font-medium text-slate-900 dark:text-white mt-1">{lead.nextAction}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Forfaller: {lead.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/leads/${lead.id}/edit`)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Rediger
                    </button>
                    <button
                      onClick={() => handleDeleteLead(lead.id, lead.name)}
                      className="px-4 py-2 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Slett lead
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Kontakt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Stadium</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Verdi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Sannsynlighet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Ansvarlig</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Neste aktivitet</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Handlinger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{lead.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {lead.services.map((service) => (
                            <span
                              key={service}
                              className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                            >
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{lead.contact}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <a
                        href={`mailto:${lead.email}`}
                        className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:text-blue-400"
                      >
                        <Mail className="w-3 h-3" />
                        {lead.email}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {pipelineStages.find((s) => s.id === lead.stage)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {lead.value.toLocaleString('nb-NO')} kr
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${lead.probability}%` }}
                        />
                      </div>
                      <span className="text-sm text-slate-600 dark:text-slate-400 min-w-[3rem]">{lead.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900 dark:text-white">{lead.assignedTo}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900 dark:text-white">{lead.nextAction}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lead.dueDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        lead.score >= 80
                          ? 'bg-green-100 text-green-700'
                          : lead.score >= 60
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {lead.score}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/leads/${lead.id}/edit`);
                        }}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Rediger lead"
                      >
                        <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLead(lead.id, lead.name);
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Slett lead"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}
