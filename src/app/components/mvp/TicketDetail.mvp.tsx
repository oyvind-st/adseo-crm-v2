import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Building2, User, Calendar, Mail, Send, X, Paperclip, CheckSquare, Plus, FileText, Clock, MessageSquare, History, Zap, Tag, Search, PhoneIncoming, PhoneOff, Video, Activity, CheckCircle } from 'lucide-react';
import { DateTimePicker } from '../DateTimePicker';
import { supabase } from '../../../lib/supabase';

const isEmailAddress = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export function TicketDetailMVP() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [replyText, setReplyText] = useState('');
  const [replyCC, setReplyCC] = useState('');
  const [showCC, setShowCC] = useState(false);
  const [internalNote, setInternalNote] = useState('');
  const [attachments, setAttachments] = useState<Array<{ name: string; size: number; url?: string }>>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [currentStatus, setCurrentStatus] = useState('');
  const [currentAssignee, setCurrentAssignee] = useState('');
  const [currentCustomerId, setCurrentCustomerId] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    assignee: 'Ola Nordmann'
  });
  const [supaTicket, setSupaTicket] = useState<any>(null);
  const [supaLoading, setSupaLoading] = useState(true);
  const [conversation, setConversation] = useState<any[]>([]);
  const [supaCustomers, setSupaCustomers] = useState<{ id: string; name: string }[]>([]);
  const [customerContacts, setCustomerContacts] = useState<any[]>([]);
  const [relatedTicketsData, setRelatedTicketsData] = useState<any[]>([]);
  const [customerActivityData, setCustomerActivityData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Add contact modal state
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [addContactPrefill, setAddContactPrefill] = useState('');
  const [addContactForm, setAddContactForm] = useState({ navn: '', tittel: '', epost: '', telefon: '' });

  // Load all customers for the dropdown
  useEffect(() => {
    supabase.from('kunder').select('id, bedriftsnavn').order('bedriftsnavn')
      .then(({ data }) => {
        if (data) setSupaCustomers(data.map(k => ({ id: k.id, name: k.bedriftsnavn })));
      });
  }, []);

  // Reload customer-specific data whenever the linked customer changes
  useEffect(() => {
    if (!currentCustomerId) {
      setCustomerContacts([]);
      setRelatedTicketsData([]);
      setCustomerActivityData([]);
      return;
    }

    // Contacts for this customer
    supabase.from('kontakter')
      .select('id, navn, tittel, epost, telefon, er_primaer')
      .eq('kunde_id', currentCustomerId)
      .order('er_primaer', { ascending: false })
      .then(({ data }) => { if (data) setCustomerContacts(data); });

    // Other tickets for this customer (exclude current ticket)
    supabase.from('tickets')
      .select('id, tittel, status, created_at')
      .eq('kunde_id', currentCustomerId)
      .neq('id', id || '')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => { if (data) setRelatedTicketsData(data); });

    // Recent activity: aktivitetslogg + completed oppgaver merged
    Promise.all([
      supabase.from('aktivitetslogg')
        .select('id, type, tittel, beskrivelse, utfort_av_navn, created_at')
        .eq('kunde_id', currentCustomerId)
        .order('created_at', { ascending: false })
        .limit(8),
      supabase.from('oppgaver')
        .select('id, tittel, created_at')
        .eq('kunde_id', currentCustomerId)
        .eq('status', 'fullfort')
        .order('created_at', { ascending: false })
        .limit(5)
    ]).then(([{ data: logData }, { data: taskData }]) => {
      const logEntries = (logData || []).map(n => ({
        id: n.id, type: n.type || 'notat',
        title: n.tittel, content: n.beskrivelse,
        author: n.utfort_av_navn || 'Ola Nordmann',
        date: new Date(n.created_at)
      }));
      const taskEntries = (taskData || []).map(t => ({
        id: `task-${t.id}`, type: 'oppgave_fullfort',
        title: t.tittel, content: null,
        author: 'Ola Nordmann',
        date: new Date(t.created_at)
      }));
      const merged = [...logEntries, ...taskEntries]
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 8);
      setCustomerActivityData(merged);
    });
  }, [currentCustomerId]);

  // Fetch real ticket from Supabase
  useEffect(() => {
    if (!id) return;
    supabase.from('tickets')
      .select('*, kunder(id, bedriftsnavn, sted, nettside), kontakter(id, navn, tittel, epost, telefon)')
      .eq('id', id).single()
      .then(({ data }) => { setSupaTicket(data); setSupaLoading(false); });

    // Fetch conversation messages
    supabase.from('ticket_meldinger')
      .select('*')
      .eq('ticket_id', id)
      .order('created_at', { ascending: true })
      .then(({ data }) => {
        if (data) setConversation(data.map(m => ({
          id: m.id,
          type: m.type,
          from: m.fra,
          cc: m.cc_epost || null,
          message: m.melding,
          timestamp: new Date(m.created_at).toLocaleString('no-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
        })));
      });
  }, [id]);

  // Auto-populate CC from thread whenever conversation loads/changes.
  // Only exclude the specific email that goes into "Til:" (last customer sender).
  // Everyone else who appeared on CC — including other senders — stays in CC.
  useEffect(() => {
    const lastCustomer = [...conversation].reverse().find(m => m.type === 'customer');
    const replyToEmail = (lastCustomer?.from ?? '').toLowerCase();

    const allCC = conversation
      .filter(m => m.type === 'customer' && m.cc)
      .flatMap((m: any) => m.cc.split(',').map((a: string) => a.trim().toLowerCase()))
      .filter(addr => addr && addr !== replyToEmail);
    const unique = [...new Set(allCC)] as string[];
    if (unique.length > 0) {
      setReplyCC(prev => prev || unique.join(', '));
      setShowCC(true);
    }
  }, [conversation]);

  const [internalNotes, setInternalNotes] = useState<any[]>([]);

  // Build ticket from Supabase data
  const ticket = supaTicket ? {
    id: supaTicket.id,
    subject: supaTicket.tittel,
    description: supaTicket.beskrivelse || '',
    customer: supaTicket.kunder?.bedriftsnavn || '—',
    customerId: supaTicket.kunder?.id || '',
    contact: supaTicket.kontakter?.navn || '',
    contactEmail: supaTicket.kontakter?.epost || '',
    category: supaTicket.kategori || '',
    priority: supaTicket.prioritet === 'høy' ? 'high' : supaTicket.prioritet === 'medium' ? 'medium' : 'low',
    status: supaTicket.status === 'apent' ? 'Open' : supaTicket.status === 'pagar' ? 'In progress' : supaTicket.status === 'venter_pa_kunde' ? 'Waiting for customer' : 'Resolved',
    assignee: 'Ola Nordmann',
    opened: new Date(supaTicket.created_at).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' }),
    openedDate: new Date(supaTicket.created_at).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    lastResponse: conversation.length > 0
      ? new Date(supaTicket.created_at).toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
      : '—',
    channel: 'E-post',
    conversation
  } : null;

  // Set initial values once when ticket data first loads (stable dep = supaTicket.id)
  useEffect(() => {
    if (supaTicket) {
      setCurrentStatus(
        supaTicket.status === 'apent' ? 'Open'
        : supaTicket.status === 'pagar' ? 'In progress'
        : supaTicket.status === 'venter_pa_kunde' ? 'Waiting for customer'
        : 'Resolved'
      );
      setCurrentAssignee('Ola Nordmann');
      setCurrentCustomerId(supaTicket.kunder?.id || '');
    }
  }, [supaTicket?.id]);

  if (supaLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <p className="text-slate-400">Laster ticket...</p>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate('/tickets')}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake til tickets
        </button>
        <p className="text-slate-600 dark:text-slate-400">Ticket ikke funnet</p>
      </div>
    );
  }

  const teamMembers = ['Ola Nordmann', 'Kari Jensen', 'Per Hansen', 'Nina Olsen'];

  const filteredCustomers = supaCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearchQuery.toLowerCase())
  );

  const selectedCustomer = supaCustomers.find((c) => c.id === currentCustomerId);

  const handleSelectCustomer = async (customerId: string) => {
    setCurrentCustomerId(customerId);
    setShowCustomerSearch(false);
    setCustomerSearchQuery('');
    if (ticket) {
      await supabase.from('tickets').update({ kunde_id: customerId }).eq('id', ticket.id);
    }
  };

  // fra is always an email address — pre-fill epost directly
  const handleOpenAddContact = (email: string) => {
    setAddContactPrefill(email);
    setAddContactForm({ navn: '', tittel: '', epost: email, telefon: '' });
    setShowAddContactModal(true);
  };

  const handleSaveNewContact = async () => {
    if (!addContactForm.navn.trim() || !currentCustomerId) return;
    await supabase.from('kontakter').insert({
      kunde_id: currentCustomerId,
      navn: addContactForm.navn,
      tittel: addContactForm.tittel,
      epost: addContactForm.epost,
      telefon: addContactForm.telefon,
      er_primaer: false
    });
    // Reload contacts
    const { data } = await supabase.from('kontakter')
      .select('id, navn, tittel, epost, telefon, er_primaer')
      .eq('kunde_id', currentCustomerId)
      .order('er_primaer', { ascending: false });
    if (data) setCustomerContacts(data);
    setShowAddContactModal(false);
    setAddContactForm({ navn: '', tittel: '', epost: '', telefon: '' });
    setAddContactPrefill('');
  };

  const templates = [
    {
      id: '1',
      name: 'Takk for henvendelsen',
      content: 'Hei {navn},\n\nTakk for at du tok kontakt! Vi har mottatt din henvendelse og skal se på saken.\n\nVi tar sikte på å komme tilbake til deg innen 24 timer.\n\nMed vennlig hilsen\n{agent}'
    },
    {
      id: '2',
      name: 'Behov for mer info',
      content: 'Hei {navn},\n\nTakk for henvendelsen. For å kunne hjelpe deg best mulig trenger vi litt mer informasjon:\n\n- [Spesifiser hva du trenger]\n\nMed vennlig hilsen\n{agent}'
    },
    {
      id: '3',
      name: 'Saken er løst',
      content: 'Hei {navn},\n\nVi har nå løst problemet. Kan du bekrefte at alt fungerer som det skal?\n\nGi oss gjerne beskjed hvis du har flere spørsmål.\n\nMed vennlig hilsen\n{agent}'
    }
  ];

  const activityLog = [
    {
      id: '1',
      type: 'status_change',
      message: 'Status endret fra "Åpen" til "Pågår"',
      user: 'Ola Nordmann',
      timestamp: '3 timer siden'
    },
    {
      id: '2',
      type: 'reply',
      message: 'Sendt svar til kunde',
      user: 'Ola Nordmann',
      timestamp: '3 timer siden'
    },
    {
      id: '3',
      type: 'created',
      message: 'Ticket opprettet fra e-post',
      user: 'System',
      timestamp: '1 dag siden'
    }
  ];

  const relatedTickets = [
    {
      id: '1180',
      subject: 'GA4 tracking problem',
      status: 'Closed',
      date: '2 uker siden'
    },
    {
      id: '1145',
      subject: 'Rapporteringsdata avvik',
      status: 'Closed',
      date: '1 måned siden'
    }
  ];

  const handleGoBack = () => {
    const state = location.state as { from?: string; tab?: string } | null;
    if (state?.from && state?.tab) {
      // Navigate back to customer detail with the correct tab
      navigate(state.from, { state: { activeTab: state.tab } });
    } else {
      // Default to tickets list
      navigate('/tickets');
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !ticket) return;
    const msgText = replyText;
    const ccValue = replyCC.trim() || null;
    setReplyText('');
    setReplyCC('');
    setShowCC(false);
    setAttachments([]);

    const newMsg = {
      id: String(Date.now()),
      type: 'agent' as const,
      from: 'Ola Nordmann',
      cc: ccValue,
      message: msgText,
      timestamp: 'Akkurat nå'
    };
    setConversation(prev => [...prev, newMsg]);
    setCurrentStatus('In progress');

    await supabase.from('ticket_meldinger').insert({
      ticket_id: ticket.id,
      type: 'agent',
      fra: 'Ola Nordmann',
      melding: msgText,
      cc_epost: ccValue
    });
  };

  const handleAddInternalNote = () => {
    if (!internalNote.trim()) return;

    setInternalNotes([
      {
        id: String(Date.now()),
        author: 'Ola Nordmann',
        message: internalNote,
        timestamp: 'Akkurat nå'
      },
      ...internalNotes
    ]);
    setInternalNote('');
  };

  const handleUseTemplate = (template: any) => {
    const filled = template.content
      .replace('{navn}', ticket.contact.split(' ')[0])
      .replace('{agent}', currentAssignee);
    setReplyText(filled);
    setShowTemplates(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map(file => ({
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      }));
      setAttachments([...attachments, ...newFiles]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const url = URL.createObjectURL(blob);
          setAttachments([...attachments, {
            name: `Limt inn bilde ${new Date().getTime()}.png`,
            size: blob.size,
            url
          }]);
        }
      }
    }
  };

  const handleCreateTask = () => {
    if (!newTask.title.trim() || !newTask.dueDate) {
      alert('Vennligst fyll ut tittel og forfallsdato');
      return;
    }

    // Simuler opprettelse av oppgave
    alert(`Oppgave opprettet: ${newTask.title}`);
    setShowTaskModal(false);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      assignee: 'Ola Nordmann'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Tilbake
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-slate-500 dark:text-slate-400">#{ticket.id}</span>
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(ticket.priority)}`}
              >
                {ticket.priority === 'high' ? 'Høy' : ticket.priority === 'medium' ? 'Medium' : 'Lav'}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{ticket.subject}</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
        {/* Quick Actions - Full Width */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="grid grid-cols-6 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => setCurrentStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Open">Åpen</option>
                  <option value="In progress">Pågår</option>
                  <option value="Waiting for customer">Venter på kunde</option>
                  <option value="Closed">Lukket</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Ansvarlig
                </label>
                <select
                  value={currentAssignee}
                  onChange={(e) => setCurrentAssignee(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {teamMembers.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kunde
                  {currentCustomerId && (
                    <button
                      onClick={() => navigate(`/customers/${currentCustomerId}`)}
                      className="ml-2 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Gå til kundekort
                    </button>
                  )}
                </label>
                <div className="relative">
                  <button
                    onClick={() => setShowCustomerSearch(!showCustomerSearch)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="flex-1 truncate">
                      {selectedCustomer
                        ? selectedCustomer.name
                        : supaTicket?.kunder?.bedriftsnavn
                        ? supaTicket.kunder.bedriftsnavn
                        : <span className="text-slate-400">Velg kunde...</span>}
                    </span>
                    <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                  {showCustomerSearch && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-slate-200 dark:border-slate-700">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="text"
                            value={customerSearchQuery}
                            onChange={(e) => setCustomerSearchQuery(e.target.value)}
                            placeholder="Søk etter kunde..."
                            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                        </div>
                      </div>
                      <div className="overflow-y-auto max-h-48">
                        {supaCustomers.length === 0 ? (
                          <div className="px-3 py-4 text-center text-sm text-slate-400">Laster kunder...</div>
                        ) : filteredCustomers.length > 0 ? (
                          filteredCustomers.map((customer) => {
                            const isSelected = currentCustomerId === customer.id ||
                              (!currentCustomerId && supaTicket?.kunder?.id === customer.id);
                            return (
                              <button
                                key={customer.id}
                                onClick={() => handleSelectCustomer(customer.id)}
                                className={`w-full px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2 ${
                                  isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                                }`}
                              >
                                <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className={`text-sm font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                                  {customer.name}
                                </span>
                                {isSelected && <span className="ml-auto text-xs text-blue-500">✓</span>}
                              </button>
                            );
                          })
                        ) : (
                          <div className="px-3 py-4 text-center text-sm text-slate-500 dark:text-slate-400">
                            Ingen kunder funnet for «{customerSearchQuery}»
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Kontaktperson
                </label>
                <div className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-lg flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  {ticket.contact}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Prioritet
                </label>
                <select
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={ticket.priority}
                >
                  <option value="low">Lav</option>
                  <option value="medium">Medium</option>
                  <option value="high">Høy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Handling
                </label>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Opprett oppgave
                </button>
              </div>
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="grid grid-cols-3">
          <div className="col-span-2 p-6 space-y-6 border-r border-slate-200 dark:border-slate-700">

              {/* Conversation Thread */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Samtale</h2>

                {conversation.length === 0 && (
                  <p className="text-sm text-slate-400 dark:text-slate-500 text-center py-6">Ingen meldinger ennå</p>
                )}
                {conversation.map((message, index) => {
                  // fra is always an email for customer messages.
                  // Priority: 1) ticket's linked contact (kontakt_id) → use their name + email
                  //           2) match customerContacts by email address
                  //           3) unknown → show raw email + "Legg til kontakt"
                  // fra is always an email — look up by address only.
                  // ticketContact is the linked contact for the ticket overall,
                  // but each message may come from a different person (e.g. CC participant).
                  const resolvedContact: any = message.type === 'customer'
                    ? customerContacts.find(c => c.epost === message.from)
                    : null;

                  return (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'agent' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="max-w-[75%]">
                      <div className={`flex items-center gap-2 mb-2 ${message.type === 'agent' ? 'justify-end' : 'justify-start'}`}>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            message.type === 'customer'
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                              : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          }`}
                        >
                          <User className="w-4 h-4" />
                        </div>
                        <div>
                          {message.type === 'customer' ? (
                            resolvedContact ? (
                              // Known contact — name on top, email underneath
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{resolvedContact.navn}</p>
                                <p className="text-xs text-slate-400 dark:text-slate-500">
                                  {resolvedContact.epost || message.from}
                                </p>
                              </div>
                            ) : (
                              // Unknown sender — show raw email + offer to add
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{message.from}</p>
                                {currentCustomerId && (
                                  <button
                                    onClick={() => handleOpenAddContact(message.from)}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    + Legg til som kontakt
                                  </button>
                                )}
                              </div>
                            )
                          ) : (
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{message.from}</p>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{message.timestamp}</span>
                      </div>
                      {/* CC recipients — per address with add-contact option */}
                      {message.type === 'customer' && message.cc && (
                        <div className="ml-10 mb-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">CC:</span>
                          {message.cc.split(',').map((addr: string) => {
                            const email = addr.trim();
                            if (!email) return null;
                            const known = customerContacts.find(c => c.epost === email);
                            return (
                              <span key={email} className="flex items-center gap-1 text-xs">
                                {known ? (
                                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                                    {known.navn} <span className="font-normal text-slate-400">&lt;{email}&gt;</span>
                                  </span>
                                ) : (
                                  <>
                                    <span className="text-slate-500 dark:text-slate-400">{email}</span>
                                    {currentCustomerId && (
                                      <button
                                        onClick={() => handleOpenAddContact(email)}
                                        className="text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap"
                                      >
                                        + legg til
                                      </button>
                                    )}
                                  </>
                                )}
                              </span>
                            );
                          })}
                        </div>
                      )}
                      {/* CC on agent replies */}
                      {message.type === 'agent' && message.cc && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-2 ml-10">
                          CC: {message.cc}
                        </p>
                      )}
                      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm ml-10">
                        <div className="text-slate-700 dark:text-slate-300 whitespace-pre-line">
                          {message.message}
                        </div>
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>

              {/* Reply Section */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">Send svar</h3>
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    Hurtigsvar
                  </button>
                </div>

                {showTemplates && (
                  <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Velg en mal:</p>
                    <div className="space-y-2">
                      {templates.map((template) => (
                        <button
                          key={template.id}
                          onClick={() => handleUseTemplate(template)}
                          className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded border border-slate-200 dark:border-slate-700 transition-colors"
                        >
                          {template.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-4">
                  {/* To / CC header — derived dynamically from linked contact or last message */}
                  {(() => {
                    const lastCustomer = [...conversation].reverse().find(m => m.type === 'customer');
                    const replyEmail = supaTicket?.kontakter?.epost || lastCustomer?.from || ticket.contactEmail || '';
                    const replyContact = customerContacts.find(c => c.epost === replyEmail) || supaTicket?.kontakter;
                    const replyDisplay = replyContact ? `${replyContact.navn} <${replyEmail}>` : replyEmail || '—';
                    return (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded border border-slate-200 dark:border-slate-700">
                          <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                          <span className="text-slate-500 dark:text-slate-400 shrink-0">Til:</span>
                          <span className="text-slate-900 dark:text-white font-medium flex-1 truncate">{replyDisplay}</span>
                          <button
                            onClick={() => setShowCC(v => !v)}
                            className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
                          >
                            {showCC ? 'Skjul CC' : replyCC ? `CC (${replyCC.split(',').filter(Boolean).length})` : '+ CC'}
                          </button>
                        </div>
                        {showCC && (
                          <div className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-900 px-3 py-2 rounded border border-slate-200 dark:border-slate-700">
                            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-slate-500 dark:text-slate-400 shrink-0">CC:</span>
                            <input
                              type="text"
                              value={replyCC}
                              onChange={e => setReplyCC(e.target.value)}
                              placeholder="epost@eksempel.no, epost2@eksempel.no"
                              className="flex-1 bg-transparent text-slate-900 dark:text-white outline-none text-sm"
                            />
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  <textarea
                    ref={textareaRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onPaste={handlePaste}
                    placeholder="Skriv ditt svar her... (Du kan lime inn bilder direkte)"
                    rows={8}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {/* Attachments */}
                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Vedlegg:</p>
                      <div className="flex flex-wrap gap-2">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700"
                          >
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span className="text-sm text-slate-700 dark:text-slate-300">{file.name}</span>
                            <span className="text-xs text-slate-500">({(file.size / 1024).toFixed(1)} KB)</span>
                            <button
                              onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                              className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                            >
                              <X className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-2 border border-slate-200 dark:border-slate-700"
                      >
                        <Paperclip className="w-4 h-4" />
                        Legg til fil
                      </button>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Svaret sendes via {ticket.channel}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setReplyText('');
                          setAttachments([]);
                        }}
                        className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        Avbryt
                      </button>
                      <button
                        onClick={handleSendReply}
                        disabled={!replyText.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-4 h-4" />
                        Send svar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Internal Notes */}
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5 shadow-sm">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Interne notater
                </h3>
                <div className="space-y-3 mb-4">
                  {internalNotes.map((note) => (
                    <div key={note.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{note.author}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">{note.timestamp}</span>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{note.message}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <textarea
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Legg til internt notat (kun synlig for teamet)..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button
                    onClick={handleAddInternalNote}
                    disabled={!internalNote.trim()}
                    className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Legg til notat
                  </button>
                </div>
            </div>
          </div>

          {/* Right Column - Sidebar (1/3 width) */}
          <div className="p-6 bg-white dark:bg-slate-800">
            {/* Customer Info */}
            <div className="pb-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Kundeinformasjon
              </h3>
                {(() => {
                  const displayName = selectedCustomer?.name || supaTicket?.kunder?.bedriftsnavn;
                  const displayId = currentCustomerId || supaTicket?.kunder?.id;
                  return (
                    <div className="space-y-4 text-sm">
                      {/* Company */}
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Bedrift</p>
                        {displayId ? (
                          <button
                            onClick={() => navigate(`/customers/${displayId}`)}
                            className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-left"
                          >
                            {displayName || '—'}
                          </button>
                        ) : (
                          <p className="text-slate-400 italic text-xs">Ingen kunde koblet</p>
                        )}
                      </div>
                      {/* Contacts from customer */}
                      {customerContacts.length > 0 && (
                        <div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Kontaktpersoner</p>
                          <div className="space-y-2">
                            {customerContacts.map(c => (
                              <div key={c.id} className="flex items-start gap-2">
                                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                                  {c.navn?.charAt(0) || '?'}
                                </div>
                                <div>
                                  <p className="font-medium text-slate-900 dark:text-white leading-tight">
                                    {c.navn}
                                    {c.er_primaer && <span className="ml-1 text-xs text-blue-500">(primær)</span>}
                                  </p>
                                  {c.tittel && <p className="text-xs text-slate-500 dark:text-slate-400">{c.tittel}</p>}
                                  {c.epost && <p className="text-xs text-slate-500 dark:text-slate-400">{c.epost}</p>}
                                  {c.telefon && <p className="text-xs text-slate-500 dark:text-slate-400">{c.telefon}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {!displayId && (
                        <p className="text-xs text-slate-400 italic">Velg en kunde for å se kontaktpersoner</p>
                      )}
                      {displayId && customerContacts.length === 0 && (
                        <p className="text-xs text-slate-400 italic">Ingen kontaktpersoner registrert</p>
                      )}
                    </div>
                  );
                })()}
            </div>

            {/* Activity Log — aktivitetslogg + completed oppgaver */}
            <div className="py-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Aktivitetslogg
              </h3>
              {customerActivityData.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  {currentCustomerId ? 'Ingen aktivitet logget' : 'Velg en kunde for å se aktivitet'}
                </p>
              ) : (
                <div className="space-y-3">
                  {customerActivityData.map((entry) => {
                    const icons: Record<string, { el: JSX.Element; bg: string }> = {
                      call_answered:    { el: <PhoneIncoming className="w-3.5 h-3.5 text-green-600" />, bg: 'bg-green-100 dark:bg-green-900/30' },
                      call_no_answer:   { el: <PhoneOff className="w-3.5 h-3.5 text-yellow-600" />, bg: 'bg-yellow-100 dark:bg-yellow-900/30' },
                      email:            { el: <Mail className="w-3.5 h-3.5 text-blue-600" />, bg: 'bg-blue-100 dark:bg-blue-900/30' },
                      meeting:          { el: <Video className="w-3.5 h-3.5 text-purple-600" />, bg: 'bg-purple-100 dark:bg-purple-900/30' },
                      oppgave_fullfort: { el: <CheckCircle className="w-3.5 h-3.5 text-green-600" />, bg: 'bg-green-100 dark:bg-green-900/30' },
                      notat:            { el: <MessageSquare className="w-3.5 h-3.5 text-slate-500" />, bg: 'bg-slate-100 dark:bg-slate-700' },
                    };
                    const meta = icons[entry.type] || icons.notat;
                    const labels: Record<string, string> = {
                      call_answered: 'Ringte', call_no_answer: 'Ikke svar',
                      email: 'E-post', meeting: 'Møte',
                      oppgave_fullfort: 'Oppgave fullført', notat: 'Notat',
                    };
                    const dateStr = entry.date instanceof Date
                      ? entry.date.toLocaleDateString('no-NO', { day: 'numeric', month: 'short' })
                      : '';
                    return (
                      <div key={entry.id} className="flex gap-2.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${meta.bg}`}>
                          {meta.el}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                              {labels[entry.type] || 'Aktivitet'}
                            </span>
                            {entry.title && entry.type !== 'notat' && (
                              <span className="text-xs text-slate-700 dark:text-slate-300 truncate">— {entry.title}</span>
                            )}
                          </div>
                          {entry.content && (
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">{entry.content}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-0.5">{entry.author} · {dateStr}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Related Tickets */}
            <div className="py-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Relaterte tickets
              </h3>
              {relatedTicketsData.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  {currentCustomerId ? 'Ingen andre tickets for denne kunden' : 'Velg en kunde for å se relaterte tickets'}
                </p>
              ) : (
                <div className="space-y-2">
                  {relatedTicketsData.map((related) => {
                    const statusLabel = related.status === 'apent' ? 'Åpen'
                      : related.status === 'pagar' ? 'Pågår'
                      : related.status === 'venter_pa_kunde' ? 'Venter'
                      : 'Lukket';
                    const statusClass = related.status === 'lukket'
                      ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      : related.status === 'apent'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400';
                    return (
                      <button
                        key={related.id}
                        onClick={() => navigate(`/tickets/${related.id}`)}
                        className="w-full text-left p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            {new Date(related.created_at).toLocaleDateString('no-NO', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${statusClass}`}>
                            {statusLabel}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug">{related.tittel}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="py-6">
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">
                Metadata
              </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Åpnet</p>
                    <p className="text-slate-900 dark:text-white">{ticket.openedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Siste aktivitet</p>
                    <p className="text-slate-900 dark:text-white">{ticket.lastResponse}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Kanal</p>
                    <p className="text-slate-900 dark:text-white">{ticket.channel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Opprett oppgave</h3>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Oppgavetittel <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="F.eks. Følg opp tracking-problem"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Beskrivelse
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Beskriv oppgaven i detalj..."
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Tildel til <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newTask.assignee}
                    onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {teamMembers.map((member) => (
                      <option key={member} value={member}>
                        {member}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Forfallsdato <span className="text-red-500">*</span>
                  </label>
                  <DateTimePicker
                    value={newTask.dueDate}
                    onChange={(value) => setNewTask({ ...newTask, dueDate: value })}
                  />
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  Oppgaven vil bli knyttet til kunde: {ticket.customer}
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                Avbryt
              </button>
              <button
                onClick={handleCreateTask}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <CheckSquare className="w-4 h-4" />
                Opprett oppgave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContactModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Legg til kontaktperson</h2>
              <button onClick={() => setShowAddContactModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>
            {!currentCustomerId && <p className="text-sm text-amber-600 mb-4">Koble ticketen til en kunde først.</p>}
            <div className="space-y-3">
              <input
                placeholder="Navn *"
                value={addContactForm.navn}
                onChange={e => setAddContactForm(f => ({ ...f, navn: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Tittel / rolle"
                value={addContactForm.tittel}
                onChange={e => setAddContactForm(f => ({ ...f, tittel: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="E-post"
                value={addContactForm.epost}
                onChange={e => setAddContactForm(f => ({ ...f, epost: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                placeholder="Telefon"
                value={addContactForm.telefon}
                onChange={e => setAddContactForm(f => ({ ...f, telefon: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setShowAddContactModal(false)}
                className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveNewContact}
                disabled={!addContactForm.navn || !currentCustomerId}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                Lagre kontakt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
