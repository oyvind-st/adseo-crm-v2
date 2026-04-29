import { User, Building2, Bell, Save } from 'lucide-react'
import { PageHeader, Button, Card, CardHeader, CardBody, Input, Select } from '../shared'

export function SettingsMVP() {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <PageHeader title="Innstillinger" subtitle="Administrer din profil og preferanser" />

      {/* Profil */}
      <Card>
        <CardHeader action={<Button variant="secondary" size="sm" icon={<Save size={14} />}>Lagre</Button>}>
          <div className="flex items-center gap-2">
            <User size={16} className="text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Profil</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Input label="Navn" defaultValue="Øyvind Andreassen" />
            <Input label="E-post" type="email" defaultValue="oyvind@adseo.no" />
            <Select label="Rolle">
              <option>Partner</option>
              <option>Administrasjon</option>
              <option>Selger</option>
              <option>Konsulent</option>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Bedrift */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Bedriftsinformasjon</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <Input label="Bedriftsnavn" defaultValue="Adseo AS" />
            <Input label="Organisasjonsnummer" defaultValue="123 456 789" />
            <Input label="Nettside" defaultValue="www.adseo.no" />
          </div>
          <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 flex justify-end">
            <Button icon={<Save size={14} />}>Lagre endringer</Button>
          </div>
        </CardBody>
      </Card>

      {/* Varsler */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-slate-500" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Varsler</h2>
          </div>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {[
              { id: 'email', label: 'E-postvarsler', desc: 'Motta oppdateringer på e-post' },
              { id: 'tasks', label: 'Påminnelser om oppgaver', desc: 'Varsle når oppgaver forfaller' },
              { id: 'leads', label: 'Nye leads', desc: 'Varsle om nye leads i pipeline' },
              { id: 'tickets', label: 'Nye tickets', desc: 'Varsle om åpne kundehenvendelser' },
            ].map(item => (
              <label key={item.id} className="flex items-center justify-between cursor-pointer group">
                <div>
                  <div className="text-sm font-medium text-slate-700 dark:text-slate-300">{item.label}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
                <input type="checkbox" defaultChecked
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
              </label>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
