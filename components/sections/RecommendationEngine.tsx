'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Sparkles, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Urgency = 'Critical' | 'High' | 'Medium' | 'Low'
type Status = 'pending' | 'approved' | 'dismissed'

interface Recommendation {
  id: string
  title: string
  department: string
  urgency: Urgency
  needsApproval: boolean
  description: string
  status: Status
}

const initialRecs: Recommendation[] = [
  {
    id: '1',
    title: 'Create supplemental MO for SKU-042',
    department: 'Production',
    urgency: 'Critical',
    needsApproval: true,
    description: 'Vanilla Cream inventory will hit zero in 4 days based on current SO backlog. A supplemental MO for 3,000 units will cover the gap. All ingredients are available except maltodextrin — covered by pending PO-1183.',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Initiate PO for Whey Protein before price spike',
    department: 'Inventory',
    urgency: 'High',
    needsApproval: true,
    description: 'Market Ear detected a 12% price increase signal for whey protein isolate from Mountain Whey suppliers. Current on-hand: 48 lbs. Placing a 500 lb order now at current pricing saves an estimated $840.',
    status: 'pending',
  },
  {
    id: '3',
    title: 'Document Vanilla Cream mixing SOP',
    department: 'SOPs',
    urgency: 'Medium',
    needsApproval: false,
    description: 'Chad has identified the mixing parameters that produce 93%+ yield. Rocky will draft the SOP from the last interview session. Needs Chad\'s review before publishing to Obsidian vault.',
    status: 'pending',
  },
  {
    id: '4',
    title: 'Schedule Acumatica training for Chad',
    department: 'Training',
    urgency: 'High',
    needsApproval: false,
    description: 'Chad is creating MOs manually without using Acumatica\'s automated BOM pull, causing data inconsistencies. A 1-hour training session covering PO workflow and MO status updates will resolve this.',
    status: 'pending',
  },
  {
    id: '5',
    title: 'Set up automated reorder triggers in Acumatica',
    department: 'Inventory',
    urgency: 'High',
    needsApproval: true,
    description: 'Configure reorder points for all 12 active raw material SKUs in Acumatica. When on-hand drops below threshold, the Reorder Agent will auto-generate a draft PO for Larry to review and approve.',
    status: 'pending',
  },
  {
    id: '6',
    title: 'Archive last 30 days of Rocky chats to Obsidian',
    department: 'Agent Logs',
    urgency: 'Low',
    needsApproval: false,
    description: 'Batch export all Rocky conversation sessions from the last 30 days (42 sessions) to Obsidian with proper tags and summaries. This preserves institutional knowledge before the Q3 operations review.',
    status: 'pending',
  },
]

const urgencyConfig: Record<Urgency, BadgeProps['variant']> = {
  Critical: 'destructive',
  High: 'warning',
  Medium: 'default',
  Low: 'ghost',
}

export default function RecommendationEngine() {
  const [recs, setRecs] = useState<Recommendation[]>(initialRecs)

  const pending = recs.filter((r) => r.status === 'pending')
  const needsApproval = pending.filter((r) => r.needsApproval).length

  const handleApprove = async (id: string) => {
    setRecs((prev) => prev.map((r) => r.id === id ? { ...r, status: 'approved' } : r))
    try {
      await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'approve' }),
      })
    } catch (_) {}
  }

  const handleDismiss = (id: string) => {
    setRecs((prev) => prev.map((r) => r.id === id ? { ...r, status: 'dismissed' } : r))
  }

  return (
    <div>
      {/* Pending approval banner */}
      {needsApproval > 0 && (
        <div className="flex items-center gap-3 mb-5 p-3 rounded-lg bg-[rgba(255,103,31,0.08)] border border-[rgba(255,103,31,0.2)]">
          <Clock size={14} className="text-[#FF671F] flex-shrink-0" />
          <p className="text-xs text-[#e9e9e9]">
            <span className="font-bold text-[#FF671F]">{needsApproval} recommendation{needsApproval > 1 ? 's' : ''}</span> pending Chris approval
          </p>
          <div className="ml-auto flex items-center gap-2">
            <Sparkles size={12} className="text-[#FF671F]" />
            <span className="text-xs text-[#9a9491]">Rocky generated</span>
          </div>
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {recs.map((rec, i) => {
            if (rec.status === 'dismissed') return null

            return (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: rec.status === 'approved' ? 0.6 : 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                transition={{ delay: i * 0.05, duration: 0.2 }}
                layout
              >
                <Card className={`hover:border-[rgba(255,103,31,0.2)] transition-colors ${rec.status === 'approved' ? 'opacity-60' : ''}`}>
                  <div className="p-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant={urgencyConfig[rec.urgency]}>{rec.urgency}</Badge>
                        <Badge variant="ghost">{rec.department}</Badge>
                        {rec.needsApproval && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[rgba(255,103,31,0.15)] text-[#FF671F] border border-[rgba(255,103,31,0.3)]">
                            Needs Chris Approval
                          </span>
                        )}
                        {rec.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[rgba(172,191,55,0.15)] text-[#ACBF37] border border-[rgba(172,191,55,0.3)]">
                            <CheckCircle size={10} /> Approved
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-white text-sm mb-2">{rec.title}</h4>
                      <p className="text-xs text-[#9a9491] leading-relaxed">{rec.description}</p>
                    </div>

                    {rec.status === 'pending' && (
                      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)]">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(rec.id)}
                          className="flex items-center gap-1.5"
                        >
                          <CheckCircle size={12} />
                          Approve & Log
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismiss(rec.id)}
                          className="flex items-center gap-1.5 text-[#9a9491]"
                        >
                          <X size={12} />
                          Dismiss
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {recs.filter((r) => r.status !== 'dismissed').length === 0 && (
          <div className="text-center py-12 text-[#9a9491]">
            <CheckCircle size={32} className="mx-auto mb-3 text-[#ACBF37]" />
            <p className="text-sm">All recommendations handled. Rocky will surface new items as conditions change.</p>
          </div>
        )}
      </div>
    </div>
  )
}
