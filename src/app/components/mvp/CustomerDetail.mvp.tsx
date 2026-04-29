import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Plus,
  Send,
  X,
  PhoneIncoming,
  MessageSquare,
  Video,
  AlertCircle,
  Edit,
  CheckCircle,
  Clock,
  AlertTriangle,
  Activity,
  Ticket,
  FileText,
  StickyNote,
  PhoneOff,
  Folder,
  Upload,
  Search,
  Download,
  Trash2,
  FolderOpen,
  File,
  FileSpreadsheet,
  FileImage,
  RefreshCw,
  Plug,
  Share2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { TaskItem } from '../TaskItem';
import { DateTimePicker } from '../DateTimePicker';

export function CustomerDetailMVP() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Check if we should open a specific tab based on navigation state
  useEffect(() => {
    const state = location.state as { activeTab?: string } | null;
    if (state?.activeTab) {
      setActiveTab(state.activeTab);
      // Clear the state after using it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);
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

  // Mock Google Drive files data
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

  // Customer data
  const customer = {
    id,
    name: 'Nordic Tech AS',
    legalName: 'Nordic Tech Solutions AS',
    orgNumber: '123456789',
    website: 'www.nordictech.no',
    status: 'Active',
    healthScore: 85,
    healthStatus: 'good',
    owner: 'Ola Nordmann',
    team: 'Team Oslo',
    country: 'Norge',
    city: 'Oslo',
    monthlyValue: 45000,
    startDate: '15. mars 2024',
    lastContact: '2 dager siden',
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
        isPrimary: true
      },
      {
        name: 'Erik Larsen',
        title: 'CEO',
        email: 'erik@nordictech.no',
        phone: '+47 987 65 432',
        isPrimary: false
      }
    ],
    activities: [
      { type: 'meeting', title: 'Oppstartsmøte planlagt', description: 'SEO oppstartsmøte med Maria', date: 'I morgen 10:00', user: 'Ola Nordmann' },
      { type: 'note', title: 'Intern note', description: 'Kunden er svært interessert i å se resultater raskt', date: '3 dager siden', user: 'Ola Nordmann' },
      { type: 'email', title: 'E-post sendt', description: 'Velkomst-e-post med onboarding-info', date: '5 dager siden', user: 'Ola Nordmann' }
    ],
    tickets: [
      {
        id: '1234',
        subject: 'Spørsmål om rapportdata',
        description: 'Kunde lurer på hvorfor trafikktallene er annerledes enn i Google Analytics',
        category: 'Rapport og tall',
        priority: 'medium',
        status: 'Open',
        opened: '1 dag siden',
        assignee: 'Ola Nordmann',
        contact: 'Maria Hansen',
        customer: 'Nordic Tech AS',
        lastResponse: '3 timer siden'
      }
    ]
  };

  // Deliveries data
  const deliveries = [
    {
      id: '1',
      customer: customer.name,
      service: 'Hjemmeside',
      assignee: 'Ola Nordmann',
      deadline: '30. mai 2026',
      progress: { completed: 4, total: 11 },
      status: 'Pågår',
      hasNewTickets: true
    }
  ];

  // Tasks - these match the tasks in TaskList and LeveranseDetail
  const [customerTasks, setCustomerTasks] = useState([
    // Fase 1 - Oppstart
    {
      id: 'task_1_1',
      title: 'Motta info fra kunde',
      description: 'Samle inn all nødvendig informasjon om prosjektet',
      dueDate: 'Fullført',
      priority: 'high' as const,
      status: 'Done',
      assignee: 'Ola Nordmann',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'delivery' as const
    },
    {
      id: 'task_1_2',
      title: 'Motta logoer og bilder',
      description: 'Få tilsendt alle visuelle ressurser',
      dueDate: 'Fullført',
      priority: 'high' as const,
      status: 'Done',
      assignee: 'Ola Nordmann',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'delivery' as const
    },
    {
      id: '3',
      title: 'Onboarding oppfølging',
      description: 'Sjekk at alle tilganger er på plass',
      dueDate: 'Om 3 dager',
      priority: 'medium' as const,
      status: 'Not started',
      assignee: 'Ola Nordmann',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'regular' as const
    },
    // Fase 2 - Teknisk oppsett
    {
      id: 'task_2_1',
      title: 'Registrer domene',
      description: 'Registrere eller overføre domene',
      dueDate: 'Fullført',
      priority: 'high' as const,
      status: 'Done',
      assignee: 'Ola Nordmann',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'delivery' as const
    },
    {
      id: 'task_2_2',
      title: 'Sett opp hosting',
      description: 'Konfigurere server og hosting-miljø',
      dueDate: 'Fullført',
      priority: 'high' as const,
      status: 'Done',
      assignee: 'Ola Nordmann',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'delivery' as const
    },
    {
      id: '2',
      title: 'Sett opp Google Analytics tracking',
      description: 'Verifiser at tracking er korrekt',
      dueDate: 'I morgen',
      priority: 'high' as const,
      status: 'Not started',
      assignee: 'Kari Jensen',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'regular' as const
    },
    // Fase 3 - Design og innhold
    {
      id: 'task_3_1',
      title: 'Lag design',
      description: 'Designe sidene i Figma basert på kundens ønsker',
      dueDate: 'I dag',
      priority: 'high' as const,
      status: 'In progress',
      assignee: 'Kari Jensen',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'delivery' as const
    },
    {
      id: 'task_3_2',
      title: 'Få godkjenning på design',
      description: 'Presentere og få godkjenning fra kunde',
      dueDate: 'Om 2 dager',
      priority: 'high' as const,
      status: 'Not started',
      assignee: 'Kari Jensen',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'delivery' as const
    },
    {
      id: '1',
      title: 'Send månedsrapport',
      description: 'Første månedsrapport SEO',
      dueDate: 'I dag 15:00',
      priority: 'high' as const,
      status: 'In progress',
      assignee: 'Ola Nordmann',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'regular' as const
    },
    // Fase 4 - Utvikling
    {
      id: 'task_4_1',
      title: 'Utvikle frontend',
      description: 'Kode HTML/CSS/JS basert på godkjent design',
      dueDate: 'Om 9 dager',
      priority: 'high' as const,
      status: 'Not started',
      assignee: 'Ola Nordmann',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'delivery' as const
    },
    {
      id: 'task_4_2',
      title: 'Sett opp CMS',
      description: 'Installere og konfigurere WordPress',
      dueDate: 'Om 11 dager',
      priority: 'medium' as const,
      status: 'Not started',
      assignee: 'Ola Nordmann',
      customer: customer.name,
      customerId: id,
      service: 'Hjemmeside',
      taskType: 'delivery' as const
    }
  ]);

  // Filter for regular tasks only (non-delivery tasks)
  const regularTasks = customerTasks.filter(t => t.taskType === 'regular');

  const [notes, setNotes] = useState([
    {
      id: '1',
      content: 'Kunden er svært interessert i å se resultater raskt. Har nevnt at de har hatt dårlig erfaring med tidligere byrå. Viktig å følge opp tett og vise resultater kontinuerlig.',
      author: 'Ola Nordmann',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      attachments: []
    },
    {
      id: '2',
      content: 'Oppdatering fra oppstartsmøte: Kunden ønsker å fokusere på lokal SEO først. De har en fysisk butikk i Oslo sentrum som ikke får nok trafikk.',
      author: 'Kari Jensen',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      attachments: []
    }
  ]);

  const [newNote, setNewNote] = useState({ content: '', attachments: [] as File[] });
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddService, setShowAddService] = useState(false);

  // Google Drive integration state
  const [driveConnected, setDriveConnected] = useState(false);
  const [driveLoading, setDriveLoading] = useState(false);
  const [driveSearchQuery, setDriveSearchQuery] = useState('');
  const [driveViewMode, setDriveViewMode] = useState<'list' | 'grid'>('list');
  const [driveSortBy, setDriveSortBy] = useState<'name' | 'modified' | 'size'>('modified');
  const [driveCurrentFolder, setDriveCurrentFolder] = useState<string | null>(null);
  const [driveFolderPath, setDriveFolderPath] = useState<Array<{ id: string; name: string }>>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  const teamMembers = ['Ola Nordmann', 'Kari Jensen', 'Per Hansen', 'Nina Olsen'];

  const tabs = [
    { id: 'overview', label: 'Oversikt', icon: Building2 },
    { id: 'tickets', label: 'Tickets', icon: Ticket },
    { id: 'deals', label: 'Avtaler & Tjenester', icon: FileText },
    { id: 'documents', label: 'Dokumenter', icon: Folder },
    { id: 'notes', label: 'Interne noter', icon: StickyNote }
  ];

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Er du sikker på at du vil slette denne oppgaven?')) {
      setCustomerTasks(customerTasks.filter(t => t.id !== taskId));
    }
  };

  const handleEditTask = (taskId: string, updatedTask: any) => {
    setCustomerTasks(customerTasks.map(t => (t.id === taskId ? { ...t, ...updatedTask } : t)));
  };

  const handleQuickLog = () => {
    if (!quickLogData.activityType || !quickLogData.note) {
      alert('Vennligst fyll ut aktivitetstype og notat');
      return;
    }

    const newNoteData = {
      id: Date.now().toString(),
      content: `${quickLogData.activityType}: ${quickLogData.note}`,
      author: customer.owner,
      date: new Date(),
      attachments: []
    };

    setNotes([newNoteData, ...notes]);

    if (quickLogData.createFollowUp && quickLogData.followUpTitle) {
      const newTask = {
        id: Date.now().toString(),
        title: quickLogData.followUpTitle,
        description: quickLogData.followUpDescription,
        dueDate: quickLogData.followUpDate,
        priority: 'medium' as const,
        status: 'Not started',
        assignee: customer.owner,
        customer: customer.name,
        customerId: id,
        service: 'Oppfølging'
      };
      setCustomerTasks([...customerTasks, newTask]);
    }

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
    alert('Aktivitet logget!');
  };

  const handleAddNote = () => {
    if (!newNote.content.trim()) return;

    const note = {
      id: Date.now().toString(),
      content: newNote.content,
      author: customer.owner,
      date: new Date(),
      attachments: []
    };

    setNotes([note, ...notes]);
    setNewNote({ content: '', attachments: [] });
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800';
      case 'danger':
        return 'text-red-600 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default:
        return 'text-slate-600 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-700';
      case 'In progress':
        return 'bg-blue-100 text-blue-700';
      case 'Waiting for customer':
        return 'bg-yellow-100 text-yellow-700';
      case 'Closed':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
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
              <div className="w-16 h-16 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{customer.name}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">{customer.legalName} • Org.nr: {customer.orgNumber}</p>
                <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400">
                  <a href={`https://${customer.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400">
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
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{regularTasks.filter(t => t.status !== 'Done').length}</p>
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

              {/* Leveranser */}
              {deliveries.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Aktive leveranser</h3>
                  {deliveries.map((delivery) => {
                    const progressPercentage = Math.round((delivery.progress.completed / delivery.progress.total) * 100);

                    return (
                      <div
                        key={delivery.id}
                        onClick={() => navigate(`/leveranser/${delivery.id}`)}
                        className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-slate-900 dark:text-white">{delivery.customer}</h4>
                              {delivery.hasNewTickets && (
                                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs rounded-full font-medium border border-red-200 dark:border-red-800">
                                  Nye tickets
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{delivery.service}</p>
                          </div>
                          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm rounded-full font-medium">
                            {delivery.status}
                          </span>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
                              <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" />
                                {delivery.assignee}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                Frist: {delivery.deadline}
                              </span>
                            </div>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {delivery.progress.completed} av {delivery.progress.total} oppgaver
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5">
                            <div
                              className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Oppgaver - Only regular tasks */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    Oppgaver ({regularTasks.filter(t => t.status !== 'Done').length} åpne)
                  </h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {regularTasks.filter(t => t.status !== 'Done').map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      onClick={() => {
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
                              quickLogData.activityType === 'call_answered' ? 'text-green-600 dark:text-green-400' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'call_answered' ? 'text-green-700 dark:text-green-300' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              Ringte
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
                              quickLogData.activityType === 'call_no_answer' ? 'text-yellow-600 dark:text-yellow-400' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'call_no_answer' ? 'text-yellow-700 dark:text-yellow-300' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              Ikke svar
                            </span>
                          </button>
                          <button
                            onClick={() => setQuickLogData({ ...quickLogData, activityType: 'email' })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${
                              quickLogData.activityType === 'email'
                                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <MessageSquare className={`w-4 h-4 ${
                              quickLogData.activityType === 'email' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'email' ? 'text-blue-700 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              E-post
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
                            <Video className={`w-4 h-4 ${
                              quickLogData.activityType === 'meeting' ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'meeting' ? 'text-purple-700 dark:text-purple-300' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              Møte
                            </span>
                          </button>
                          <button
                            onClick={() => setQuickLogData({ ...quickLogData, activityType: 'other' })}
                            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border-2 transition-all ${
                              quickLogData.activityType === 'other'
                                ? 'border-slate-600 bg-slate-50 dark:bg-slate-700'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                          >
                            <Activity className={`w-4 h-4 ${
                              quickLogData.activityType === 'other' ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400'
                            }`} />
                            <span className={`text-sm font-medium ${
                              quickLogData.activityType === 'other' ? 'text-slate-700 dark:text-slate-300' : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              Annet
                            </span>
                          </button>
                        </div>

                        {quickLogData.activityType === 'other' && (
                          <input
                            type="text"
                            value={quickLogData.customActivityType}
                            onChange={(e) => setQuickLogData({ ...quickLogData, customActivityType: e.target.value })}
                            placeholder="Spesifiser aktivitetstype..."
                            className="w-full mt-3 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>

                      {/* Notat */}
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Hva skjedde? (Valgfritt notat)
                        </label>
                        <textarea
                          value={quickLogData.note}
                          onChange={(e) => setQuickLogData({ ...quickLogData, note: e.target.value })}
                          placeholder="Beskriv kort hva som ble diskutert..."
                          rows={3}
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {/* Opprett oppfølging */}
                      <div className="border-t border-blue-200 dark:border-blue-800 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={quickLogData.createFollowUp}
                            onChange={(e) => setQuickLogData({ ...quickLogData, createFollowUp: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Opprett oppfølgingsoppgave
                          </span>
                        </label>

                        {quickLogData.createFollowUp && (
                          <div className="mt-4 space-y-3 pl-6 border-l-2 border-blue-600">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Oppgavetittel
                              </label>
                              <input
                                type="text"
                                value={quickLogData.followUpTitle}
                                onChange={(e) => setQuickLogData({ ...quickLogData, followUpTitle: e.target.value })}
                                placeholder="F.eks. Ring for oppfølging"
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Forfallsdato
                              </label>
                              <DateTimePicker
                                value={quickLogData.followUpDate}
                                onChange={(value) => setQuickLogData({ ...quickLogData, followUpDate: value })}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Beskrivelse (valgfritt)
                              </label>
                              <textarea
                                value={quickLogData.followUpDescription}
                                onChange={(e) => setQuickLogData({ ...quickLogData, followUpDescription: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3 pt-4 border-t border-blue-200 dark:border-blue-800">
                        <button
                          onClick={() => setQuickLogExpanded(false)}
                          className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                        >
                          Avbryt
                        </button>
                        <button
                          onClick={handleQuickLog}
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Logg aktivitet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Siste aktivitet */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Siste aktivitet</h3>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {customer.activities.map((activity, idx) => (
                    <div key={idx} className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          activity.type === 'meeting' ? 'bg-blue-50 dark:bg-blue-900/30' :
                          activity.type === 'email' ? 'bg-purple-50 dark:bg-purple-900/30' :
                          'bg-green-50 dark:bg-green-900/30'
                        }`}>
                          {activity.type === 'meeting' ? (
                            <Video className={`w-4 h-4 ${activity.type === 'meeting' ? 'text-blue-600 dark:text-blue-400' : ''}`} />
                          ) : activity.type === 'email' ? (
                            <MessageSquare className={`w-4 h-4 ${activity.type === 'email' ? 'text-purple-600 dark:text-purple-400' : ''}`} />
                          ) : (
                            <Activity className={`w-4 h-4 text-green-600 dark:text-green-400`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">{activity.title}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{activity.description}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{activity.date} • {activity.user}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              {/* Kontaktpersoner */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Kontaktpersoner</h3>
                  <button
                    onClick={() => setShowAddContact(!showAddContact)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {customer.contacts.map((contact, idx) => (
                    <div key={idx} className="px-6 py-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{contact.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{contact.title}</p>
                        </div>
                        {contact.isPrimary && (
                          <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                            Primær
                          </span>
                        )}
                      </div>
                      <div className="mt-3 space-y-1">
                        <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </a>
                        <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 hover:underline">
                          <Phone className="w-3 h-3" />
                          {contact.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tjenester */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Tjenester</h3>
                  <button
                    onClick={() => setShowAddService(!showAddService)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-700">
                  {customer.services.map((service, idx) => (
                    <div key={idx} className="px-6 py-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-medium text-slate-900 dark:text-white">{service.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {service.monthlyValue.toLocaleString('nb-NO')} kr/mnd
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Ansvarlig: {service.owner}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kundeansvarlig & Team */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Team</h3>
                </div>
                <div className="px-6 py-4 space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Kundeansvarlig</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">{customer.owner}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Team</p>
                    <p className="text-slate-900 dark:text-white">{customer.team}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="max-w-5xl">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Tickets</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {customer.tickets.map((ticket) => {
                  const isUnread = ticket.lastResponse === 'Ikke besvart';
                  const initials = ticket.contact.split(' ').map(n => n[0]).join('');

                  // Generate consistent color based on contact name
                  const colors = [
                    'bg-blue-500',
                    'bg-green-500',
                    'bg-purple-500',
                    'bg-orange-500',
                    'bg-pink-500',
                    'bg-teal-500',
                    'bg-indigo-500',
                    'bg-red-500'
                  ];
                  const colorIndex = ticket.contact.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
                  const avatarColor = colors[colorIndex];

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => navigate(`/tickets/${ticket.id}`, { state: { from: `/customers/${id}`, tab: 'tickets' } })}
                      className={`px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer ${
                        isUnread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Avatar with initials */}
                        <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center flex-shrink-0`}>
                          <span className="text-white font-medium text-sm">{initials}</span>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className={`${isUnread ? 'font-semibold' : 'font-medium'} text-slate-900 dark:text-white truncate`}>
                                {ticket.contact}
                              </span>
                              {isUnread && (
                                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">
                              {ticket.opened}
                            </span>
                          </div>

                          <h3 className={`${isUnread ? 'font-semibold' : 'font-normal'} text-slate-900 dark:text-white mb-1 truncate`}>
                            {ticket.subject}
                          </h3>

                          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                            {ticket.description}
                          </p>

                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs text-slate-500 dark:text-slate-400">{ticket.category}</span>
                            {ticket.priority === 'high' && (
                              <>
                                <span className="text-slate-300 dark:text-slate-600">•</span>
                                <span className="text-xs text-red-600 dark:text-red-400 font-medium">Høy prioritet</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Deals Tab */}
        {activeTab === 'deals' && (
          <div className="max-w-5xl">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Avtaler & Tjenester</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {customer.services.map((service, idx) => (
                  <div key={idx} className="px-6 py-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{service.name}</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                          Start: {service.startDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900 dark:text-white">
                          {service.monthlyValue.toLocaleString('nb-NO')} kr/mnd
                        </p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'Active' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Ansvarlig: {service.owner}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Documents Tab */}
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
                      {/* New Folder Button */}
                      <button
                        onClick={() => setShowCreateFolderModal(true)}
                        className="px-3 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Folder className="w-4 h-4" />
                        Ny mappe
                      </button>

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

                {/* Create Folder Modal */}
                {showCreateFolderModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full">
                      <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Opprett ny mappe</h3>
                        <button
                          onClick={() => {
                            setShowCreateFolderModal(false);
                            setNewFolderName('');
                          }}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
                        >
                          <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                      </div>

                      <div className="p-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Mappenavn
                        </label>
                        <input
                          type="text"
                          value={newFolderName}
                          onChange={(e) => setNewFolderName(e.target.value)}
                          placeholder="F.eks. Kampanjemateriale 2024"
                          className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      </div>

                      <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
                        <button
                          onClick={() => {
                            setShowCreateFolderModal(false);
                            setNewFolderName('');
                          }}
                          className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          Avbryt
                        </button>
                        <button
                          onClick={() => {
                            if (newFolderName.trim()) {
                              // TODO: Backend - Create folder in Google Drive
                              alert(`Mappe "${newFolderName}" opprettet!`);
                              setShowCreateFolderModal(false);
                              setNewFolderName('');
                            }
                          }}
                          disabled={!newFolderName.trim()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Folder className="w-4 h-4" />
                          Opprett mappe
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="max-w-5xl space-y-6">
            {/* Add Note */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legg til intern note</h3>
              <textarea
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                placeholder="Skriv en intern note..."
              />
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lagre note
              </button>
            </div>

            {/* Notes List */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Alle notater ({notes.length})</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {notes.map((note) => (
                  <div key={note.id} className="px-6 py-4">
                    <p className="text-slate-900 dark:text-white whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>{note.author}</span>
                      <span>•</span>
                      <span>{note.date.toLocaleDateString('nb-NO', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
