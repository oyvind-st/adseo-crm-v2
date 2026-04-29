import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PageHeader, SearchInput, Button, Card, Avatar, HealthScore, Loading } from '../shared'

export function CustomerListMVP() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('kunder')
      .select('*, kontakter(id, navn, tittel, er_primaer)')
      .order('bedriftsnavn')
      .then(({ data }) => { setCustomers(data || []); setLoading(false) })
  }, [])

  const filtered = customers.filter(c =>
    c.bedriftsnavn.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <Loading fullPage text="Laster kunder..." />

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Kunder"
        subtitle={`${customers.length} aktive kunder`}
        action={<Button icon={<Plus size={15} />}>Ny kunde</Button>}
      />

      <Card>
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-700">
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Søk etter kunde..."
            className="max-w-sm"
          />
        </div>

        {/* Header */}
        <div className="grid px-5 py-2.5 bg-slate-50/70 dark:bg-slate-900/30 border-b border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-400 uppercase tracking-wider"
          style={{ gridTemplateColumns: '2.5fr 1.5fr 1.5fr 100px 60px' }}>
          <span>Bedrift</span><span>Kontakt</span><span>Sted</span>
          <span className="text-right">MRR</span><span className="text-center">Helse</span>
        </div>

        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-slate-400">Ingen kunder funnet</div>
        ) : filtered.map((c, i) => {
          const primaer = c.kontakter?.find((k: any) => k.er_primaer) || c.kontakter?.[0]
          return (
            <div key={c.id}
              onClick={() => navigate(`/customers/${c.id}`)}
              className={`grid px-5 py-4 items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${i < filtered.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}
              style={{ gridTemplateColumns: '2.5fr 1.5fr 1.5fr 100px 60px' }}>
              <div className="flex items-center gap-3">
                <Avatar name={c.bedriftsnavn} shape="rounded" size="sm" />
                <span className="font-medium text-sm text-slate-900 dark:text-white">{c.bedriftsnavn}</span>
              </div>
              <div className="text-sm text-slate-700 dark:text-slate-300">
                {primaer ? (
                  <div>
                    <div className="font-medium">{primaer.navn}</div>
                    <div className="text-xs text-slate-400">{primaer.tittel}</div>
                  </div>
                ) : <span className="text-slate-300">—</span>}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">{c.sted || '—'}</span>
              <span className="text-sm font-semibold text-slate-900 dark:text-white text-right">
                {(c.mrr / 1000).toFixed(0)}k kr
              </span>
              <div className="flex justify-center">
                <HealthScore score={c.helse_score} />
              </div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}
