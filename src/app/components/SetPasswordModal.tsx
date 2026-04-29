import { useState } from 'react';
import { Zap, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useCurrentUser } from '../contexts/UserContext';

export function SetPasswordModal() {
  const { clearFirstLogin } = useCurrentUser();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Passordet må være minst 6 tegn'); return; }
    if (password !== confirm) { setError('Passordene stemmer ikke overens'); return; }
    setSaving(true);
    setError('');
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError('Feil: ' + updateError.message);
      setSaving(false);
    } else {
      clearFirstLogin();
    }
  };

  const handleSkip = () => {
    clearFirstLogin();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">Adseo CRM</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Sett ditt passord</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Velg et passord slik at du kan logge inn med e-post og passord neste gang — eller hopp over og bruk innloggingslenke.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSetPassword} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Passord
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 tegn"
                className="w-full pl-9 pr-10 py-2.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Bekreft passord
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Gjenta passordet"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Lagrer...</>
            ) : (
              <><ArrowRight className="w-4 h-4" />Sett passord og fortsett</>
            )}
          </button>
        </form>

        {/* Skip */}
        <div className="px-6 pb-6">
          <button
            onClick={handleSkip}
            className="w-full text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-center"
          >
            Hopp over — jeg bruker innloggingslenke
          </button>
        </div>
      </div>
    </div>
  );
}
