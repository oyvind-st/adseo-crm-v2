import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Ticket,
  BarChart,
  Building2,
  ArrowRight
} from 'lucide-react';

export function CustomerHealth() {
  const [filterHealth, setFilterHealth] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  const customers = [
    {
      id: '1',
      name: 'Green Energy Norway',
      healthScore: 92,
      healthStatus: 'excellent',
      trend: 'up',
      trendChange: '+5',
      riskLevel: 'low',
      signals: {
        positive: ['Sterke resultater siste 3 måneder', 'Aktiv kommunikasjon', 'Betalinger i tide', 'Høy engasjement i rapporter'],
        negative: [],
        upsell: ['Interesse for Meta Ads nevnt i siste møte', 'Potensial for Content-tjenester']
      },
      metrics: {
        nps: 9,
        lastContact: '1 dag siden',
        responseTime: '2.5 timer',
        openTickets: 0,
        overdueInvoices: 0,
        kpiTrend: 'positive',
        utilizationRate: 95
      },
      owner: 'Ola Nordmann',
      mrr: 120000,
      ltv: 1440000
    },
    {
      id: '2',
      name: 'E-commerce Pro AS',
      healthScore: 88,
      healthStatus: 'good',
      trend: 'up',
      trendChange: '+3',
      riskLevel: 'low',
      signals: {
        positive: ['God KPI-utvikling', 'Regelmessig kommunikasjon', 'Onboarding fullført på tid'],
        negative: ['Mindre aktivitet siste 2 uker'],
        upsell: ['Spør ofte om SEO - potensial for upsell']
      },
      metrics: {
        nps: 8,
        lastContact: '3 dager siden',
        responseTime: '1.5 timer',
        openTickets: 0,
        overdueInvoices: 0,
        kpiTrend: 'positive',
        utilizationRate: 88
      },
      owner: 'Ola Nordmann',
      mrr: 95000,
      ltv: 1140000
    },
    {
      id: '3',
      name: 'Tech Startup AS',
      healthScore: 75,
      healthStatus: 'good',
      trend: 'stable',
      trendChange: '0',
      riskLevel: 'medium',
      signals: {
        positive: ['God samarbeidsvilje', 'Raskt på tilbakemeldinger'],
        negative: ['Budsjettpress nevnt', 'Spør om redusert scope'],
        upsell: []
      },
      metrics: {
        nps: 7,
        lastContact: '5 dager siden',
        responseTime: '3.5 timer',
        openTickets: 2,
        overdueInvoices: 0,
        kpiTrend: 'neutral',
        utilizationRate: 72
      },
      owner: 'Kari Jensen',
      mrr: 55000,
      ltv: 660000
    },
    {
      id: '4',
      name: 'Nordic Tech AS',
      healthScore: 68,
      healthStatus: 'fair',
      trend: 'down',
      trendChange: '-8',
      riskLevel: 'medium',
      signals: {
        positive: ['Ny kunde med potensial'],
        negative: ['Forventningsavklaring trengs', 'Litt usikkerhet på onboarding'],
        upsell: []
      },
      metrics: {
        nps: 6,
        lastContact: '2 dager siden',
        responseTime: '4 timer',
        openTickets: 1,
        overdueInvoices: 0,
        kpiTrend: 'neutral',
        utilizationRate: 65
      },
      owner: 'Ola Nordmann',
      mrr: 45000,
      ltv: 180000
    },
    {
      id: '5',
      name: 'Retail Solutions',
      healthScore: 45,
      healthStatus: 'at_risk',
      trend: 'down',
      trendChange: '-15',
      riskLevel: 'high',
      signals: {
        positive: [],
        negative: [
          'Ingen kontakt siste 45 dager',
          'Ikke åpnet siste 3 rapporter',
          'KPI-resultater under baseline',
          '2 åpne tickets ubesvart',
          'Lavt engasjement'
        ],
        upsell: []
      },
      metrics: {
        nps: 4,
        lastContact: '45 dager siden',
        responseTime: '6 timer',
        openTickets: 2,
        overdueInvoices: 0,
        kpiTrend: 'negative',
        utilizationRate: 45
      },
      owner: 'Kari Jensen',
      mrr: 65000,
      ltv: 520000
    },
    {
      id: '6',
      name: 'Travel Group',
      healthScore: 35,
      healthStatus: 'critical',
      trend: 'down',
      trendChange: '-20',
      riskLevel: 'critical',
      signals: {
        positive: [],
        negative: [
          'Ingen kontakt siste 60 dager',
          'Misnøye uttrykt i siste møte',
          'Resultater betydelig under forventet',
          '3 åpne tickets med høy prioritet',
          'Ikke respondert på oppfølging',
          'Nevnt konkurrenter'
        ],
        upsell: []
      },
      metrics: {
        nps: 2,
        lastContact: '60 dager siden',
        responseTime: '12 timer',
        openTickets: 3,
        overdueInvoices: 0,
        kpiTrend: 'negative',
        utilizationRate: 28
      },
      owner: 'Ola Nordmann',
      mrr: 28000,
      ltv: 336000
    }
  ];

  const filteredCustomers = customers.filter((customer) => {
    if (filterHealth !== 'all' && customer.healthStatus !== filterHealth) return false;
    if (filterRisk !== 'all' && customer.riskLevel !== filterRisk) return false;
    return true;
  });

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-green-600 bg-green-50 dark:bg-green-900/30 border-green-200';
      case 'good':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-200';
      case 'fair':
        return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200';
      case 'at_risk':
        return 'text-orange-600 bg-orange-50 dark:bg-orange-900/30 border-orange-200';
      case 'critical':
        return 'text-red-600 bg-red-50 dark:bg-red-900/30 border-red-200';
      default:
        return 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-700';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">Lav risiko</span>;
      case 'medium':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Medium risiko</span>;
      case 'high':
        return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">Høy risiko</span>;
      case 'critical':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">Kritisk risiko</span>;
      default:
        return null;
    }
  };

  const excellentCount = customers.filter((c) => c.healthStatus === 'excellent').length;
  const atRiskCount = customers.filter((c) => c.healthStatus === 'at_risk' || c.healthStatus === 'critical').length;
  const upsellCount = customers.filter((c) => c.signals.upsell.length > 0).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Kundehelse</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{filteredCustomers.length} kunder med helse-scoring</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Utmerket helse</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{excellentCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">I risiko</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{atRiskCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Mersalgsmuligheter</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{upsellCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <BarChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">Gj.snitt score</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {Math.round(customers.reduce((sum, c) => sum + c.healthScore, 0) / customers.length)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4">
          <span className="font-medium text-slate-700 dark:text-slate-300">Filtre:</span>
          <select
            value={filterHealth}
            onChange={(e) => setFilterHealth(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle helse-nivåer</option>
            <option value="excellent">Utmerket</option>
            <option value="good">God</option>
            <option value="fair">OK</option>
            <option value="at_risk">I risiko</option>
            <option value="critical">Kritisk</option>
          </select>
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Alle risikonivåer</option>
            <option value="low">Lav risiko</option>
            <option value="medium">Medium risiko</option>
            <option value="high">Høy risiko</option>
            <option value="critical">Kritisk risiko</option>
          </select>
          {(filterHealth !== 'all' || filterRisk !== 'all') && (
            <button
              onClick={() => {
                setFilterHealth('all');
                setFilterRisk('all');
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700"
            >
              Nullstill filtre
            </button>
          )}
        </div>
      </div>

      {/* Customer Health Cards */}
      <div className="space-y-4">
        {filteredCustomers.map((customer) => (
          <div key={customer.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link to={`/customers/${customer.id}`} className="text-lg font-semibold text-slate-900 dark:text-white hover:text-blue-600 dark:text-blue-400">
                      {customer.name}
                    </Link>
                    {getRiskBadge(customer.riskLevel)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {customer.owner}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      MRR: {customer.mrr.toLocaleString('nb-NO')} kr
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Siste kontakt: {customer.metrics.lastContact}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Helse-score</p>
                  <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center ${getHealthColor(customer.healthStatus)}`}>
                    <span className="text-2xl font-bold">{customer.healthScore}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {customer.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4 text-green-600" />
                    ) : customer.trend === 'down' ? (
                      <TrendingDown className="w-4 h-4 text-red-600" />
                    ) : (
                      <Activity className="w-4 h-4 text-slate-400" />
                    )}
                    <span className={`text-sm font-medium ${customer.trend === 'up' ? 'text-green-600' : customer.trend === 'down' ? 'text-red-600' : 'text-slate-600 dark:text-slate-400'}`}>
                      {customer.trendChange !== '0' && (customer.trend === 'up' ? '+' : '')}{customer.trendChange}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-6 gap-3 mb-4">
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">NPS</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{customer.metrics.nps}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">Responstid</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{customer.metrics.responseTime}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">Åpne tickets</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{customer.metrics.openTickets}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">Forfalt</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{customer.metrics.overdueInvoices}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">KPI-trend</p>
                <div className="flex items-center justify-center mt-1">
                  {customer.metrics.kpiTrend === 'positive' ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : customer.metrics.kpiTrend === 'negative' ? (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  ) : (
                    <Activity className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-400">Utnyttelse</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{customer.metrics.utilizationRate}%</p>
              </div>
            </div>

            {/* Signals */}
            <div className="grid grid-cols-3 gap-4">
              {customer.signals.positive.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-green-700 mb-2 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4" />
                    Positive signaler ({customer.signals.positive.length})
                  </h4>
                  <ul className="space-y-1">
                    {customer.signals.positive.map((signal, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {customer.signals.negative.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    Risikosignaler ({customer.signals.negative.length})
                  </h4>
                  <ul className="space-y-1">
                    {customer.signals.negative.map((signal, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                        <span className="text-red-600 mt-0.5">•</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {customer.signals.upsell.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-purple-700 mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4" />
                    Mersalgsmuligheter ({customer.signals.upsell.length})
                  </h4>
                  <ul className="space-y-1">
                    {customer.signals.upsell.map((signal, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                        <span className="text-purple-600 mt-0.5">•</span>
                        <span>{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
              <Link
                to={`/customers/${customer.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
              >
                Åpne kundekort
                <ArrowRight className="w-4 h-4" />
              </Link>
              {customer.riskLevel === 'high' || customer.riskLevel === 'critical' ? (
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Opprett redningstiltak
                </button>
              ) : null}
              {customer.signals.upsell.length > 0 && (
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Lag mersalgstilbud
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
