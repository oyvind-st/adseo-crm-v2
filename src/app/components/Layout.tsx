import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Palette,
  Building2,
  UserPlus,
  CheckSquare,
  Ticket,
  BarChart3,
  Search,
  Bell,
  Settings,
  User,
  PlayCircle,
  Activity,
  Plug,
  Moon,
  Sun,
  Target,
  Phone,
  Database,
  Zap,
  Package
} from 'lucide-react';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useMVPMode } from '../contexts/MVPContext';
import { useCurrentUser } from '../contexts/UserContext';

export function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isMVPMode, toggleMVPMode } = useMVPMode();
  const { user, signOut } = useCurrentUser();

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="h-screen flex bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-bold text-xl text-slate-900 dark:text-white">Adseo CRM</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kundeoppfølging & Salg</p>
            </div>
            {isMVPMode && (
              <div className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                MVP
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </Link>

          <Link
            to="/tasks"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive('/tasks')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <CheckSquare className="w-5 h-5" />
            <span className="font-medium">Oppgaver</span>
          </Link>

          <Link
            to="/tickets"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive('/tickets')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Ticket className="w-5 h-5" />
            <span className="font-medium">Tickets</span>
          </Link>

          {isMVPMode && (
            <Link
              to="/leveranser"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive('/leveranser')
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Leveranser</span>
            </Link>
          )}

          <Link
            to="/customers"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive('/customers')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="font-medium">Kunder</span>
          </Link>

          {/* Salg Section */}
          {!isMVPMode && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Salg
                </p>
              </div>

              <Link
                to="/prospects"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/prospects')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Database className="w-5 h-5" />
                <span className="font-medium">Prospekter</span>
              </Link>

              <Link
                to="/call-list"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/call-list')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Phone className="w-5 h-5" />
                <div className="flex items-center justify-between flex-1">
                  <span className="font-medium">Ringeliste</span>
                  <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full">
                    23
                  </span>
                </div>
              </Link>
            </>
          )}

          <Link
            to="/leads"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive('/leads')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Target className="w-5 h-5" />
            <div className="flex items-center justify-between flex-1">
              <span className="font-medium">Pipeline</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                2.4M kr
              </span>
            </div>
          </Link>

          {/* Produksjon Section */}
          {!isMVPMode && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Produksjon
                </p>
              </div>

              <Link
                to="/onboarding"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/onboarding')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <PlayCircle className="w-5 h-5" />
                <span className="font-medium">Onboarding</span>
              </Link>

              <Link
                to="/health"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/health')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Activity className="w-5 h-5" />
                <span className="font-medium">Kundehelse</span>
              </Link>
            </>
          )}

          {/* Administrasjon Section */}
          {!isMVPMode && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Administrasjon
                </p>
              </div>

              <Link
                to="/integrations"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/integrations')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <Plug className="w-5 h-5" />
                <span className="font-medium">Integrasjoner</span>
              </Link>

              <Link
                to="/reports"
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                  isActive('/reports')
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Rapporter</span>
              </Link>
            </>
          )}

          <Link
            to="/settings"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive('/settings')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Innstillinger</span>
          </Link>

          <Link
            to="/design-system"
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              isActive('/design-system')
                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            <Palette className="w-5 h-5" />
            <span className="font-medium">Designsystem</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-400">
              {user?.navn ? user.navn.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.navn || 'Bruker'}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.rolle || 'selger'}</p>
            </div>
            <button onClick={signOut} title="Logg ut" className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 flex items-center justify-between">
          <div className="flex-1 max-w-xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
                }
              }}
              className="relative"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder="Søk kunder, kontakter, tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleMVPMode}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                isMVPMode
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
              title={isMVPMode ? 'Bytt til full versjon' : 'Bytt til MVP'}
            >
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium">{isMVPMode ? 'MVP' : 'Full'}</span>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              )}
            </button>
            <button className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
