import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DarkModeProvider } from './contexts/DarkModeContext'
import { MVPProvider } from './contexts/MVPContext'
import { Layout } from './components/Layout'
import { DashboardMVP } from './components/mvp/Dashboard.mvp'
import { CustomerListMVP } from './components/mvp/CustomerList.mvp'
import { CustomerDetailMVP } from './components/mvp/CustomerDetail.mvp'
import { TaskListMVP } from './components/mvp/TaskList.mvp'
import { TicketListMVP } from './components/mvp/TicketList.mvp'
import { LeveranserListMVP } from './components/mvp/LeveranserList.mvp'
import { LeadListMVP } from './components/mvp/LeadList.mvp'
import { SettingsMVP } from './components/mvp/Settings.mvp'
export default function App() {
  return (
    <DarkModeProvider><MVPPevider><BrowserRouter>
      <Routes><Route path="/" element={<Layout />}>
        <Route index element={<DashboardMVP />} />
        <Route path="customers" element={<CustomerListMVP />} />
        <Route path="customers/:id" element={<CustomerDetailMVP />} />
        <Route path="tasks" element={<TaskListMVP />} />
        <Route path="tickets" element={<TicketListMVP />} />
        <Route path="leveranser" element={<LeveranserListMVP />} />
        <Route path="leads" element={<LeadListMVP />} />
        <Route path="settings" element={<SettingsMVP />} />
        <Route path="*" element={<DashboardMVP />} />
      </Route></Routes>
    </BrowserRouter></MVPProvider></DarkModeProvider>
  )
}
