import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, Mail, Phone } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export function CustomerDetailMVP() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [kunde, setKunde] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase.from('kunder').select('*, kontakter(*), tjenester(*)')
      .eq('id', id).single()
      .then(({ data }) => { setKunde(data); setLoading(false) })
  }, [id])

  if (loading) return <div className="p-8 text-gray-400">Laster kunde...</div>
  if (!kunde) return <div className="p-8 text-gray-400">Kunde ikke funnet</div>

  return (
    <div className="p-8">
      <button onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm">
        <ArrowLeft className="w-4 h-4"/> Tilbake til kunder
      </button>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
          <Building2 className="w-7 h-7 text-blue-600"/>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{kunde.bedriftsnavn}</h1>
          <p className="text-slate-500">{kunde.sted}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-slate-700 mb-4">Kontakter</h2>
          {kunde.kontakter?.length === 0 && <p className="text-gray-400 text-sm">Ingen kontakter</p>}
          {kunde.kontakter?.map((k: any) => (
            <div key={k.id} className="flex items-start gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                {k.navn.slice(0,2).toUpperCase()}
              </div>
              <div>
                <div className="font-medium text-sm">{k.navn}</div>
                <div className="text-xs text-gray-500">{k.tittel}</div>
                {k.epost && <div className="text-xs text-blue-600 flex items-center gap-1 mt-1"><Mail className="w-3 h-3"/>{k.epost}</div>}
                {k.telefon && <div className="text-xs text-gray-500 flex items-center gap-1"><Phone className="w-3 h-3"/>{k.telefon}</div>}
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-slate-700 mb-4">Tjenester</h2>
          {kunde.tjenester?.length === 0 && <p className="text-gray-400 text-sm">Ingen tjenester</p>}
          {kunde.tjenester?.map((t: any) => (
            <div key={t.id} className="flex items-center justify-between mb-2 p-3 bg-slate-50 rounded-lg">
              <span className="text-sm font-medium">{t.navn}</span>
              <span className="text-sm text-slate-600">{(t.pris_per_mnd/1000).toFixed(0)}k kr/mnd</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
