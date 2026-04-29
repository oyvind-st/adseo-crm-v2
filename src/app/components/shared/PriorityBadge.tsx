type Priority = 'høy' | 'medium' | 'lav', hasBadge?: boolean
type Status = string
const priorityConfig: Record<string, { bg: string; text: string; label: string }> = {
  høy: { bg: '#fef2f2', text: '#dc2626', label: 'Høy' },
  high: { bg: '#fef2f2', text: '#dc2626', label: 'Høy' },
  medium: { bg: '#fffbeb', text: '#d97706', label: 'Medium' },
  lav: { bg: '#f9fafb', text: '#6b7280', label: 'Lav' },
  low: { bg: '#f9fafb', text: '#6b7280', label: 'Lav' },
}
const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  apent: { bg: '#eff6ff', text: '#2563eb', label: 'Åpen' },
  pagar: { bg: '#f5f3ff', text: '#7c3aed', label: 'Pågår' },
  venter_pa_kunde: { bg: '#fffbeb', text: '#d97706', label: 'Venter' },
  lukket: { bg: '#f0fdf4', text: '#16a34a', label: 'Lukket' },
  ikke_startet: { bg: '#f9fafb', text: '#6b7280', label: 'Ikke startet' },
  ferdig: { bg: '#f0fdf4', text: '#16a34a', label: 'Ferdig' },
  active: { bg: '#f0fdf4', text: '#16a34a', label: 'Aktiv' },
  onboarding: { bg: '#fffbeb', text: '#d97706', label: 'Onboarding' },
}
export function PriorityBadge({ priority }: { priority: string }) {
  const config = priorityConfig[priority?.toLowerCase()] || priorityConfig.lav
  return (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: config.bg, color: config.text }}>{config.label}</span>)
}
export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status?.toLowerCase()] || { bg: '#f9fafb', text: '#6b7280', label: status }
  return (<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ background: config.bg, color: config.text }}>{config.label}</span>)
}
export function HealthScore({ score }: { score: number }) {
  const color = score >= 80 ? '#16a34a' : score >= 60 ? '#d97706' : '#dc2626'
  const bg = score >= 80 ? '#f0fdf4' : score >= 60 ? '#fffbeb' : '#fef2f2'
  return (<div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ border: `2.5px solid ${color}`, background: bg, color }}>{score}</div>)
}
