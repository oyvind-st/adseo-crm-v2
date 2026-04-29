import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Phone,
  Mail,
  BarChart3,
  ExternalLink,
  Trash2,
  Clock,
  Zap,
  RefreshCw,
  Building,
  Briefcase,
  MapPin,
  Users,
  Calendar,
  Globe,
  Target,
  DollarSign,
  Database
} from 'lucide-react';

export function Prospects() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'bronnoysund' | 'forvalt'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBranch, setFilterBranch] = useState('all');
  const [filterScore, setFilterScore] = useState('all');
  const [filterSize, setFilterSize] = useState('all');
  const [minScore, setMinScore] = useState(60);
  const [selectedProspects, setSelectedProspects] = useState<string[]>([]);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState<'bronnoysund' | 'forvalt' | null>(null);

  // TODO: Backend - Fetch prospects from Forvalt.no / Proff.no API
  const [prospects, setProspects] = useState([
    {
      id: 'p1',
      orgnr: '923456789',
      name: 'Norsk Eiendom AS',
      industry: 'Eiendom',
      employees: 45,
      revenue: 85000000,
      location: 'Oslo',
      founded: 2015,
      growth: 23.5,
      website: 'norskeiendom.no',
      ceo: 'Kari Nordmann',
      prospectScore: 92,
      dataSource: 'forvalt' as 'bronnoysund' | 'forvalt',
      importedDate: '2026-04-15',
      reasoning: {
        strengths: ['Sterk vekst siste 3 år', 'Aktiv nettilstedeværelse', 'Konkurrerer i høy-verdi marked', 'Stor nok til å ha budsjett'],
        weaknesses: ['Har allerede noe SEO-innhold på nettsted'],
        opportunities: ['Ingen synlig Google Ads-aktivitet', 'Svak mobiloptimalisering', 'Mangler strukturerte data']
      },
      digitalPresence: {
        hasWebsite: true,
        seoScore: 42,
        mobileScore: 38,
        pageSpeed: 45,
        socialMedia: ['LinkedIn'],
        googleAdsActivity: false,
        organicKeywords: 23
      },
      financials: {
        revenue2023: 85000000,
        revenue2022: 69000000,
        revenue2021: 52000000,
        profitMargin: 12.3,
        equity: 25000000
      },
      estimatedBudget: '50-100k NOK/måned'
    },
    {
      id: 'p2',
      orgnr: '923456790',
      name: 'TechStart Norge AS',
      industry: 'SaaS / Programvare',
      employees: 28,
      revenue: 42000000,
      location: 'Bergen',
      founded: 2019,
      growth: 89.2,
      website: 'techstart.no',
      ceo: 'Lars Hansen',
      prospectScore: 88,
      dataSource: 'bronnoysund' as 'bronnoysund' | 'forvalt',
      importedDate: '2026-04-23',
      reasoning: {
        strengths: ['Ekstremt høy vekst', 'Ung tech-bedrift (forstår digital markedsføring)', 'Ekspanderer raskt', 'SaaS = lang kundeverdilevetid'],
        weaknesses: ['Mindre bedrift, potensielt begrenset budsjett'],
        opportunities: ['Ingen synlig betalt annonsering', 'LinkedIn-profil indikerer fundraising (kapital tilgjengelig)', 'Nettside mangler konverteringsoptimalisering']
      },
      digitalPresence: {
        hasWebsite: true,
        seoScore: 35,
        mobileScore: 72,
        pageSpeed: 68,
        socialMedia: ['LinkedIn', 'Twitter'],
        googleAdsActivity: false,
        organicKeywords: 12
      },
      financials: {
        revenue2023: 42000000,
        revenue2022: 22000000,
        revenue2021: 11000000,
        profitMargin: 8.5,
        equity: 15000000
      },
      estimatedBudget: '30-60k NOK/måned'
    },
    {
      id: 'p3',
      orgnr: '923456791',
      name: 'Retail Pro Norge AS',
      industry: 'E-handel',
      employees: 65,
      revenue: 125000000,
      location: 'Oslo',
      founded: 2012,
      growth: 15.8,
      website: 'retailpro.no',
      ceo: 'Nina Berg',
      prospectScore: 95,
      dataSource: 'forvalt' as 'bronnoysund' | 'forvalt',
      importedDate: '2026-04-10',
      reasoning: {
        strengths: ['Stor e-handelsbedrift = høyt ROI-potensial', 'Solid økonomi', 'Stabil vekst', 'E-handel krever kontinuerlig annonsering'],
        weaknesses: [],
        opportunities: ['Bruker Google Ads men dårlig optimalisert (høy CPC)', 'Mangler Meta Ads helt', 'Svak SEO-ytelse for produktsider', 'Ingen retargeting synlig']
      },
      digitalPresence: {
        hasWebsite: true,
        seoScore: 48,
        mobileScore: 82,
        pageSpeed: 52,
        socialMedia: ['Facebook', 'Instagram', 'LinkedIn'],
        googleAdsActivity: true,
        organicKeywords: 145
      },
      financials: {
        revenue2023: 125000000,
        revenue2022: 108000000,
        revenue2021: 93000000,
        profitMargin: 6.8,
        equity: 42000000
      },
      estimatedBudget: '100-200k NOK/måned'
    },
    {
      id: 'p4',
      orgnr: '923456792',
      name: 'Wellness Klinikk AS',
      industry: 'Helse / Velvære',
      employees: 18,
      revenue: 12000000,
      location: 'Stavanger',
      founded: 2018,
      growth: 45.2,
      website: 'wellnessklinikk.no',
      ceo: 'Emma Olsen',
      prospectScore: 78,
      dataSource: 'bronnoysund' as 'bronnoysund' | 'forvalt',
      importedDate: '2026-04-22',
      reasoning: {
        strengths: ['Høy vekst', 'Lokal tjeneste = perfekt for lokal SEO/Google Ads', 'Lav digital konkurranse i region'],
        weaknesses: ['Mindre bedrift', 'B2C = lavere deal-størrelse'],
        opportunities: ['Ingen Google Ads', 'Nettside har dårlig UX', 'Ingen local SEO-optimalisering', 'Mangler booking-funksjonalitet']
      },
      digitalPresence: {
        hasWebsite: true,
        seoScore: 28,
        mobileScore: 45,
        pageSpeed: 38,
        socialMedia: ['Facebook', 'Instagram'],
        googleAdsActivity: false,
        organicKeywords: 8
      },
      financials: {
        revenue2023: 12000000,
        revenue2022: 8500000,
        revenue2021: 5800000,
        profitMargin: 18.5,
        equity: 3200000
      },
      estimatedBudget: '15-30k NOK/måned'
    },
    {
      id: 'p5',
      orgnr: '923456793',
      name: 'Bygg & Anlegg Norge AS',
      industry: 'Bygg / Anlegg',
      employees: 120,
      revenue: 285000000,
      location: 'Trondheim',
      founded: 2005,
      growth: 8.2,
      website: 'bygganlegg.no',
      ceo: 'Tor Andersen',
      prospectScore: 65,
      dataSource: 'forvalt' as 'bronnoysund' | 'forvalt',
      importedDate: '2026-04-08',
      reasoning: {
        strengths: ['Stor bedrift med budsjett', 'Tradisjonell bransje = lav digital modenhet = potensial'],
        weaknesses: ['Lav vekst', 'Tradisjonell bransje kan være skeptisk til digital markedsføring', 'Lang salgssyklus'],
        opportunities: ['Ingen digital markedsføring i det hele tatt', 'Nettside fra 2010-tallet', 'Kunne dominere lokalt søk']
      },
      digitalPresence: {
        hasWebsite: true,
        seoScore: 15,
        mobileScore: 22,
        pageSpeed: 28,
        socialMedia: ['Facebook'],
        googleAdsActivity: false,
        organicKeywords: 4
      },
      financials: {
        revenue2023: 285000000,
        revenue2022: 263000000,
        revenue2021: 245000000,
        profitMargin: 4.2,
        equity: 85000000
      },
      estimatedBudget: '40-80k NOK/måned'
    },
    {
      id: 'p6',
      orgnr: '923456794',
      name: 'Fashion Forward AS',
      industry: 'E-handel',
      employees: 32,
      revenue: 58000000,
      location: 'Oslo',
      founded: 2017,
      growth: 62.5,
      website: 'fashionforward.no',
      ceo: 'Sophie Kristiansen',
      prospectScore: 91,
      dataSource: 'bronnoysund' as 'bronnoysund' | 'forvalt',
      importedDate: '2026-04-21',
      reasoning: {
        strengths: ['Ekstrem vekst', 'E-handel mote = perfekt for Meta Ads', 'Ung bedrift = digitalt modne', 'Visuelt produkt'],
        weaknesses: ['Sesongsvingninger kan påvirke budsjett'],
        opportunities: ['Bruker Meta Ads men ikke retargeting', 'Ingen Google Shopping', 'Dårlig SEO på produkter', 'Kunne ekspandere nordisk med riktig strategi']
      },
      digitalPresence: {
        hasWebsite: true,
        seoScore: 52,
        mobileScore: 88,
        pageSpeed: 78,
        socialMedia: ['Instagram', 'TikTok', 'Facebook', 'Pinterest'],
        googleAdsActivity: false,
        organicKeywords: 89
      },
      financials: {
        revenue2023: 58000000,
        revenue2022: 36000000,
        revenue2021: 22000000,
        profitMargin: 11.2,
        equity: 12000000
      },
      estimatedBudget: '60-120k NOK/måned'
    },
    {
      id: 'p7',
      orgnr: '923456795',
      name: 'Legal Partners AS',
      industry: 'Advokatfirma',
      employees: 22,
      revenue: 35000000,
      location: 'Oslo',
      founded: 2010,
      growth: 12.3,
      website: 'legalpartners.no',
      ceo: 'Henrik Solberg',
      prospectScore: 72,
      dataSource: 'forvalt' as 'bronnoysund' | 'forvalt',
      importedDate: '2026-03-28',
      reasoning: {
        strengths: ['Høy verdi per kunde', 'Lokal tjeneste', 'Premium bransje = budsjett for kvalitet'],
        weaknesses: ['Konservativ bransje', 'Kan ha etiske begrensninger på markedsføring'],
        opportunities: ['Ingen betalt annonsering', 'Konkurrenter ranker høyt på Google', 'LinkedIn kunne vært kraftig kanal', 'Content marketing for thought leadership']
      },
      digitalPresence: {
        hasWebsite: true,
        seoScore: 38,
        mobileScore: 65,
        pageSpeed: 58,
        socialMedia: ['LinkedIn'],
        googleAdsActivity: false,
        organicKeywords: 34
      },
      financials: {
        revenue2023: 35000000,
        revenue2022: 31000000,
        revenue2021: 28000000,
        profitMargin: 22.5,
        equity: 18000000
      },
      estimatedBudget: '25-50k NOK/måned'
    },
    {
      id: 'p8',
      orgnr: '923456796',
      name: 'Nordic Food Distributors AS',
      industry: 'Grossist / Distribusjon',
      employees: 85,
      revenue: 420000000,
      location: 'Bergen',
      founded: 2008,
      growth: 5.8,
      website: 'nordicfood.no',
      ceo: 'Maria Lund',
      prospectScore: 58,
      dataSource: 'forvalt' as 'bronnoysund' | 'forvalt',
      importedDate: '2026-03-20',
      reasoning: {
        strengths: ['Massiv omsetning', 'Stabil virksomhet'],
        weaknesses: ['Lav vekst', 'B2B grossist = mindre avhengig av digital markedsføring', 'Etablerte kunde-relasjoner = mindre behov'],
        opportunities: ['Nettside kun informativ, kunne hatt webshop for småkunder', 'Ingen synlig digital strategi', 'LinkedIn for B2B lead gen']
      },
      digitalPresence: {
        hasWebsite: true,
        seoScore: 25,
        mobileScore: 42,
        pageSpeed: 35,
        socialMedia: ['LinkedIn'],
        googleAdsActivity: false,
        organicKeywords: 15
      },
      financials: {
        revenue2023: 420000000,
        revenue2022: 398000000,
        revenue2021: 378000000,
        profitMargin: 2.8,
        equity: 95000000
      },
      estimatedBudget: '20-40k NOK/måned'
    }
  ]);

  const handleDeleteProspect = (prospectId: string, prospectName: string) => {
    if (confirm(`Er du sikker på at du vil slette prospect "${prospectName}"?`)) {
      // TODO: Backend - Delete prospect from database
      setProspects(prospects.filter(p => p.id !== prospectId));
      // Also remove from selected if it was selected
      setSelectedProspects(selectedProspects.filter(id => id !== prospectId));
    }
  };

  const filteredProspects = prospects.filter((prospect) => {
    // Filter by active tab first
    if (activeTab !== 'all' && prospect.dataSource !== activeTab) {
      return false;
    }
    if (searchQuery && !prospect.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filterBranch !== 'all' && prospect.industry !== filterBranch) {
      return false;
    }
    if (filterScore === 'high' && prospect.prospectScore < 85) {
      return false;
    }
    if (filterScore === 'medium' && (prospect.prospectScore < 70 || prospect.prospectScore >= 85)) {
      return false;
    }
    if (filterScore === 'low' && prospect.prospectScore >= 70) {
      return false;
    }
    if (filterSize === 'small' && prospect.employees >= 50) {
      return false;
    }
    if (filterSize === 'medium' && (prospect.employees < 50 || prospect.employees >= 100)) {
      return false;
    }
    if (filterSize === 'large' && prospect.employees < 100) {
      return false;
    }
    if (prospect.prospectScore < minScore) {
      return false;
    }
    return true;
  });

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-700';
    if (score >= 70) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Prospektdatabase</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {filteredProspects.length} prospekter · {selectedProspects.length} valgt
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Importer liste
          </button>
          <button
            onClick={() => {
              // TODO: Backend - Navigate to ringeliste with selected prospects
              if (selectedProspects.length > 0) {
                navigate('/call-list', { state: { addProspects: selectedProspects } });
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Legg til ringeliste ({selectedProspects.length})
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="flex items-center border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 ${
              activeTab === 'all'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>Alle prospekter</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                {prospects.length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bronnoysund')}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 ${
              activeTab === 'bronnoysund'
                ? 'border-green-600 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Nyregistrerte bedrifter</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
                {prospects.filter(p => p.dataSource === 'bronnoysund').length}
              </span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('forvalt')}
            className={`flex-1 px-6 py-4 font-medium transition-colors border-b-2 ${
              activeTab === 'forvalt'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Database className="w-4 h-4" />
              <span>Komplett database</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full">
                {prospects.filter(p => p.dataSource === 'forvalt').length}
              </span>
            </div>
          </button>
        </div>

        {/* Tab Description */}
        <div className="p-4 bg-slate-50 dark:bg-slate-700/50">
          {activeTab === 'all' && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Viser alle prospekter fra både Brønnøysund og Forvalt
            </p>
          )}
          {activeTab === 'bronnoysund' && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Nyregistrerte bedrifter fra Brønnøysund</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Oppdateres daglig med nye bedrifter. Grunndata: org.nr, navn, bransje. Perfekt for early-bird prospektering og first-mover fordel.
                </p>
              </div>
            </div>
          )}
          {activeTab === 'forvalt' && (
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <Database className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-1">Komplett bedriftsdatabase fra Forvalt/Proff</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Detaljert økonomidata, styre/ledelse, kontaktinfo og historikk. Oppdatert 2-4 uker etter registrering. Best for kvalifisering og segmentering.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* API Integration Status */}
      <div className="grid grid-cols-2 gap-4">
        {/* Brønnøysund Integration */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Brønnøysundregistrene</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Daglig import av nyregistrerte bedrifter
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs text-slate-700 dark:text-slate-300">Aktiv</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium">{prospects.filter(p => p.dataSource === 'bronnoysund').length}</span> bedrifter
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forvalt Integration */}
        <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">Forvalt / Proff</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  Komplett bedriftsdata og økonomianalyse
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-xs text-slate-700 dark:text-slate-300">Tilkoblet</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-medium">{prospects.filter(p => p.dataSource === 'forvalt').length}</span> bedrifter
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Totalt</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{prospects.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Høy score (85+)</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {prospects.filter(p => p.prospectScore >= 85).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Medium score (70-84)</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {prospects.filter(p => p.prospectScore >= 70 && p.prospectScore < 85).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Total estimert verdi</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {(prospects.reduce((sum, p) => {
                  const budget = p.estimatedBudget.match(/(\d+)-(\d+)/);
                  return sum + (budget ? parseInt(budget[2]) : 0);
                }, 0) / 1000).toFixed(0)}k/mnd
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          <h3 className="font-semibold text-slate-900 dark:text-white">Filtrer prospekter</h3>
        </div>
        <div className="grid grid-cols-6 gap-4">
          {/* Search */}
          <div className="col-span-2 relative">
            <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Søk</label>
            <Search className="w-4 h-4 absolute left-3 top-11 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Søk etter bedrift..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Bransje</label>
            <select
              value={filterBranch}
              onChange={(e) => setFilterBranch(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle bransjer</option>
              <option value="E-handel">E-handel</option>
              <option value="SaaS / Programvare">SaaS / Programvare</option>
              <option value="Eiendom">Eiendom</option>
              <option value="Helse / Velvære">Helse / Velvære</option>
              <option value="Bygg / Anlegg">Bygg / Anlegg</option>
              <option value="Advokatfirma">Advokatfirma</option>
              <option value="Grossist / Distribusjon">Grossist / Distribusjon</option>
            </select>
          </div>

          {/* Score */}
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Score-nivå</label>
            <select
              value={filterScore}
              onChange={(e) => setFilterScore(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle score</option>
              <option value="high">Høy score (85+)</option>
              <option value="medium">Medium score (70-84)</option>
              <option value="low">Lav score (&lt;70)</option>
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Størrelse</label>
            <select
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Alle størrelser</option>
              <option value="small">Små (&lt;50 ansatte)</option>
              <option value="medium">Medium (50-100)</option>
              <option value="large">Store (100+)</option>
            </select>
          </div>

          {/* Min Score Slider */}
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-400 mb-2 block">Min. score</label>
            <input
              type="range"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-slate-500 dark:text-slate-400">0</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{minScore}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">100</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Viser <span className="font-medium text-slate-900 dark:text-white">{filteredProspects.length}</span> av{' '}
            <span className="font-medium text-slate-900 dark:text-white">{prospects.length}</span> bedrifter
          </p>
          <div className="flex items-center gap-3">
            {(searchQuery || filterBranch !== 'all' || filterScore !== 'all' || filterSize !== 'all' || minScore > 0) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterBranch('all');
                  setFilterScore('all');
                  setFilterSize('all');
                  setMinScore(0);
                }}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
              >
                Nullstill filtre
              </button>
            )}
            {selectedProspects.length > 0 && (
              <button
                onClick={() => {
                  // TODO: Backend - Add selected to call list or create leads
                  navigate('/call-list', { state: { addProspects: selectedProspects } });
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Legg til {selectedProspects.length} som leads
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Prospects List */}
      <div className="space-y-4">
        {filteredProspects.map((prospect) => (
          <div
            key={prospect.id}
            className={`bg-white dark:bg-slate-800 rounded-lg border-2 transition-all ${
              selectedProspects.includes(prospect.id)
                ? 'border-blue-500 shadow-md'
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600'
            }`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4 flex-1">
                  <input
                    type="checkbox"
                    checked={selectedProspects.includes(prospect.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProspects([...selectedProspects, prospect.id]);
                      } else {
                        setSelectedProspects(selectedProspects.filter((id) => id !== prospect.id));
                      }
                    }}
                    className="mt-1 w-5 h-5 text-blue-600 dark:text-blue-400 border-slate-300 dark:border-slate-600 rounded focus:ring-blue-500"
                  />
                  <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <Building className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{prospect.name}</h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Org.nr: {prospect.orgnr}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          prospect.dataSource === 'bronnoysund'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                            : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                        }`}
                        title={
                          prospect.dataSource === 'bronnoysund'
                            ? 'Importert fra Brønnøysundregistrene'
                            : 'Importert fra Forvalt/Proff'
                        }
                      >
                        {prospect.dataSource === 'bronnoysund' ? 'Brønnøysund' : 'Forvalt'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4" />
                        {prospect.industry}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {prospect.location}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {prospect.employees} ansatte
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Etablert {prospect.founded}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        Importert {new Date(prospect.importedDate).toLocaleDateString('nb-NO', { day: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Prospect Score</p>
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mt-1 ${getScoreColor(
                        prospect.prospectScore
                      )}`}
                    >
                      {prospect.prospectScore}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteProspect(prospect.id, prospect.name)}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Slett prospect"
                  >
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>

              {/* Key Metrics */}
              {prospect.dataSource === 'bronnoysund' ? (
                // Simplified metrics for Brønnøysund prospects
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-900 dark:text-green-300 mb-2">Nyregistrert bedrift</h4>
                      <p className="text-sm text-green-800 dark:text-green-400 mb-3">
                        Grunndata tilgjengelig. Full analyse vil være tilgjengelig når bedriften er tilgjengelig i Forvalt (2-4 uker).
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-green-700 dark:text-green-500 mb-1">Registreringsdato</p>
                          <p className="text-sm font-medium text-green-900 dark:text-green-300">
                            {new Date(prospect.importedDate).toLocaleDateString('nb-NO')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-green-700 dark:text-green-500 mb-1">Bransje</p>
                          <p className="text-sm font-medium text-green-900 dark:text-green-300">{prospect.industry}</p>
                        </div>
                        <div>
                          <p className="text-xs text-green-700 dark:text-green-500 mb-1">Lokasjon</p>
                          <p className="text-sm font-medium text-green-900 dark:text-green-300">{prospect.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Full metrics for Forvalt prospects
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Omsetning 2023</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">
                      {(prospect.revenue / 1000000).toFixed(0)} MNOK
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">+{prospect.growth}% vekst</span>
                    </div>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Estimert budsjett</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{prospect.estimatedBudget}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Basert på bransje/størrelse</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">SEO Score</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{prospect.digitalPresence.seoScore}/100</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {prospect.digitalPresence.organicKeywords} søkeord
                    </p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Ads aktivitet</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">
                      {prospect.digitalPresence.googleAdsActivity ? 'Ja' : 'Nei'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {prospect.digitalPresence.googleAdsActivity ? 'Mulighet for opt.' : 'Stor mulighet'}
                    </p>
                  </div>
                </div>
              )}

              {/* AI Analysis - Only for Forvalt prospects */}
              {prospect.dataSource === 'forvalt' && (
                <div className="grid grid-cols-3 gap-4">
                <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h4 className="font-medium text-green-900 dark:text-green-300">Styrker</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {prospect.reasoning.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-green-800 dark:text-green-300 flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400 mt-0.5">•</span>
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h4 className="font-medium text-red-900 dark:text-red-300">Svakheter</h4>
                  </div>
                  {prospect.reasoning.weaknesses.length > 0 ? (
                    <ul className="space-y-1.5">
                      {prospect.reasoning.weaknesses.map((weakness, idx) => (
                        <li key={idx} className="text-sm text-red-800 dark:text-red-300 flex items-start gap-2">
                          <span className="text-red-600 dark:text-red-400 mt-0.5">•</span>
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-red-700 dark:text-red-400 italic">Ingen vesentlige svakheter identifisert</p>
                  )}
                </div>

                <div className="border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <h4 className="font-medium text-blue-900 dark:text-blue-300">Muligheter</h4>
                  </div>
                  <ul className="space-y-1.5">
                    {prospect.reasoning.opportunities.map((opportunity, idx) => (
                      <li key={idx} className="text-sm text-blue-800 dark:text-blue-300 flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 mt-0.5">•</span>
                        <span>{opportunity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              )}

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {prospect.website && (
                    <a
                      href={`https://${prospect.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
                    >
                      <Globe className="w-4 h-4" />
                      Besøk nettside
                    </a>
                  )}
                  {prospect.dataSource === 'forvalt' && (
                    <>
                      <button
                        onClick={() => navigate(`/leads/prospect-analysis/${prospect.id}`)}
                        className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white"
                      >
                        <BarChart3 className="w-4 h-4" />
                        Se full analyse
                      </button>
                      <button className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white">
                        <Download className="w-4 h-4" />
                        Last ned rapport
                      </button>
                    </>
                  )}
                  {prospect.dataSource === 'bronnoysund' && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 italic">
                      Full analyse tilgjengelig om 2-4 uker
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      // TODO: Backend - Add to call list
                      navigate('/call-list', { state: { addProspect: prospect.id } });
                    }}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Legg til ringeliste
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Legg til som lead
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-3xl w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Importer bedrifter</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Velg kilde basert på behov for aktualitet eller datakompletthet
              </p>
            </div>
            <div className="p-6 space-y-6">
              {/* Import Type Selection */}
              {!importType && (
                <div className="grid grid-cols-2 gap-4">
                  {/* Brønnøysund Option */}
                  <button
                    onClick={() => setImportType('bronnoysund')}
                    className="border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-lg p-6 text-left transition-all hover:shadow-lg group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-6 h-6 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Brønnøysundregistrene
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                          Nyregistrerte bedrifter – oppdatert daglig
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                              Øyeblikkelig tilgang til nye bedrifter
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                              Grunndata: org.nr, navn, bransje
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                              Perfekt for early-bird prospektering
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <span className="text-xs font-medium text-green-700 dark:text-green-400">
                            → Beste for: Aktualitet og first-mover fordel
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Forvalt Option */}
                  <button
                    onClick={() => setImportType('forvalt')}
                    className="border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-500 rounded-lg p-6 text-left transition-all hover:shadow-lg group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                        <Database className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                          Forvalt / Proff
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                          Komplett bedriftsdata – alle norske bedrifter
                        </p>
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                              Detaljert økonomidata (inntekt, vekst, ansatte)
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                              Styre/ledelse, kontaktinfo, historikk
                            </span>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                            <span className="text-xs text-slate-700 dark:text-slate-300">
                              Oppdatert 2-4 uker etter registrering
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                          <span className="text-xs font-medium text-purple-700 dark:text-purple-400">
                            → Beste for: Kvalifisering og segmentering
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Brønnøysund Import UI */}
              {importType === 'bronnoysund' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Import fra Brønnøysundregistrene
                    </h4>
                    <button
                      onClick={() => setImportType(null)}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      ← Tilbake
                    </button>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900 dark:text-green-300 mb-2">
                          Automatisk daglig import
                        </p>
                        <p className="text-xs text-green-800 dark:text-green-400 mb-3">
                          Systemet kan hente nyregistrerte bedrifter automatisk hver morgen kl. 08:00.
                          Du får varsel om nye prospects.
                        </p>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-green-300" defaultChecked />
                          <span className="text-xs text-green-900 dark:text-green-300">
                            Aktiver daglig automatisk import
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Filtrer etter bransjer (valgfritt)
                    </label>
                    <select
                      multiple
                      className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      size={5}
                    >
                      <option value="all">Alle bransjer</option>
                      <option value="handel">Handel</option>
                      <option value="tjenester">Tjenester</option>
                      <option value="bygg">Bygg og anlegg</option>
                      <option value="tech">Teknologi</option>
                      <option value="helse">Helse og velvære</option>
                    </select>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Hold Ctrl/Cmd for å velge flere
                    </p>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-900 dark:text-blue-300 font-medium mb-2">
                      Etter import
                    </p>
                    <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                      <li>✓ Grunndata lastes inn (navn, org.nr, bransje, adresse)</li>
                      <li>✓ Digital analyse starter automatisk i bakgrunnen</li>
                      <li>✓ Du får varsel når analysen er klar</li>
                      <li>✓ Bedrifter dukker opp i prospect-listen</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Forvalt Import UI */}
              {importType === 'forvalt' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-slate-900 dark:text-white">
                      Import fra Forvalt/Proff
                    </h4>
                    <button
                      onClick={() => setImportType(null)}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    >
                      ← Tilbake
                    </button>
                  </div>

                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                      Last opp CSV-fil fra Forvalt/Proff
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                      eller dra og slipp filen her
                    </p>
                    <input type="file" accept=".csv" className="hidden" id="file-upload" />
                    <label
                      htmlFor="file-upload"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors cursor-pointer inline-block"
                    >
                      Velg fil
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Min. omsetning (MNOK)
                      </label>
                      <input
                        type="number"
                        placeholder="f.eks. 5"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Min. antall ansatte
                      </label>
                      <input
                        type="number"
                        placeholder="f.eks. 10"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
                    <p className="text-sm text-purple-900 dark:text-purple-300 font-medium mb-2">
                      Komplett dataimport
                    </p>
                    <ul className="text-xs text-purple-700 dark:text-purple-400 space-y-1">
                      <li>✓ Fullstendig økonomidata og historikk</li>
                      <li>✓ Styre, ledelse og kontaktpersoner</li>
                      <li>✓ SEO-analyse og digital tilstedeværelse</li>
                      <li>✓ AI-basert prospect scoring</li>
                      <li>✓ Anbefalinger for hvilke som bør kontaktes</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportType(null);
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              {importType && (
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportType(null);
                    const source = importType === 'bronnoysund' ? 'Brønnøysund' : 'Forvalt';
                    alert(`Import fra ${source} ville blitt startet. Analyse kjører i bakgrunnen.`);
                  }}
                  className={`px-4 py-2 text-white rounded-lg transition-colors ${
                    importType === 'bronnoysund'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  Start import
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
