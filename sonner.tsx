import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Mail,
  ExternalLink,
  Play,
  Pause,
  SkipForward,
  Calendar,
  FileText,
  User,
  Building2,
  BarChart3
} from 'lucide-react';
import { DateTimePicker } from './DateTimePicker';

export function CallList() {
  const navigate = useNavigate();
  const [activeCall, setActiveCall] = useState<string | null>(null);
  const [callStartTime, setCallStartTime] = useState<number | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callNotes, setCallNotes] = useState('');
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentProspect, setCurrentProspect] = useState<any>(null);
  const [followUpDate, setFollowUpDate] = useState('');
  const [followUpType, setFollowUpType] = useState('Oppfølgingsmøte etter interessesamtale');

  // TODO: Backend - Fetch from call list database
  const callListItems = [
    {
      id: '1',
      company: 'Nordic Fashion AS',
      contactPerson: 'Emma Johansen',
      title: 'Markedssjef',
      email: 'emma@nordicfashion.no',
      phone: '+47 123 45 678',
      website: 'www.nordicfashion.no',
      industry: 'Detaljhandel',
      employees: 45,
      digitalScore: 35,
      issues: ['Mangler GA4', 'Dårlig mobil-score', 'Ingen SSL'],
      callAttempts: 0,
      lastAttempt: null,
      priority: 'high',
      addedToList: '2 dager siden',
      bestTimeToCall: '09:00 - 12:00',
      notes: null
    },
    {
      id: '2',
      company: 'Wellness Spa',
      contactPerson: 'Sofie Berg',
      title: 'Daglig leder',
      email: 'sofie@wellnessspa.no',
      phone: '+47 345 67 890',
      website: 'www.wellnessspa.no',
      industry: 'Helse og velvære',
      employees: 15,
      digitalScore: 45,
      issues: ['Ingen blogg', 'Mangler lokalt SEO'],
      callAttempts: 1,
      lastAttempt: 'I går 10:30',
      priority: 'medium',
      addedToList: '3 dager siden',
      bestTimeToCall: '13:00 - 16:00',
      notes: 'Ikke svar første gang. Prøv igjen.'
    },
    {
      id: '3',
      company: 'Gourmet Foods AS',
      contactPerson: 'Nina Olsen',
      title: 'Marketing Manager',
      email: 'nina@gourmetfoods.no',
      phone: '+47 567 89 012',
      website: 'www.gourmetfoods.no',
      industry: 'Mat og drikke',
      employees: 65,
      digitalScore: 58,
      issues: ['Mangler schema markup', 'Langsom hastighet'],
      callAttempts: 0,
      lastAttempt: null,
      priority: 'high',
      addedToList: '1 dag siden',
      bestTimeToCall: '10:00 - 15:00',
      notes: null
    }
  ];

  const startCall = (prospect: any) => {
    setActiveCall(prospect.id);
    setCallStartTime(Date.now());
    setCurrentProspect(prospect);

    // Start timer
    const interval = setInterval(() => {
      if (callStartTime) {
        setCallDuration(Math.floor((Date.now() - callStartTime) / 1000));
      }
    }, 1000);

    // Store interval ID for cleanup
    (window as any).callTimerInterval = interval;
  };

  const endCall = () => {
    if ((window as any).callTimerInterval) {
      clearInterval((window as any).callTimerInterval);
    }

    // Set default follow-up date to 3 days from now at 10:00
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    defaultDate.setHours(10, 0, 0, 0);
    setFollowUpDate(defaultDate.toISOString().slice(0, 16));

    setShowResultModal(true);
  };

  const logCallResult = (result: 'interested' | 'maybe' | 'not_interested' | 'no_answer', followUpDate?: string, followUpType?: string) => {
    // TODO: Backend - Log call result to database
    const prospect = currentProspect;

    // Format date for display
    const formatDate = (dateStr: string) => {
      if (!dateStr) return 'Ikke satt';
      const date = new Date(dateStr);
      return date.toLocaleDateString('nb-NO', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    if (result === 'interested') {
      // TODO: Backend - Create customer card from prospect
      // TODO: Backend - Create follow-up task in tasks and customer card
      // TODO: Backend - Mark as lead in pipeline
      // TODO: Backend - Remove from call list
      alert(
        `✅ Kundekort opprettet for ${prospect.company}\n\n` +
        `📋 Oppfølgingsoppgave lagt til:\n` +
        `"${followUpType || 'Oppfølgingsmøte etter interessesamtale'}"\n` +
        `Frist: ${formatDate(followUpDate)}\n\n` +
        `Status: Lagt til i Pipeline som aktiv lead\n\n` +
        `Du kan nå ringe neste på listen!`
      );
    } else if (result === 'maybe') {
      // TODO: Backend - Create customer card from prospect
      // TODO: Backend - Set follow-up task and add back to call list with scheduled date
      alert(
        `✅ Kundekort opprettet for ${prospect.company}\n\n` +
        `📅 Oppfølgingsoppgave opprettet:\n` +
        `"${followUpType || 'Ring på nytt'}"\n` +
        `Frist: ${formatDate(followUpDate)}\n\n` +
        `${prospect.company} vil bli lagt tilbake i ringeliste på planlagt dato.`
      );
    } else if (result === 'no_answer') {
      // TODO: Backend - Create customer card from prospect (if not exists)
      // TODO: Backend - Add back to call list with retry counter
      // TODO: Backend - Create task to call again
      alert(
        `✅ Kundekort opprettet for ${prospect.company}\n\n` +
        `📞 ${prospect.company} vil automatisk bli lagt tilbake i ringeliste for nytt forsøk.\n\n` +
        `${followUpDate ? `Planlagt oppringning: ${formatDate(followUpDate)}` : 'Oppringning: Senere i dag'}`
      );
    } else {
      // TODO: Backend - Create customer card from prospect (if not exists)
      // TODO: Backend - Archive prospect
      // TODO: Backend - Log as "not interested" in customer card
      alert(
        `✅ Kundekort opprettet for ${prospect.company}\n\n` +
        `📁 Status satt til "Ikke interessert" og arkivert.\n` +
        `Samtalenotater lagret i kundekortet.`
      );
    }

    // Reset state - stay in call list
    setActiveCall(null);
    setCallStartTime(null);
    setCallDuration(0);
    setCallNotes('');
    setFollowUpDate('');
    setFollowUpType('Oppfølgingsmøte etter interessesamtale');
    setShowResultModal(false);
    setCurrentProspect(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-600 dark:text-green-400';
    if (score >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400';
    if (priority === 'medium') return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400';
    return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Ringeliste</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {callListItems.length} prospects å kontakte
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <span className="font-bold">{callListItems.filter(c => c.callAttempts === 0).length}</span> nye
            </p>
          </div>
        </div>
      </div>

      {/* Today's Goal */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Dagens mål</p>
            <p className="text-3xl font-bold mt-1">20 samtaler</p>
            <p className="text-blue-100 text-sm mt-2">Du har ringt 7 i dag • 13 gjenstår</p>
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-white/30 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold">35%</p>
              <p className="text-xs text-blue-100">fullført</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Call List */}
        <div className="col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h2 className="font-semibold text-slate-900 dark:text-white">Neste å ringe</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {callListItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`p-6 ${activeCall === item.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-slate-900 dark:text-white text-lg">
                            {item.company}
                          </h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(item.priority)}`}>
                            {item.priority === 'high' ? 'Høy' : item.priority === 'medium' ? 'Medium' : 'Lav'} prioritet
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {item.contactPerson} · {item.title}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                          <span>{item.phone}</span>
                          <span>·</span>
                          <span>{item.industry}</span>
                          <span>·</span>
                          <span>{item.employees} ansatte</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Digital Score</p>
                      <p className={`text-2xl font-bold ${getScoreColor(item.digitalScore)}`}>
                        {item.digitalScore}
                      </p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-3">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Ringeforsøk</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {item.callAttempts}
                      </p>
                      {item.lastAttempt && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          Sist: {item.lastAttempt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                    <p className="text-xs font-medium text-yellow-900 dark:text-yellow-300 mb-2">
                      Kritiske problemer som gir åpning:
                    </p>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1">
                      {item.issues.map((issue, idx) => (
                        <li key={idx}>• {issue}</li>
                      ))}
                    </ul>
                  </div>

                  {item.notes && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-1">Notater</p>
                      <p className="text-sm text-blue-800 dark:text-blue-400">{item.notes}</p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <button
                      onClick={() => window.open(`${window.location.origin}/leads/prospect-analysis/${item.id}`, '_blank')}
                      className="w-full px-4 py-2 border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                    >
                      <BarChart3 className="w-4 h-4" />
                      Se full digital analyse (åpnes i ny fane)
                    </button>

                    <div className="flex items-center gap-2">
                      {activeCall === item.id ? (
                        <>
                          <div className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg flex-1">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="font-medium">Samtale pågår</span>
                            <span className="ml-auto font-mono">{formatDuration(callDuration)}</span>
                          </div>
                          <button
                            onClick={endCall}
                            className="px-4 py-2 bg-slate-800 dark:bg-slate-700 text-white rounded-lg hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                          >
                            Avslutt
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startCall(item)}
                            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
                          >
                            <Phone className="w-4 h-4" />
                            Ring nå
                          </button>
                          <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <SkipForward className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call Script & Tips */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Call Script
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-medium text-slate-900 dark:text-white mb-2">1. Introduksjon</p>
                <p className="text-slate-600 dark:text-slate-400">
                  "Hei, mitt navn er [navn] fra Adseo. Vi hjelper bedrifter innen [bransje] med å forbedre deres digitale synlighet. Har du 2 minutter?"
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white mb-2">2. Verdi først</p>
                <p className="text-slate-600 dark:text-slate-400">
                  "Vi har sett på deres nettside og identifisert [X] områder hvor dere kan forbedre konverteringen betydelig."
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white mb-2">3. Problemidentifikasjon</p>
                <p className="text-slate-600 dark:text-slate-400">
                  Nevn 1-2 konkrete problemer fra listen over. Vær spesifikk!
                </p>
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-white mb-2">4. Spør om interesse</p>
                <p className="text-slate-600 dark:text-slate-400">
                  "Ville det være interessant å høre mer om hvordan vi kan hjelpe dere med dette?"
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="font-medium text-green-900 dark:text-green-300 mb-2">💡 Tips</p>
            <ul className="text-sm text-green-800 dark:text-green-400 space-y-1">
              <li>• Vær konkret om deres problemer</li>
              <li>• Hør etter deres utfordringer</li>
              <li>• Book møte, ikke selg over telefon</li>
              <li>• Ta notater underveis</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Dagens statistikk</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Samtaler</span>
                <span className="font-bold text-slate-900 dark:text-white">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Interessert</span>
                <span className="font-bold text-green-600 dark:text-green-400">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Kanskje</span>
                <span className="font-bold text-yellow-600 dark:text-yellow-400">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Ikke svar</span>
                <span className="font-bold text-slate-600 dark:text-slate-400">2</span>
              </div>
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">Konverteringsrate</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">43%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call Result Modal */}
      {showResultModal && currentProspect && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-semibold text-slate-900 dark:text-white">
                Logg samtale med {currentProspect.company}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Varighet: {formatDuration(callDuration)}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Notater fra samtalen
                </label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  rows={4}
                  placeholder="Hva sa de? Hva er deres hovedutfordringer? Når er best å følge opp?"
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Type oppfølging
                  </label>
                  <select
                    value={followUpType}
                    onChange={(e) => setFollowUpType(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Oppfølgingsmøte etter interessesamtale">Oppfølgingsmøte</option>
                    <option value="Send tilbud">Send tilbud</option>
                    <option value="Behovskartlegging">Behovskartlegging</option>
                    <option value="Demo/presentasjon">Demo/presentasjon</option>
                    <option value="Send case studies">Send case studies</option>
                    <option value="Ring for oppfølging">Ring for oppfølging</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Oppfølgingsdato og tidspunkt
                  </label>
                  <DateTimePicker
                    value={followUpDate}
                    onChange={(value) => setFollowUpDate(value)}
                  />
                </div>
              </div>

              <div>
                <p className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Resultat av samtalen
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => logCallResult('interested', followUpDate, followUpType)}
                    className="p-4 border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg hover:border-green-400 dark:hover:border-green-600 transition-colors"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="font-medium text-green-900 dark:text-green-300 text-sm">Interessert</p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      → Kundekort + Pipeline + Oppgave
                    </p>
                  </button>
                  <button
                    onClick={() => logCallResult('maybe', followUpDate, followUpType)}
                    className="p-4 border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:border-yellow-400 dark:hover:border-yellow-600 transition-colors"
                  >
                    <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                    <p className="font-medium text-yellow-900 dark:text-yellow-300 text-sm">Kanskje senere</p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                      → Kundekort + Oppgave + Tilbake i liste
                    </p>
                  </button>
                  <button
                    onClick={() => logCallResult('no_answer', followUpDate, followUpType)}
                    className="p-4 border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 rounded-lg hover:border-slate-400 dark:hover:border-slate-500 transition-colors"
                  >
                    <Phone className="w-6 h-6 text-slate-600 dark:text-slate-400 mx-auto mb-2" />
                    <p className="font-medium text-slate-900 dark:text-white text-sm">Ikke svar</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      → Kundekort + Tilbake i liste
                    </p>
                  </button>
                  <button
                    onClick={() => logCallResult('not_interested', followUpDate, followUpType)}
                    className="p-4 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg hover:border-red-400 dark:hover:border-red-600 transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <p className="font-medium text-red-900 dark:text-red-300 text-sm">Ikke interessert</p>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                      → Kundekort + Arkiver
                    </p>
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
              <button
                onClick={() => {
                  setShowResultModal(false);
                  setCallNotes('');
                  setFollowUpDate('');
                  setFollowUpType('Oppfølgingsmøte etter interessesamtale');
                }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
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
