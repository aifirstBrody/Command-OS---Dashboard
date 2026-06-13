'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Bell, MessageSquare, Maximize2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SECTIONS } from './AppShell'
import { cn } from '@/lib/utils'

interface CommandBarProps {
  activeSection: string
  onToggleTv: () => void
  onToggleChat: () => void
  chatOpen: boolean
}

const ALERTS_MOCK = [
  { id: '1', title: 'SKU-042 Forecast Gap -23%', severity: 'critical', time: '4m ago' },
  { id: '2', title: 'Low Whey Protein Stock',    severity: 'critical', time: '12m ago' },
  { id: '3', title: 'MO-20443 BLOCKED',           severity: 'warning',  time: '28m ago' },
  { id: '4', title: 'Yield Drop — SKU-017',       severity: 'warning',  time: '1h ago' },
]

export default function CommandBar({ activeSection, onToggleTv, onToggleChat, chatOpen }: CommandBarProps) {
  const [showNotif, setShowNotif]   = useState(false)
  const [showBrief, setShowBrief]   = useState(false)
  const [syncing,   setSyncing]     = useState(false)
  const section = SECTIONS.find(s => s.id === activeSection)

  const handleSync = () => {
    setSyncing(true)
    setTimeout(() => setSyncing(false), 2000)
  }

  return (
    <>
      <header className="command-bar-bg sticky top-0 z-20 flex items-center px-5 h-14 gap-4 flex-shrink-0">
        {/* Active section title */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={activeSection} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ duration: 0.2 }}>
              <div className="font-display font-bold text-xl text-white tracking-wide leading-none">{section?.title ?? 'Dashboard'}</div>
              <div className="text-[10px] font-mono text-[#FF671F]/70 tracking-widest uppercase mt-0.5 truncate">{section?.question ?? ''}</div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setShowBrief(true)} className="gap-1.5 text-[#ACBF37] hover:text-[#ACBF37] hover:bg-[rgba(172,191,55,0.1)] border border-[rgba(172,191,55,0.2)]">
            <Sun size={13} /><span className="hidden sm:inline text-xs">Morning Brief</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={handleSync} title="Sync Acumatica">
            <RefreshCw size={15} className={cn('text-[#9a9491]', syncing && 'animate-spin text-[#FF671F]')} />
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setShowNotif(v => !v)}>
              <Bell size={15} className="text-[#9a9491]" />
              <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#FF671F] rounded-full text-white text-[8px] font-bold flex items-center justify-center">
                {ALERTS_MOCK.length}
              </span>
            </Button>
            <AnimatePresence>
              {showNotif && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setShowNotif(false)} />
                  <motion.div initial={{ opacity: 0, y: -8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.96 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full mt-2 w-80 z-40 rounded-xl shadow-2xl overflow-hidden" style={{ background: '#1e1a17', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                      <span className="font-semibold text-sm">Live Alerts</span>
                      <button onClick={() => setShowNotif(false)} className="text-[#9a9491] hover:text-white text-xs">Clear</button>
                    </div>
                    {ALERTS_MOCK.map(a => (
                      <div key={a.id} className={cn('px-4 py-3 border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors', a.severity === 'critical' ? 'alert-critical' : 'alert-warning')}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-white">{a.title}</span>
                          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', a.severity === 'critical' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-400/15 text-yellow-400')}>
                            {a.severity.toUpperCase()}
                          </span>
                        </div>
                        <div className="text-xs text-[#9a9491] mt-0.5">{a.time}</div>
                      </div>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <Button variant="ghost" size="icon" onClick={onToggleChat} className={cn(chatOpen && 'bg-[rgba(255,103,31,0.12)] text-[#FF671F]')} title="Toggle Chat">
            <MessageSquare size={15} />
          </Button>
          <Button variant="ghost" size="icon" onClick={onToggleTv} title="Full-screen / TV mode">
            <Maximize2 size={15} className="text-[#9a9491]" />
          </Button>
        </div>
      </header>

      {/* Morning Brief Modal */}
      <AnimatePresence>
        {showBrief && (
          <>
            <motion.div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowBrief(false)} />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div className="w-full max-w-lg rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto pointer-events-auto" style={{ background: '#1e1a17', border: '1px solid rgba(255,255,255,0.08)' }} initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(172,191,55,0.1)', border: '1px solid rgba(172,191,55,0.25)' }}>
                      <Sun size={18} className="text-[#ACBF37]" />
                    </div>
                    <div>
                      <div className="font-display font-bold text-xl text-white">Morning Executive Brief</div>
                      <div className="text-xs text-[#9a9491]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                    </div>
                  </div>
                  <button onClick={() => setShowBrief(false)} className="text-[#9a9491] hover:text-white text-xl">×</button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[{ label: 'Production', value: '4 on track', ok: true }, { label: 'Inventory', value: '6/8 SKUs', ok: false }, { label: 'Open Orders', value: '24 SOs', ok: true }, { label: 'Yield', value: '91.4% avg', ok: true }, { label: 'Purchasing', value: '2 urgent POs', ok: false }, { label: 'Cash', value: 'ACU current', ok: true }].map(l => (
                    <div key={l.label} className="rounded-xl p-3 text-center" style={{ background: l.ok ? 'rgba(172,191,55,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${l.ok ? 'rgba(172,191,55,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                      <div className="text-xl mb-1">{l.ok ? '✅' : '⚠️'}</div>
                      <div className="text-xs font-semibold text-white">{l.label}</div>
                      <div className="text-xs text-[#9a9491] mt-0.5">{l.value}</div>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mb-5">
                  <div className="text-sm font-semibold text-[#FF671F] mb-2">Key Observations</div>
                  {['Whey Protein Isolate below reorder point — PO needed within 48 hours.', 'SKU-042 tracking 23% below weekly forecast. SO-10482 at risk.', 'MO-20440 completed: 4,200 Chocolate Fudge units added.', 'Vanilla Cream yield dropped 4.8% over last 3 batches.', 'New SO from Summit Sports ($14,200). Capacity OK.'].map((obs, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-[#9a9491]">
                      <span className="text-[#FF671F] mt-0.5 flex-shrink-0">›</span><span>{obs}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1" onClick={() => setShowBrief(false)}>Send to Chris via Email</Button>
                  <Button variant="outline" onClick={() => setShowBrief(false)}>Post to Slack</Button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
