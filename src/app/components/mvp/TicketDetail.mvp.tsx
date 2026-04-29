import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, User, Clock, Tag, MessageSquare, Send, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { PriorityBadge, StatusBadge } from '../shared/PriorityBadge'

const STATUS_LABEL: Record<string, string> = {
  apent: 'Åpen', pagar: 'Pågår', venter_pa_kunde: 'Venter på kunde', lukket: 'Lukket'
}
const STATUS_OPTIONS = ['apent', 'pagar', 'venter_pa_kunde', 'lukket']

export function TicketDetailMVP() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [replySent, setReplySent] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)

  useEffect(() => {
    if (!id) return
    supabase.from('tickets')
      .select('*, kunder(bedriftsnavn, sted, nettside), kontakter(navn, tittel, epost, telefon)')
      .eq('id', id).single()
      .then(({ data }) => { setTicket(data); setLoading(false) })
  }, [id])

  const updateStatus = async (newStatus: string) => {
    if (!ticket) return
    setUpdatingStatus(true)
    await supabase.from('tickets').update({ status: newStatus }).eq('id', ticket.id)
    setTicket({ ...ticket, status: newStatus })
    setUpdatingStatus(false)
  }

  const sendReply = () => {
    if (!replyText.trim()) return
    setReplySent(true)
    setReplyText('')
    setTimeout(() => setReplySent(false), 3000)
  }

  if (loading) return (
    <div className="p-8 flex items-center justify-center">
      <div className="text-gray-400">Laster ticket...</div>
    </div>
  )

  if (!ticket) return (
    <div className="p-8">
      <button onClick={() => navigate('/tickets')} className="flex items-center gap-2 text-violet-600 mb-4 text-sm hover:underline">
        <ArrowLeft size={16} /> Tilbake til tickets
      </button>
      <p className="text-gray-500">Ticket ikke funnet.</p>
    </div>
  )

  const displayName = ticket.kontakter?.navn || ticket.kunder?.bedriftsnavn || 'Ukjent'

  return (
    <div className="p-8 max-w-5xl">
      {/* Back */}
      <button onClick={() => navigate('/tickets')}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm transition-colors">
        <ArrowLeft size={15} /> Tilbake til tickets
      </button>

      <div className="grid grid-cols-3 gap-6">
        {/* Main */}
        <div className="col-span-2 space-y-5">
          {/* Header */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">{ticket.tittel}</h1>
                <div className="flex items-center gap-3 text-sm text-gray-500">
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
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
                {ticket.beskrivelse}
              </div>
            )}

            {ticket.kategori && (
              <div className="flex items-center gap-1.5 mt-3 text-xs text-gray-500">
                <Tag size={12} />
                <span className="bg-gray-100 px-2 py-0.5 rounded-full">{ticket.kategori}</span>
              </div>
            )}
          </div>

          {/* Reply */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4 text-sm font-medium text-gray-700">
              <MessageSquare size={15} />
              Svar til kunde
            </div>
            {replySent && (
              <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg px-4 py-2.5 mb-3">
                <CheckCircle2 size={15} /> Svar sendt!
              </div>
            )}
            <textarea
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder={`Skriv svar til ${displayName}...`}
              rows={4}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none"
            />
            <div className="flex justify-end mt-3">
              <button onClick={sendReply}
                className="flex items-center gap-2 bg-violet-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-violet-700 transition-colors">
                <Send size={14} /> Send svar
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status</div>
            <div className="space-y-1.5">
              {STATUS_OPTIONS.map(s => (
                <button key={s} onClick={() => updateStatus(s)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    ticket.status === s
                      ? 'bg-violet-50 text-violet-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  {ticket.status === s && <span className="mr-1.5">✓</span>}
                  {STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>

          {/* Kunde */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Kunde</div>
            {ticket.kunder ? (
              <div>
                <div className="font-medium text-sm text-gray-900 mb-0.5">{ticket.kunder.bedriftsnavn}</div>
                {ticket.kunder.sted && <div className="text-xs text-gray-500">{ticket.kunder.sted}</div>}
                {ticket.kunder.nettside && (
                  <a href={`https://${ticket.kunder.nettside}`} target="_blank" rel="noreferrer"
                    className="text-xs text-violet-600 hover:underline mt-1 block">{ticket.kunder.nettside}</a>
                )}
              </div>
            ) : <span className="text-sm text-gray-400">Ingen kunde</span>}
          </div>

          {/* Kontakt */}
          {ticket.kontakter && (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Kontakt</div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-600 flex-shrink-0">
                  {ticket.kontakter.navn.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-sm text-gray-900">{ticket.kontakter.navn}</div>
                  {ticket.kontakter.tittel && <div className="text-xs text-gray-500">{ticket.kontakter.tittel}</div>}
                  {ticket.kontakter.epost && <div className="text-xs text-violet-600 mt-0.5">{ticket.kontakter.epost}</div>}
                </div>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Detaljer</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Prioritet</span>
                <PriorityBadge priority={ticket.prioritet} />
              </div>
              {ticket.kategori && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Kategori</span>
                  <span className="text-gray-700">{ticket.kategori}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Opprettet</span>
                <span className="text-gray-700">{new Date(ticket.created_at).toLocaleDateString('no-NO')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
