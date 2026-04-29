import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { MVPProvider } from './contexts/MVPContext'
import { Layout } from './components/Layout'

// Full Figma components with Supabase
import { Dashboard } from './components/Dashboard'
import { TaskList } from './components/TaskList'
// Supabase-connected MVP components
import { DashboardMVP } from './components/mvp/Dashboard.mvp'
import { CustomerListMVP } from './components/mvp/CustomerList.mvp'
import { CustomerDetailMVP } from './components/mvp/CustomerDetail.mvp'
import { TaskListMVP } from './components/mvp/TaskList.mvp'
import { TicketListMVP } from './components/mvp/TicketList.mvp'
import { TicketDetailMVP } from './components/mvp/TicketDetail.mvp'
import { LeveranserListMVP } from './components/mvp/LeveranserList.mvp'
import { LeadListMVP } from './components/mvp/LeadList.mvp'
import { SettingsMVP } from './components/mvp/Settings.mvp'
import { DesignSystemMVP } from './components/mvp/DesignSystem.mvp'

export default function App() {
  return (
    <DarkModeProvider>
      <MVPProvider>
        <BrowserRouter>
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
              <Route path="settings" element={<SettingsMVP />} />
              <Route path="design-system" element={<DesignSystemMVP />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </MVPProvider>
    </DarkModeProvider>
  )
}
