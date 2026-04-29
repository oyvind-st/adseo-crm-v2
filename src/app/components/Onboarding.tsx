import { useState } from 'react';
import { Plus, CheckCircle2, Circle, Clock, User, Calendar, Building2, PlayCircle, ListTodo, Briefcase } from 'lucide-react';

export function Onboarding() {
  const [view, setView] = useState<'active' | 'templates'>('active');

  const templates = [
    {
      id: '1',
      name: 'SEO-kunde standard',
      description: 'Standard onboarding for SEO-kunder med fokus på teknisk SEO og innhold',
      serviceScope: 'SEO',
      steps: 8,
      avgDuration: '10-14 dager',
      estimatedTime: '2 uker',
      isActive: true
    },
    {
      id: '2',
      name: 'Google Ads-kunde',
      description: 'Rask onboarding for Google Ads-kunder - fra oppsett til live kampanje',
      serviceScope: 'Google Ads',
      steps: 6,
      avgDuration: '5-7 dager',
      estimatedTime: '1 uke',
      isActive: true
    },
    {
      id: '3',
      name: 'Full-service kunde – SEO + Ads',
      description: 'Omfattende onboarding for kunder med både SEO og Google Ads',
      serviceScope: 'SEO, Google Ads',
      steps: 12,
      avgDuration: '14-21 dager',
      estimatedTime: '3 uker',
      isActive: true
    }
  ];

  const activeOnboardings = [
    {
      id: '1',
      customer: 'Nordic Tech AS',
      template: 'SEO-kunde standard',
      startedAt: '15. mars 2024',
      startedBy: 'Ola Nordmann',
      status: 'In progress',
      progress: 62,
      completedSteps: 5,
      totalSteps: 8,
      assignedTo: 'Ola Nordmann',
      dueDate: '29. mars 2024',
      nextStep: 'Verifiser Google Analytics tracking',
      steps: [
        { title: 'Opprettsmøte gjennomført', status: 'completed', assignee: 'Ola Nordmann', dueDate: '16.03.2024', completedAt: '16.03.2024' },
        { title: 'Tilgang til Google Analytics', status: 'completed', assignee: 'Ola Nordmann', dueDate: '17.03.2024', completedAt: '17.03.2024' },
        { title: 'Tilgang til Google Search Console', status: 'completed', assignee: 'Ola Nordmann', dueDate: '17.03.2024', completedAt: '17.03.2024' },
        { title: 'Tilgang til nettsted/CMS', status: 'completed', assignee: 'Ola Nordmann', dueDate: '18.03.2024', completedAt: '18.03.2024' },
        { title: 'Baseline-måling etablert', status: 'completed', assignee: 'Ola Nordmann', dueDate: '20.03.2024', completedAt: '20.03.2024' },
        { title: 'Verifiser Google Analytics tracking', status: 'in_progress', assignee: 'Ola Nordmann', dueDate: '22.03.2024', completedAt: null },
        { title: 'Definere mål og KPI-er', status: 'not_started', assignee: 'Ola Nordmann', dueDate: '25.03.2024', completedAt: null },
        { title: 'Oppstartsrapport sendt', status: 'not_started', assignee: 'Ola Nordmann', dueDate: '29.03.2024', completedAt: null }
      ]
    },
    {
      id: '2',
      customer: 'Green Energy Norway',
      template: 'Google Ads-kunde',
      startedAt: '20. mars 2024',
      startedBy: 'Kari Jensen',
      status: 'In progress',
      progress: 33,
      completedSteps: 2,
      totalSteps: 6,
      assignedTo: 'Kari Jensen',
      dueDate: '27. mars 2024',
      nextStep: 'Sett opp kampanjestruktur',
      steps: [
        { title: 'Opprettsmøte gjennomført', status: 'completed', assignee: 'Kari Jensen', dueDate: '21.03.2024', completedAt: '21.03.2024' },
        { title: 'Tilgang til Google Ads', status: 'completed', assignee: 'Kari Jensen', dueDate: '21.03.2024', completedAt: '21.03.2024' },
        { title: 'Sett opp kampanjestruktur', status: 'in_progress', assignee: 'Kari Jensen', dueDate: '23.03.2024', completedAt: null },
        { title: 'Sett opp konverteringssporing', status: 'not_started', assignee: 'Kari Jensen', dueDate: '24.03.2024', completedAt: null },
        { title: 'Første kampanje live', status: 'not_started', assignee: 'Kari Jensen', dueDate: '26.03.2024', completedAt: null },
        { title: 'Oppfølgingsmøte etter 1 uke', status: 'not_started', assignee: 'Kari Jensen', dueDate: '27.03.2024', completedAt: null }
      ]
    },
    {
      id: '3',
      customer: 'E-commerce Pro AS',
      template: 'Kombinert SEO + Ads',
      startedAt: '18. mars 2024',
      startedBy: 'Ola Nordmann',
      status: 'At risk',
      progress: 41,
      completedSteps: 5,
      totalSteps: 12,
      assignedTo: 'Ola Nordmann',
      dueDate: '08. april 2024',
      nextStep: 'Tilgang til Google Ads mangler',
      steps: [
        { title: 'Opprettsmøte gjennomført', status: 'completed', assignee: 'Ola Nordmann', dueDate: '19.03.2024', completedAt: '19.03.2024' },
        { title: 'Tilgang til Google Analytics', status: 'completed', assignee: 'Ola Nordmann', dueDate: '19.03.2024', completedAt: '19.03.2024' },
        { title: 'Tilgang til Google Search Console', status: 'completed', assignee: 'Ola Nordmann', dueDate: '19.03.2024', completedAt: '19.03.2024' },
        { title: 'Tilgang til nettsted/CMS', status: 'completed', assignee: 'Ola Nordmann', dueDate: '20.03.2024', completedAt: '20.03.2024' },
        { title: 'Baseline SEO etablert', status: 'completed', assignee: 'Ola Nordmann', dueDate: '22.03.2024', completedAt: '22.03.2024' },
        { title: 'Tilgang til Google Ads', status: 'blocked', assignee: 'Ola Nordmann', dueDate: '21.03.2024', completedAt: null },
        { title: 'Teknisk SEO-audit', status: 'not_started', assignee: 'Ola Nordmann', dueDate: '25.03.2024', completedAt: null },
        { title: 'Sett opp Ads kampanjestruktur', status: 'not_started', assignee: 'Kari Jensen', dueDate: '26.03.2024', completedAt: null },
        { title: 'SEO-strategi definert', status: 'not_started', assignee: 'Ola Nordmann', dueDate: '28.03.2024', completedAt: null },
        { title: 'Konverteringssporing Ads', status: 'not_started', assignee: 'Kari Jensen', dueDate: '30.03.2024', completedAt: null },
        { title: 'Første Ads-kampanje live', status: 'not_started', assignee: 'Kari Jensen', dueDate: '02.04.2024', completedAt: null },
        { title: 'Oppstartsrapport begge kanaler', status: 'not_started', assignee: 'Ola Nordmann', dueDate: '08.04.2024', completedAt: null }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In progress':
        return 'bg-blue-100 text-blue-700';
      case 'At risk':
        return 'bg-red-100 text-red-700';
      case 'Completed':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300';
    }
  };

  const getStepStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'blocked':
        return <Circle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-slate-300" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Onboarding</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {view === 'active' ? `${activeOnboardings.length} aktive onboarding-prosesser` : `${templates.length} maler`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <button
              onClick={() => setView('active')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'active' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Aktive
            </button>
            <button
              onClick={() => setView('templates')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'templates' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              Maler
            </button>
          </div>
          {view === 'active' ? (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Start onboarding
            </button>
          ) : (
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ny mal
            </button>
          )}
        </div>
      </div>

      {view === 'active' && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Aktive</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeOnboardings.filter(o => o.status === 'In progress').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-900/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Med risiko</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeOnboardings.filter(o => o.status === 'At risk').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/30 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Fullført denne uken</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">2</p>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Gj.snitt tid</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">12d</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Onboardings */}
          <div className="space-y-4">
            {activeOnboardings.map((onboarding) => (
              <div key={onboarding.id} className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{onboarding.customer}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{onboarding.template}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            {onboarding.assignedTo}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            Startet {onboarding.startedAt}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4" />
                            Frist: {onboarding.dueDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm text-slate-600 dark:text-slate-400">Fremgang</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{onboarding.progress}%</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{onboarding.completedSteps}/{onboarding.totalSteps} steg</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(onboarding.status)}`}>
                        {onboarding.status}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${onboarding.status === 'At risk' ? 'bg-red-600' : 'bg-blue-600'}`}
                        style={{ width: `${onboarding.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Next Step */}
                  {onboarding.status !== 'Completed' && (
                    <div className={`p-3 rounded-lg ${onboarding.status === 'At risk' ? 'bg-red-50 dark:bg-red-900/30 border border-red-200' : 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200'}`}>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Neste steg: {onboarding.nextStep}</p>
                    </div>
                  )}

                  {/* Steps */}
                  <div className="mt-4 space-y-2">
                    {onboarding.steps.map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                        {getStepStatusIcon(step.status)}
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${step.status === 'completed' ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                            {step.title}
                          </p>
                          <div className="flex items-center gap-3 mt-0.5">
                            <span className="text-xs text-slate-500 dark:text-slate-400">{step.assignee}</span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">Frist: {step.dueDate}</span>
                            {step.completedAt && (
                              <span className="text-xs text-green-600">Fullført: {step.completedAt}</span>
                            )}
                            {step.status === 'blocked' && (
                              <span className="text-xs text-red-600 font-medium">Blokkert</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === 'templates' && (
        <div className="grid grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white dark:bg-slate-800 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  {template.isActive && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Aktiv
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg mb-2">{template.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">{template.description}</p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <ListTodo className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Antall steg</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{template.steps} steg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Estimert tid</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{template.estimatedTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Tjenester</p>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{template.serviceScope}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  Bruk mal
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
