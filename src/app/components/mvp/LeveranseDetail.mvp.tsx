import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfiles } from '../../../lib/useProfiles';
import { useCurrentUser } from '../../contexts/UserContext';
import {
  ArrowLeft,
  Building2,
  User,
  Calendar,
  Package,
  CheckCircle2,
  Circle,
  ExternalLink,
  MessageSquare,
  Clock,
  Check,
  AlertCircle,
  Edit2,
  Plus,
  X,
  Trash2,
  Save,
  FileText
} from 'lucide-react';
import { TaskItem } from '../TaskItem';

// Phase templates - each phase contains task templates
type TaskTemplate = {
  title: string;
  description: string;
  estimatedDays: number;
};

type PhaseTemplate = {
  name: string;
  tasks: TaskTemplate[];
};

const initialTemplates: Record<string, PhaseTemplate[]> = {
  'Hjemmeside': [
    {
      name: 'Oppstart',
      tasks: [
        { title: 'Motta info fra kunde', description: 'Samle inn all nødvendig informasjon om prosjektet', estimatedDays: 2 },
        { title: 'Motta logoer og bilder', description: 'Få tilsendt alle visuelle ressurser', estimatedDays: 3 }
      ]
    },
    {
      name: 'Teknisk oppsett',
      tasks: [
        { title: 'Registrer domene', description: 'Registrere eller overføre domene', estimatedDays: 1 },
        { title: 'Sett opp hosting', description: 'Konfigurere server og hosting-miljø', estimatedDays: 1 }
      ]
    },
    {
      name: 'Design',
      tasks: [
        { title: 'Lag design', description: 'Designe sidene i Figma basert på kundens ønsker', estimatedDays: 5 },
        { title: 'Få godkjenning på design', description: 'Presentere og få godkjenning fra kunde', estimatedDays: 2 }
      ]
    },
    {
      name: 'Utvikling',
      tasks: [
        { title: 'Utvikle frontend', description: 'Kode HTML/CSS/JS basert på godkjent design', estimatedDays: 7 },
        { title: 'Sett opp CMS', description: 'Installere og konfigurere WordPress', estimatedDays: 2 }
      ]
    },
    {
      name: 'Innhold og testing',
      tasks: [
        { title: 'Legg inn innhold', description: 'Publisere tekst, bilder og annet innhold', estimatedDays: 3 },
        { title: 'Test og godkjenn', description: 'Gjennomføre testing og få godkjenning fra kunde', estimatedDays: 2 }
      ]
    }
  ],
  'Nettbutikk': [
    {
      name: 'Oppstart',
      tasks: [
        { title: 'Motta produktinfo', description: 'Samle inn produktbilder og beskrivelser', estimatedDays: 3 }
      ]
    },
    {
      name: 'Teknisk oppsett',
      tasks: [
        { title: 'Installer WooCommerce', description: 'Sette opp WordPress og WooCommerce', estimatedDays: 1 },
        { title: 'Konfigurer betalingsløsning', description: 'Integrere Vipps, Stripe eller lignende', estimatedDays: 2 },
        { title: 'Sett opp frakt', description: 'Konfigurere fraktalternativer', estimatedDays: 1 }
      ]
    },
    {
      name: 'Produkter',
      tasks: [
        { title: 'Last opp produkter', description: 'Legge inn alle produkter med bilder og info', estimatedDays: 5 }
      ]
    },
    {
      name: 'Design og testing',
      tasks: [
        { title: 'Design nettbutikk', description: 'Designe og tilpasse utseende', estimatedDays: 5 },
        { title: 'Test og godkjenn', description: 'Teste bestillingsprosess og få godkjenning', estimatedDays: 3 }
      ]
    }
  ],
  'SEO-oppsett': [
    {
      name: 'Analyse',
      tasks: [
        { title: 'Nøkkelordanalyse', description: 'Identifisere relevante søkeord', estimatedDays: 3 },
        { title: 'Konkurrentanalyse', description: 'Analysere konkurrenters SEO-strategi', estimatedDays: 2 }
      ]
    },
    {
      name: 'Implementering',
      tasks: [
        { title: 'On-page SEO', description: 'Optimalisere innhold og metadata', estimatedDays: 4 },
        { title: 'Teknisk SEO', description: 'Forbedre tekniske aspekter', estimatedDays: 3 }
      ]
    },
    {
      name: 'Verktøy og rapportering',
      tasks: [
        { title: 'Sett opp Search Console', description: 'Konfigurere Google Search Console', estimatedDays: 1 },
        { title: 'Sett opp Analytics', description: 'Konfigurere Google Analytics', estimatedDays: 1 },
        { title: 'Etabler rapportering', description: 'Sette opp månedlig rapportering', estimatedDays: 2 }
      ]
    }
  ],
  'Google Ads': [
    {
      name: 'Planlegging',
      tasks: [
        { title: 'Opprett Google Ads-konto', description: 'Sette opp annonsekonto', estimatedDays: 1 },
        { title: 'Utvikle kampanjestrategi', description: 'Planlegge kampanjer og budsjett', estimatedDays: 3 }
      ]
    },
    {
      name: 'Oppsett',
      tasks: [
        { title: 'Skriv annonsetekster', description: 'Lage annonser for alle kampanjer', estimatedDays: 3 },
        { title: 'Definer målgrupper', description: 'Sette opp målgrupper og segmentering', estimatedDays: 2 },
        { title: 'Sett opp konverteringssporing', description: 'Implementere sporing av konverteringer', estimatedDays: 2 }
      ]
    },
    {
      name: 'Lansering',
      tasks: [
        { title: 'Lanser kampanjer', description: 'Aktivere kampanjer og overvåke', estimatedDays: 1 }
      ]
    }
  ]
};

export function LeveranseDetailMVP() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'activity'>('overview');
  const [newComment, setNewComment] = useState('');

  // Editing state
  const [editingDescription, setEditingDescription] = useState(false);
  const [editingRequirements, setEditingRequirements] = useState(false);
  const [editingReferences, setEditingReferences] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showManageTemplatesModal, setShowManageTemplatesModal] = useState(false);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [showAddPhaseModal, setShowAddPhaseModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [selectedPhaseForTask, setSelectedPhaseForTask] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Template management
  const [phaseTemplates, setPhaseTemplates] = useState(initialTemplates);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [editingTemplateName, setEditingTemplateName] = useState('');
  const [editingTemplatePhases, setEditingTemplatePhases] = useState<PhaseTemplate[]>([]);

  const { profiles } = useProfiles();
  const { user: currentUser } = useCurrentUser();

  // Mock data (non-editable)
  const leveranse = {
    id: '1',
    customer: 'Nordic Tech AS',
    customerId: '1',
    type: 'Hjemmeside',
    status: 'in_progress',
    progress: 60,
    responsible: 'Ola Nordmann',
    deadline: '30. mai 2026',
    createdDate: '15. april 2026',
    description: '5-siders bedriftsside med CMS',
    relatedTickets: [
      { id: '1234', subject: 'Spørsmål om rapportdata', status: 'Open', date: '1 dag siden' },
      { id: '1236', subject: 'Teknisk feil på tracking', status: 'Open', date: '4 timer siden' }
    ]
  };

  // Editable state
  const [detailedDescription, setDetailedDescription] = useState('Kunde ønsker en moderne, responsiv hjemmeside med:\n- Forside\n- Om oss-side\n- Tjenester-side\n- Blogg\n- Kontakt-side\n\nMed WordPress som CMS for enkel oppdatering av innhold.');
  const [requirements, setRequirements] = useState([
    'Responsiv design (mobil, tablet, desktop)',
    'Kontaktskjema med e-postvarsling',
    'Integrasjon med sosiale medier',
    'SEO-optimalisert',
    'GDPR-compliant cookie-banner'
  ]);
  const [references, setReferences] = useState([
    'https://example1.no',
    'https://example2.no'
  ]);

  // Phase structure with tasks
  type Task = {
    id: string;
    title: string;
    description: string;
    status: 'Not started' | 'In progress' | 'Done';
    assignee: string;
    dueDate: string;
    priority: 'low' | 'medium' | 'high';
  };

  type Phase = {
    id: string;
    name: string;
    tasks: Task[];
  };

  const [phases, setPhases] = useState<Phase[]>([
    {
      id: '1',
      name: 'Oppstart',
      tasks: [
        {
          id: 'task_1_1',
          title: 'Motta info fra kunde',
          description: 'Samle inn all nødvendig informasjon om prosjektet',
          status: 'Done',
          assignee: 'Ola Nordmann',
          dueDate: '2026-04-20',
          priority: 'high'
        },
        {
          id: 'task_1_2',
          title: 'Motta logoer og bilder',
          description: 'Få tilsendt alle visuelle ressurser',
          status: 'Done',
          assignee: 'Ola Nordmann',
          dueDate: '2026-04-22',
          priority: 'high'
        },
        {
          id: '3',
          title: 'Onboarding oppfølging',
          description: 'Sjekk at alle tilganger er på plass',
          status: 'Not started',
          assignee: 'Ola Nordmann',
          dueDate: '2026-04-30',
          priority: 'medium'
        }
      ]
    },
    {
      id: '2',
      name: 'Teknisk oppsett',
      tasks: [
        {
          id: 'task_2_1',
          title: 'Registrer domene',
          description: 'Registrere eller overføre domene',
          status: 'Done',
          assignee: 'Ola Nordmann',
          dueDate: '2026-04-23',
          priority: 'high'
        },
        {
          id: 'task_2_2',
          title: 'Sett opp hosting',
          description: 'Konfigurere server og hosting-miljø',
          status: 'Done',
          assignee: 'Ola Nordmann',
          dueDate: '2026-04-24',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Sett opp Google Analytics tracking',
          description: 'Verifiser at tracking er korrekt',
          status: 'Not started',
          assignee: 'Kari Jensen',
          dueDate: '2026-04-28',
          priority: 'high'
        }
      ]
    },
    {
      id: '3',
      name: 'Design og innhold',
      tasks: [
        {
          id: 'task_3_1',
          title: 'Lag design',
          description: 'Designe sidene i Figma basert på kundens ønsker',
          status: 'In progress',
          assignee: 'Kari Jensen',
          dueDate: '2026-04-27',
          priority: 'high'
        },
        {
          id: 'task_3_2',
          title: 'Få godkjenning på design',
          description: 'Presentere og få godkjenning fra kunde',
          status: 'Not started',
          assignee: 'Kari Jensen',
          dueDate: '2026-04-29',
          priority: 'high'
        },
        {
          id: '1',
          title: 'Send månedsrapport',
          description: 'Første månedsrapport SEO',
          status: 'In progress',
          assignee: 'Ola Nordmann',
          dueDate: '2026-04-27',
          priority: 'high'
        }
      ]
    },
    {
      id: '4',
      name: 'Utvikling',
      tasks: [
        {
          id: 'task_4_1',
          title: 'Utvikle frontend',
          description: 'Kode HTML/CSS/JS basert på godkjent design',
          status: 'Not started',
          assignee: 'Ola Nordmann',
          dueDate: '2026-05-06',
          priority: 'high'
        },
        {
          id: 'task_4_2',
          title: 'Sett opp CMS',
          description: 'Installere og konfigurere WordPress',
          status: 'Not started',
          assignee: 'Ola Nordmann',
          dueDate: '2026-05-08',
          priority: 'medium'
        }
      ]
    }
  ]);

  // Temp editing values
  const [tempDescription, setTempDescription] = useState('');
  const [tempRequirements, setTempRequirements] = useState<string[]>([]);
  const [tempReferences, setTempReferences] = useState<string[]>([]);
  const [newPhaseName, setNewPhaseName] = useState('');
  const [newTaskData, setNewTaskData] = useState({
    title: '',
    description: '',
    assignee: '',
    estimatedDays: 1,
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  // Flatten all tasks for the Tasks tab
  const allTasks = phases.flatMap(phase =>
    phase.tasks.map(task => ({
      ...task,
      customer: leveranse.customer,
      customerId: leveranse.customerId,
      service: leveranse.type,
      dueDate: formatDueDate(task.dueDate),
      priority: task.priority as 'low' | 'medium' | 'high'
    }))
  );

  // Helper to format dates
  function formatDueDate(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Forfalt';
    if (diffDays === 0) return 'I dag';
    if (diffDays === 1) return 'I morgen';
    if (diffDays <= 7) return `Om ${diffDays} dager`;
    return date.toLocaleDateString('no-NO', { day: 'numeric', month: 'long' });
  }

  const [activities, setActivities] = useState([
    {
      id: '1',
      type: 'comment',
      user: 'Kari Jensen',
      message: 'Design er nå klar for godkjenning. Sendt til kunde.',
      timestamp: '2 timer siden'
    },
    {
      id: '2',
      type: 'task_completed',
      user: 'Ola Nordmann',
      message: 'Fullførte oppgave: Motta logoer og bilder fra kunde',
      timestamp: '1 dag siden'
    },
    {
      id: '3',
      type: 'status_change',
      user: 'Ola Nordmann',
      message: 'Endret status fra "Ikke startet" til "Pågår"',
      timestamp: '3 dager siden'
    },
    {
      id: '4',
      type: 'created',
      user: 'System',
      message: 'Leveranse opprettet',
      timestamp: '2 uker siden'
    }
  ]);

  const [currentStatus, setCurrentStatus] = useState(leveranse.status);
  const [currentResponsible, setCurrentResponsible] = useState(leveranse.responsible);

  // Update main assignee for all tasks
  const handleChangeMainResponsible = (newResponsible: string) => {
    setCurrentResponsible(newResponsible);
    // Optionally update all tasks to new assignee
    if (confirm(`Vil du også oppdatere ansvarlig på alle oppgaver til ${newResponsible}?`)) {
      setPhases(phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.map(task => ({ ...task, assignee: newResponsible }))
      })));
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newActivity = {
      id: String(activities.length + 1),
      type: 'comment',
      user: currentUser?.navn || 'Ukjent', // Current user
      message: newComment,
      timestamp: 'Akkurat nå'
    };

    setActivities([newActivity, ...activities]);
    setNewComment('');
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm('Er du sikker på at du vil slette denne oppgaven?')) {
      setPhases(phases.map(phase => ({
        ...phase,
        tasks: phase.tasks.filter(t => t.id !== taskId)
      })));
    }
  };

  const handleEditTask = (taskId: string, updatedTask: any) => {
    setPhases(phases.map(phase => ({
      ...phase,
      tasks: phase.tasks.map(t => t.id === taskId ? { ...t, ...updatedTask } : t)
    })));
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: 'Not started' | 'In progress' | 'Done') => {
    handleEditTask(taskId, { status: newStatus });
  };

  const handleStartEditTask = (task: Task) => {
    setEditingTask({ ...task });
    setShowEditTaskModal(true);
  };

  const handleSaveEditTask = () => {
    if (!editingTask) return;
    handleEditTask(editingTask.id, editingTask);
    setEditingTask(null);
    setShowEditTaskModal(false);
  };

  const handleCancelEditTask = () => {
    setEditingTask(null);
    setShowEditTaskModal(false);
  };

  // Description editing
  const handleStartEditDescription = () => {
    setTempDescription(detailedDescription);
    setEditingDescription(true);
  };

  const handleSaveDescription = () => {
    setDetailedDescription(tempDescription);
    setEditingDescription(false);
  };

  const handleCancelEditDescription = () => {
    setTempDescription('');
    setEditingDescription(false);
  };

  // Requirements editing
  const handleStartEditRequirements = () => {
    setTempRequirements([...requirements]);
    setEditingRequirements(true);
  };

  const handleSaveRequirements = () => {
    setRequirements(tempRequirements);
    setEditingRequirements(false);
  };

  const handleCancelEditRequirements = () => {
    setTempRequirements([]);
    setEditingRequirements(false);
  };

  const handleAddRequirement = () => {
    setTempRequirements([...tempRequirements, '']);
  };

  const handleRemoveRequirement = (index: number) => {
    setTempRequirements(tempRequirements.filter((_, i) => i !== index));
  };

  const handleUpdateRequirement = (index: number, value: string) => {
    const updated = [...tempRequirements];
    updated[index] = value;
    setTempRequirements(updated);
  };

  // References editing
  const handleStartEditReferences = () => {
    setTempReferences([...references]);
    setEditingReferences(true);
  };

  const handleSaveReferences = () => {
    setReferences(tempReferences);
    setEditingReferences(false);
  };

  const handleCancelEditReferences = () => {
    setTempReferences([]);
    setEditingReferences(false);
  };

  const handleAddReference = () => {
    setTempReferences([...tempReferences, '']);
  };

  const handleRemoveReference = (index: number) => {
    setTempReferences(tempReferences.filter((_, i) => i !== index));
  };

  const handleUpdateReference = (index: number, value: string) => {
    const updated = [...tempReferences];
    updated[index] = value;
    setTempReferences(updated);
  };

  // Phase and task management
  const handleAddPhase = () => {
    if (!newPhaseName.trim()) return;
    const newPhase: Phase = {
      id: String(phases.length + 1),
      name: newPhaseName,
      tasks: []
    };
    setPhases([...phases, newPhase]);
    setNewPhaseName('');
    setShowAddPhaseModal(false);
  };

  const handleDeletePhase = (phaseId: string) => {
    if (confirm('Er du sikker på at du vil slette denne fasen og alle oppgavene i den?')) {
      setPhases(phases.filter(p => p.id !== phaseId));
    }
  };

  const handleAddTask = () => {
    if (!newTaskData.title.trim() || !selectedPhaseForTask) return;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    const dueDate = new Date(startDate);
    dueDate.setDate(dueDate.getDate() + newTaskData.estimatedDays);

    const newTask: Task = {
      id: String(Date.now()),
      title: newTaskData.title,
      description: newTaskData.description,
      status: 'Not started',
      assignee: newTaskData.assignee,
      dueDate: dueDate.toISOString().split('T')[0],
      priority: newTaskData.priority
    };

    setPhases(phases.map(phase =>
      phase.id === selectedPhaseForTask
        ? { ...phase, tasks: [...phase.tasks, newTask] }
        : phase
    ));

    setNewTaskData({
      title: '',
      description: '',
      assignee: currentResponsible,
      estimatedDays: 1,
      priority: 'medium'
    });
    setShowAddTaskModal(false);
    setSelectedPhaseForTask(null);
  };

  const handleLoadTemplate = (templateName: string) => {
    const template = phaseTemplates[templateName as keyof typeof phaseTemplates];
    if (!template) return;

    let taskIdCounter = 1;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);

    const newPhases: Phase[] = template.map((phaseTemplate, phaseIndex) => {
      let currentDate = new Date(startDate);
      currentDate.setDate(currentDate.getDate() + (phaseIndex * 7)); // Each phase starts roughly a week apart

      const tasks: Task[] = phaseTemplate.tasks.map((taskTemplate) => {
        const dueDate = new Date(currentDate);
        dueDate.setDate(dueDate.getDate() + taskTemplate.estimatedDays);
        currentDate = new Date(dueDate);

        const task: Task = {
          id: String(taskIdCounter++),
          title: taskTemplate.title,
          description: taskTemplate.description,
          status: 'Not started',
          assignee: currentResponsible,
          dueDate: dueDate.toISOString().split('T')[0],
          priority: 'medium'
        };
        return task;
      });

      return {
        id: String(phaseIndex + 1),
        name: phaseTemplate.name,
        tasks
      };
    });

    setPhases(newPhases);
    setShowTemplateModal(false);
  };

  // Template management handlers
  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) return;
    setPhaseTemplates({
      ...phaseTemplates,
      [newTemplateName]: []
    });
    // Open edit mode for new template
    setEditingTemplateId(newTemplateName);
    setEditingTemplateName(newTemplateName);
    setEditingTemplatePhases([]);
    setNewTemplateName('');
    setShowCreateTemplateModal(false);
  };

  const handleStartEditTemplate = (templateName: string) => {
    const template = phaseTemplates[templateName as keyof typeof phaseTemplates];
    setEditingTemplateId(templateName);
    setEditingTemplateName(templateName);
    setEditingTemplatePhases([...template]);
  };

  const handleSaveTemplateEdit = () => {
    if (!editingTemplateId || !editingTemplateName.trim()) return;

    const updatedTemplates = { ...phaseTemplates };

    // If name changed, delete old and create new
    if (editingTemplateId !== editingTemplateName) {
      delete updatedTemplates[editingTemplateId as keyof typeof updatedTemplates];
    }

    updatedTemplates[editingTemplateName as keyof typeof updatedTemplates] = editingTemplatePhases;
    setPhaseTemplates(updatedTemplates);
    setEditingTemplateId(null);
    setEditingTemplateName('');
    setEditingTemplatePhases([]);
  };

  const handleCancelTemplateEdit = () => {
    setEditingTemplateId(null);
    setEditingTemplateName('');
    setEditingTemplatePhases([]);
  };

  const handleDeleteTemplate = (templateName: string) => {
    if (confirm(`Er du sikker på at du vil slette malen "${templateName}"?`)) {
      const updatedTemplates = { ...phaseTemplates };
      delete updatedTemplates[templateName as keyof typeof updatedTemplates];
      setPhaseTemplates(updatedTemplates);
    }
  };

  const handleAddTemplatePhase = () => {
    const newPhase: PhaseTemplate = {
      name: '',
      tasks: []
    };
    setEditingTemplatePhases([...editingTemplatePhases, newPhase]);
  };

  const handleRemoveTemplatePhase = (phaseIndex: number) => {
    setEditingTemplatePhases(editingTemplatePhases.filter((_, i) => i !== phaseIndex));
  };

  const handleUpdateTemplatePhaseName = (phaseIndex: number, name: string) => {
    const updated = [...editingTemplatePhases];
    updated[phaseIndex].name = name;
    setEditingTemplatePhases(updated);
  };

  const handleAddTemplateTask = (phaseIndex: number) => {
    const updated = [...editingTemplatePhases];
    updated[phaseIndex].tasks.push({
      title: '',
      description: '',
      estimatedDays: 1
    });
    setEditingTemplatePhases(updated);
  };

  const handleRemoveTemplateTask = (phaseIndex: number, taskIndex: number) => {
    const updated = [...editingTemplatePhases];
    updated[phaseIndex].tasks = updated[phaseIndex].tasks.filter((_, i) => i !== taskIndex);
    setEditingTemplatePhases(updated);
  };

  const handleUpdateTemplateTask = (phaseIndex: number, taskIndex: number, field: keyof TaskTemplate, value: string | number) => {
    const updated = [...editingTemplatePhases];
    updated[phaseIndex].tasks[taskIndex] = {
      ...updated[phaseIndex].tasks[taskIndex],
      [field]: value
    };
    setEditingTemplatePhases(updated);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-700';
      case 'waiting':
        return 'bg-yellow-100 text-yellow-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Oversikt' },
    { id: 'tasks', label: 'Oppgaver' },
    { id: 'activity', label: 'Aktivitet' }
  ];

  // Calculate progress from all tasks
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.status === 'Done').length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Tilbake
          </button>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4 flex-1">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => navigate(`/customers/${leveranse.customerId}`)}
                    className="text-2xl font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2 group"
                  >
                    {leveranse.customer}
                    <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-sm font-medium">
                    {leveranse.type}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400">{leveranse.description}</p>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Status
              </label>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="not_started">Ikke startet</option>
                <option value="in_progress">Pågår</option>
                <option value="waiting">Venter på kunde</option>
                <option value="completed">Ferdig</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Hovedansvarlig
              </label>
              <select
                value={currentResponsible}
                onChange={(e) => handleChangeMainResponsible(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Velg ansvarlig</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.navn}>{p.navn}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Kunde
              </label>
              <button
                onClick={() => navigate(`/customers/${leveranse.customerId}`)}
                className="w-full px-3 py-2 border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-left flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  {leveranse.customer}
                </span>
                <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Frist
              </label>
              <div className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                {leveranse.deadline}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-slate-200 dark:border-slate-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="max-w-5xl space-y-6">
            {/* Progress */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Fremdrift</h3>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white min-w-[4rem] text-right">
                  {progress}%
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {completedTasks} av {totalTasks} oppgaver fullført
              </p>
            </div>

            {/* Description */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Beskrivelse</h3>
                {!editingDescription && (
                  <button
                    onClick={handleStartEditDescription}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {editingDescription ? (
                <div className="space-y-3">
                  <textarea
                    value={tempDescription}
                    onChange={(e) => setTempDescription(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveDescription}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Lagre
                    </button>
                    <button
                      onClick={handleCancelEditDescription}
                      className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                    >
                      Avbryt
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line mb-4">
                  {detailedDescription}
                </p>
              )}

              {/* Requirements */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">Krav:</h4>
                  {!editingRequirements && (
                    <button
                      onClick={handleStartEditRequirements}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {editingRequirements ? (
                  <div className="space-y-3">
                    {tempRequirements.map((req, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={req}
                          onChange={(e) => handleUpdateRequirement(index, e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleRemoveRequirement(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddRequirement}
                      className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Legg til krav
                    </button>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveRequirements}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Lagre
                      </button>
                      <button
                        onClick={handleCancelEditRequirements}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Avbryt
                      </button>
                    </div>
                  </div>
                ) : (
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* References */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">Referanser:</h4>
                  {!editingReferences && (
                    <button
                      onClick={handleStartEditReferences}
                      className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {editingReferences ? (
                  <div className="space-y-3">
                    {tempReferences.map((ref, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={ref}
                          onChange={(e) => handleUpdateReference(index, e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleRemoveReference(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={handleAddReference}
                      className="px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Legg til referanse
                    </button>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSaveReferences}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Lagre
                      </button>
                      <button
                        onClick={handleCancelEditReferences}
                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                      >
                        Avbryt
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {references.map((ref, index) => (
                      <a
                        key={index}
                        href={ref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {ref}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Phases and Tasks */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Faser og oppgaver</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTemplateModal(true)}
                    className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Bruk mal
                  </button>
                  <button
                    onClick={() => setShowAddPhaseModal(true)}
                    className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ny fase
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                {phases.map((phase) => (
                  <div
                    key={phase.id}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden"
                  >
                    <div className="bg-slate-50 dark:bg-slate-700/50 px-4 py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium text-slate-900 dark:text-white">{phase.name}</h4>
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                          {phase.tasks.filter(t => t.status === 'Done').length}/{phase.tasks.length} fullført
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPhaseForTask(phase.id);
                            setShowAddTaskModal(true);
                          }}
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeletePhase(phase.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    {phase.tasks.length > 0 ? (
                      <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {phase.tasks.map((task) => (
                          <div key={task.id} className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                            <div className="flex items-start gap-3">
                              <button
                                onClick={() => {
                                  const newStatus = task.status === 'Done' ? 'Not started' :
                                                    task.status === 'In progress' ? 'Done' : 'In progress';
                                  handleUpdateTaskStatus(task.id, newStatus);
                                }}
                                className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                                  task.status === 'Done'
                                    ? 'bg-green-600 border-green-600'
                                    : task.status === 'In progress'
                                    ? 'bg-blue-600 border-blue-600'
                                    : 'border-slate-300 dark:border-slate-600'
                                }`}
                              >
                                {task.status === 'Done' && <Check className="w-4 h-4 text-white" />}
                                {task.status === 'In progress' && <Clock className="w-3 h-3 text-white" />}
                              </button>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h5 className={`font-medium ${
                                    task.status === 'Done'
                                      ? 'text-slate-500 dark:text-slate-400 line-through'
                                      : 'text-slate-900 dark:text-white'
                                  }`}>
                                    {task.title}
                                  </h5>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                                    <button
                                      onClick={() => handleStartEditTask(task)}
                                      className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                                    >
                                      <Edit2 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteTask(task.id)}
                                      className="p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                                {task.description && (
                                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{task.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    {task.assignee}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {formatDueDate(task.dueDate)}
                                  </span>
                                  {task.priority === 'high' && (
                                    <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                      Høy prioritet
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                        Ingen oppgaver i denne fasen ennå
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Tickets */}
            {leveranse.relatedTickets.length > 0 && (
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Relaterte tickets</h3>
                <div className="space-y-2">
                  {leveranse.relatedTickets.map((ticket) => (
                    <button
                      key={ticket.id}
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          #{ticket.id} - {ticket.subject}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{ticket.date}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="max-w-5xl">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Oppgaver ({allTasks.length})</h3>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {allTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    showCustomer={false}
                    showService={false}
                    showStatus={false}
                    teamMembers={profiles.map(p => p.navn)}
                    onReassign={(assignee) => {
                      handleEditTask(task.id, { assignee });
                    }}
                    onReschedule={(date) => {
                      handleEditTask(task.id, { dueDate: date });
                    }}
                    onEdit={(updatedTask) => handleEditTask(task.id, updatedTask)}
                    onDelete={() => handleDeleteTask(task.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="max-w-5xl space-y-6">
            {/* Add Comment */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legg til kommentar</h3>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Skriv en kommentar til teamet..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
              />
              <button
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Legg til kommentar
              </button>
            </div>

            {/* Activity Timeline */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Aktivitet</h3>
              <div className="space-y-4">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.type === 'comment' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        activity.type === 'task_completed' ? 'bg-green-100 dark:bg-green-900/30' :
                        activity.type === 'status_change' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                        'bg-slate-100 dark:bg-slate-700'
                      }`}>
                        {activity.type === 'comment' ? (
                          <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : activity.type === 'task_completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : activity.type === 'status_change' ? (
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                        ) : (
                          <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                        )}
                      </div>
                      {index < activities.length - 1 && (
                        <div className="w-0.5 h-full bg-slate-200 dark:bg-slate-700 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium text-slate-900 dark:text-white">{activity.user}</p>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{activity.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Phase Modal */}
      {showAddPhaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Legg til fase</h3>
              <button
                onClick={() => {
                  setShowAddPhaseModal(false);
                  setNewPhaseName('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              value={newPhaseName}
              onChange={(e) => setNewPhaseName(e.target.value)}
              placeholder="F.eks. 'Testing og QA'"
              className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddPhase();
                }
              }}
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddPhase}
                disabled={!newPhaseName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Legg til
              </button>
              <button
                onClick={() => {
                  setShowAddPhaseModal(false);
                  setNewPhaseName('');
                }}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditTaskModal && editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Rediger oppgave</h3>
              <button
                onClick={handleCancelEditTask}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Oppgavetittel
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Beskrivelse
                </label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ansvarlig
                  </label>
                  <select
                    value={editingTask.assignee}
                    onChange={(e) => setEditingTask({ ...editingTask, assignee: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Velg ansvarlig</option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.navn}>{p.navn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Frist
                  </label>
                  <input
                    type="date"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editingTask.status}
                    onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as 'Not started' | 'In progress' | 'Done' })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Not started">Ikke startet</option>
                    <option value="In progress">Pågår</option>
                    <option value="Done">Ferdig</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Prioritet
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Lav</option>
                    <option value="medium">Medium</option>
                    <option value="high">Høy</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveEditTask}
                disabled={!editingTask.title.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Lagre endringer
              </button>
              <button
                onClick={handleCancelEditTask}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && selectedPhaseForTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Legg til oppgave</h3>
              <button
                onClick={() => {
                  setShowAddTaskModal(false);
                  setSelectedPhaseForTask(null);
                  setNewTaskData({
                    title: '',
                    description: '',
                    assignee: currentResponsible,
                    estimatedDays: 1,
                    priority: 'medium'
                  });
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Oppgavetittel
                </label>
                <input
                  type="text"
                  value={newTaskData.title}
                  onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
                  placeholder="F.eks. 'Teste kontaktskjema'"
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Beskrivelse (valgfritt)
                </label>
                <textarea
                  value={newTaskData.description}
                  onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Ansvarlig
                  </label>
                  <select
                    value={newTaskData.assignee}
                    onChange={(e) => setNewTaskData({ ...newTaskData, assignee: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">— Velg ansvarlig</option>
                    {profiles.map((p) => (
                      <option key={p.id} value={p.navn}>{p.navn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Estimert dager
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newTaskData.estimatedDays}
                    onChange={(e) => setNewTaskData({ ...newTaskData, estimatedDays: parseInt(e.target.value) || 1 })}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Prioritet
                </label>
                <select
                  value={newTaskData.priority}
                  onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Lav</option>
                  <option value="medium">Medium</option>
                  <option value="high">Høy</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleAddTask}
                disabled={!newTaskData.title.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Legg til oppgave
              </button>
              <button
                onClick={() => {
                  setShowAddTaskModal(false);
                  setSelectedPhaseForTask(null);
                  setNewTaskData({
                    title: '',
                    description: '',
                    assignee: currentResponsible,
                    estimatedDays: 1,
                    priority: 'medium'
                  });
                }}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Velg mal for milepæler</h3>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Dette vil erstatte eksisterende milepæler med valgt mal.
            </p>
            <div className="space-y-2 mb-4">
              {Object.keys(phaseTemplates).map((templateName) => {
                const template = phaseTemplates[templateName as keyof typeof phaseTemplates];
                const totalTasks = template.reduce((sum, phase) => sum + phase.tasks.length, 0);
                return (
                  <button
                    key={templateName}
                    onClick={() => {
                      if (confirm(`Er du sikker på at du vil bruke malen "${templateName}"? Dette vil erstatte eksisterende faser og oppgaver.`)) {
                        handleLoadTemplate(templateName);
                      }
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{templateName}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {template.length} faser, {totalTasks} oppgaver
                        </p>
                      </div>
                      <FileText className="w-5 h-5 text-slate-400" />
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setShowManageTemplatesModal(true);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Administrer maler
              </button>
              <button
                onClick={() => setShowTemplateModal(false)}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Templates Modal */}
      {showManageTemplatesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Administrer milepælmaler</h3>
              <button
                onClick={() => setShowManageTemplatesModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {editingTemplateId ? (
              // Edit Template View
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Malnavn
                  </label>
                  <input
                    type="text"
                    value={editingTemplateName}
                    onChange={(e) => setEditingTemplateName(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Faser og oppgaver
                    </label>
                    <button
                      onClick={handleAddTemplatePhase}
                      className="px-3 py-1.5 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ny fase
                    </button>
                  </div>
                  <div className="space-y-4">
                    {editingTemplatePhases.map((phase, phaseIndex) => (
                      <div key={phaseIndex} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                        <div className="flex gap-2 mb-3">
                          <input
                            type="text"
                            value={phase.name}
                            onChange={(e) => handleUpdateTemplatePhaseName(phaseIndex, e.target.value)}
                            placeholder="Fasenavn"
                            className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                          />
                          <button
                            onClick={() => handleRemoveTemplatePhase(phaseIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="space-y-2 ml-4">
                          {phase.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex gap-2">
                              <input
                                type="text"
                                value={task.title}
                                onChange={(e) => handleUpdateTemplateTask(phaseIndex, taskIndex, 'title', e.target.value)}
                                placeholder="Oppgavetittel"
                                className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <input
                                type="number"
                                min="1"
                                value={task.estimatedDays}
                                onChange={(e) => handleUpdateTemplateTask(phaseIndex, taskIndex, 'estimatedDays', parseInt(e.target.value) || 1)}
                                placeholder="Dager"
                                className="w-20 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              />
                              <button
                                onClick={() => handleRemoveTemplateTask(phaseIndex, taskIndex)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddTemplateTask(phaseIndex)}
                            className="px-3 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Legg til oppgave
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={handleSaveTemplateEdit}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Lagre mal
                  </button>
                  <button
                    onClick={handleCancelTemplateEdit}
                    className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Avbryt
                  </button>
                </div>
              </div>
            ) : (
              // List Templates View
              <>
                <div className="space-y-2 mb-4">
                  {Object.keys(phaseTemplates).map((templateName) => {
                    const template = phaseTemplates[templateName as keyof typeof phaseTemplates];
                    const totalTasks = template.reduce((sum, phase) => sum + phase.tasks.length, 0);
                    return (
                      <div
                        key={templateName}
                        className="flex items-center justify-between px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{templateName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {template.length} faser, {totalTasks} oppgaver
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEditTemplate(templateName)}
                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTemplate(templateName)}
                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowCreateTemplateModal(true)}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Ny mal
                  </button>
                  <button
                    onClick={() => setShowManageTemplatesModal(false)}
                    className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                  >
                    Lukk
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Opprett ny mal</h3>
              <button
                onClick={() => {
                  setShowCreateTemplateModal(false);
                  setNewTemplateName('');
                }}
                className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Malnavn
              </label>
              <input
                type="text"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="F.eks. 'E-post kampanje'"
                className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateTemplate();
                  }
                }}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreateTemplate}
                disabled={!newTemplateName.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Opprett
              </button>
              <button
                onClick={() => {
                  setShowCreateTemplateModal(false);
                  setNewTemplateName('');
                }}
                className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                Avbryt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
