import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Globe,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Search,
  Link as LinkIcon,
  Smartphone,
  Zap,
  Shield,
  Eye,
  Target,
  Users,
  BarChart3,
  FileText,
  Share2,
  MousePointerClick,
  Award,
  Clock,
  Lock,
  Code,
  Image as ImageIcon,
  Video,
  MessageSquare,
  Download,
  ChevronRight
} from 'lucide-react';

export function ProspectAnalysis() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - i praksis ville dette kommet fra API basert på {id}
  // Data kilder: Forvalt.no, Proff.no, SEMrush, Ahrefs, PageSpeed Insights, Google Analytics (hvis tilgang)
  const prospect = {
    name: 'Retail Pro Norge AS',
    website: 'retailpro.no',
    industry: 'E-handel',
    analyzed: '13. april 2026 14:23',
    prospectScore: 95
  };

  const technicalSEO = {
    overall: 48,
    metrics: [
      { name: 'Core Web Vitals', score: 52, status: 'warning', details: 'LCP: 3.8s, FID: 180ms, CLS: 0.18' },
      { name: 'HTTPS / SSL', score: 100, status: 'success', details: 'Valid SSL certificate, forced HTTPS' },
      { name: 'Mobile-Friendly', score: 82, status: 'success', details: 'Responsive design, some touch targets too small' },
      { name: 'Page Speed', score: 45, status: 'error', details: 'Desktop: 52, Mobile: 38' },
      { name: 'Structured Data', score: 35, status: 'error', details: 'Missing Product schema, no Organization markup' },
      { name: 'XML Sitemap', score: 100, status: 'success', details: 'Valid sitemap with 1,247 URLs' },
      { name: 'Robots.txt', score: 100, status: 'success', details: 'Properly configured' },
      { name: 'Canonical Tags', score: 65, status: 'warning', details: '23 pages missing canonical tags' },
      { name: 'Meta Tags', score: 58, status: 'warning', details: '45% of pages missing meta descriptions' },
      { name: 'Image Optimization', score: 32, status: 'error', details: 'Large uncompressed images, missing alt tags' }
    ]
  };

  const seoMetrics = {
    overallScore: 48,
    domainAuthority: 42,
    trustScore: 68,
    spamScore: 3,
    organicKeywords: 145,
    keywordRankings: {
      top3: 8,
      top10: 23,
      top50: 89,
      top100: 145
    },
    estimatedTraffic: 12450,
    topKeywords: [
      { keyword: 'nettbutikk klær', position: 12, volume: 2400, difficulty: 58, url: '/category/clothes' },
      { keyword: 'online shopping norge', position: 8, volume: 1900, difficulty: 72, url: '/' },
      { keyword: 'kjøp sko online', position: 15, volume: 1200, difficulty: 54, url: '/category/shoes' },
      { keyword: 'retail pro', position: 3, volume: 320, difficulty: 12, url: '/' },
      { keyword: 'dame jakker', position: 18, volume: 890, difficulty: 48, url: '/category/jackets' }
    ],
    keywordGaps: [
      { keyword: 'billige klær online', volume: 3200, difficulty: 45, competitorRank: 4, theirRank: null },
      { keyword: 'nettbutikk tilbud', volume: 1800, difficulty: 52, competitorRank: 6, theirRank: null },
      { keyword: 'gratis frakt klær', volume: 1400, difficulty: 38, competitorRank: 5, theirRank: null }
    ]
  };

  const backlinks = {
    total: 2847,
    referring_domains: 342,
    dofollow: 2103,
    nofollow: 744,
    toxicScore: 12,
    topBacklinks: [
      { domain: 'fashionblog.no', authority: 58, type: 'dofollow', anchor: 'retail online shopping' },
      { domain: 'shoppingguide.no', authority: 52, type: 'dofollow', anchor: 'best online stores norway' },
      { domain: 'osloevents.no', authority: 45, type: 'nofollow', anchor: 'retailpro.no' },
      { domain: 'stylemagasin.no', authority: 38, type: 'dofollow', anchor: 'se mer her' }
    ],
    backlinkGaps: 15,
    lostBacklinks: 23
  };

  const paidAdvertising = {
    googleAds: {
      isActive: true,
      estimatedSpend: '85,000-120,000 NOK/måned',
      estimatedClicks: 3200,
      estimatedCPC: 32.5,
      adsCopy: 3,
      keywords: 45,
      quality: 'Dårlig optimalisert',
      issues: [
        'Høy CPC sammenlignet med bransjesnittet',
        'Mange broad match keywords uten negativ keywords',
        'Landing pages ikke optimalisert for konvertering',
        'Ingen bruk av ad extensions'
      ]
    },
    metaAds: {
      isActive: false,
      competitor_activity: 'Høy',
      opportunity: 'Stor'
    },
    shoppingAds: {
      isActive: false,
      productFeed: null,
      opportunity: 'Kritisk - e-handel uten Shopping ads'
    }
  };

  const competitors = [
    { name: 'fashiononline.no', rank: 1, keywords: 489, traffic: 45200, adSpend: '180k' },
    { name: 'styleshop.no', rank: 2, keywords: 423, traffic: 38900, adSpend: '150k' },
    { name: 'nordicstyle.no', rank: 3, keywords: 356, traffic: 28400, adSpend: '95k' },
    { name: 'retailpro.no', rank: 4, keywords: 145, traffic: 12450, adSpend: '85k' }
  ];

  const trafficAnalysis = {
    monthly: 12450,
    trend: -8.5,
    sources: [
      { source: 'Organic Search', percentage: 42, visitors: 5229 },
      { source: 'Paid Search', percentage: 28, visitors: 3486 },
      { source: 'Direct', percentage: 18, visitors: 2241 },
      { source: 'Social', percentage: 8, visitors: 996 },
      { source: 'Referral', percentage: 4, visitors: 498 }
    ],
    topPages: [
      { url: '/', views: 4200, bounceRate: 45, avgTime: '2:34' },
      { url: '/category/clothes', views: 2100, bounceRate: 52, avgTime: '1:45' },
      { url: '/category/shoes', views: 1800, bounceRate: 48, avgTime: '2:01' }
    ]
  };

  const contentAnalysis = {
    totalPages: 1247,
    blogPosts: 23,
    productPages: 1184,
    lastPublished: '3 måneder siden',
    contentScore: 42,
    issues: [
      'Tynt innhold på produktsider (avg 89 ord)',
      'Ingen bloggaktivitet siste 3 måneder',
      'Mangel på buying guides og hvordan-artikler',
      'Ingen video-innhold',
      'Produktbeskrivelser mangler unike sellingpoints'
    ],
    opportunities: [
      'Lag buying guides for hver produktkategori',
      'Implementer brukeranmeldelser på produktsider',
      'Start ukentlig blogg om motetrender',
      'Lag produktvideoer for toppselgere',
      'Optimaliser produktbeskrivelser med long-tail keywords'
    ]
  };

  const conversionAnalysis = {
    conversionRate: 1.8,
    industryAverage: 2.4,
    cartAbandonment: 73,
    issues: [
      'Ingen retargeting kampanjer',
      'Kompleks checkout-prosess (5 steg)',
      'Mangler trust badges ved checkout',
      'Ingen live chat / customer support',
      'Fragtskostnader vises sent i prosessen'
    ],
    opportunities: [
      'Implementer 1-klikks checkout',
      'Legg til retargeting kampanjer',
      'Vis fraktkostnader tidlig',
      'Legg til customer reviews',
      'A/B test ulike CTAs'
    ]
  };

  const socialPresence = {
    platforms: [
      { name: 'Instagram', followers: 12400, engagement: 2.3, posts: 234, posting: 'Sporadisk' },
      { name: 'Facebook', followers: 8900, engagement: 1.1, posts: 156, posting: 'Sjelden' },
      { name: 'TikTok', followers: 0, engagement: 0, posts: 0, posting: 'Ikke aktiv' },
      { name: 'Pinterest', followers: 0, engagement: 0, posts: 0, posting: 'Ikke aktiv' }
    ],
    score: 35,
    opportunities: [
      'TikTok er kritisk for mote-e-handel',
      'Pinterest driver mye e-handel trafikk',
      'Instagram Stories og Reels underbrukt',
      'Ingen influencer-samarbeid synlig'
    ]
  };

  const opportunityMatrix = {
    quickWins: [
      { title: 'Legg til Product Schema', effort: 'Lav', value: 'Høy', impact: '+15-25% CTR i søk' },
      { title: 'Optimaliser produktbilder', effort: 'Lav', value: 'Høy', impact: '-40% lastetid' },
      { title: 'Sett opp Google Shopping', effort: 'Lav', value: 'Kritisk', impact: '+200% paid traffic' },
      { title: 'Legg til customer reviews', effort: 'Lav', value: 'Høy', impact: '+25% konvertering' }
    ],
    strategic: [
      { title: 'Komplett innholds-strategi', effort: 'Høy', value: 'Høy', impact: 'Langsiktig organic growth' },
      { title: 'TikTok + Influencer marketing', effort: 'Høy', value: 'Høy', impact: 'Ny målgruppe 18-35' },
      { title: 'Retargeting + email automation', effort: 'Medium', value: 'Høy', impact: '+30% customer LTV' },
      { title: 'UX/CRO redesign', effort: 'Høy', value: 'Høy', impact: '+50% konverteringsrate' }
    ],
    deprioritize: [
      { title: 'LinkedIn-markedsføring', effort: 'Medium', value: 'Lav', impact: 'Feil målgruppe for B2C mote' }
    ]
  };

  const estimatedROI = {
    currentMonthlySpend: 85000,
    recommendedSpend: 150000,
    projectedRevenue: {
      month3: 420000,
      month6: 780000,
      month12: 1450000
    },
    roi: {
      month3: 2.8,
      month6: 4.2,
      month12: 6.5
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    if (score >= 40) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Full Digital Analyse</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-slate-600 dark:text-slate-400">{prospect.name}</p>
              <span className="text-slate-400">•</span>
              <a
                href={`https://${prospect.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Globe className="w-4 h-4" />
                {prospect.website}
              </a>
              <span className="text-slate-400">•</span>
              <p className="text-sm text-slate-500 dark:text-slate-400">Analysert: {prospect.analyzed}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm text-slate-600 dark:text-slate-400">Prospect Score</p>
            <div className={`text-3xl font-bold ${getScoreColor(prospect.prospectScore)}`}>
              {prospect.prospectScore}/100
            </div>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Last ned rapport
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-700">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Oversikt', icon: BarChart3 },
            { id: 'seo', label: 'SEO & Keywords', icon: Search },
            { id: 'technical', label: 'Teknisk', icon: Code },
            { id: 'paid', label: 'Betalt annonsering', icon: Target },
            { id: 'content', label: 'Innhold & Sosiale medier', icon: FileText },
            { id: 'conversion', label: 'Konvertering & UX', icon: MousePointerClick },
            { id: 'opportunities', label: 'Muligheter', icon: Zap }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                selectedTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Score Cards */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">SEO Score</p>
              </div>
              <div className="flex items-end gap-2">
                <p className={`text-3xl font-bold ${getScoreColor(seoMetrics.overallScore)}`}>
                  {seoMetrics.overallScore}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mb-1">/100</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Trust Score</p>
              </div>
              <div className="flex items-end gap-2">
                <p className={`text-3xl font-bold ${getScoreColor(seoMetrics.trustScore)}`}>
                  {seoMetrics.trustScore}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mb-1">/100</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Code className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Technical SEO</p>
              </div>
              <div className="flex items-end gap-2">
                <p className={`text-3xl font-bold ${getScoreColor(technicalSEO.overall)}`}>
                  {technicalSEO.overall}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mb-1">/100</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Content Score</p>
              </div>
              <div className="flex items-end gap-2">
                <p className={`text-3xl font-bold ${getScoreColor(contentAnalysis.contentScore)}`}>
                  {contentAnalysis.contentScore}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mb-1">/100</p>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-2 mb-2">
                <Share2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <p className="text-sm text-slate-600 dark:text-slate-400">Social Score</p>
              </div>
              <div className="flex items-end gap-2">
                <p className={`text-3xl font-bold ${getScoreColor(socialPresence.score)}`}>
                  {socialPresence.score}
                </p>
                <p className="text-slate-500 dark:text-slate-400 mb-1">/100</p>
              </div>
            </div>
          </div>

          {/* Key Findings */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">🚨 Kritiske problemer</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Ingen Google Shopping ads</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">E-handel uten Shopping ads mister 60-70% av potensiell paid traffic</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Ingen Meta Ads</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Konkurrenter bruker Meta aktivt for mote-e-handel</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Dårlig page speed (38 mobil)</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Mister trolig 20-30% av mobile besøkende</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Mangler Product Schema</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Mister rich snippets i Google søk</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">🎯 Største muligheter</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Google Shopping + Meta Ads</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Estimert +200% økning i qualified traffic</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Retargeting kampanjer</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Kan redusere cart abandonment fra 73% til ~45%</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">TikTok for mote</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Kritisk kanal for 18-35 år målgruppe</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">Content marketing + buying guides</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Kan 3x organic traffic over 12 måneder</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Traffic & Competition */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Trafikk-kilder</h3>
              <div className="space-y-3">
                {trafficAnalysis.sources.map((source, idx) => (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-700 dark:text-slate-300">{source.source}</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {source.percentage}% ({source.visitors.toLocaleString('nb-NO')})
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Konkurranseposisjon</h3>
              <div className="space-y-2">
                {competitors.map((comp, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      comp.name === 'retailpro.no' ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200' : 'bg-slate-50 dark:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold">
                        {comp.rank}
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">{comp.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                      <span>{comp.keywords} keywords</span>
                      <span>{(comp.traffic / 1000).toFixed(1)}k traffic</span>
                      <span>{comp.adSpend} ads</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Technical SEO Tab */}
      {selectedTab === 'technical' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Teknisk SEO-analyse</h3>
            <div className="space-y-3">
              {technicalSEO.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(metric.status)}
                    <div className="flex-1">
                      <p className="font-medium text-slate-900 dark:text-white">{metric.name}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{metric.details}</p>
                    </div>
                  </div>
                  <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                    {metric.score}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEO & Keywords Tab */}
      {selectedTab === 'seo' && (
        <div className="space-y-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Domain Authority</p>
              <p className={`text-3xl font-bold ${getScoreColor(seoMetrics.domainAuthority)}`}>
                {seoMetrics.domainAuthority}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Organic Keywords</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{seoMetrics.organicKeywords}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Est. Monthly Traffic</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {seoMetrics.estimatedTraffic.toLocaleString('nb-NO')}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Spam Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(100 - seoMetrics.spamScore * 10)}`}>
                {seoMetrics.spamScore}%
              </p>
            </div>
          </div>

          {/* Keyword Rankings */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Keyword-distribuering</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <p className="text-3xl font-bold text-green-700">{seoMetrics.keywordRankings.top3}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Top 3</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <p className="text-3xl font-bold text-blue-700">{seoMetrics.keywordRankings.top10}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Top 10</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-3xl font-bold text-yellow-700">{seoMetrics.keywordRankings.top50}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Top 50</p>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{seoMetrics.keywordRankings.top100}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Top 100</p>
              </div>
            </div>

            <h4 className="font-medium text-slate-900 dark:text-white mb-3">Topp-rankende keywords</h4>
            <div className="space-y-2">
              {seoMetrics.topKeywords.map((kw, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{kw.keyword}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{kw.url}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Posisjon</p>
                      <p className={`font-bold ${kw.position <= 10 ? 'text-green-600' : 'text-yellow-600'}`}>
                        #{kw.position}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Volume</p>
                      <p className="font-medium text-slate-900 dark:text-white">{kw.volume.toLocaleString('nb-NO')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Difficulty</p>
                      <p className="font-medium text-slate-900 dark:text-white">{kw.difficulty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keyword Gaps */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Keyword Gaps (Muligheter)</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Keywords hvor konkurrenter ranker, men {prospect.name} ikke gjør det
            </p>
            <div className="space-y-2">
              {seoMetrics.keywordGaps.map((kw, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-orange-50 dark:bg-orange-900/30 rounded-lg border border-orange-200">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{kw.keyword}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Konkurrent ranker #{kw.competitorRank}</p>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Volume</p>
                      <p className="font-medium text-slate-900 dark:text-white">{kw.volume.toLocaleString('nb-NO')}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-slate-500 dark:text-slate-400">Difficulty</p>
                      <p className="font-medium text-slate-900 dark:text-white">{kw.difficulty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Backlinks */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Backlink-profil</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{backlinks.total.toLocaleString('nb-NO')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total backlinks</p>
              </div>
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{backlinks.referring_domains}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Referring domains</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <p className="text-2xl font-bold text-green-700">{backlinks.dofollow.toLocaleString('nb-NO')}</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Dofollow</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
                <p className="text-2xl font-bold text-yellow-700">{backlinks.toxicScore}%</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Toxic score</p>
              </div>
            </div>

            <h4 className="font-medium text-slate-900 dark:text-white mb-3">Topp backlinks</h4>
            <div className="space-y-2">
              {backlinks.topBacklinks.map((link, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <LinkIcon className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">{link.domain}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{link.anchor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${
                      link.type === 'dofollow' ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {link.type}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">DA: {link.authority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Paid Advertising Tab */}
      {selectedTab === 'paid' && (
        <div className="space-y-6">
          {/* Google Ads */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Google Ads</h3>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Aktiv
              </span>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Estimert spend</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{paidAdvertising.googleAds.estimatedSpend}</p>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Est. klikk/måned</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{paidAdvertising.googleAds.estimatedClicks.toLocaleString('nb-NO')}</p>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Gj.snitt CPC</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{paidAdvertising.googleAds.estimatedCPC} kr</p>
              </div>
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Kvalitet</p>
                <p className="text-lg font-bold text-orange-600">{paidAdvertising.googleAds.quality}</p>
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 rounded-lg p-4">
              <h4 className="font-medium text-red-900 mb-2">Problemer identifisert:</h4>
              <ul className="space-y-2">
                {paidAdvertising.googleAds.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-red-800">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Meta Ads */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Meta Ads (Facebook & Instagram)</h3>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Ikke aktiv
              </span>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/30 border border-orange-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-6 h-6 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-2">Kritisk mulighet</h4>
                  <p className="text-sm text-orange-800 mb-3">
                    Konkurrenter bruker Meta Ads aktivt. For mote-e-handel er Meta (spesielt Instagram) en kritisk kanal.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-orange-600" />
                    <span className="text-orange-800">Estimert ROI: 4-6x for mote-e-handel på Meta</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Shopping Ads */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900 dark:text-white">Google Shopping Ads</h3>
              <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                Ikke satt opp
              </span>
            </div>
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
                <div>
                  <h4 className="font-medium text-red-900 mb-2">KRITISK: Google Shopping mangler</h4>
                  <p className="text-sm text-red-800 mb-3">
                    E-handel uten Google Shopping mister 60-70% av potensiell paid traffic. Shopping ads har typisk 30% lavere CPC enn tekstannonser.
                  </p>
                  <ul className="space-y-2 text-sm text-red-800">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      Ingen produkt-feed oppsett
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      Merchant Center ikke konfigurert
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600">•</span>
                      Mister visuell plassering i Google søk
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {selectedTab === 'content' && (
        <div className="space-y-6">
          {/* Content Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total sider</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{contentAnalysis.totalPages}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Blogginnlegg</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{contentAnalysis.blogPosts}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Sist publisert</p>
              <p className="text-lg font-bold text-orange-600">{contentAnalysis.lastPublished}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Content Score</p>
              <p className={`text-3xl font-bold ${getScoreColor(contentAnalysis.contentScore)}`}>
                {contentAnalysis.contentScore}
              </p>
            </div>
          </div>

          {/* Content Issues */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Innholds-problemer</h3>
            <ul className="space-y-2">
              {contentAnalysis.issues.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                  <span className="text-sm text-red-800">{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Content Opportunities */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Innholds-muligheter</h3>
            <ul className="space-y-2">
              {contentAnalysis.opportunities.map((opp, idx) => (
                <li key={idx} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm text-green-800">{opp}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Sosiale medier</h3>
            <div className="grid grid-cols-2 gap-4">
              {socialPresence.platforms.map((platform, idx) => (
                <div key={idx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-slate-900 dark:text-white">{platform.name}</h4>
                    <span className={`text-xs px-2 py-1 rounded ${
                      platform.followers > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {platform.posting}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Følgere</p>
                      <p className="font-medium text-slate-900 dark:text-white">{platform.followers.toLocaleString('nb-NO')}</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Engagement</p>
                      <p className="font-medium text-slate-900 dark:text-white">{platform.engagement}%</p>
                    </div>
                    <div>
                      <p className="text-slate-600 dark:text-slate-400">Innlegg</p>
                      <p className="font-medium text-slate-900 dark:text-white">{platform.posts}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Anbefalinger:</h4>
              <ul className="space-y-1">
                {socialPresence.opportunities.map((opp, idx) => (
                  <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 mt-0.5" />
                    {opp}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Conversion Tab */}
      {selectedTab === 'conversion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Konverteringsrate</p>
              <p className="text-3xl font-bold text-orange-600">{conversionAnalysis.conversionRate}%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bransjesnitt: {conversionAnalysis.industryAverage}%</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Cart Abandonment</p>
              <p className="text-3xl font-bold text-red-600">{conversionAnalysis.cartAbandonment}%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Bransjesnitt: ~65%</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Potensiell forbedring</p>
              <p className="text-3xl font-bold text-green-600">+50%</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Med CRO-optimalisering</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Konverteringsproblemer</h3>
              <ul className="space-y-2">
                {conversionAnalysis.issues.map((issue, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <span className="text-sm text-red-800">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">CRO-muligheter</h3>
              <ul className="space-y-2">
                {conversionAnalysis.opportunities.map((opp, idx) => (
                  <li key={idx} className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                    <span className="text-sm text-green-800">{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Opportunities Tab */}
      {selectedTab === 'opportunities' && (
        <div className="space-y-6">
          {/* ROI Projection */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Estimert ROI med full implementering</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Nåværende spend</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{estimatedROI.currentMonthlySpend.toLocaleString('nb-NO')} kr</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Per måned</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">3 måneder</p>
                <p className="text-2xl font-bold text-green-600">{estimatedROI.roi.month3}x ROI</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{estimatedROI.projectedRevenue.month3.toLocaleString('nb-NO')} kr revenue</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">6 måneder</p>
                <p className="text-2xl font-bold text-green-600">{estimatedROI.roi.month6}x ROI</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{estimatedROI.projectedRevenue.month6.toLocaleString('nb-NO')} kr revenue</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">12 måneder</p>
                <p className="text-2xl font-bold text-green-600">{estimatedROI.roi.month12}x ROI</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{estimatedROI.projectedRevenue.month12.toLocaleString('nb-NO')} kr revenue</p>
              </div>
            </div>
          </div>

          {/* Quick Wins */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Quick Wins (Lav innsats, Høy verdi)</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {opportunityMatrix.quickWins.map((item, idx) => (
                <div key={idx} className="border-2 border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      Innsats: {item.effort}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      Verdi: {item.value}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{item.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Initiatives */}
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-slate-900 dark:text-white">Strategiske initiativ (Høy innsats, Høy verdi)</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {opportunityMatrix.strategic.map((item, idx) => (
                <div key={idx} className="border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-medium text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded">
                      Innsats: {item.effort}
                    </span>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                      Verdi: {item.value}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300">{item.impact}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
