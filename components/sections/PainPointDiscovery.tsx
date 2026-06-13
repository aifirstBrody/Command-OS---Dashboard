'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'

type Severity = 'critical' | 'high' | 'medium' | 'low'

interface PainPoint {
  id: string
  title: string
  department: string
  severity: Severity
  date: string
  description: string
  detail: string
}

const painPoints: PainPoint[] = [
  {
    id: '1',
    title: 'Manual receipt entry duplication',
    department: 'Finance AR',
    severity: 'high',
    date: 'Jun 10',
    description: 'Drivers submit receipts via photo, but Finance AR manually re-enters the data — creating duplicate effort and error risk.',
    detail: 'Currently 12+ receipts per week are being entered twice. No automated OCR pipeline is in place. Estimated time cost: 3–4 hours/week. Recommended fix: connect Shepherds receipt uploads directly to an extraction pipeline that pre-fills the AR entry form.',
  },
  {
    id: '2',
    title: 'Vanilla Cream yield consistently below target',
    department: 'Production',
    severity: 'critical',
    date: 'Jun 8',
    description: 'Vanilla Cream SKU is consistently yielding 82–85% vs the 93% target, with no root cause documented.',
    detail: 'Chad has tracked this across 6 consecutive batches. Possible causes include: mixing time variance, ingredient measurement inconsistency, or equipment calibration drift. No SOP currently defines the exact mixing parameters. Action: document current best-practice parameters from Chad and create a formal SOP.',
  },
  {
    id: '3',
    title: 'No real-time inventory visibility for sales team',
    department: 'Sales',
    severity: 'high',
    date: 'Jun 7',
    description: 'Sales team is quoting availability based on stale data, leading to customer commitments that can\'t be fulfilled.',
    detail: 'The current process requires Larry to manually export inventory from Acumatica and share via Slack or email. This happens once per day at best. The sales team needs a live ATS (available-to-sell) feed that updates whenever production is complete or inventory is adjusted.',
  },
  {
    id: '4',
    title: 'Vendor lead times not tracked in system',
    department: 'Vendors',
    severity: 'medium',
    date: 'Jun 6',
    description: 'Vendor delivery windows exist only in email threads — not in Acumatica or any shared system.',
    detail: 'When POs are placed, the expected delivery date is tracked informally. When delays occur (like PO-1183 from Ingredion), there\'s no system-level alert. This needs a lead time field per vendor in Acumatica, with automatic alerts when ETAs are missed.',
  },
  {
    id: '5',
    title: 'Onboarding process undocumented',
    department: 'People',
    severity: 'high',
    date: 'Jun 5',
    description: 'No written onboarding checklist or SOP exists — each new hire experience is inconsistent.',
    detail: 'The last two hires reported confusion about systems access, role expectations, and who to contact for different issues. A 1-page onboarding checklist and 2–3 core SOPs (Acumatica basics, Slack usage, safety walkthrough) would reduce ramp-up time significantly.',
  },
  {
    id: '6',
    title: 'Morning brief data arrives 2 hours late',
    department: 'Executive',
    severity: 'low',
    date: 'Jun 4',
    description: 'Rocky\'s morning brief depends on Acumatica sync which runs at 4 AM — but data isn\'t available until 8 AM due to caching.',
    detail: 'The brief is supposed to land at 6:30 AM for Chris\'s first review. Acumatica\'s read-only API is available immediately, but the current data pipeline has an unnecessary 2-hour delay introduced by the caching layer. Fix: reduce cache TTL to 15 minutes for morning brief data sources only.',
  },
]

const severityConfig: Record<Severity, { variant: BadgeProps['variant']; dot: string; label: string }> = {
  critical: { variant: 'destructive', dot: 'bg-red-500', label: 'Critical' },
  high: { variant: 'warning', dot: 'bg-yellow-400', label: 'High' },
  medium: { variant: 'default', dot: 'bg-[#FF671F]', label: 'Medium' },
  low: { variant: 'ghost', dot: 'bg-[#9a9491]', label: 'Low' },
}

const FILTERS = ['All', 'Critical', 'High', 'Medium', 'Low'] as const

export default function PainPointDiscovery() {
  const [filter, setFilter] = useState<string>('All')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = filter === 'All'
    ? painPoints
    : painPoints.filter((p) => p.severity === filter.toLowerCase())

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              filter === f
                ? 'bg-[rgba(255,103,31,0.15)] text-[#FF671F] border-[rgba(255,103,31,0.3)]'
                : 'text-[#9a9491] border-[rgba(255,255,255,0.08)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
            }`}
          >
            {f}
            {f !== 'All' && (
              <span className="ml-1.5 opacity-60">
                ({painPoints.filter((p) => p.severity === f.toLowerCase()).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-2 bottom-2 w-px bg-[rgba(255,255,255,0.08)]" />
        <div className="space-y-4">
          {filtered.map((point, i) => {
            const config = severityConfig[point.severity]
            const isExpanded = expanded.has(point.id)

            return (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                className="relative pl-12"
              >
                <div className={`absolute left-3.5 top-5 w-3 h-3 rounded-full border-2 border-[#0c0a09] ${config.dot} -translate-x-1/2`} />

                <Card className="hover:border-[rgba(255,103,31,0.2)] transition-colors">
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant={config.variant}>{config.label}</Badge>
                          <Badge variant="ghost">{point.department}</Badge>
                          <span className="text-xs text-[#9a9491]">{point.date}</span>
                        </div>
                        <h4 className="font-semibold text-white text-sm mb-1">{point.title}</h4>
                        <p className="text-xs text-[#9a9491] leading-relaxed">{point.description}</p>
                      </div>
                      <button
                        onClick={() => toggle(point.id)}
                        className="flex-shrink-0 p-1.5 rounded-lg text-[#9a9491] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                            <p className="text-xs text-[#9a9491] leading-relaxed">{point.detail}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
