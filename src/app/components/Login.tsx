import { useState } from 'react';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useCurrentUser } from '../contexts/UserContext';
import { supabase } from '../../lib/supabase';

export function Login() {
  const { signIn } = useCurrentUser();
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [magicSent, setMagicSent] = useState(false);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) { setError('Fyll inn e-post og passord'); return; }
    setLoading(true); setError('');
    const { error: authError } = await signIn(email, password);
    if (authError) {
      setError(authError.includes('Invalid') ? 'Feil e-post eller passord' : authError);
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError('Fyll inn e-post'); return; }
    setLoading(true); setError('');
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false, emailRedirectTo: window.location.origin }
    });
    if (otpError) {
      setError('Kunne ikke sende lenke: ' + otpError.message);
      setLoading(false);
    } else {
      setMagicSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-lg text-slate-900 dark:text-white">Adseo CRM</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Kundeoppfølging & Salg</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button onClick={() => { setMode('password'); setError(''); setMagicSent(false); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'password' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              E-post & Passord
            </button>
            <button onClick={() => { setMode('magic'); setError(''); setMagicSent(false); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${mode === 'magic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              Innloggingslenke
            </button>
          </div>

          <div className="p-6">
            {mode === 'password' ? (
              <>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Logg inn</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Skriv inn dine innloggingsdetaljer</p>
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-postadresse</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="navn@adseo.no"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Passord</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Logger inn...</> : 'Logg inn'}
                  </button>
                  <button type="button" onClick={() => { setMode('magic'); setError(''); }}
                    className="w-full text-xs text-slate-400 hover:text-blue-600 transition-colors text-center">
                    Glemt passord? Send innloggingslenke →
                  </button>
                </form>
              </>
            ) : magicSent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="font-semibold text-slate-900 dark:text-white mb-2">Sjekk e-posten din!</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Vi har sendt en innloggingslenke til <strong>{email}</strong>. Klikk lenken for å logge inn.</p>
                <button onClick={() => { setMagicSent(false); setEmail(''); }}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mx-auto">
                  <ArrowLeft className="w-4 h-4" /> Send ny lenke
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Send innloggingslenke</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">Du mottar en lenke på e-post — ingen passord nødvendig</p>
                <form onSubmit={handleMagicLink} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">E-postadresse</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="navn@adseo.no"
                        className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sender...</> : 'Send innloggingslenke'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 mt-6">Adseo CRM • Intern plattform</p>
      </div>
    </div>
  );
}
