import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Plus,
  Filter,
  Download,
  Building2,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Mail,
  Phone,
  Edit,
  Trash2
} from 'lucide-react';

export function CustomerList() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterService, setFilterService] = useState('all');

  // TODO: Backend - Fetch customers from database
  const [customers, setCustomers] = useState([
    {
      id: '1',
      name: 'Nordic Tech AS',
      legalName: 'Nordic Tech Solutions AS',
      orgNumber: '123456789',
      status: 'Onboarding',
      healthScore: 85,
      healthStatus: 'good',
      owner: 'Ola Nordmann',
      services: ['SEO', 'Google Ads'],
      monthlyValue: 45000,
      lastContact: '2 dager siden',
      nextActivity: 'Oppstartsmøte - I morgen 10:00',
      openTasks: 3,
      openTickets: 0,
      primaryContact: {
        name: 'Maria Hansen',
        email: 'maria@nordictech.no',
        phone: '+47 123 45 678'
      }
    },
    {
      id: '2',
      name: 'Retail Solutions',
      legalName: 'Retail Solutions Norge AS',
      orgNumber: '987654321',
      status: 'Active with risk',
      healthScore: 45,
      healthStatus: 'warning',
      owner: 'Kari Jensen',
      services: ['Meta Ads', 'Google Ads'],
      monthlyValue: 65000,
      lastContact: '45 dager siden',
      nextActivity: 'Ukjent',
      openTasks: 1,
      openTickets: 2,
      primaryContact: {
        name: 'Per Olsen',
        email: 'per@retail.no',
        phone: '+47 987 65 432'
      }
    },
    {
      id: '3',
      name: 'Green Energy Norway',
      legalName: 'Green Energy Norway AS',
      orgNumber: '456789123',
      status: 'Active',
      healthScore: 92,
      healthStatus: 'good',
      owner: 'Ola Nordmann',
      services: ['SEO', 'Google Ads', 'Web'],
      monthlyValue: 120000,
      lastContact: '1 dag siden',
      nextActivity: 'Månedsrapport - Fredag 14:00',
      openTasks: 2,
      openTickets: 0,
      primaryContact: {
        name: 'Lisa Berg',
        email: 'lisa@greenenergy.no',
        phone: '+47 555 12 345'
      }
    },
    {
      id: '4',
      name: 'Media Group AS',
      legalName: 'Media Group AS',
      orgNumber: '789123456',
      status: 'Active',
      healthScore: 78,
      healthStatus: 'good',
      owner: 'Kari Jensen',
      services: ['SEO', 'Content'],
      monthlyValue: 38000,
      lastContact: '5 dager siden',
      nextActivity: 'Kvartalsgjennomgang - Neste uke',
      openTasks: 1,
      openTickets: 1,
      primaryContact: {
        name: 'Tom Andersen',
        email: 'tom@mediagroup.no',
        phone: '+47 888 99 000'
      }
    },
    {
      id: '5',
      name: 'Travel Group',
      legalName: 'Travel Group Norge AS',
      orgNumber: '321654987',
      status: 'Churn risk',
      healthScore: 35,
      healthStatus: 'danger',
      owner: 'Ola Nordmann',
      services: ['Google Ads'],
      monthlyValue: 28000,
      lastContact: '60 dager siden',
      nextActivity: 'Ingen planlagt aktivitet',
      openTasks: 0,
      openTickets: 3,
      primaryContact: {
        name: 'Sara Nilsen',
        email: 'sara@travelgroup.no',
        phone: '+47 666 77 888'
      }
    },
    {
      id: '6',
      name: 'Tech Startup AS',
      legalName: 'Tech Startup Innovation AS',
      orgNumber: '147258369',
      status: 'Active',
      healthScore: 88,
      healthStatus: 'good',
      owner: 'Kari Jensen',
      services: ['SEO', 'Google Ads', 'Tracking'],
      monthlyValue: 55000,
      lastContact: '3 dager siden',
      nextActivity: 'Strategimøte - I dag 15:00',
      openTasks: 4,
      openTickets: 0,
      primaryContact: {
        name: 'Erik Strand',
        email: 'erik@techstartup.no',
        phone: '+47 777 88 999'
      }
    }
  ]);

  const handleDeleteCustomer = (customerId: string, customerName: string) => {
    if (confirm(`Er du sikker på at du vil slette ${customerName}? Dette vil også slette alle tilhørende oppgaver, tickets og historikk.`)) {
      // TODO: Backend - Delete customer from database
      setCustomers(customers.filter(c => c.id !== customerId));
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    if (filterStatus !== 'all' && customer.status !== filterStatus) return false;
    if (filterService !== 'all' && !customer.services.includes(filterService)) return false;
    return true;
  });

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50';
      case 'danger':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-slate-600 bg-slate-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Onboarding':
        return 'bg-blue-100 text-blue-700';
      case 'Active with risk':
        return 'bg-yellow-100 text-yellow-700';
      case 'Churn risk':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kunder</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{filteredCustomers.length} kunder totalt</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Eksporter
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ny kunde
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filtre:</span>
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle statuser</option>
            <option value="Active">Aktive</option>
            <option value="Onboarding">Onboarding</option>
            <option value="Active with risk">Aktive med risiko</option>
            <option value="Churn risk">Churn-risiko</option>
          </select>
          <select
            value={filterService}
            onChange={(e) => setFilterService(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle tjenester</option>
            <option value="SEO">SEO</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Meta Ads">Meta Ads</option>
            <option value="Web">Web</option>
            <option value="Tracking">Tracking</option>
            <option value="Content">Content</option>
          </select>
          {(filterStatus !== 'all' || filterService !== 'all') && (
            <button
              onClick={() => {
                setFilterStatus('all');
                setFilterService('all');
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Nullstill filtre
            </button>
          )}
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Kunde
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Helse
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Tjenester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Ansvarlig
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Siste kontakt
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  MRR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Åpent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Handlinger
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link to={`/customers/${customer.id}`} className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{customer.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{customer.orgNumber}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        customer.status
                      )}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${getHealthColor(
                          customer.healthStatus
                        )}`}
                      >
                        {customer.healthStatus === 'good' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : customer.healthStatus === 'warning' ? (
                          <Clock className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {customer.healthScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {customer.services.map((service) => (
                        <span
                          key={service}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-900 dark:text-white">{customer.owner}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">{customer.lastContact}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      {customer.monthlyValue.toLocaleString('nb-NO')} kr
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-slate-600 dark:text-slate-400">{customer.openTasks} oppg.</span>
                      {customer.openTickets > 0 && (
                        <span className="text-orange-600">{customer.openTickets} ticket</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="Rediger kunde"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCustomer(customer.id, customer.name);
                        }}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Slett kunde"
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
      </div>
    </div>
  );
}
