import { useState } from 'react';
import { Plus, Filter, Ticket, Building2, User, Clock, AlertTriangle, CheckCircle2, XCircle, Edit, Trash2 } from 'lucide-react';

export function TicketList() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterQueue, setFilterQueue] = useState('all');
  const [filterSLA, setFilterSLA] = useState('all');

  // TODO: Backend - Fetch tickets from database
  const [tickets, setTickets] = useState([
    {
      id: '1234',
      subject: 'Spørsmål om rapportdata',
      description: 'Kunde lurer på hvorfor trafikktallene er annerledes enn i Google Analytics',
      customer: 'Nordic Tech AS',
      contact: 'Maria Hansen',
      category: 'Rapport og tall',
      priority: 'medium',
      status: 'Open',
      assignee: 'Ola Nordmann',
      opened: '1 dag siden',
      lastResponse: '3 timer siden',
      responseTime: '2t 15min',
      channel: 'E-post',
      queue: 'SEO & Analyse',
      slaResponseStatus: 'within',
      slaResponseTarget: '4t',
      slaResponseActual: '2t 15min',
      slaResolutionStatus: 'at_risk',
      slaResolutionTarget: '24t',
      slaResolutionTimeLeft: '5t 45min'
    },
    {
      id: '1235',
      subject: 'Ønsker endring i kampanjestrategi',
      description: 'Kunde ønsker å flytte mer budsjett til Shopping-kampanjer',
      customer: 'Retail Solutions',
      contact: 'Per Olsen',
      category: 'Annonser / kampanjeendring',
      priority: 'high',
      status: 'In progress',
      assignee: 'Kari Jensen',
      opened: '30 minutter siden',
      lastResponse: 'Ikke besvart',
      responseTime: '-',
      channel: 'E-post',
      queue: 'Google Ads',
      slaResponseStatus: 'breached',
      slaResponseTarget: '1t',
      slaResponseActual: '-',
      slaResolutionStatus: 'within',
      slaResolutionTarget: '8t',
      slaResolutionTimeLeft: '7t 30min'
    },
    {
      id: '1236',
      subject: 'Teknisk feil på tracking',
      description: 'Conversions registreres ikke korrekt i Google Analytics',
      customer: 'E-commerce Pro AS',
      contact: 'Nina Hansen',
      category: 'Sporing / tekniske feil',
      priority: 'high',
      status: 'Open',
      assignee: 'Ola Nordmann',
      opened: '4 timer siden',
      lastResponse: '1 time siden',
      responseTime: '45min',
      channel: 'E-post',
      queue: 'Teknisk support',
      slaResponseStatus: 'within',
      slaResponseTarget: '1t',
      slaResponseActual: '45min',
      slaResolutionStatus: 'breached',
      slaResolutionTarget: '4t',
      slaResolutionTimeLeft: 'Overskredet med 15min'
    },
    {
      id: '1237',
      subject: 'Spørsmål om faktura',
      description: 'Kunde har spørsmål om linjepost på siste faktura',
      customer: 'Travel Group',
      contact: 'Sara Nilsen',
      category: 'Faktura / avtale',
      priority: 'low',
      status: 'Waiting for customer',
      assignee: 'Kari Jensen',
      opened: '2 dager siden',
      lastResponse: '1 dag siden',
      responseTime: '4t 30min',
      channel: 'E-post',
      queue: 'Administrasjon',
      slaResponseStatus: 'within',
      slaResponseTarget: '8t',
      slaResponseActual: '4t 30min',
      slaResolutionStatus: 'paused',
      slaResolutionTarget: '48t',
      slaResolutionTimeLeft: 'Venter på kunde'
    },
    {
      id: '1238',
      subject: 'Ønske om månedlig statusmøte',
      description: 'Kunde ønsker å etablere fast månedlig statusmøte',
      customer: 'Green Energy Norway',
      contact: 'Lisa Berg',
      category: 'Rådgivning / strategi',
      priority: 'medium',
      status: 'Resolved',
      assignee: 'Ola Nordmann',
      opened: '5 dager siden',
      lastResponse: '3 dager siden',
      responseTime: '1t 20min',
      channel: 'Telefon',
      queue: 'Kundesuksess',
      slaResponseStatus: 'within',
      slaResponseTarget: '4t',
      slaResponseActual: '1t 20min',
      slaResolutionStatus: 'within',
      slaResolutionTarget: '48t',
      slaResolutionTimeLeft: 'Løst'
    },
    {
      id: '1239',
      subject: 'Tilgang til Google Ads-konto',
      description: 'Ny markedssjef trenger tilgang til annonsekontoen',
      customer: 'Tech Startup AS',
      contact: 'Erik Strand',
      category: 'Tilgang / brukerrettigheter',
      priority: 'medium',
      status: 'In progress',
      assignee: 'Kari Jensen',
      opened: '6 timer siden',
      lastResponse: '2 timer siden',
      responseTime: '1t 10min',
      channel: 'E-post',
      queue: 'Administrasjon',
      slaResponseStatus: 'within',
      slaResponseTarget: '4t',
      slaResponseActual: '1t 10min',
      slaResolutionStatus: 'within',
      slaResolutionTarget: '8t',
      slaResolutionTimeLeft: '2t 50min'
    },
    {
      id: '1240',
      subject: 'SEO-spørsmål om keywords',
      description: 'Kunde lurer på hvorfor et spesifikt søkeord har falt i ranking',
      customer: 'Media Group AS',
      contact: 'Tom Andersen',
      category: 'SEO-spørsmål',
      priority: 'low',
      status: 'Open',
      assignee: 'Ola Nordmann',
      opened: '1 dag siden',
      lastResponse: 'Ikke besvart',
      responseTime: '-',
      channel: 'E-post',
      queue: 'SEO & Analyse',
      slaResponseStatus: 'breached',
      slaResponseTarget: '8t',
      slaResponseActual: '-',
      slaResolutionStatus: 'at_risk',
      slaResolutionTarget: '48t',
      slaResolutionTimeLeft: '23t'
    }
  ]);

  const handleDeleteTicket = (ticketId: string, ticketSubject: string) => {
    if (confirm(`Er du sikker på at du vil slette ticket "${ticketSubject}"?`)) {
      // TODO: Backend - Delete ticket from database
      setTickets(tickets.filter(t => t.id !== ticketId));
    }
  };

  const filteredTickets = tickets.filter((ticket) => {
    if (filterStatus !== 'all' && ticket.status !== filterStatus) return false;
    if (filterCategory !== 'all' && ticket.category !== filterCategory) return false;
    if (filterQueue !== 'all' && ticket.queue !== filterQueue) return false;
    if (filterSLA === 'breached' && ticket.slaResponseStatus !== 'breached' && ticket.slaResolutionStatus !== 'breached') return false;
    if (filterSLA === 'at_risk' && ticket.slaResolutionStatus !== 'at_risk') return false;
    return true;
  });

  const openTickets = tickets.filter((t) => t.status === 'Open' || t.status === 'In progress');
  const highPriorityTickets = tickets.filter((t) => t.priority === 'high');
  const unansweredTickets = tickets.filter((t) => t.lastResponse === 'Ikke besvart');
  const slaBreachedTickets = tickets.filter((t) => t.slaResponseStatus === 'breached' || t.slaResolutionStatus === 'breached');

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
      case 'Resolved':
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getSLAStatusColor = (status: string) => {
    switch (status) {
      case 'within':
        return 'text-green-600';
      case 'at_risk':
        return 'text-yellow-600';
      case 'breached':
        return 'text-red-600';
      case 'paused':
        return 'text-slate-500 dark:text-slate-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getSLAStatusIcon = (status: string) => {
    switch (status) {
      case 'within':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'at_risk':
        return <AlertTriangle className="w-4 h-4" />;
      case 'breached':
        return <XCircle className="w-4 h-4" />;
      case 'paused':
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tickets</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{filteredTickets.length} tickets</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Ny ticket
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <Ticket className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Åpne tickets</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{openTickets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Høy prioritet</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{highPriorityTickets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Ubesvarte</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{unansweredTickets.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">SLA brudd</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{slaBreachedTickets.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filtre:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle statuser</option>
            <option value="Open">Åpne</option>
            <option value="In progress">Pågår</option>
            <option value="Waiting for customer">Venter på kunde</option>
            <option value="Resolved">Løst</option>
          </select>
          <select
            value={filterQueue}
            onChange={(e) => setFilterQueue(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle køer</option>
            <option value="SEO & Analyse">SEO & Analyse</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Teknisk support">Teknisk support</option>
            <option value="Kundesuksess">Kundesuksess</option>
            <option value="Administrasjon">Administrasjon</option>
          </select>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle kategorier</option>
            <option value="Rapport og tall">Rapport og tall</option>
            <option value="Annonser / kampanjeendring">Annonser / kampanjeendring</option>
            <option value="Sporing / tekniske feil">Sporing / tekniske feil</option>
            <option value="SEO-spørsmål">SEO-spørsmål</option>
            <option value="Faktura / avtale">Faktura / avtale</option>
            <option value="Tilgang / brukerrettigheter">Tilgang / brukerrettigheter</option>
            <option value="Rådgivning / strategi">Rådgivning / strategi</option>
          </select>
          <select
            value={filterSLA}
            onChange={(e) => setFilterSLA(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle SLA-statuser</option>
            <option value="breached">SLA brudd</option>
            <option value="at_risk">I risikosone</option>
          </select>
          {(filterStatus !== 'all' || filterCategory !== 'all' || filterQueue !== 'all' || filterSLA !== 'all') && (
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterCategory('all');
                setFilterQueue('all');
                setFilterSLA('all');
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
            >
              Nullstill filtre
            </button>
          )}
        </div>
      </div>

      {/* Ticket List */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {filteredTickets.map((ticket) => (
            <div key={ticket.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-500 dark:text-slate-400">#{ticket.id}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority === 'high'
                          ? 'Høy'
                          : ticket.priority === 'medium'
                          ? 'Medium'
                          : 'Lav'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(ticket.status)}`}
                      >
                        {ticket.status}
                      </span>
                      {ticket.lastResponse === 'Ikke besvart' && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          Ikke besvart
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mt-2">{ticket.subject}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{ticket.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Navigate to ticket detail/edit page
                      console.log(`Edit ticket ${ticket.id}`);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                    title="Rediger ticket"
                  >
                    <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTicket(ticket.id, ticket.subject);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                    title="Slett ticket"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </div>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kunde</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-slate-900 dark:text-white">{ticket.customer}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kontakt</p>
                    <p className="text-slate-900 dark:text-white mt-1">{ticket.contact}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kø</p>
                    <p className="text-slate-900 dark:text-white mt-1 text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 rounded inline-block">
                      {ticket.queue}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Kategori</p>
                    <p className="text-slate-900 dark:text-white mt-1">{ticket.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ansvarlig</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <p className="text-slate-900 dark:text-white">{ticket.assignee}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Åpnet</p>
                    <p className="text-slate-900 dark:text-white mt-1">{ticket.opened}</p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">SLA Responstid</p>
                      <div className={`flex items-center gap-2 ${getSLAStatusColor(ticket.slaResponseStatus)}`}>
                        {getSLAStatusIcon(ticket.slaResponseStatus)}
                        <span className="text-xs">
                          Mål: {ticket.slaResponseTarget} | Faktisk: {ticket.slaResponseActual}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">SLA Løsningstid</p>
                      <div className={`flex items-center gap-2 ${getSLAStatusColor(ticket.slaResolutionStatus)}`}>
                        {getSLAStatusIcon(ticket.slaResolutionStatus)}
                        <span className="text-xs">
                          Mål: {ticket.slaResolutionTarget} | {ticket.slaResolutionTimeLeft}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
