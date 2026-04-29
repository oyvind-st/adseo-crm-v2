import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Send, ArrowLeft, Tag, Building2, Clock } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { Button, Card, CardHeader, CardBody, Badge, PriorityBadge, StatusBadge, Avatar, Loading } from '../shared'

const STATUS_OPTIONS = [
  { value: 'apent',           label: 'Åpen' },
  { value: 'pagar',           label: 'Pågår' },
  { value: 'venter_pa_kunde', label: 'Venter på kunde' },
  { value: 'lukket',          label: 'Lukket' },
]

export function TicketDetailMVP() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [replySent, setReplySent] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase.from('tickets')
      .select('*, kunder(bedriftsnavn, sted, nettside), kontakter(navn, tittel, epost, telefon)')
      .eq('id', id).single()
      .then(({ data }) => { setTicket(data); setLoading(false) })
  }, [id])

  const updateStatus = async (status: string) => {
    if (!ticket) return
    await supabase.from('tickets').update({ status }).eq('id', ticket.id)
    setTicket({ ...ticket, status })
  }

  const sendReply = () => {
    if (!replyText.trim()) return
    setReplySent(true)
    setReplyText('')
    setTimeout(() => setReplySent(false), 3000)
  }

  if (loading) return <Loading fullPage text="Laster ticket..." />
  if (!ticket) return (
    <div className="p-6">
      <Button variant="ghost" icon={<ArrowLeft size={15} />} onClick={() => navigate('/tickets')}>
        Tilbake til tickets
      </Button>
      <p className="text-slate-500 mt-4">Ticket ikke funnet.</p>
    </div>
  )

  const displayName = ticket.kontakter?.navn || ticket.kunder?.bedriftsnavn || 'Ukjent'

  return (
    <div className="p-6 max-w-5xl">
      <Button variant="ghost" icon={<ArrowLeft size={15} />} onClick={() => navigate('/tickets')} className="mb-6">
        Tilbake til tickets
      </Button>

      <div className="grid grid-cols-3 gap-6">
        {/* Main */}
        <div className="col-span-2 space-y-5">
          <Card padding>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{ticket.tittel}</h1>
                <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={13} />{ticket.kunder?.bedriftsnavn || '—'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={13} />{new Date(ticket.created_at).toLocaleDateString('no-NO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PriorityBadge priority={ticket.prioritet} />
                <StatusBadge status={ticket.status} />
              </div>
            </div>
            {ticket.beskrivelse && (
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {ticket.beskrivelse}
              </div>
            )}
            {ticket.kategori && (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-slate-500">
                <Tag size={12} />
                <Badge variant="slate" size="sm">{ticket.kategori}</Badge>
              </div>
            )}
          </Card>

          {/* Reply */}
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Svar til kunde</h2>
            </CardHeader>
            <CardBody>
              {replySent && (
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-lg px-4 py-2.5 mb-3">
                  ✓ Svar sendt!
                </div>
              )}
              <textarea
                value={replyText}
                onChange={e => setReplyText(e.target.value)}
                placeholder={`Skriv svar til ${displayName}...`}
                rows={4}
                className="w-full text-sm border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
              />
              <div className="flex justify-end mt-3">
                <Button icon={<Send size={14} />} onClick={sendReply} disabled={!replyText.trim()}>
                  Send svar
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader border={false}><span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</span></CardHeader>
            <CardBody>
              <div className="space-y-1">
                {STATUS_OPTIONS.map(s => (
                  <button key={s.value} onClick={() => updateStatus(s.value)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      ticket.status === s.value
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}>
                    {ticket.status === s.value && '✓ '}{s.label}
                  </button>
                ))}
              </div>
            </CardBody>
          </Card>

          {ticket.kunder && (
            <Card padding>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Kunde</div>
              <div className="font-medium text-sm text-slate-900 dark:text-white">{ticket.kunder.bedriftsnavn}</div>
              {ticket.kunder.sted && <div className="text-xs text-slate-500 mt-0.5">{ticket.kunder.sted}</div>}
              {ticket.kunder.nettside && (
                <a href={`https://${ticket.kunder.nettside}`} target="_blank" rel="noreferrer"
                  className="text-xs text-blue-600 hover:underline mt-1 block">{ticket.kunder.nettside}</a>
              )}
            </Card>
          )}

          {ticket.kontakter && (
            <Card padding>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Kontakt</div>
              <div className="flex items-center gap-3">
                <Avatar name={ticket.kontakter.navn} size="sm" />
                <div>
                  <div className="font-medium text-sm text-slate-900 dark:text-white">{ticket.kontakter.navn}</div>
                  {ticket.kontakter.tittel && <div className="text-xs text-slate-500">{ticket.kontakter.tittel}</div>}
                  {ticket.kontakter.epost && <div className="text-xs text-blue-600 mt-0.5">{ticket.kontakter.epost}</div>}
                </div>
              </div>
            </Card>
          )}

          <Card padding>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Detaljer</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Prioritet</span>
                <PriorityBadge priority={ticket.prioritet} />
              </div>
              {ticket.kategori && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Kategori</span>
                  <span className="text-slate-700 dark:text-slate-300">{ticket.kategori}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Opprettet</span>
                <span className="text-slate-700 dark:text-slate-300">{new Date(ticket.created_at).toLocaleDateString('no-NO')}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
