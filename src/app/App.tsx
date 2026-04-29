import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { MVPProvider } from './contexts/MVPContext'
import { UserProvider, useCurrentUser } from './contexts/UserContext'
import { Layout } from './components/Layout'
import { Login } from './components/Login'
import { SetPasswordModal } from './components/SetPasswordModal'

// Full Figma components with Supabase
import { Dashboard } from './components/Dashboard'
import { TaskList } from './components/TaskList'
import { Settings } from './components/Settings'
// Supabase-connected MVP components
import { DashboardMVP } from './components/mvp/Dashboard.mvp'
import { CustomerListMVP } from './components/mvp/CustomerList.mvp'
import { CustomerDetailMVP } from './components/mvp/CustomerDetail.mvp'
import { TaskListMVP } from './components/mvp/TaskList.mvp'
import { TicketListMVP } from './components/mvp/TicketList.mvp'
import { TicketDetailMVP } from './components/mvp/TicketDetail.mvp'
import { LeveranserListMVP } from './components/mvp/LeveranserList.mvp'
import { LeadListMVP } from './components/mvp/LeadList.mvp'
import { DesignSystemMVP } from './components/mvp/DesignSystem.mvp'

// Auth guard — shows login if not authenticated
function AppRoutes() {
  const { user, loading, isFirstLogin } = useCurrentUser()

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
    </div>
  )

  if (!user) return <Login />

  return (
    <BrowserRouter>
      {isFirstLogin && <SetPasswordModal />}
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<CustomerListMVP />} />
          <Route path="customers/:id" element={<CustomerDetailMVP />} />
          <Route path="tasks" element={<TaskList />} />
          <Route path="tickets" element={<TicketListMVP />} />
          <Route path="tickets/:id" element={<TicketDetailMVP />} />
          <Route path="leveranser" element={<LeveranserListMVP />} />
          <Route path="leads" element={<LeadListMVP />} />
          <Route path="settings" element={<Settings />} />
          <Route path="design-system" element={<DesignSystemMVP />} />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <DarkModeProvider>
      <UserProvider>
        <MVPProvider>
          <AppRoutes />
        </MVPProvider>
      </UserProvider>
    </DarkModeProvider>
  )
}
