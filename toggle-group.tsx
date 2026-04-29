import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Building2,
  UserPlus,
  Ticket,
  Clock,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  MousePointerClick,
  Eye,
  Target
} from 'lucide-react';

export function Reports() {
  const [timeframe, setTimeframe] = useState('month');
  const [reportType, setReportType] = useState('overview');

  const stats = {
    customers: {
      total: 47,
      new: 3,
      churn: 1,
      active: 43,
      onboarding: 4
    },
    revenue: {
      mrr: 2140000,
      arr: 25680000,
      growth: 12.5,
      avgCustomerValue: 45532
    },
    pipeline: {
      total: 625000,
      weighted: 387500,
      leads: 12,
      conversionRate: 32
    },
    operations: {
      openTasks: 18,
      completedTasks: 127,
      openTickets: 7,
      avgResponseTime: '2.5h'
    }
  };

  const customersByService = [
    { service: 'SEO', count: 28, revenue: 720000 },
    { service: 'Google Ads', count: 35, revenue: 980000 },
    { service: 'Meta Ads', count: 18, revenue: 385000 },
    { service: 'Web', count: 12, revenue: 420000 },
    { service: 'Tracking', count: 15, revenue: 180000 },
    { service: 'Content', count: 8, revenue: 145000 }
  ];

  const topCustomers = [
    { name: 'Green Energy Norway', mrr: 120000, services: ['SEO', 'Google Ads', 'Web'], health: 92 },
    { name: 'E-commerce Pro AS', mrr: 95000, services: ['SEO', 'Google Ads'], health: 88 },
    { name: 'Retail Solutions', mrr: 65000, services: ['Meta Ads', 'Google Ads'], health: 45 },
    { name: 'Tech Startup AS', mrr: 55000, services: ['SEO', 'Google Ads', 'Tracking'], health: 88 },
    { name: 'Nordic Tech AS', mrr: 45000, services: ['SEO', 'Google Ads'], health: 85 }
  ];

  const salesFunnel = [
    { stage: 'Leads', count: 47, value: 2800000 },
    { stage: 'Qualified', count: 28, value: 1950000 },
    { stage: 'Proposal sent', count: 15, value: 1250000 },
    { stage: 'Negotiation', count: 8, value: 780000 },
    { stage: 'Won', count: 3, value: 420000 }
  ];

  const teamPerformance = [
    { name: 'Ola Nordmann', customers: 18, mrr: 785000, tasks: 42, tickets: 8, satisfaction: 4.7 },
    { name: 'Kari Jensen', customers: 22, mrr: 965000, tasks: 58, tickets: 12, satisfaction: 4.8 },
    { name: 'Team Oslo (totalt)', customers: 47, mrr: 2140000, tasks: 127, tickets: 18, satisfaction: 4.75 }
  ];

  const trendData = {
    mrr: [
      { month: 'Okt', value: 1850000, growth: 8.2 },
      { month: 'Nov', value: 1920000, growth: 3.8 },
      { month: 'Des', value: 2020000, growth: 5.2 },
      { month: 'Jan', value: 2080000, growth: 3.0 },
      { month: 'Feb', value: 2140000, growth: 2.9 }
    ],
    customers: [
      { month: 'Okt', active: 39, new: 2, churn: 0 },
      { month: 'Nov', active: 40, new: 3, churn: 2 },
      { month: 'Des', active: 42, new: 4, churn: 2 },
      { month: 'Jan', active: 44, new: 3, churn: 1 },
      { month: 'Feb', active: 43, new: 3, churn: 1 }
    ],
    tickets: [
      { month: 'Okt', open: 12, resolved: 35, avgTime: '3.2h' },
      { month: 'Nov', open: 9, resolved: 42, avgTime: '2.8h' },
      { month: 'Des', open: 15, resolved: 38, avgTime: '3.5h' },
      { month: 'Jan', open: 8, resolved: 45, avgTime: '2.3h' },
      { month: 'Feb', open: 7, resolved: 48, avgTime: '2.5h' }
    ]
  };

  const integrationMetrics = {
    ga4: {
      totalSessions: 1847235,
      totalUsers: 642891,
      avgSessionDuration: '3m 42s',
      bounceRate: 42.3,
      conversionRate: 3.8,
      trend: { sessions: 12.5, users: 8.3, conversions: 15.2 },
      topChannels: [
        { name: 'Organic Search', sessions: 782450, conversions: 4.2 },
        { name: 'Direct', sessions: 425680, conversions: 5.1 },
        { name: 'Paid Search', sessions: 385920, conversions: 3.1 },
        { name: 'Social', sessions: 253185, conversions: 2.4 }
      ]
    },
    googleAds: {
      totalSpend: 1245680,
      totalClicks: 45892,
      totalImpressions: 3847921,
      avgCPC: 27.15,
      ctr: 1.19,
      conversionRate: 4.3,
      conversions: 1973,
      costPerConversion: 631.45,
      trend: { spend: 8.2, conversions: 12.4, cpc: -3.5 },
      topCampaigns: [
        { name: 'Brand - Exact Match', spend: 285420, conversions: 542, roas: 8.4 },
        { name: 'Shopping - Best Sellers', spend: 425680, conversions: 687, roas: 6.2 },
        { name: 'Generic - High Intent', spend: 312450, conversions: 421, roas: 5.1 },
        { name: 'Remarketing - Cart Abandon', spend: 222130, conversions: 323, roas: 7.8 }
      ]
    },
    metaAds: {
      totalSpend: 685420,
      reach: 2847921,
      impressions: 8234591,
      clicks: 32845,
      ctr: 0.4,
      cpc: 20.87,
      conversions: 1124,
      costPerConversion: 609.98,
      trend: { spend: 5.8, conversions: 9.2, reach: 15.3 },
      topCampaigns: [
        { name: 'Prospecting - Interests', spend: 245680, conversions: 389, roas: 5.2 },
        { name: 'Retargeting - Website Visitors', spend: 185420, conversions: 324, roas: 7.1 },
        { name: 'Lookalike - Purchase', spend: 154320, conversions: 267, roas: 6.4 },
        { name: 'Video - Brand Awareness', spend: 100000, conversions: 144, roas: 3.8 }
      ]
    },
    gsc: {
      totalClicks: 284592,
      totalImpressions: 4892341,
      avgPosition: 8.4,
      ctr: 5.82,
      trend: { clicks: 18.5, impressions: 12.3, position: -1.2 },
      topQueries: [
        { query: 'digital markedsføring oslo', clicks: 12450, impressions: 98420, position: 2.3, ctr: 12.6 },
        { query: 'seo byrå', clicks: 8920, impressions: 142850, position: 4.8, ctr: 6.2 },
        { query: 'google ads byrå', clicks: 7845, impressions: 125420, position: 5.2, ctr: 6.3 },
        { query: 'facebook annonsering', clicks: 6234, impressions: 108920, position: 6.8, ctr: 5.7 }
      ]
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Rapporter</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Ledelsesrapporter og nøkkeltall</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Siste uke</option>
            <option value="month">Siste måned</option>
            <option value="quarter">Siste kvartal</option>
            <option value="year">Siste år</option>
          </select>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="overview">Oversikt</option>
            <option value="sales">Salg</option>
            <option value="customers">Kunder</option>
            <option value="operations">Operativt</option>
            <option value="integrations">Integrasjoner & KPI</option>
            <option value="team">Team</option>
          </select>
        </div>
      </div>

      {reportType === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Aktive kunder</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.customers.active}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+7%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Nye: {stats.customers.new}</span>
                  <span>Churn: {stats.customers.churn}</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">MRR</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                      {(stats.revenue.mrr / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+{stats.revenue.growth}%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>ARR:</span>
                  <span className="font-medium">{(stats.revenue.arr / 1000000).toFixed(1)}M kr</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                    <UserPlus className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pipeline</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
                      {(stats.pipeline.total / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">+15%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>{stats.pipeline.leads} aktive leads</span>
                  <span>{stats.pipeline.conversionRate}% conv.</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-orange-50 dark:bg-orange-900/30 flex items-center justify-center">
                    <Ticket className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Support</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.operations.openTickets}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingDown className="w-4 h-4" />
                  <span className="text-sm font-medium">-22%</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Gj.snitt svar:</span>
                  <span className="font-medium">{stats.operations.avgResponseTime}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Trender siste 5 måneder</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* MRR Trend */}
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">MRR-utvikling</p>
                  <div className="space-y-2">
                    {trendData.mrr.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">{item.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${(item.value / 2200000) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-900 dark:text-white w-12">
                            {(item.value / 1000000).toFixed(1)}M
                          </span>
                          <span className={`text-xs ${item.growth >= 0 ? 'text-green-600' : 'text-red-600'} w-10`}>
                            +{item.growth}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Trend */}
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Kundebase</p>
                  <div className="space-y-2">
                    {trendData.customers.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">{item.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${(item.active / 50) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-900 dark:text-white w-12">{item.active}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 w-10">+{item.new}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tickets Trend */}
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Support-ytelse</p>
                  <div className="space-y-2">
                    {trendData.tickets.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-xs text-slate-600 dark:text-slate-400">{item.month}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                            <div
                              className="bg-orange-600 h-2 rounded-full"
                              style={{ width: `${(item.resolved / 50) * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-900 dark:text-white w-12">{item.resolved} løst</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 w-10">{item.avgTime}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* Top Customers */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Topp 5 kunder (MRR)</h3>
              </div>
              <div className="p-6 space-y-4">
                {topCustomers.map((customer, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{customer.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {customer.services.map((service) => (
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
                    <div className="text-right">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {customer.mrr.toLocaleString('nb-NO')} kr
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            customer.health >= 80
                              ? 'bg-green-100 text-green-700'
                              : customer.health >= 60
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {customer.health}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Services Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Fordeling per tjeneste</h3>
              </div>
              <div className="p-6 space-y-3">
                {customersByService.map((item) => (
                  <div key={item.service}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium text-slate-900 dark:text-white">{item.service}</span>
                      <span className="text-slate-600 dark:text-slate-400">
                        {item.count} kunder • {(item.revenue / 1000).toFixed(0)}k kr
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(item.count / 47) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {reportType === 'sales' && (
        <div className="grid grid-cols-2 gap-6">
          {/* Sales Funnel */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Salgstrakt</h3>
            </div>
            <div className="p-6 space-y-4">
              {salesFunnel.map((stage, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{stage.stage}</span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {stage.count} leads • {(stage.value / 1000).toFixed(0)}k kr
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-8 flex items-center px-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-500 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      style={{ width: `${(stage.count / salesFunnel[0].count) * 100}%` }}
                    >
                      {Math.round((stage.count / salesFunnel[0].count) * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Metrics */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Konverteringsmetrikker</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Lead til kunde</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">32%</p>
                  <div className="flex items-center gap-1 text-green-600 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+5% vs forrige</span>
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gj.snitt salgslengde</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">28d</p>
                  <div className="flex items-center gap-1 text-green-600 mt-2">
                    <TrendingDown className="w-4 h-4" />
                    <span className="text-sm">-3 dager</span>
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Win rate</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">65%</p>
                  <div className="flex items-center gap-1 text-green-600 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+8%</span>
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gj.snitt deal-verdi</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">92k</p>
                  <div className="flex items-center gap-1 text-green-600 mt-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm">+12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {reportType === 'integrations' && (
        <>
          {/* Integration Stats Overview */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">GA4 Økter</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(integrationMetrics.ga4.totalSessions / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{integrationMetrics.ga4.trend.sessions}% vs forrige</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <MousePointerClick className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Ads Klikk</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(integrationMetrics.googleAds.totalClicks / 1000).toFixed(1)}k
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{integrationMetrics.googleAds.trend.conversions}% konv.</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Meta Rekkevidde</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(integrationMetrics.metaAds.reach / 1000000).toFixed(1)}M
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{integrationMetrics.metaAds.trend.reach}% vs forrige</span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">GSC Klikk</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {(integrationMetrics.gsc.totalClicks / 1000).toFixed(0)}k
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">+{integrationMetrics.gsc.trend.clicks}% vs forrige</span>
              </div>
            </div>
          </div>

          {/* Google Analytics 4 */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white">Google Analytics 4</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Aggregert på tvers av alle kunder</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-4 mb-6">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Brukere</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {(integrationMetrics.ga4.totalUsers / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-green-600 mt-1">+{integrationMetrics.ga4.trend.users}%</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Økt-varighet</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {integrationMetrics.ga4.avgSessionDuration}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gjennomsnitt</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Avvisningsrate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{integrationMetrics.ga4.bounceRate}%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gjennomsnitt</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Konverteringsrate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {integrationMetrics.ga4.conversionRate}%
                  </p>
                  <p className="text-xs text-green-600 mt-1">+{integrationMetrics.ga4.trend.conversions}%</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Økter</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {(integrationMetrics.ga4.totalSessions / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-xs text-green-600 mt-1">+{integrationMetrics.ga4.trend.sessions}%</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Topp-kanaler</p>
                <div className="space-y-2">
                  {integrationMetrics.ga4.topChannels.map((channel, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2">
                      <span className="text-sm text-slate-900 dark:text-white">{channel.name}</span>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {channel.sessions.toLocaleString('nb-NO')} økter
                        </span>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">{channel.conversions}% conv.</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Google Ads & Meta Ads */}
          <div className="grid grid-cols-2 gap-6">
            {/* Google Ads */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Google Ads</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Total kostnader</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {integrationMetrics.googleAds.totalSpend.toLocaleString('nb-NO')} kr
                    </p>
                    <p className="text-xs text-green-600 mt-1">+{integrationMetrics.googleAds.trend.spend}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Konverteringer</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {integrationMetrics.googleAds.conversions}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      +{integrationMetrics.googleAds.trend.conversions}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Gj.snitt CPC</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {integrationMetrics.googleAds.avgCPC.toFixed(2)} kr
                    </p>
                    <p className="text-xs text-green-600 mt-1">{integrationMetrics.googleAds.trend.cpc}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">CTR</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{integrationMetrics.googleAds.ctr}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gjennomsnitt</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Topp kampanjer</p>
                  <div className="space-y-2">
                    {integrationMetrics.googleAds.topCampaigns.map((campaign, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-900 dark:text-white flex-1">{campaign.name}</span>
                        <span className="text-slate-600 dark:text-slate-400 mx-2">{campaign.conversions} conv.</span>
                        <span className="text-green-600 font-medium">{campaign.roas}x ROAS</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Meta Ads */}
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-semibold text-slate-900 dark:text-white">Meta Ads</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Total kostnader</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {integrationMetrics.metaAds.totalSpend.toLocaleString('nb-NO')} kr
                    </p>
                    <p className="text-xs text-green-600 mt-1">+{integrationMetrics.metaAds.trend.spend}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Konverteringer</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{integrationMetrics.metaAds.conversions}</p>
                    <p className="text-xs text-green-600 mt-1">+{integrationMetrics.metaAds.trend.conversions}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Gj.snitt CPC</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                      {integrationMetrics.metaAds.cpc.toFixed(2)} kr
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gjennomsnitt</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">CTR</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">{integrationMetrics.metaAds.ctr}%</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gjennomsnitt</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Topp kampanjer</p>
                  <div className="space-y-2">
                    {integrationMetrics.metaAds.topCampaigns.map((campaign, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1">
                        <span className="text-slate-900 dark:text-white flex-1">{campaign.name}</span>
                        <span className="text-slate-600 dark:text-slate-400 mx-2">{campaign.conversions} conv.</span>
                        <span className="text-green-600 font-medium">{campaign.roas}x ROAS</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Google Search Console */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">Google Search Console</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Totalt klikk</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {(integrationMetrics.gsc.totalClicks / 1000).toFixed(0)}k
                  </p>
                  <p className="text-xs text-green-600 mt-1">+{integrationMetrics.gsc.trend.clicks}%</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Visninger</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
                    {(integrationMetrics.gsc.totalImpressions / 1000000).toFixed(1)}M
                  </p>
                  <p className="text-xs text-green-600 mt-1">+{integrationMetrics.gsc.trend.impressions}%</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gj.snitt posisjon</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{integrationMetrics.gsc.avgPosition}</p>
                  <p className="text-xs text-green-600 mt-1">{integrationMetrics.gsc.trend.position} (bedre)</p>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">CTR</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">{integrationMetrics.gsc.ctr}%</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Gjennomsnitt</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Topp søkeord</p>
                <div className="space-y-2">
                  {integrationMetrics.gsc.topQueries.map((query, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                      <span className="text-sm text-slate-900 dark:text-white flex-1">{query.query}</span>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-slate-600 dark:text-slate-400">{query.clicks.toLocaleString('nb-NO')} klikk</span>
                        <span className="text-slate-600 dark:text-slate-400">Pos. {query.position}</span>
                        <span className="text-slate-900 dark:text-white font-medium">{query.ctr}% CTR</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {reportType === 'team' && (
        <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white">Team-ytelse</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">Navn</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                    Antall kunder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">MRR</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                    Oppgaver fullført
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                    Tickets håndtert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                    Tilfredshet
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {teamPerformance.map((member, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 dark:text-white">{member.customers}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">
                        {(member.mrr / 1000).toLocaleString('nb-NO')}k kr
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 dark:text-white">{member.tasks}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-900 dark:text-white">{member.tickets}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={`text-lg ${
                                star <= member.satisfaction ? 'text-yellow-400' : 'text-slate-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-slate-600 dark:text-slate-400">({member.satisfaction})</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
