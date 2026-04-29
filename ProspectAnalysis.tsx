import { useState } from 'react';
import {
  Plug,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Settings,
  RefreshCw,
  Eye,
  BarChart,
  Database,
  Calendar,
  Mail,
  DollarSign,
  FileText,
  Search,
  TrendingUp
} from 'lucide-react';

export function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const integrations = [
    {
      id: 'tripletex',
      name: 'Tripletex',
      category: 'Økonomi',
      description: 'Fakturering, betalingsstatus og økonomisk data',
      status: 'connected',
      icon: DollarSign,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50 dark:bg-green-900/30',
      lastSync: '5 minutter siden',
      syncFrequency: 'Hver time',
      dataPoints: {
        invoices: 142,
        customers: 47,
        outstanding: 3
      },
      health: 'healthy',
      errors: 0,
      warnings: 0,
      credentials: { apiKey: '****-****-****-****', organizationId: '123456' },
      permissions: ['read_invoices', 'read_customers', 'read_payments']
    },
    {
      id: 'dealbuilder',
      name: 'DealBuilder',
      category: 'Salg',
      description: 'Tilbud, avtaler og signeringsstatus',
      status: 'connected',
      icon: FileText,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      lastSync: '2 timer siden',
      syncFrequency: 'Hver 4. time',
      dataPoints: {
        deals: 28,
        signed: 23,
        pending: 5
      },
      health: 'healthy',
      errors: 0,
      warnings: 1,
      credentials: { apiKey: '****-****-****-****' },
      permissions: ['read_deals', 'read_templates']
    },
    {
      id: 'google_calendar',
      name: 'Google Calendar',
      category: 'Produktivitet',
      description: 'Møter og kalenderhendelser',
      status: 'connected',
      icon: Calendar,
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-50 dark:bg-orange-900/30',
      lastSync: '10 minutter siden',
      syncFrequency: 'Hver 15. minutt',
      dataPoints: {
        events: 156,
        upcoming: 12,
        today: 3
      },
      health: 'healthy',
      errors: 0,
      warnings: 0,
      credentials: { email: 'crm@adseo.no' },
      permissions: ['read_events', 'create_events']
    },
    {
      id: 'gmail',
      name: 'Gmail',
      category: 'Kommunikasjon',
      description: 'E-postkommunikasjon og ticket-håndtering',
      status: 'connected',
      icon: Mail,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50 dark:bg-red-900/30',
      lastSync: '3 minutter siden',
      syncFrequency: 'Hver 5. minutt',
      dataPoints: {
        emails: 1247,
        unread: 8,
        tickets: 18
      },
      health: 'warning',
      errors: 0,
      warnings: 2,
      credentials: { email: 'support@adseo.no' },
      permissions: ['read_emails', 'send_emails']
    },
    {
      id: 'timely',
      name: 'Timely',
      category: 'Timeregistrering',
      description: 'Timer og timegrunnlag per kunde',
      status: 'connected',
      icon: Clock,
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-50 dark:bg-purple-900/30',
      lastSync: '1 time siden',
      syncFrequency: 'Daglig kl. 08:00',
      dataPoints: {
        entries: 523,
        thisMonth: 187,
        billable: 165
      },
      health: 'healthy',
      errors: 0,
      warnings: 0,
      credentials: { apiKey: '****-****-****-****', accountId: 'adseo' },
      permissions: ['read_time_entries', 'read_projects']
    },
    {
      id: 'google_analytics',
      name: 'Google Analytics 4',
      category: 'Analyse',
      description: 'Nettstedstrafikk og konverteringsdata',
      status: 'partial',
      icon: BarChart,
      iconColor: 'text-yellow-600',
      iconBg: 'bg-yellow-50 dark:bg-yellow-900/30',
      lastSync: '30 minutter siden',
      syncFrequency: 'Hver time',
      dataPoints: {
        properties: 42,
        connected: 38,
        errors: 4
      },
      health: 'warning',
      errors: 4,
      warnings: 0,
      credentials: { serviceAccountEmail: 'crm-analytics@adseo.iam.gserviceaccount.com' },
      permissions: ['read_analytics', 'read_conversions']
    },
    {
      id: 'google_search_console',
      name: 'Google Search Console',
      category: 'SEO',
      description: 'Søkeytelse og SEO-data',
      status: 'connected',
      icon: Search,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      lastSync: '45 minutter siden',
      syncFrequency: 'Daglig kl. 06:00',
      dataPoints: {
        properties: 38,
        queries: 15234,
        clicks: 8942
      },
      health: 'healthy',
      errors: 0,
      warnings: 0,
      credentials: { serviceAccountEmail: 'crm-seo@adseo.iam.gserviceaccount.com' },
      permissions: ['read_search_data']
    },
    {
      id: 'google_ads',
      name: 'Google Ads',
      category: 'Annonsering',
      description: 'Kampanjedata og annonseytelse',
      status: 'error',
      icon: TrendingUp,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-50 dark:bg-red-900/30',
      lastSync: 'Feilet for 2 timer siden',
      syncFrequency: 'Hver 2. time',
      dataPoints: {
        accounts: 35,
        campaigns: 142,
        errors: 12
      },
      health: 'error',
      errors: 12,
      warnings: 0,
      credentials: { managerId: '123-456-7890', developerToken: '****-****-****' },
      permissions: ['read_campaigns', 'read_performance']
    },
    {
      id: 'meta_ads',
      name: 'Meta Ads',
      category: 'Annonsering',
      description: 'Facebook og Instagram annonsedata',
      status: 'disconnected',
      icon: TrendingUp,
      iconColor: 'text-slate-600 dark:text-slate-400',
      iconBg: 'bg-slate-50 dark:bg-slate-700',
      lastSync: 'Aldri synkronisert',
      syncFrequency: 'Ikke konfigurert',
      dataPoints: {
        accounts: 0,
        campaigns: 0,
        errors: 0
      },
      health: 'disconnected',
      errors: 0,
      warnings: 0,
      credentials: {},
      permissions: []
    },
    {
      id: 'google_drive',
      name: 'Google Drive',
      category: 'Dokumenter',
      description: 'Filer og dokumenthåndtering',
      status: 'connected',
      icon: Database,
      iconColor: 'text-green-600',
      iconBg: 'bg-green-50 dark:bg-green-900/30',
      lastSync: '1 time siden',
      syncFrequency: 'Hver 6. time',
      dataPoints: {
        files: 342,
        folders: 47,
        shared: 89
      },
      health: 'healthy',
      errors: 0,
      warnings: 0,
      credentials: { serviceAccountEmail: 'crm-drive@adseo.iam.gserviceaccount.com' },
      permissions: ['read_files', 'create_files']
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Tilkoblet
          </span>
        );
      case 'partial':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            <AlertTriangle className="w-4 h-4" />
            Delvis
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Feil
          </span>
        );
      case 'disconnected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            Ikke tilkoblet
          </span>
        );
      default:
        return null;
    }
  };

  const connectedCount = integrations.filter((i) => i.status === 'connected').length;
  const errorCount = integrations.filter((i) => i.status === 'error').length;
  const warningCount = integrations.filter((i) => i.health === 'warning').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Integrasjoner</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {connectedCount} av {integrations.length} integrasjoner er aktive
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
          <Plug className="w-4 h-4" />
          Legg til integrasjon
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Tilkoblede</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{connectedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Med feil</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{errorCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Med advarsler</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{warningCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Synk siste time</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">47</p>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-2 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <div
              key={integration.id}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedIntegration(integration.id)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${integration.iconBg} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${integration.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{integration.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{integration.category}</p>
                  </div>
                </div>
                {getStatusBadge(integration.status)}
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{integration.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-4">
                {Object.entries(integration.dataPoints).map(([key, value]) => (
                  <div key={key} className="text-center p-2 bg-slate-50 dark:bg-slate-700 rounded">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{key}</p>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Siste synkronisering:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{integration.lastSync}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Synkroniseringsfrekvens:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{integration.syncFrequency}</span>
                </div>
                {integration.errors > 0 && (
                  <div className="flex items-center gap-2 text-sm text-red-600 mt-2">
                    <XCircle className="w-4 h-4" />
                    <span>{integration.errors} feil</span>
                  </div>
                )}
                {integration.warnings > 0 && (
                  <div className="flex items-center gap-2 text-sm text-yellow-600 mt-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{integration.warnings} advarsler</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4">
                {integration.status !== 'disconnected' && (
                  <>
                    <button className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Synkroniser nå
                    </button>
                    <button className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-sm flex items-center justify-center gap-2">
                      <Settings className="w-4 h-4" />
                      Innstillinger
                    </button>
                  </>
                )}
                {integration.status === 'disconnected' && (
                  <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center justify-center gap-2">
                    <Plug className="w-4 h-4" />
                    Koble til
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Details Modal (simplified) */}
      {selectedIntegration && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedIntegration(null)}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {(() => {
              const integration = integrations.find((i) => i.id === selectedIntegration);
              if (!integration) return null;
              const Icon = integration.icon;

              return (
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-lg ${integration.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 ${integration.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{integration.name}</h2>
                      <p className="text-slate-600 dark:text-slate-400 mt-1">{integration.description}</p>
                      <div className="mt-2">{getStatusBadge(integration.status)}</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Synkroniseringsstatus</h3>
                      <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Siste synkronisering:</span>
                          <span className="font-medium">{integration.lastSync}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Frekvens:</span>
                          <span className="font-medium">{integration.syncFrequency}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Helse:</span>
                          <span className="font-medium capitalize">{integration.health}</span>
                        </div>
                      </div>
                    </div>

                    {integration.permissions.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Tilganger</h3>
                        <div className="flex flex-wrap gap-2">
                          {integration.permissions.map((permission) => (
                            <span
                              key={permission}
                              className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 rounded text-xs font-medium"
                            >
                              {permission}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-4">
                      <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Åpne innstillinger
                      </button>
                      <button
                        onClick={() => setSelectedIntegration(null)}
                        className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                      >
                        Lukk
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
