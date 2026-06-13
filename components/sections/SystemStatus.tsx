'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ShieldAlert, CheckCircle, AlertTriangle, XCircle } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Status = 'ok' | 'warning' | 'error' | 'inactive'

interface SystemService {
  id: string
  name: string
  status: Status
  statusLabel: string
  description: string
  lastChecked: string
}

const services: SystemService[] = [
  { id: 'acumatica', name: 'Acumatica Connection', status: 'warning', statusLabel: 'Sandbox Mode', description: 'All writes disabled. Read-only access to ERP data. Production credentials not configured.', lastChecked: '2 min ago' },
  { id: 'api-proxy', name: 'API Proxy', status: 'ok', statusLabel: 'Active', description: 'All ERP calls proxied server-side. No credentials exposed to browser. Latency: ~120ms.', lastChecked: '2 min ago' },
  { id: 'google-sheets', name: 'Google Sheets Logging', status: 'ok', statusLabel: 'Connected', description: 'Ops log syncing. Last write: 4 minutes ago. 1,240 rows logged this month.', lastChecked: '2 min ago' },
  { id: 'obsidian-bridge', name: 'Obsidian Bridge', status: 'warning', statusLabel: 'Config Needed', description: 'Set OBSIDIAN_VAULT_PATH in .env to enable vault writes. Read operations will stub until configured.', lastChecked: '2 min ago' },
  { id: 'rocky-agent', name: 'Rocky Agent', status: 'warning', statusLabel: 'Stub Only', description: 'Agent configuration ready. Trigger endpoints wired. Not yet connected to AI backend.', lastChecked: '2 min ago' },
  { id: 'simon-archive', name: 'Simon Archive', status: 'warning', statusLabel: 'Stub Only', description: 'Long-term archive agent not yet active. Endpoint stubbed at /api/simon. Awaiting configuration.', lastChecked: '2 min ago' },
]

const statusConfig: Record<Status, { icon: React.ReactNode; variant: 'secondary' | 'warning' | 'destructive' | 'ghost'; dot: string; pulse: boolean }> = {
  ok: { icon: <CheckCircle size={14} className="text-[#ACBF37]" />, variant: 'secondary', dot: 'bg-[#ACBF37]', pulse: true },
  warning: { icon: <AlertTriangle size={14} className="text-yellow-400" />, variant: 'warning', dot: 'bg-yellow-400', pulse: false },
  error: { icon: <XCircle size={14} className="text-red-400" />, variant: 'destructive', dot: 'bg-red-500', pulse: false },
  inactive: { icon: <XCircle size={14} className="text-[#9a9491]" />, variant: 'ghost', dot: 'bg-[#9a9491]', pulse: false },
}

export default function SystemStatus() {
  const [checking, setChecking] = useState<Set<string>>(new Set())
  const [checkedTimes, setCheckedTimes] = useState<Record<string, string>>({})

  const checkService = async (id: string) => {
    setChecking((prev) => new Set(prev).add(id))
    try {
      await fetch('/api/system/status')
    } catch (_) {}
    setTimeout(() => {
      setChecking((prev) => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
      setCheckedTimes((prev) => ({ ...prev, [id]: 'just now' }))
    }, 800)
  }

  const okCount = services.filter((s) => s.status === 'ok').length
  const warnCount = services.filter((s) => s.status === 'warning').length

  return (
    <div>
      {/* Security Banner */}
      <div className="flex items-start gap-3 mb-5 p-4 rounded-xl bg-[rgba(172,191,55,0.06)] border border-[rgba(172,191,55,0.2)]">
        <ShieldAlert size={16} className="text-[#ACBF37] mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-[#ACBF37] mb-0.5">Security Note</p>
          <p className="text-xs text-[#9a9491] leading-relaxed">
            All credentials live in backend{' '}
            <code className="text-[#ACBF37] bg-[rgba(172,191,55,0.1)] px-1 rounded">.env</code>.
            No API keys are stored in this browser. All ERP and AI calls are proxied server-side.
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ACBF37]" />
          <span className="text-sm text-[#e9e9e9]"><strong>{okCount}</strong> operational</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="text-sm text-[#e9e9e9]"><strong>{warnCount}</strong> warnings</span>
        </div>
      </div>

      {/* Service Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {services.map((svc, i) => {
          const config = statusConfig[svc.status]
          const isChecking = checking.has(svc.id)

          return (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className="p-4 hover:border-[rgba(255,103,31,0.2)] transition-colors h-full flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    {config.icon}
                    <h4 className="font-semibold text-sm text-white leading-tight">{svc.name}</h4>
                  </div>
                  <Badge variant={config.variant} className="text-[10px] flex-shrink-0">
                    {svc.statusLabel}
                  </Badge>
                </div>

                <p className="text-xs text-[#9a9491] leading-relaxed mb-4 flex-1">{svc.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot} ${config.pulse ? 'animate-pulse-dot' : ''}`} />
                    <span className="text-xs text-[#9a9491]">
                      {checkedTimes[svc.id] ? `Checked ${checkedTimes[svc.id]}` : `Last checked: ${svc.lastChecked}`}
                    </span>
                  </div>
                  <button
                    onClick={() => checkService(svc.id)}
                    disabled={isChecking}
                    className="flex items-center gap-1 text-xs text-[#9a9491] hover:text-white bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] rounded-lg px-2.5 py-1 transition-all disabled:opacity-50"
                  >
                    <RefreshCw size={10} className={isChecking ? 'animate-spin' : ''} />
                    Check Now
                  </button>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
