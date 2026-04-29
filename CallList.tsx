import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  XCircle,
  Clock,
  TrendingUp,
  FileText,
  Users,
  Briefcase,
  BarChart3,
  Folder,
  DollarSign,
  Timer,
  Plug,
  StickyNote,
  Plus,
  Edit,
  ExternalLink,
  ArrowLeft,
  Activity,
  Ticket,
  ListTodo,
  Send,
  X,
  Download,
  TrendingDown,
  Target,
  MessageSquare,
  PhoneIncoming,
  PhoneOff,
  Video,
  UserCheck,
  Save,
  ArrowRight,
  Search,
  Filter,
  RefreshCw,
  Share2,
  Eye,
  FolderOpen,
  File,
  Image as ImageIcon,
  FileSpreadsheet,
  FileImage,
  Upload,
  ChevronRight,
  Settings,
  Trash2,
  Paperclip
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DateTimePicker } from './DateTimePicker';
import { TaskItem } from './TaskItem';

export function CustomerDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [reportSettings, setReportSettings] = useState({
    period: 'last_month',
    customStart: '',
    customEnd: '',
    includeSections: {
      kpis: true,
      financials: true,
      activity: true
    }
  });

  // Quick log state
  const [quickLogExpanded, setQuickLogExpanded] = useState(false);
  const [quickLogData, setQuickLogData] = useState({
    activityType: '',
    customActivityType: '',
    note: '',
    createFollowUp: false,
    followUpTitle: '',
    followUpDate: '',
    followUpDescription: ''
  });

  // Tasks state
  const [customerTasks, setCustomerTasks] = useState([
    { id: '1', title: 'Send månedsrapport', description: 'Første månedsrapport SEO', dueDate: 'I dag 15:00', priority: 'high' as const, status: 'In progress', assignee: 'Ola Nordmann', customer: 'Nordic Tech AS', customerId: id, service: 'SEO' },
    { id: '2', title: 'Sett opp Google Analytics tracking', description: 'Verifiser at tracking er korrekt', dueDate: 'I morgen', priority: 'high' as const, status: 'Not started', assignee: 'Kari Jensen', customer: 'Nordic Tech AS', customerId: id, service: 'Analytics' },
    { id: '3', title: 'Onboarding oppfølging', description: 'Sjekk at alle tilganger er på plass', dueDate: 'Om 3 dager', priority: 'medium' as const, status: 'Not started', assignee: 'Ola Nordmann', customer: 'Nordic Tech AS', customerId: id, service: 'Onboarding' }
  ]);

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Er du sikker på at du vil slette denne oppgaven?')) {
      setCustomerTasks(customerTasks.filter(t => t.id !== taskId));
    }
  };

  const handleEditTask = (taskId: string, updatedTask: any) => {
    setCustomerTasks(customerTasks.map(t => t.id === taskId ? { ...t, ...updatedTask } : t));
  };

  // Customer owner change
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false);

  // Deal management
  const [showNewDealModal, setShowNewDealModal] = useState(false);
  const [editingDealIndex, setEditingDealIndex] = useState<number | null>(null);
  const [newDeal, setNewDeal] = useState({
    name: '',
    totalValue: '',
    startDate: '',
    billingFrequency: 'monthly',
    priceIncludesVat: false,
    signedAgreementPdf: null as File | null,
    services: [{ name: '', value: '', isRecurring: true }]
  });

  // Contact management
  const [showAddContact, setShowAddContact] = useState(false);
  const [editingContact, setEditingContact] = useState<number | null>(null);
  const [newContact, setNewContact] = useState({
    name: '',
    title: '',
    email: '',
    phone: ''
  });
  const [editContact, setEditContact] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    isPrimary: false
  });

  // Google Drive integration state
  const [driveConnected, setDriveConnected] = useState(false);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveSearchQuery, setDriveSearchQuery] = useState('');
  const [driveViewMode, setDriveViewMode] = useState<'list' | 'grid'>('list');
  const [driveSortBy, setDriveSortBy] = useState<'name' | 'modified' | 'size'>('modified');
  const [driveCurrentFolder, setDriveCurrentFolder] = useState<string | null>(null);
  const [driveFolderPath, setDriveFolderPath] = useState<Array<{ id: string; name: string }>>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);

  // Integration management state
  const [showAddIntegrationModal, setShowAddIntegrationModal] = useState(false);
  const [showConfigureIntegration, setShowConfigureIntegration] = useState<string | null>(null);
  const [integrationConnecting, setIntegrationConnecting] = useState<string | null>(null);

  // Notes management state
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({ content: '', attachments: [] as File[] });
  const [notes, setNotes] = useState([
    {
      id: '1',
      content: 'Kunden er svært interessert i å se resultater raskt. Har nevnt at de har hatt dårlig erfaring med tidligere byrå. Viktig å følge opp tett og vise resultater kontinuerlig.',
      author: 'Ola Nordmann',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      attachments: [] as { name: string; url: string; type: string }[]
    },
    {
      id: '2',
      content: 'Oppdatering fra oppstartsmøte: Kunden ønsker å fokusere på lokal SEO først. De har en fysisk butikk i Oslo sentrum som ikke får nok trafikk.',
      author: 'Kari Jensen',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      attachments: [
        { name: 'oppstartsmøte-notater.pdf', url: '#', type: 'pdf' },
        { name: 'konkurranseanalyse.xlsx', url: '#', type: 'spreadsheet' }
      ]
    }
  ]);

  const teamMembers = ['Ola Nordmann', 'Kari Jensen', 'Per Hansen', 'Nina Olsen'];

  // Check if we should open quick log from navigation state
  useEffect(() => {
    if (location.state?.openQuickLog) {
      setQuickLogExpanded(true);
      if (location.state?.taskData) {
        setQuickLogData({
          activityType: 'other',
          customActivityType: location.state.taskData.title,
          note: `Fullført: ${location.state.taskData.title} - ${location.state.taskData.description}`,
          createFollowUp: false,
          followUpTitle: '',
          followUpDate: '',
          followUpDescription: ''
        });
      }
    }
  }, [location.state]);

  // Available integrations to add
  const availableIntegrations = [
    { id: 'ga4', name: 'Google Analytics 4', description: 'Spor nettstedstrafikk og brukeradferd', icon: '📊', category: 'Analytics' },
    { id: 'gsc', name: 'Google Search Console', description: 'Overvåk søkeytelse og indeksering', icon: '🔍', category: 'SEO' },
    { id: 'gads', name: 'Google Ads', description: 'Administrer annonsekampanjer', icon: '🎯', category: 'Advertising' },
    { id: 'meta', name: 'Meta Ads', description: 'Facebook og Instagram annonsering', icon: '📱', category: 'Advertising' },
    { id: 'linkedin', name: 'LinkedIn Ads', description: 'LinkedIn annonsekampanjer', icon: '💼', category: 'Advertising' },
    { id: 'hubspot', name: 'HubSpot', description: 'CRM og marketing automation', icon: '🔄', category: 'CRM' },
    { id: 'mailchimp', name: 'Mailchimp', description: 'E-postmarkedsføring', icon: '✉️', category: 'Email' },
    { id: 'semrush', name: 'SEMrush', description: 'SEO og konkurranseanalyse', icon: '📈', category: 'SEO' },
    { id: 'ahrefs', name: 'Ahrefs', description: 'Backlink og keyword research', icon: '🔗', category: 'SEO' },
    { id: 'slack', name: 'Slack', description: 'Team kommunikasjon og varsler', icon: '💬', category: 'Communication' }
  ];

  // Mock Google Drive files - TODO: Replace with API data from Google Drive API v3
  const mockDriveFiles = [
    // Root level folders
    {
      id: '1',
      name: 'Kunde dokumenter',
      mimeType: 'folder',
      parentId: null,
      owner: 'kunde@nordictech.no',
      modifiedTime: 'I dag',
      size: '-',
      shared: true,
      webViewLink: 'https://drive.google.com/drive/folders/example1'
    },
    {
      id: '5',
      name: 'Merkevarebilder',
      mimeType: 'folder',
      parentId: null,
      owner: 'kunde@nordictech.no',
      modifiedTime: '1 uke siden',
      size: '-',
      shared: true,
      webViewLink: 'https://drive.google.com/drive/folders/example5'
    },
    {
      id: '9',
      name: 'Produktbilder Q1',
      mimeType: 'folder',
      parentId: null,
      owner: 'kunde@nordictech.no',
      modifiedTime: '1 måned siden',
      size: '-',
      shared: true,
      webViewLink: 'https://drive.google.com/drive/folders/example9'
    },
    // Root level files
    {
      id: '2',
      name: 'SEO-strategi Q2 2024.pdf',
      mimeType: 'document',
      parentId: null,
      owner: 'Ola Nordmann',
      modifiedTime: '2 timer siden',
      size: '2.4 MB',
      shared: true,
      webViewLink: 'https://docs.google.com/document/d/example2'
    },
    {
      id: '3',
      name: 'Månedsrapport Mars 2024',
      mimeType: 'document',
      parentId: null,
      owner: 'Ola Nordmann',
      modifiedTime: '3 dager siden',
      size: '1.8 MB',
      shared: true,
      webViewLink: 'https://docs.google.com/document/d/example3'
    },
    {
      id: '4',
      name: 'Keyword Research.xlsx',
      mimeType: 'spreadsheet',
      parentId: null,
      owner: 'Kari Jensen',
      modifiedTime: '5 dager siden',
      size: '456 KB',
      shared: true,
      webViewLink: 'https://docs.google.com/spreadsheets/d/example4'
    },
    {
      id: '10',
      name: 'Google Analytics Dashboard.pdf',
      mimeType: 'document',
      parentId: null,
      owner: 'Kari Jensen',
      modifiedTime: '1 måned siden',
      size: '5.1 MB',
      shared: true,
      webViewLink: 'https://drive.google.com/file/d/example10'
    },
    // Files inside "Kunde dokumenter" folder (id: '1')
    {
      id: '8',
      name: 'Onboarding-avtale signert.pdf',
      mimeType: 'document',
      parentId: '1',
      owner: 'Ola Nordmann',
      modifiedTime: '3 uker siden',
      size: '890 KB',
      shared: true,
      webViewLink: 'https://drive.google.com/file/d/example8'
    },
    {
      id: '11',
      name: 'Kundeintervju notater.docx',
      mimeType: 'document',
      parentId: '1',
      owner: 'Kari Jensen',
      modifiedTime: '1 uke siden',
      size: '124 KB',
      shared: true,
      webViewLink: 'https://docs.google.com/document/d/example11'
    },
    // Files inside "Merkevarebilder" folder (id: '5')
    {
      id: '6',
      name: 'Logo-varianter.zip',
      mimeType: 'application',
      parentId: '5',
      owner: 'kunde@nordictech.no',
      modifiedTime: '1 uke siden',
      size: '12.3 MB',
      shared: true,
      webViewLink: 'https://drive.google.com/file/d/example6'
    },
    {
      id: '7',
      name: 'Kampanjebanner-april.png',
      mimeType: 'image',
      parentId: '5',
      owner: 'kunde@nordictech.no',
      modifiedTime: '2 uker siden',
      size: '3.2 MB',
      shared: false,
      webViewLink: 'https://drive.google.com/file/d/example7'
    },
    {
      id: '12',
      name: 'Brand-guidelines.pdf',
      mimeType: 'document',
      parentId: '5',
      owner: 'kunde@nordictech.no',
      modifiedTime: '3 uker siden',
      size: '8.7 MB',
      shared: true,
      webViewLink: 'https://drive.google.com/file/d/example12'
    }
  ];

  // Mock customer data
  const customer = {
    id: id,
    name: 'Nordic Tech AS',
    legalName: 'Nordic Tech Solutions AS',
    orgNumber: '123456789',
    website: 'www.nordictech.no',
    status: 'Onboarding',
    healthScore: 85,
    healthStatus: 'good',
    owner: 'Ola Nordmann',
    team: 'Team Oslo',
    country: 'Norge',
    city: 'Oslo',
    monthlyValue: 45000,
    startDate: '15. mars 2024',
    lastContact: '2 dager siden',
    nextActivity: 'Oppstartsmøte - I morgen 10:00',
    services: [
      { name: 'SEO', status: 'Active', owner: 'Ola Nordmann', startDate: '15.03.2024', monthlyValue: 25000 },
      { name: 'Google Ads', status: 'Onboarding', owner: 'Kari Jensen', startDate: '20.03.2024', monthlyValue: 20000 }
    ],
    contacts: [
      {
        name: 'Maria Hansen',
        title: 'Markedssjef',
        email: 'maria@nordictech.no',
        phone: '+47 123 45 678',
        isPrimary: true,
        isDecisionMaker: true,
        linkedIn: 'linkedin.com/in/mariahansen'
      },
      {
        name: 'Erik Larsen',
        title: 'CEO',
        email: 'erik@nordictech.no',
        phone: '+47 987 65 432',
        isPrimary: false,
        isDecisionMaker: true,
        linkedIn: 'linkedin.com/in/eriklarsen'
      }
    ],
    activities: [
      { type: 'meeting', title: 'Oppstartsmøte planlagt', description: 'SEO oppstartsmøte med Maria', date: 'I morgen 10:00', user: 'Ola Nordmann' },
      { type: 'deal', title: 'Avtale signert', description: 'Google Ads avtale signert', date: '2 dager siden', user: 'System' },
      { type: 'note', title: 'Intern note', description: 'Kunden er svært interessert i å se resultater raskt', date: '3 dager siden', user: 'Ola Nordmann' },
      { type: 'email', title: 'E-post sendt', description: 'Velkomst-e-post med onboarding-info', date: '5 dager siden', user: 'Ola Nordmann' }
    ],
    tasks: [
      { title: 'Send månedsrapport', description: 'Første månedsrapport SEO', dueDate: 'I dag 15:00', priority: 'high', status: 'In progress', assignee: 'Ola Nordmann' },
      { title: 'Sett opp Google Analytics tracking', description: 'Verifiser at tracking er korrekt', dueDate: 'I morgen', priority: 'high', status: 'Not started', assignee: 'Kari Jensen' },
      { title: 'Onboarding oppfølging', description: 'Sjekk at alle tilganger er på plass', dueDate: 'Om 3 dager', priority: 'medium', status: 'Not started', assignee: 'Ola Nordmann' }
    ],
    tickets: [
      { id: '1234', subject: 'Spørsmål om rapportdata', category: 'Rapport og tall', priority: 'medium', status: 'Open', opened: '1 dag siden', assignee: 'Ola Nordmann' }
    ],
    deals: [
      { name: 'SEO-pakke Standard', value: 300000, status: 'Signed', signedDate: '10.03.2024', startDate: '15.03.2024' },
      { name: 'Google Ads Setup', value: 240000, status: 'Signed', signedDate: '15.03.2024', startDate: '20.03.2024' }
    ],
    kpis: [
      { metric: 'Organisk trafikk', current: 12500, previous: 11200, change: '+11.6%', trend: 'up' },
      { metric: 'Søkeord i topp 10', current: 45, previous: 38, change: '+18.4%', trend: 'up' },
      { metric: 'Conversion rate', current: '2.8%', previous: '2.1%', change: '+33.3%', trend: 'up' }
    ],
    kpiTrends: {
      organicTraffic: [
        { id: 'traffic-1', month: 'Okt', value: 9800 },
        { id: 'traffic-2', month: 'Nov', value: 10200 },
        { id: 'traffic-3', month: 'Des', value: 11200 },
        { id: 'traffic-4', month: 'Jan', value: 11800 },
        { id: 'traffic-5', month: 'Feb', value: 12100 },
        { id: 'traffic-6', month: 'Mar', value: 12500 }
      ],
      topKeywords: [
        { id: 'keywords-1', month: 'Okt', value: 32 },
        { id: 'keywords-2', month: 'Nov', value: 35 },
        { id: 'keywords-3', month: 'Des', value: 38 },
        { id: 'keywords-4', month: 'Jan', value: 40 },
        { id: 'keywords-5', month: 'Feb', value: 43 },
        { id: 'keywords-6', month: 'Mar', value: 45 }
      ]
    },
    customKpis: [
      { name: 'Nye leads via nettside', target: 25, actual: 28, status: 'good' },
      { name: 'Kostnad per lead', target: 500, actual: 480, status: 'good' },
      { name: 'Organisk synlighet', target: 80, actual: 72, status: 'warning' },
      { name: 'Booking-rate', target: 15, actual: 12, status: 'danger' }
    ],
    integrations: [
      { name: 'Google Analytics 4', status: 'Connected', lastSync: '10 minutter siden' },
      { name: 'Google Search Console', status: 'Connected', lastSync: '1 time siden' },
      { name: 'Google Ads', status: 'Pending', lastSync: 'Ikke synkronisert' }
    ],
    documents: [
      { name: 'Onboarding-dokument.pdf', category: 'Onboarding', uploadedBy: 'Ola Nordmann', uploadedAt: '5 dager siden' },
      { name: 'SEO-strategi 2024.pdf', category: 'Strategi', uploadedBy: 'Ola Nordmann', uploadedAt: '3 dager siden' }
    ],
    financials: {
      totalInvoiced: 45000,
      totalPaid: 45000,
      outstanding: 0,
      nextInvoice: '01.05.2024',
      invoices: [
        { number: 'INV-2024-001', date: '01.03.2024', amount: 45000, dueDate: '15.03.2024', status: 'Betalt', paidDate: '12.03.2024' },
        { number: 'INV-2024-002', date: '01.04.2024', amount: 45000, dueDate: '15.04.2024', status: 'Betalt', paidDate: '14.04.2024' },
        { number: 'INV-2024-003', date: '01.05.2024', amount: 45000, dueDate: '15.05.2024', status: 'Sendt', paidDate: null }
      ],
      mrrHistory: [
        { id: 'mrr-1', month: 'Okt', revenue: 0 },
        { id: 'mrr-2', month: 'Nov', revenue: 0 },
        { id: 'mrr-3', month: 'Des', revenue: 0 },
        { id: 'mrr-4', month: 'Jan', revenue: 0 },
        { id: 'mrr-5', month: 'Feb', revenue: 0 },
        { id: 'mrr-6', month: 'Mar', revenue: 45000 }
      ]
    },
    timeEntries: {
      thisMonth: 12.5,
      lastMonth: 0,
      total: 12.5
    }
  };

  const tabs = [
    { id: 'overview', label: 'Oversikt', icon: Building2 },
    { id: 'health', label: 'Kundehelse', icon: Activity },
    { id: 'analysis', label: 'Analyse', icon: TrendingUp },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'deals', label: 'Avtaler & Tjenester', icon: FileText },
    { id: 'kpis', label: 'KPI-er', icon: BarChart3 },
    { id: 'documents', label: 'Dokumenter', icon: Folder },
    { id: 'financials', label: 'Økonomi', icon: DollarSign },
    { id: 'time', label: 'Timer', icon: Timer },
    { id: 'integrations', label: 'Integrasjoner', icon: Plug },
    { id: 'notes', label: 'Interne noter', icon: StickyNote }
  ];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'danger':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <Link to="/customers" className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Tilbake til kunder
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{customer.name}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{customer.legalName} • Org.nr: {customer.orgNumber}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                  <a href={`https://${customer.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600">
                    <Globe className="w-4 h-4" />
                    {customer.website}
                  </a>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {customer.city}, {customer.country}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Kunde siden {customer.startDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className={`px-4 py-2 rounded-lg border ${getHealthColor(customer.healthStatus)}`}>
                <div className="flex items-center gap-2">
                  {customer.healthStatus === 'good' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : customer.healthStatus === 'warning' ? (
                    <Clock className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <div>
                    <p className="text-xs font-medium">Helse-score</p>
                    <p className="text-lg font-bold">{customer.healthScore}</p>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Rediger
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 border-t border-slate-200 dark:border-slate-700">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="col-span-2 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">MRR</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{customer.monthlyValue.toLocaleString('nb-NO')} kr</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Åpne oppgaver</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{customerTasks.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Åpne tickets</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{customer.tickets.length}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Tjenester</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{customer.services.length}</p>
                </div>
              </div>

              {/* Oppgaver */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Oppgaver</h3>
                  <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                    Se alle
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {customerTasks.slice(0, 3).map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onClick={() => {
                        // Når man klikker på oppgaven, åpne hurtiglogg med pre-fyllt info
                        setQuickLogData({
                          activityType: 'other',
                          customActivityType: task.title,
                          note: `Fullført: ${task.title} - ${task.description}`,
                          createFollowUp: false,
                          followUpTitle: '',
                          followUpDate: '',
                          followUpDescription: ''
                        });
                        setQuickLogExpanded(true);
                      }}
                      teamMembers={teamMembers}
                      onReassign={(assignee) => {
                        console.log(`Reassigning task to ${assignee}`);
                      }}
                      onReschedule={(date) => {
                        console.log(`Rescheduling task to ${date}`);
                      }}
                      onEdit={(updatedTask) => handleEditTask(task.id, updatedTask)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Hurtiglogg - Loggfør kontakt */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="px-6 py-4">
                  <div
                    onClick={() => setQuickLogExpanded(!quickLogExpanded)}
                    className="flex items-center justify-between mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Hurtiglogg</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Loggfør kundekontakt raskt</p>
                      </div>
                    </div>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {quickLogExpanded ? 'Skjul' : 'Utvid'}
                    </span>
                  </div>

                  {quickLogExpanded && (
                    <div className="space-y-4">
                      {/* Aktivitetstype - hurtigvalg */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Hva gjorde du?
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            onClick={() => setQuickLogData({ ...quickLogData, activityType: 'call_answered' })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${
                              quickLogData.activityType === 'call_answered'
                                ? 'border-green-600 bg-green-50 dark:bg-green-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <PhoneIncoming className={`w-4 h-4 ${
                              quickLogData.activityType === 'call_answered' ? 'text-green-600' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'call_answered'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              Ringt - samtale
                            </span>
                          </button>

                          <button
                            onClick={() => setQuickLogData({ ...quickLogData, activityType: 'call_no_answer' })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${
                              quickLogData.activityType === 'call_no_answer'
                                ? 'border-yellow-600 bg-yellow-50 dark:bg-yellow-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <PhoneOff className={`w-4 h-4 ${
                              quickLogData.activityType === 'call_no_answer' ? 'text-yellow-600' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'call_no_answer'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              Ringt - ikke svar
                            </span>
                          </button>

                          <button
                            onClick={() => setQuickLogData({ ...quickLogData, activityType: 'call_booked_meeting' })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${
                              quickLogData.activityType === 'call_booked_meeting'
                                ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <Calendar className={`w-4 h-4 ${
                              quickLogData.activityType === 'call_booked_meeting' ? 'text-emerald-600' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'call_booked_meeting'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              Ringt - booket møte
                            </span>
                          </button>

                          <button
                            onClick={() => setQuickLogData({ ...quickLogData, activityType: 'email_sent' })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${
                              quickLogData.activityType === 'email_sent'
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <Send className={`w-4 h-4 ${
                              quickLogData.activityType === 'email_sent' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'email_sent'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              E-post sendt
                            </span>
                          </button>

                          <button
                            onClick={() => setQuickLogData({ ...quickLogData, activityType: 'meeting' })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${
                              quickLogData.activityType === 'meeting'
                                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <UserCheck className={`w-4 h-4 ${
                              quickLogData.activityType === 'meeting' ? 'text-purple-600' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'meeting'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              Møte avholdt
                            </span>
                          </button>

                          <button
                            onClick={() => setQuickLogData({ ...quickLogData, activityType: 'video_call' })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${
                              quickLogData.activityType === 'video_call'
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <Video className={`w-4 h-4 ${
                              quickLogData.activityType === 'video_call' ? 'text-indigo-600' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'video_call'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              Videomøte
                            </span>
                          </button>

                          <button
                            onClick={() => setQuickLogData({ ...quickLogData, activityType: 'other' })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${
                              quickLogData.activityType === 'other'
                                ? 'border-slate-600 bg-slate-50 dark:bg-slate-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <Edit className={`w-4 h-4 ${
                              quickLogData.activityType === 'other' ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'other'
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-600 dark:text-slate-400'
                            }`}>
                              Annet
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Custom activity type input */}
                      {quickLogData.activityType === 'other' && (
                        <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Type aktivitet
                          </label>
                          <input
                            type="text"
                            value={quickLogData.customActivityType}
                            onChange={(e) => setQuickLogData({ ...quickLogData, customActivityType: e.target.value })}
                            placeholder="F.eks. 'LinkedIn-melding sendt', 'Demoavtale booket'..."
                            className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}

                      {/* Notat */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Notat
                        </label>
                        <textarea
                          value={quickLogData.note}
                          onChange={(e) => setQuickLogData({ ...quickLogData, note: e.target.value })}
                          placeholder="Skriv et kort notat om kontakten..."
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      {/* Opprett oppfølgingsoppgave */}
                      <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={quickLogData.createFollowUp}
                            onChange={(e) => setQuickLogData({ ...quickLogData, createFollowUp: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Opprett oppfølgingsoppgave
                          </span>
                        </label>

                        {quickLogData.createFollowUp && (
                          <div className="mt-3 space-y-3 pl-6">
                            <div>
                              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Tittel på oppgave
                              </label>
                              <input
                                type="text"
                                value={quickLogData.followUpTitle}
                                onChange={(e) => setQuickLogData({ ...quickLogData, followUpTitle: e.target.value })}
                                placeholder="F.eks. 'Ring tilbake', 'Send tilbud', 'Book møte'..."
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Når skal oppfølging skje?
                              </label>
                              <DateTimePicker
                                value={quickLogData.followUpDate}
                                onChange={(value) => setQuickLogData({ ...quickLogData, followUpDate: value })}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                Beskrivelse av oppfølging
                              </label>
                              <input
                                type="text"
                                value={quickLogData.followUpDescription}
                                onChange={(e) => setQuickLogData({ ...quickLogData, followUpDescription: e.target.value })}
                                placeholder="Ekstra detaljer om oppgaven (valgfritt)"
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            // Handle saving the quick log
                            console.log('Saving quick log:', quickLogData);
                            // Reset form
                            setQuickLogData({
                              activityType: '',
                              customActivityType: '',
                              note: '',
                              createFollowUp: false,
                              followUpTitle: '',
                              followUpDate: '',
                              followUpDescription: ''
                            });
                            setQuickLogExpanded(false);
                          }}
                          disabled={
                            !quickLogData.activityType ||
                            !quickLogData.note ||
                            (quickLogData.activityType === 'other' && !quickLogData.customActivityType) ||
                            (quickLogData.createFollowUp && !quickLogData.followUpTitle)
                          }
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Save className="w-4 h-4" />
                          Logg aktivitet
                        </button>
                        <button
                          onClick={() => {
                            setQuickLogData({
                              activityType: '',
                              customActivityType: '',
                              note: '',
                              createFollowUp: false,
                              followUpTitle: '',
                              followUpDate: '',
                              followUpDescription: ''
                            });
                            setQuickLogExpanded(false);
                          }}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Avbryt
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Siste aktivitet */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Siste aktivitet</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEmailData({
                          to: customer.contacts[0].email,
                          subject: '',
                          message: ''
                        });
                        setShowEmailModal(true);
                      }}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                    >
                      <Send className="w-4 h-4" />
                      Send e-post
                    </button>
                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Se alle</button>
                  </div>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {customer.activities.slice(0, 4).map((activity, idx) => (
                    <div key={idx} className="px-6 py-4 flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'meeting' ? 'bg-blue-50' :
                        activity.type === 'deal' ? 'bg-green-50' :
                        activity.type === 'note' ? 'bg-purple-50' : 'bg-orange-50'
                      }`}>
                        {activity.type === 'meeting' ? <Calendar className="w-4 h-4 text-blue-600" /> :
                         activity.type === 'deal' ? <FileText className="w-4 h-4 text-green-600" /> :
                         activity.type === 'note' ? <StickyNote className="w-4 h-4 text-purple-600" /> :
                         <Mail className="w-4 h-4 text-orange-600" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{activity.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{activity.date} • {activity.user}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Kundeansvarlig */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Kundeansvarlig</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      Endre
                    </button>
                    {showOwnerDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-10">
                        <div className="p-2">
                          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 px-2 py-1 mb-1">
                            Overfør til:
                          </p>
                          {teamMembers.map((member) => (
                            <button
                              key={member}
                              onClick={() => {
                                console.log(`Changing owner to ${member}`);
                                setShowOwnerDropdown(false);
                              }}
                              className="w-full text-left px-2 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors flex items-center gap-2"
                            >
                              <Users className="w-3.5 h-3.5" />
                              {member}
                            </button>
                          ))}
                          <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2">
                            <button
                              onClick={() => setShowOwnerDropdown(false)}
                              className="w-full text-center px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                            >
                              Avbryt
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{customer.owner}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{customer.team}</p>
                  </div>
                </div>
              </div>

              {/* Kontaktpersoner */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Kontaktpersoner</h3>
                  <button
                    onClick={() => setShowAddContact(!showAddContact)}
                    className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Legg til
                  </button>
                </div>

                {showAddContact && (
                  <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Ny kontaktperson</p>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Navn"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Tittel"
                        value={newContact.title}
                        onChange={(e) => setNewContact({ ...newContact, title: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="E-post"
                        value={newContact.email}
                        onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="tel"
                        placeholder="Telefon"
                        value={newContact.phone}
                        onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            console.log('Adding contact:', newContact);
                            setNewContact({ name: '', title: '', email: '', phone: '' });
                            setShowAddContact(false);
                          }}
                          className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          Lagre
                        </button>
                        <button
                          onClick={() => {
                            setNewContact({ name: '', title: '', email: '', phone: '' });
                            setShowAddContact(false);
                          }}
                          className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          Avbryt
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {customer.contacts.map((contact, idx) => (
                    <div
                      key={idx}
                      className="pb-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0 last:pb-0"
                    >
                      {editingContact === idx ? (
                        <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
                          <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Rediger kontaktperson</p>
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Navn"
                              value={editContact.name}
                              onChange={(e) => setEditContact({ ...editContact, name: e.target.value })}
                              className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Tittel"
                              value={editContact.title}
                              onChange={(e) => setEditContact({ ...editContact, title: e.target.value })}
                              className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="email"
                              placeholder="E-post"
                              value={editContact.email}
                              onChange={(e) => setEditContact({ ...editContact, email: e.target.value })}
                              className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="tel"
                              placeholder="Telefon"
                              value={editContact.phone}
                              onChange={(e) => setEditContact({ ...editContact, phone: e.target.value })}
                              className="w-full px-2 py-1.5 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editContact.isPrimary}
                                onChange={(e) => setEditContact({ ...editContact, isPrimary: e.target.checked })}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                              />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Primærkontakt</span>
                            </label>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => {
                                  console.log('Saving contact:', editContact);
                                  setEditingContact(null);
                                }}
                                className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                              >
                                Lagre
                              </button>
                              <button
                                onClick={() => {
                                  setEditingContact(null);
                                }}
                                className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                              >
                                Avbryt
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-slate-900 dark:text-white">{contact.name}</p>
                                {contact.isPrimary && (
                                  <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded">
                                    Primær
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{contact.title}</p>
                            </div>
                            <button
                              onClick={() => {
                                setEditContact({
                                  name: contact.name,
                                  title: contact.title,
                                  email: contact.email,
                                  phone: contact.phone,
                                  isPrimary: contact.isPrimary
                                });
                                setEditingContact(idx);
                              }}
                              className="text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="space-y-1">
                            <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                              <Mail className="w-3.5 h-3.5" />
                              {contact.email}
                            </a>
                            <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                              <Phone className="w-3.5 h-3.5" />
                              {contact.phone}
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Aktive tjenester */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Aktive tjenester</h3>
                <div className="space-y-3">
                  {customer.services.map((service, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{service.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{service.owner}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        service.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="space-y-6">
            {/* Health Score Overview */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Kundehelse</h2>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-lg p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Health Score</p>
                    <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-4xl font-bold text-green-900 dark:text-green-100">85</p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">God helse</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Trend</p>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">+5</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Siste 30 dager</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Risikonivå</p>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">Lav</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Stabil kunde</p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">NPS Score</p>
                    <Target className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">9/10</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Promoter</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Siste kontakt</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">2 dager siden</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <Clock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Gjennomsnittlig responstid</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">2.5 timer</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                  <Ticket className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Åpne tickets</p>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">0</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Positive Signals */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Positive signaler</h3>
              </div>
              <div className="space-y-2">
                {[
                  'Sterke resultater siste 3 måneder',
                  'Aktiv kommunikasjon og engasjement',
                  'Betalinger alltid i tide',
                  'Høy engasjement i rapporter og møter',
                  'God KPI-utvikling på tvers av tjenester'
                ].map((signal, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-green-900 dark:text-green-100">{signal}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning Signals */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Advarselssignaler</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-900 dark:text-orange-100">Ingen kritiske advarsler identifisert</p>
                </div>
              </div>
            </div>

            {/* Upsell Opportunities */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-slate-900 dark:text-white">Upsell-muligheter</h3>
              </div>
              <div className="space-y-2">
                {[
                  'Interesse for Meta Ads nevnt i siste møte',
                  'Potensial for Content Marketing tjenester',
                  'Spør ofte om konverteringsoptimalisering'
                ].map((opportunity, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900 dark:text-blue-100">{opportunity}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Health History */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Health Score historikk</h3>
              <div className="h-64" key="health-score-chart-container">
                <ResponsiveContainer width="100%" height="100%" key="health-score-responsive">
                  <LineChart
                    data={[
                      { id: 'health-jan', month: 'Jan', score: 72 },
                      { id: 'health-feb', month: 'Feb', score: 75 },
                      { id: 'health-mar', month: 'Mar', score: 78 },
                      { id: 'health-apr', month: 'Apr', score: 80 },
                      { id: 'health-mai', month: 'Mai', score: 85 }
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" key="health-grid" />
                    <XAxis dataKey="month" className="text-slate-600 dark:text-slate-400" key="health-xaxis" />
                    <YAxis domain={[0, 100]} className="text-slate-600 dark:text-slate-400" key="health-yaxis" />
                    <Tooltip key="health-tooltip" />
                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} name="Health Score" key="health-line" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analysis' && (
          <div className="space-y-6">
            {/* Analysis Header */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Digital Analyse</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Sist analysert: {new Date().toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Oppdater analyse
                </button>
              </div>

              {/* Overall Score */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total score</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">48/100</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Forbedringspotensial</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Organiske søkeord</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">145</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-1">-8% siste måned</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Estimert trafikk</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">12.5k</p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">+3% siste måned</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Domain Authority</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">42</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Middels</p>
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Viktigste funn</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">Kritisk: Lav sidehastighet</p>
                    <p className="text-xs text-red-700 dark:text-red-300 mt-1">PageSpeed score: 38/100. Dette påvirker både brukeropplevelse og SEO-rangering negativt.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-900 dark:text-orange-100">Advarsel: Manglende structured data</p>
                    <p className="text-xs text-orange-700 dark:text-orange-300 mt-1">Product schema og Organization markup mangler. Dette reduserer synlighet i søkeresultater.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">Bra: SSL og HTTPS konfigurert korrekt</p>
                    <p className="text-xs text-green-700 dark:text-green-300 mt-1">Sikker tilkobling fungerer som den skal.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical SEO */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Teknisk SEO</h3>
              <div className="space-y-3">
                {[
                  { name: 'Core Web Vitals', score: 52, status: 'warning' },
                  { name: 'HTTPS / SSL', score: 100, status: 'success' },
                  { name: 'Mobile-Friendly', score: 82, status: 'success' },
                  { name: 'Page Speed', score: 45, status: 'error' },
                  { name: 'Structured Data', score: 35, status: 'error' },
                  { name: 'XML Sitemap', score: 100, status: 'success' },
                  { name: 'Meta Tags', score: 58, status: 'warning' },
                  { name: 'Image Optimization', score: 32, status: 'error' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {item.status === 'warning' && <AlertCircle className="w-5 h-5 text-orange-600" />}
                      {item.status === 'error' && <XCircle className="w-5 h-5 text-red-600" />}
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            item.score >= 80 ? 'bg-green-500' :
                            item.score >= 50 ? 'bg-orange-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${item.score}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white w-12 text-right">{item.score}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Performance */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Topp søkeord</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="text-left text-sm font-medium text-slate-600 dark:text-slate-400 pb-3">Søkeord</th>
                      <th className="text-left text-sm font-medium text-slate-600 dark:text-slate-400 pb-3">Posisjon</th>
                      <th className="text-left text-sm font-medium text-slate-600 dark:text-slate-400 pb-3">Volum</th>
                      <th className="text-left text-sm font-medium text-slate-600 dark:text-slate-400 pb-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { keyword: 'nettbutikk klær', position: 12, volume: 2400, trend: 'up' },
                      { keyword: 'online shopping norge', position: 8, volume: 1900, trend: 'up' },
                      { keyword: 'kjøp sko online', position: 15, volume: 1200, trend: 'down' },
                      { keyword: 'dame jakker', position: 18, volume: 890, trend: 'neutral' }
                    ].map((item, idx) => (
                      <tr key={idx} className="border-b border-slate-100 dark:border-slate-700">
                        <td className="py-3 text-sm text-slate-900 dark:text-white">{item.keyword}</td>
                        <td className="py-3 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.position <= 3 ? 'bg-green-100 text-green-700' :
                            item.position <= 10 ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}>
                            #{item.position}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-slate-600 dark:text-slate-400">{item.volume.toLocaleString()}/måned</td>
                        <td className="py-3">
                          {item.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-600" />}
                          {item.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-600" />}
                          {item.trend === 'neutral' && <span className="text-slate-400">-</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Kontaktpersoner ({customer.contacts.length})</h3>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Legg til kontakt
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {customer.contacts.map((contact, idx) => (
                <div key={idx} className="px-6 py-6 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <Users className="w-6 h-6 text-slate-600 dark:text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 dark:text-white">{contact.name}</p>
                          {contact.isPrimary && (
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                              Primær
                            </span>
                          )}
                          {contact.isDecisionMaker && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                              Beslutningstaker
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{contact.title}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <a href={`mailto:${contact.email}`} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                            <Mail className="w-4 h-4" />
                            {contact.email}
                          </a>
                          <a href={`tel:${contact.phone}`} className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                            <Phone className="w-4 h-4" />
                            {contact.phone}
                          </a>
                          <a href={`https://${contact.linkedIn}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400">
                            LinkedIn
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Aktivitetsfeed</h3>
            </div>
            <div className="p-6 space-y-4">
              {customer.activities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'meeting' ? 'bg-blue-50' :
                    activity.type === 'deal' ? 'bg-green-50' :
                    activity.type === 'note' ? 'bg-purple-50' : 'bg-orange-50'
                  }`}>
                    {activity.type === 'meeting' ? <Calendar className="w-5 h-5 text-blue-600" /> :
                     activity.type === 'deal' ? <FileText className="w-5 h-5 text-green-600" /> :
                     activity.type === 'note' ? <StickyNote className="w-5 h-5 text-purple-600" /> :
                     <Mail className="w-5 h-5 text-orange-600" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{activity.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">{activity.date} • {activity.user}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Oppgaver ({customerTasks.length})</h3>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Ny oppgave
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {customerTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    showCustomer={false}
                    showService={true}
                    showStatus={true}
                    teamMembers={teamMembers}
                    onReassign={(assignee) => {
                      console.log(`Reassigning task to ${assignee}`);
                    }}
                    onReschedule={(date) => {
                      console.log(`Rescheduling task to ${date}`);
                    }}
                    onEdit={(updatedTask) => handleEditTask(task.id, updatedTask)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Tickets ({customer.tickets.length})</h3>
              <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                <Plus className="w-4 h-4" />
                Ny ticket
              </button>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {customer.tickets.map((ticket, idx) => (
                <div key={idx} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-500 dark:text-slate-400">#{ticket.id}</p>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                          ticket.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}>
                          {ticket.priority === 'high' ? 'Høy' : ticket.priority === 'medium' ? 'Medium' : 'Lav'} prioritet
                        </span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">
                          {ticket.status}
                        </span>
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white mt-2">{ticket.subject}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Kategori: {ticket.category}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">Åpnet {ticket.opened} • Ansvarlig: {ticket.assignee}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="space-y-6">
            {/* Header with New Deal button */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">Avtaler & Tjenester</h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{customer.deals.length} aktive avtaler</p>
                </div>
                <button
                  onClick={() => setShowNewDealModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Ny avtale
                </button>
              </div>
            </div>

            {/* Deals List */}
            <div className="space-y-4">
              {customer.deals.map((deal, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  {/* Deal Header */}
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-slate-900 dark:text-white">{deal.name}</h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            {deal.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-6 mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            <span>{deal.value.toLocaleString('nb-NO')} kr totalt</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Signert: {deal.signedDate}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Start: {deal.startDate}</span>
                          </div>
                          {/* Show signed agreement link if available */}
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4" />
                            <a
                              href="#"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                              onClick={(e) => {
                                e.preventDefault();
                                console.log('Download signed agreement for deal:', deal.name);
                                // In a real app, this would download or open the PDF
                              }}
                            >
                              Signert avtale
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            console.log('Download signed agreement for deal:', deal.name);
                            // In a real app, this would download or open the PDF
                          }}
                          className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Last ned avtale
                        </a>
                        <button
                          onClick={() => {
                            setEditingDealIndex(idx);
                            setShowNewDealModal(true);
                            // TODO: Load existing deal data into form
                          }}
                          className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Rediger
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Services under this deal */}
                  <div className="p-6">
                    <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">Tjenester i avtalen</h4>
                    <div className="space-y-3">
                      {customer.services.map((service, serviceIdx) => (
                        <div key={serviceIdx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Briefcase className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-slate-900 dark:text-white">{service.name}</p>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  service.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                }`}>
                                  {service.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Ansvarlig: {service.owner}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-slate-900 dark:text-white">{service.monthlyValue.toLocaleString('nb-NO')} kr/mnd</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400">Start: {service.startDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* New Deal Modal */}
            {showNewDealModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {editingDealIndex !== null ? 'Rediger avtale' : 'Opprett ny avtale'}
                    </h3>
                    <button
                      onClick={() => {
                        setShowNewDealModal(false);
                        setEditingDealIndex(null);
                      }}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Deal Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Avtalenavn
                      </label>
                      <input
                        type="text"
                        value={newDeal.name}
                        onChange={(e) => setNewDeal({ ...newDeal, name: e.target.value })}
                        placeholder="f.eks. SEO-pakke Standard"
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Oppstartsdato
                      </label>
                      <input
                        type="date"
                        value={newDeal.startDate}
                        onChange={(e) => setNewDeal({ ...newDeal, startDate: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Billing Frequency */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Faktureringsfrekvens
                      </label>
                      <select
                        value={newDeal.billingFrequency}
                        onChange={(e) => setNewDeal({ ...newDeal, billingFrequency: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="monthly">Månedlig</option>
                        <option value="quarterly">Kvartalsvis</option>
                        <option value="semi-annually">Halvårlig</option>
                        <option value="annually">Årlig</option>
                      </select>
                    </div>

                    {/* Services */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                          Tjenester
                        </label>
                        <button
                          onClick={() => setNewDeal({
                            ...newDeal,
                            services: [...newDeal.services, { name: '', value: '', isRecurring: true }]
                          })}
                          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          Legg til tjeneste
                        </button>
                      </div>
                      <div className="space-y-4">
                        {newDeal.services.map((service, idx) => (
                          <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 space-y-3">
                            <div className="flex gap-3 items-start">
                              <div className="flex-1">
                                <input
                                  type="text"
                                  value={service.name}
                                  onChange={(e) => {
                                    const updatedServices = [...newDeal.services];
                                    updatedServices[idx].name = e.target.value;
                                    setNewDeal({ ...newDeal, services: updatedServices });
                                  }}
                                  placeholder="Tjenestenavn (f.eks. SEO)"
                                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                              {newDeal.services.length > 1 && (
                                <button
                                  onClick={() => {
                                    const updatedServices = newDeal.services.filter((_, i) => i !== idx);
                                    setNewDeal({ ...newDeal, services: updatedServices });
                                  }}
                                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <div className="flex gap-3 items-center">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={service.isRecurring}
                                  onChange={(e) => {
                                    const updatedServices = [...newDeal.services];
                                    updatedServices[idx].isRecurring = e.target.checked;
                                    setNewDeal({ ...newDeal, services: updatedServices });
                                  }}
                                  className="w-4 h-4"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Gjentakende</span>
                              </label>
                              <div className="flex-1">
                                <input
                                  type="number"
                                  value={service.value}
                                  onChange={(e) => {
                                    const updatedServices = [...newDeal.services];
                                    updatedServices[idx].value = e.target.value;
                                    setNewDeal({ ...newDeal, services: updatedServices });
                                  }}
                                  placeholder={service.isRecurring ? "Månedlig pris" : "Engangspris"}
                                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PDF Upload */}
                    <div>
                      <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                        Signert avtale (PDF)
                      </label>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setNewDeal({ ...newDeal, signedAgreementPdf: file });
                          }}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Eller hent automatisk fra Dealbuilder ved å koble til API
                        </p>
                      </div>
                    </div>

                    {/* VAT Toggle */}
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newDeal.priceIncludesVat}
                          onChange={(e) => setNewDeal({ ...newDeal, priceIncludesVat: e.target.checked })}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                          Prisene inkluderer MVA
                        </span>
                      </label>
                    </div>

                    {/* Total Value (calculated) */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 space-y-2">
                      {(() => {
                        const recurringTotal = newDeal.services
                          .filter(s => s.isRecurring)
                          .reduce((sum, s) => sum + (Number(s.value) || 0), 0);

                        const oneTimeTotal = newDeal.services
                          .filter(s => !s.isRecurring)
                          .reduce((sum, s) => sum + (Number(s.value) || 0), 0);

                        const recurringExVat = newDeal.priceIncludesVat ? recurringTotal / 1.25 : recurringTotal;
                        const recurringIncVat = newDeal.priceIncludesVat ? recurringTotal : recurringTotal * 1.25;
                        const recurringVat = recurringIncVat - recurringExVat;

                        const oneTimeExVat = newDeal.priceIncludesVat ? oneTimeTotal / 1.25 : oneTimeTotal;
                        const oneTimeIncVat = newDeal.priceIncludesVat ? oneTimeTotal : oneTimeTotal * 1.25;
                        const oneTimeVat = oneTimeIncVat - oneTimeExVat;

                        return (
                          <>
                            {recurringTotal > 0 && (
                              <>
                                <div className="pb-2">
                                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Gjentakende (månedlig)</p>
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-slate-600 dark:text-slate-400">Eks. MVA:</span>
                                      <span className="font-semibold text-slate-900 dark:text-white">
                                        {Math.round(recurringExVat).toLocaleString('nb-NO')} kr/mnd
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-slate-600 dark:text-slate-400">MVA (25%):</span>
                                      <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {Math.round(recurringVat).toLocaleString('nb-NO')} kr/mnd
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-600">
                                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Ink. MVA:</span>
                                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                                        {Math.round(recurringIncVat).toLocaleString('nb-NO')} kr/mnd
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                            {oneTimeTotal > 0 && (
                              <>
                                <div className={recurringTotal > 0 ? "pt-2 border-t border-slate-200 dark:border-slate-600" : ""}>
                                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Engangskostnad</p>
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-slate-600 dark:text-slate-400">Eks. MVA:</span>
                                      <span className="font-semibold text-slate-900 dark:text-white">
                                        {Math.round(oneTimeExVat).toLocaleString('nb-NO')} kr
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-slate-600 dark:text-slate-400">MVA (25%):</span>
                                      <span className="text-sm text-slate-600 dark:text-slate-400">
                                        {Math.round(oneTimeVat).toLocaleString('nb-NO')} kr
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 dark:border-slate-600">
                                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Ink. MVA:</span>
                                      <span className="text-lg font-bold text-slate-900 dark:text-white">
                                        {Math.round(oneTimeIncVat).toLocaleString('nb-NO')} kr
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex gap-3 justify-end">
                    <button
                      onClick={() => {
                        setShowNewDealModal(false);
                        setEditingDealIndex(null);
                        setNewDeal({
                          name: '',
                          totalValue: '',
                          startDate: '',
                          billingFrequency: 'monthly',
                          priceIncludesVat: false,
                          signedAgreementPdf: null,
                          services: [{ name: '', value: '', isRecurring: true }]
                        });
                      }}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      Avbryt
                    </button>
                    <button
                      onClick={() => {
                        if (editingDealIndex !== null) {
                          console.log('Updating deal:', newDeal);
                        } else {
                          console.log('Creating new deal:', newDeal);
                        }
                        setShowNewDealModal(false);
                        setEditingDealIndex(null);
                        setNewDeal({
                          name: '',
                          totalValue: '',
                          startDate: '',
                          billingFrequency: 'monthly',
                          priceIncludesVat: false,
                          signedAgreementPdf: null,
                          services: [{ name: '', value: '', isRecurring: true }]
                        });
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingDealIndex !== null ? 'Oppdater avtale' : 'Opprett avtale'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'kpis' && (
          <div className="space-y-6">
            {/* Header med rapport-knapp */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-900 dark:text-white">KPI-er og resultater</h3>
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Generer rapport
                </button>
              </div>

              {/* Hovedmetrikker */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {customer.kpis.map((kpi, idx) => (
                  <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{kpi.metric}</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{kpi.current}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className={`w-4 h-4 ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                      <span className={`text-sm font-medium ${kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                        {kpi.change} vs forrige periode
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trendgrafer */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4" key="organic-traffic-container">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-4">Organisk trafikk - siste 6 måneder</h4>
                  <ResponsiveContainer width="100%" height={200} key="organic-traffic-responsive">
                    <LineChart data={customer.kpiTrends.organicTraffic}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" key="organic-grid" />
                      <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} key="organic-xaxis" />
                      <YAxis stroke="#64748b" style={{ fontSize: '12px' }} key="organic-yaxis" />
                      <Tooltip
                        key="organic-tooltip"
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} name="Organisk trafikk" key="organic-line" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4" key="keywords-container">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-4">Søkeord i topp 10 - siste 6 måneder</h4>
                  <ResponsiveContainer width="100%" height={200} key="keywords-responsive">
                    <LineChart data={customer.kpiTrends.topKeywords}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" key="keywords-grid" />
                      <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} key="keywords-xaxis" />
                      <YAxis stroke="#64748b" style={{ fontSize: '12px' }} key="keywords-yaxis" />
                      <Tooltip
                        key="keywords-tooltip"
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981', r: 4 }} name="Søkeord i topp 10" key="keywords-line" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Kundespesifikke KPI-er */}
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white mb-4">Kundespesifikke KPI-er</h4>
                <div className="grid grid-cols-2 gap-4">
                  {customer.customKpis.map((kpi, idx) => (
                    <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{kpi.name}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Mål</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white">{kpi.target}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Faktisk</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white">{kpi.actual}</p>
                            </div>
                          </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          kpi.status === 'good' ? 'bg-green-100' :
                          kpi.status === 'warning' ? 'bg-yellow-100' : 'bg-red-100'
                        }`}>
                          {kpi.status === 'good' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : kpi.status === 'warning' ? (
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            kpi.status === 'good' ? 'bg-green-600' :
                            kpi.status === 'warning' ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${Math.min((kpi.actual / kpi.target) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            {/* TODO: Backend - Implement Google Drive OAuth Flow
                 - Add OAuth endpoint in Supabase Edge Function
                 - Store refresh_token securely in Supabase
                 - Handle token refresh automatically
                 - API Reference: https://developers.google.com/drive/api/guides/about-auth
            */}

            {!driveConnected ? (
              // Google Drive Connection Setup
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-8">
                <div className="max-w-md mx-auto text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Koble til Google Drive</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                    Få tilgang til alle kundens dokumenter direkte fra deres Google Drive-mappe.
                    Du kan bla gjennom filer, laste ned og dele dokumenter uten å forlate systemet.
                  </p>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-left">
                    <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium mb-2">For utviklere:</p>
                    <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                      <li>• Implementer OAuth 2.0 flow i Supabase Edge Function</li>
                      <li>• Lagre tokens i Supabase med kryptering</li>
                      <li>• Bruk Google Drive API v3 for filhenting</li>
                      <li>• Scope: drive.readonly eller drive.file</li>
                    </ul>
                  </div>
                  <button
                    onClick={() => {
                      // TODO: Backend - Replace with actual OAuth redirect
                      // window.location.href = '/api/auth/google-drive'
                      setDriveLoading(true);
                      setTimeout(() => {
                        setDriveConnected(true);
                        setDriveLoading(false);
                      }, 1500);
                    }}
                    disabled={driveLoading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {driveLoading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Kobler til...
                      </>
                    ) : (
                      <>
                        <Plug className="w-5 h-5" />
                        Koble til Google Drive
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              // Google Drive File Browser
              <>
                {/* Toolbar */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 flex items-center gap-3">
                      {/* Search */}
                      <div className="flex-1 max-w-md relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Søk i Drive..."
                          value={driveSearchQuery}
                          onChange={(e) => setDriveSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                        />
                      </div>

                      {/* Sort */}
                      <select
                        value={driveSortBy}
                        onChange={(e) => setDriveSortBy(e.target.value as any)}
                        className="px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                      >
                        <option value="modified">Sist endret</option>
                        <option value="name">Navn</option>
                        <option value="size">Størrelse</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Upload Button */}
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Upload className="w-4 h-4" />
                        Last opp
                      </button>

                      {/* Sync Status */}
                      <button className="px-3 py-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Synkronisert
                      </button>

                      {/* Disconnect */}
                      <button
                        onClick={() => setDriveConnected(false)}
                        className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        Koble fra
                      </button>
                    </div>
                  </div>
                </div>

                {/* Breadcrumb Navigation */}
                {driveFolderPath.length > 0 && (
                  <div className="flex items-center gap-2 text-sm">
                    <button
                      onClick={() => {
                        setDriveCurrentFolder(null);
                        setDriveFolderPath([]);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Min Drive
                    </button>
                    {driveFolderPath.map((folder, index) => (
                      <div key={folder.id} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                        {index === driveFolderPath.length - 1 ? (
                          <span className="text-slate-900 dark:text-white">{folder.name}</span>
                        ) : (
                          <button
                            onClick={() => {
                              const newPath = driveFolderPath.slice(0, index + 1);
                              setDriveFolderPath(newPath);
                              setDriveCurrentFolder(folder.id);
                            }}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {folder.name}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Files and Folders List */}
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-12 gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <div className="col-span-5">Navn</div>
                      <div className="col-span-2">Eier</div>
                      <div className="col-span-2">Sist endret</div>
                      <div className="col-span-2">Størrelse</div>
                      <div className="col-span-1 text-right">Deling</div>
                    </div>
                  </div>

                  {/* TODO: Backend - Fetch from Google Drive API
                       - Endpoint: GET https://www.googleapis.com/drive/v3/files
                       - Include: name, mimeType, modifiedTime, size, owners, shared, webViewLink
                       - Handle pagination with pageToken
                       - Filter by folder if driveCurrentFolder is set
                  */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-700">
                    {/* Mock Data - Replace with API response */}
                    {mockDriveFiles
                      // Filter by current folder
                      .filter(file => file.parentId === driveCurrentFolder)
                      // Filter by search query
                      .filter(file =>
                        driveSearchQuery === '' ||
                        file.name.toLowerCase().includes(driveSearchQuery.toLowerCase())
                      )
                      // Sort: folders first, then by selected sort option
                      .sort((a, b) => {
                        // Folders always come first
                        if (a.mimeType === 'folder' && b.mimeType !== 'folder') return -1;
                        if (a.mimeType !== 'folder' && b.mimeType === 'folder') return 1;

                        // Then sort by selected option
                        if (driveSortBy === 'name') {
                          return a.name.localeCompare(b.name);
                        } else if (driveSortBy === 'size') {
                          return (b.size || '0').localeCompare(a.size || '0');
                        }
                        // Default: modified time (newest first)
                        return 0;
                      })
                      .map((file) => (
                        <div
                          key={file.id}
                          onClick={() => {
                            if (file.mimeType === 'folder') {
                              // Navigate into folder
                              setDriveCurrentFolder(file.id);
                              setDriveFolderPath([...driveFolderPath, { id: file.id, name: file.name }]);
                            }
                          }}
                          className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer group"
                        >
                          <div className="grid grid-cols-12 gap-4 items-center">
                            {/* Name & Icon */}
                            <div className="col-span-5 flex items-center gap-3">
                              <div className={`w-8 h-8 rounded flex items-center justify-center ${
                                file.mimeType === 'folder' ? 'bg-blue-100 dark:bg-blue-900/30' :
                                file.mimeType === 'document' ? 'bg-blue-50 dark:bg-blue-900/20' :
                                file.mimeType === 'spreadsheet' ? 'bg-green-50 dark:bg-green-900/20' :
                                file.mimeType === 'image' ? 'bg-purple-50 dark:bg-purple-900/20' :
                                'bg-slate-100 dark:bg-slate-700'
                              }`}>
                                {file.mimeType === 'folder' ? (
                                  <Folder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                ) : file.mimeType === 'document' ? (
                                  <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                ) : file.mimeType === 'spreadsheet' ? (
                                  <FileSpreadsheet className="w-4 h-4 text-green-600 dark:text-green-400" />
                                ) : file.mimeType === 'image' ? (
                                  <FileImage className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                ) : (
                                  <File className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-slate-900 dark:text-white truncate">
                                  {file.name}
                                </p>
                              </div>
                            </div>

                            {/* Owner */}
                            <div className="col-span-2">
                              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                                {file.owner}
                              </p>
                            </div>

                            {/* Modified */}
                            <div className="col-span-2">
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {file.modifiedTime}
                              </p>
                            </div>

                            {/* Size */}
                            <div className="col-span-2">
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {file.size}
                              </p>
                            </div>

                            {/* Sharing */}
                            <div className="col-span-1 flex items-center justify-end gap-2">
                              {file.shared && (
                                <Share2 className="w-4 h-4 text-slate-400" />
                              )}
                              {file.mimeType !== 'folder' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // TODO: Backend - Open file in new tab
                                    // window.open(file.webViewLink, '_blank')
                                  }}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <ExternalLink className="w-4 h-4 text-slate-400 hover:text-blue-600" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Integration Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                        Google Drive-integrasjon aktiv
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-400">
                        Filer synkroniseres automatisk fra kundens delte mappe.
                        Endringer gjort i Google Drive vil reflekteres her innen 15 minutter.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="space-y-6">
            {/* Økonomiske nøkkeltall */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Økonomioversikt</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Totalt fakturert</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{customer.financials.totalInvoiced.toLocaleString('nb-NO')} kr</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Betalt</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">{customer.financials.totalPaid.toLocaleString('nb-NO')} kr</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Utestående</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{customer.financials.outstanding.toLocaleString('nb-NO')} kr</p>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">Neste faktura</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white mt-2">{customer.financials.nextInvoice}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MRR-graf */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Månedlig inntekt (MRR) - siste 6 måneder</h3>
              </div>
              <div className="p-6" key="mrr-chart-container">
                <ResponsiveContainer width="100%" height={250} key="mrr-responsive">
                  <BarChart data={customer.financials.mrrHistory} key="mrr-bar-chart">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" key="mrr-grid" />
                    <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} key="mrr-xaxis" />
                    <YAxis stroke="#64748b" style={{ fontSize: '12px' }} key="mrr-yaxis" />
                    <Tooltip
                      key="mrr-tooltip"
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value) => [`${Number(value).toLocaleString('nb-NO')} kr`, 'Inntekt']}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} name="MRR Inntekt" key="mrr-bar" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Fakturahistorikk */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Fakturahistorikk</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Fakturanr.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Dato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Beløp</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Forfallsdato</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Betalt dato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {customer.financials.invoices.map((invoice, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{invoice.number}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900 dark:text-white">{invoice.date}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{invoice.amount.toLocaleString('nb-NO')} kr</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900 dark:text-white">{invoice.dueDate}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'Betalt' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {invoice.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm text-slate-900 dark:text-white">{invoice.paidDate || '-'}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'time' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Timeregistrering</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Denne måneden</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{customer.timeEntries.thisMonth} t</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Forrige måned</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{customer.timeEntries.lastMonth} t</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Totalt</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{customer.timeEntries.total} t</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'integrations' && (
          <div className="space-y-6">
            {/* Active Integrations */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 dark:text-white">Aktive integrasjoner ({customer.integrations.length})</h3>
                <button
                  onClick={() => setShowAddIntegrationModal(true)}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Legg til integrasjon
                </button>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {customer.integrations.map((integration, idx) => (
                  <div key={idx} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                          <Plug className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{integration.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Sist synkronisert: {integration.lastSync}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          integration.status === 'Connected' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {integration.status}
                        </span>
                        <div className="flex items-center gap-2">
                          {integration.status === 'Connected' && (
                            <button
                              onClick={() => {
                                // TODO: Backend - Trigger manual sync
                                alert(`Synkroniserer ${integration.name}...`);
                              }}
                              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              title="Synkroniser nå"
                            >
                              <RefreshCw className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            </button>
                          )}
                          <button
                            onClick={() => setShowConfigureIntegration(integration.name)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Konfigurer"
                          >
                            <Settings className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Er du sikker på at du vil fjerne ${integration.name}?`)) {
                                // TODO: Backend - Disconnect integration
                                alert(`${integration.name} ville blitt frakoblet`);
                              }
                            }}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            title="Fjern integrasjon"
                          >
                            <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Info */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                    Automatisk datasynkronisering
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Data fra tilkoblede integrasjoner synkroniseres automatisk hver time.
                    Du kan også synkronisere manuelt når som helst.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Interne noter ({notes.length})</h3>
              <button
                onClick={() => setShowAddNoteModal(true)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                Ny note
              </button>
            </div>
            <div className="p-6 space-y-4">
              {notes.length === 0 ? (
                <div className="text-center py-8">
                  <StickyNote className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">Ingen notater ennå</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Klikk "Ny note" for å legge til et notat</p>
                </div>
              ) : (
                notes
                  .sort((a, b) => b.date.getTime() - a.date.getTime())
                  .map((note) => {
                    const timeAgo = (() => {
                      const now = new Date();
                      const diffMs = now.getTime() - note.date.getTime();
                      const diffMins = Math.floor(diffMs / 60000);
                      const diffHours = Math.floor(diffMins / 60);
                      const diffDays = Math.floor(diffHours / 24);
                      const diffWeeks = Math.floor(diffDays / 7);
                      const diffMonths = Math.floor(diffDays / 30);

                      if (diffMins < 60) return `${diffMins} minutter siden`;
                      if (diffHours < 24) return `${diffHours} timer siden`;
                      if (diffDays < 7) return `${diffDays} dager siden`;
                      if (diffWeeks < 4) return `${diffWeeks} uker siden`;
                      return `${diffMonths} måneder siden`;
                    })();

                    return (
                      <div
                        key={note.id}
                        className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 bg-yellow-50 dark:bg-yellow-900/20"
                      >
                        <div className="flex items-start gap-3">
                          <StickyNote className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-slate-900 dark:text-slate-300 whitespace-pre-wrap">
                              {note.content}
                            </p>

                            {note.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {note.attachments.map((attachment, idx) => (
                                  <a
                                    key={idx}
                                    href={attachment.url}
                                    className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Paperclip className="w-3 h-3" />
                                    {attachment.name}
                                  </a>
                                ))}
                              </div>
                            )}

                            <div className="flex items-center justify-between mt-3">
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {note.author} • {timeAgo}
                              </p>
                              <button
                                onClick={() => {
                                  if (confirm('Er du sikker på at du vil slette dette notatet?')) {
                                    setNotes(notes.filter(n => n.id !== note.id));
                                  }
                                }}
                                className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Slett notat"
                              >
                                <Trash2 className="w-3 h-3 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}
      </div>

      {/* E-post Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Send e-post</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Til</label>
                <input
                  type="email"
                  value={emailData.to}
                  onChange={(e) => setEmailData({ ...emailData, to: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e-post@eksempel.no"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Emne</label>
                <input
                  type="text"
                  value={emailData.subject}
                  onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Skriv inn emne"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Melding</label>
                <textarea
                  value={emailData.message}
                  onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                  rows={8}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Skriv din melding her..."
                />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  // Her ville vi sendt e-posten
                  setShowEmailModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rapport Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Generer kunde-rapport</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Tidsperiode</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="period"
                      value="last_month"
                      checked={reportSettings.period === 'last_month'}
                      onChange={(e) => setReportSettings({ ...reportSettings, period: e.target.value })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Siste måned</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="period"
                      value="last_quarter"
                      checked={reportSettings.period === 'last_quarter'}
                      onChange={(e) => setReportSettings({ ...reportSettings, period: e.target.value })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Siste kvartal</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="period"
                      value="custom"
                      checked={reportSettings.period === 'custom'}
                      onChange={(e) => setReportSettings({ ...reportSettings, period: e.target.value })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Egendefinert</span>
                  </label>
                  {reportSettings.period === 'custom' && (
                    <div className="ml-6 grid grid-cols-2 gap-3 mt-2">
                      <div>
                        <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Fra dato</label>
                        <input
                          type="date"
                          value={reportSettings.customStart}
                          onChange={(e) => setReportSettings({ ...reportSettings, customStart: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">Til dato</label>
                        <input
                          type="date"
                          value={reportSettings.customEnd}
                          onChange={(e) => setReportSettings({ ...reportSettings, customEnd: e.target.value })}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Inkluderte seksjoner</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={reportSettings.includeSections.kpis}
                      onChange={(e) => setReportSettings({
                        ...reportSettings,
                        includeSections: { ...reportSettings.includeSections, kpis: e.target.checked }
                      })}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">KPI-er og resultater</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={reportSettings.includeSections.financials}
                      onChange={(e) => setReportSettings({
                        ...reportSettings,
                        includeSections: { ...reportSettings.includeSections, financials: e.target.checked }
                      })}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Økonomi</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={reportSettings.includeSections.activity}
                      onChange={(e) => setReportSettings({
                        ...reportSettings,
                        includeSections: { ...reportSettings.includeSections, activity: e.target.checked }
                      })}
                      className="text-blue-600 focus:ring-blue-500 rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Aktivitet</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  // Her ville vi generert og eksportert PDF-rapporten
                  setShowReportModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Eksporter PDF
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Last opp fil til Google Drive</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6">
              {/* TODO: Backend - Implement file upload to Google Drive
                   - Endpoint: POST https://www.googleapis.com/upload/drive/v3/files
                   - Use multipart upload for files
                   - Set parent folder ID if driveCurrentFolder is set
                   - Handle progress updates
                   - Return file metadata on success
              */}
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // TODO: Backend - Upload file to Google Drive
                      setUploadingFile(true);
                      setTimeout(() => {
                        setUploadingFile(false);
                        setShowUploadModal(false);
                        alert(`Fil "${file.name}" ville blitt lastet opp til Google Drive`);
                      }, 2000);
                    }
                  }}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-sm font-medium text-slate-900 dark:text-white mb-1">
                    Klikk for å velge fil
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    eller dra og slipp fil her
                  </p>
                </label>
              </div>

              {uploadingFile && (
                <div className="mt-4">
                  <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        Laster opp...
                      </p>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {driveCurrentFolder && (
                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    Filen vil bli lastet opp til:{' '}
                    <span className="font-medium">
                      {driveFolderPath[driveFolderPath.length - 1]?.name || 'Min Drive'}
                    </span>
                  </p>
                </div>
              )}

              <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  <strong>For utviklere:</strong> Implementer Google Drive Upload API med multipart request.
                  Bruk access token fra OAuth flow og send filen sammen med metadata (name, mimeType, parents).
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Integration Modal */}
      {showAddIntegrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Legg til integrasjon</h3>
              <button
                onClick={() => setShowAddIntegrationModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                {availableIntegrations.map((integration) => {
                  const isConnected = customer.integrations.some(i => i.name === integration.name);
                  return (
                    <div
                      key={integration.id}
                      className={`border rounded-lg p-4 transition-all ${
                        isConnected
                          ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10'
                          : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{integration.icon}</div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{integration.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{integration.category}</p>
                          </div>
                        </div>
                        {isConnected && (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{integration.description}</p>
                      {isConnected ? (
                        <button
                          disabled
                          className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 rounded-lg text-sm cursor-not-allowed"
                        >
                          Allerede tilkoblet
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            // TODO: Backend - Initiate OAuth flow or API key setup
                            setIntegrationConnecting(integration.id);
                            setTimeout(() => {
                              setIntegrationConnecting(null);
                              setShowAddIntegrationModal(false);
                              alert(`${integration.name} ville blitt koblet til. OAuth-flow eller API-nøkkel oppsett ville startet.`);
                            }, 2000);
                          }}
                          disabled={integrationConnecting === integration.id}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {integrationConnecting === integration.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              Kobler til...
                            </>
                          ) : (
                            <>
                              <Plug className="w-4 h-4" />
                              Koble til
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-300 font-medium mb-2">For utviklere:</p>
                <ul className="text-xs text-yellow-700 dark:text-yellow-400 space-y-1">
                  <li>• Hver integrasjon krever sin egen OAuth 2.0 flow eller API-nøkkel</li>
                  <li>• Lagre tokens sikkert i Supabase med kryptering</li>
                  <li>• Implementer token refresh-logikk for hver provider</li>
                  <li>• Håndter feilede autentiseringer og synkroniseringer</li>
                  <li>• Legg til webhook endpoints for real-time data oppdateringer</li>
                </ul>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddIntegrationModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Integration Modal */}
      {showConfigureIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Konfigurer {showConfigureIntegration}</h3>
              <button
                onClick={() => setShowConfigureIntegration(null)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Sync Settings */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Synkroniseringsfrekvens
                </label>
                <select className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                  <option value="15min">Hver 15. minutt</option>
                  <option value="30min">Hver 30. minutt</option>
                  <option value="1hour" selected>Hver time</option>
                  <option value="6hour">Hver 6. time</option>
                  <option value="daily">Daglig</option>
                  <option value="manual">Kun manuelt</option>
                </select>
              </div>

              {/* Data Scope */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Data som skal synkroniseres
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Trafikk og brukerdata</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Konverteringer</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Kampanjedata</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Demografisk data</span>
                  </label>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Historisk data
                </label>
                <select className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white">
                  <option value="30days" selected>Siste 30 dager</option>
                  <option value="90days">Siste 90 dager</option>
                  <option value="1year">Siste år</option>
                  <option value="all">All tilgjengelig data</option>
                </select>
              </div>

              {/* Notifications */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Varsler
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Send varsel ved synkroniseringsfeil</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Send varsel ved betydelige endringer</span>
                  </label>
                </div>
              </div>

              {/* API Credentials */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 mt-4">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">API-tilkobling</p>
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Status:</span>
                    <span className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Tilkoblet
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Siste autentisering:</span>
                    <span className="text-sm text-slate-700 dark:text-slate-300">2 dager siden</span>
                  </div>
                  <button className="w-full mt-2 px-3 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-sm">
                    Forny tilkobling
                  </button>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  <strong>For utviklere:</strong> Konfigurasjonsinnstillinger må lagres i database
                  og brukes av synkroniserings-jobber. Implementer validering av API-tilkoblinger.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowConfigureIntegration(null)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  // TODO: Backend - Save configuration
                  setShowConfigureIntegration(null);
                  alert('Konfigurasjonen ville blitt lagret');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lagre innstillinger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Nytt internt notat</h3>
              <button
                onClick={() => {
                  setShowAddNoteModal(false);
                  setNewNote({ content: '', attachments: [] });
                }}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notat
                </label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={6}
                  placeholder="Skriv ditt notat her..."
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Vedlegg (valgfritt)
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-4">
                  <input
                    type="file"
                    id="note-file-upload"
                    multiple
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewNote({ ...newNote, attachments: [...newNote.attachments, ...files] });
                    }}
                  />
                  <label htmlFor="note-file-upload" className="cursor-pointer block text-center">
                    <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Klikk for å laste opp filer
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      Bilder, PDF, Word eller Excel
                    </p>
                  </label>
                </div>

                {/* Attachment List */}
                {newNote.attachments.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {newNote.attachments.map((file, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-2">
                          {file.type.startsWith('image/') ? (
                            <ImageIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <Paperclip className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                          )}
                          <span className="text-sm text-slate-900 dark:text-white">
                            {file.name}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setNewNote({
                              ...newNote,
                              attachments: newNote.attachments.filter((_, i) => i !== idx)
                            });
                          }}
                          className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Notatet vil bli lagret med ditt navn og nåværende tidspunkt.
                  Kun teammedlemmer har tilgang til interne notater.
                </p>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                  <strong>For utviklere:</strong> Implementer filopplasting til server/cloud storage.
                  Lagre vedlegg med sikre URL-er og knytt til notat-ID i database.
                </p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddNoteModal(false);
                  setNewNote({ content: '', attachments: [] });
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={() => {
                  if (!newNote.content.trim()) {
                    alert('Vennligst skriv et notat');
                    return;
                  }

                  // TODO: Backend - Upload attachments and save note to database
                  const note = {
                    id: String(Date.now()),
                    content: newNote.content,
                    author: 'Ola Nordmann', // TODO: Get from current user session
                    date: new Date(),
                    attachments: newNote.attachments.map(file => ({
                      name: file.name,
                      url: URL.createObjectURL(file), // TODO: Replace with actual server URL after upload
                      type: file.type.startsWith('image/') ? 'image' :
                            file.type.includes('pdf') ? 'pdf' :
                            file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? 'spreadsheet' :
                            'document'
                    }))
                  };

                  setNotes([note, ...notes]);
                  setShowAddNoteModal(false);
                  setNewNote({ content: '', attachments: [] });
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lagre notat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
