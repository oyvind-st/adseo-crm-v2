import { User, Building2, Bell } from 'lucide-react';

export function SettingsMVP() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Innstillinger</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">Administrer din profil og preferanser</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Profil</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Navn
            </label>
            <input
              type="text"
              defaultValue="Ola Nordmann"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              E-post
            </label>
            <input
              type="email"
              defaultValue="ola@adseo.no"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Telefon
            </label>
            <input
              type="tel"
              defaultValue="+47 900 00 000"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="pt-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Lagre endringer
            </button>
          </div>
        </div>
      </div>

      {/* Company Settings */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Bedriftsinformasjon</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Bedriftsnavn
            </label>
            <input
              type="text"
              defaultValue="Adseo AS"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Organisasjonsnummer
            </label>
            <input
              type="text"
              defaultValue="123 456 789"
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Varslinger</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-700 dark:text-slate-300">E-postvarslinger</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-700 dark:text-slate-300">Påminnelser om oppgaver</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-slate-700 dark:text-slate-300">Nye leads</span>
            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" />
          </label>
        </div>
      </div>
    </div>
  );
}
