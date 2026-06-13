'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, X } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface Dept {
  id: string
  name: string
  icon: string
  description: string
  openItems: number
  recentActivity: string[]
  sources: string[]
  outputs: string[]
}

const departments: Dept[] = [
  {
    id: 'executive',
    name: 'Executive',
    icon: '👑',
    description: 'Strategic oversight, KPIs, decision log, and Rocky intelligence feed for Chris.',
    openItems: 3,
    recentActivity: ['Morning Brief reviewed — Jun 13', 'Decision: Approve supplemental MO', 'Rocky recommendation flagged for review'],
    sources: ['Acumatica ERP', 'Rocky Agent', 'All dept feeds'],
    outputs: ['Decision log', 'Daily brief', 'Approval queue'],
  },
  {
    id: 'finance-ar',
    name: 'Finance AR',
    icon: '💰',
    description: 'Accounts receivable, receipt logging, invoice tracking, and Shepherds receipt pipeline.',
    openItems: 12,
    recentActivity: ['Receipt duplication detected — 12 items backlogged', 'Invoice INV-4421 overdue 5 days', 'New receipt batch uploaded to Sheets'],
    sources: ['Google Sheets', 'Shepherds receipts', 'Acumatica AR'],
    outputs: ['Receipt log', 'AR aging report', 'Obsidian finance notes'],
  },
  {
    id: 'production',
    name: 'Production',
    icon: '🏭',
    description: 'Manufacturing orders, batch yields, Chad\'s production sheet, and floor readiness.',
    openItems: 6,
    recentActivity: ['Yield alert: Vanilla Cream 82.1%', 'MO-20441 completed — 2,400 units', 'Batch B-2242 scheduled for tomorrow'],
    sources: ['Acumatica MO', 'Chad\'s yield sheet', 'Work center data'],
    outputs: ['Production readiness report', 'Yield trending', 'MO status feed'],
  },
  {
    id: 'inventory',
    name: 'Inventory',
    icon: '📦',
    description: 'Raw material stock, reorder triggers, Larry\'s inventory log, and ATS calculations.',
    openItems: 4,
    recentActivity: ['Whey Protein critical — 48 lbs on hand', 'Reorder trigger fired: Maltodextrin', 'Inventory count verified: 18,240 ATS'],
    sources: ['Acumatica inventory', 'Larry\'s tracking sheet', 'Reorder Agent'],
    outputs: ['Stock report', 'Reorder queue', 'ATS feed'],
  },
  {
    id: 'sales',
    name: 'Sales',
    icon: '📈',
    description: 'Sales orders, customer commitments, pipeline tracking, and available-to-sell visibility.',
    openItems: 8,
    recentActivity: ['SO-4421 shortfall: 500 units', 'New order received: SO-4432', 'Customer ETA updated: SO-4419'],
    sources: ['Acumatica SO', 'Sales team updates', 'Inventory feed'],
    outputs: ['SO pipeline', 'ATS report for sales', 'Customer commitments'],
  },
  {
    id: 'marketing',
    name: 'Marketing',
    icon: '📣',
    description: 'Campaign tracking, social signals, product launch readiness, and market positioning.',
    openItems: 2,
    recentActivity: ['New campaign brief reviewed', 'Product launch checklist updated', 'Social mention spike detected'],
    sources: ['Marketing calendar', 'Social feeds', 'Rocky market ear'],
    outputs: ['Campaign log', 'Launch checklist', 'Market signals'],
  },
  {
    id: 'vendors',
    name: 'Vendors',
    icon: '🤝',
    description: 'Vendor relationships, lead times, PO tracking, and supplier risk monitoring.',
    openItems: 5,
    recentActivity: ['PO-1183 overdue: Ingredion', 'New vendor quote received: Dairy Suppliers', 'Lead time updated: Mountain Whey'],
    sources: ['Acumatica PO', 'Vendor communications', 'Market Ear agent'],
    outputs: ['PO status', 'Vendor risk log', 'Lead time tracker'],
  },
  {
    id: 'shepherds',
    name: 'Shepherds Receipts',
    icon: '🧾',
    description: 'Driver receipt capture, photo uploads, and automated data extraction pipeline.',
    openItems: 7,
    recentActivity: ['12 receipts pending manual review', 'Driver upload: Batch R-0441', 'OCR extraction completed for R-0438'],
    sources: ['Driver photo uploads', 'Google Sheets', 'OCR pipeline'],
    outputs: ['Receipt log', 'Finance AR feed', 'Expense tracking'],
  },
  {
    id: 'sops',
    name: 'SOPs',
    icon: '📐',
    description: 'Standard operating procedures, process documentation, and compliance tracking.',
    openItems: 3,
    recentActivity: ['New draft: Vanilla Cream Mixing Parameters', 'SOP reviewed: Reorder threshold process', 'SOP candidate identified from Rocky chat'],
    sources: ['Rocky chats', 'Team interviews', 'Obsidian vault'],
    outputs: ['Obsidian SOP notes', 'Process library', 'Training inputs'],
  },
  {
    id: 'skills',
    name: 'Skills',
    icon: '🧠',
    description: 'Employee skill tracking, competency gaps, training assignments, and certification log.',
    openItems: 5,
    recentActivity: ['Skill node added: Chad — Acumatica MO', 'Training gap identified: Production team', 'Skill assessment scheduled: Larry'],
    sources: ['Rocky interviews', 'Training records', 'Manager assessments'],
    outputs: ['Skills graph in Obsidian', 'Gap report', 'Training queue'],
  },
  {
    id: 'people',
    name: 'People',
    icon: '👥',
    description: 'Team roster, onboarding, HR processes, and employee documentation.',
    openItems: 4,
    recentActivity: ['Onboarding process flagged as undocumented', 'New hire checklist updated', 'Performance review scheduled: Chad'],
    sources: ['HR records', 'Manager inputs', 'Rocky interviews'],
    outputs: ['Onboarding docs', 'People log in Obsidian', 'Org chart'],
  },
  {
    id: 'agent-logs',
    name: 'Agent Logs',
    icon: '🤖',
    description: 'Full audit trail of all Rocky agent actions, recommendations, and decision history.',
    openItems: 14,
    recentActivity: ['Rocky ran Morning Brief — Jun 13', 'Reorder Agent fired: Whey Protein', 'Sales Intelligence flagged SO-4421'],
    sources: ['All Rocky agents', 'API action log', 'Decision triggers'],
    outputs: ['Obsidian agent log', 'Action audit trail', 'Trigger history'],
  },
  {
    id: 'decisions',
    name: 'Decisions',
    icon: '⚖️',
    description: 'Logged business decisions, approval trail, and Chris\'s decision rationale archive.',
    openItems: 2,
    recentActivity: ['Decision logged: Approve MO-20445', 'Pending: Whey Protein emergency PO', 'Decision archived: Vendor change Jun 12'],
    sources: ['Recommendation engine', 'Chris approvals', 'Rocky suggestions'],
    outputs: ['Decision log in Obsidian', 'Approval queue', 'Rationale archive'],
  },
  {
    id: 'follow-ups',
    name: 'Follow Ups',
    icon: '🔔',
    description: 'Open action items, pending tasks, and follow-up assignments across all teams.',
    openItems: 9,
    recentActivity: ['Follow-up: Larry verify maltodextrin PO', 'Follow-up: Chad yield investigation', 'Follow-up: Finance receipt backlog'],
    sources: ['Rocky chats', 'Decision log', 'Agent recommendations'],
    outputs: ['Follow-up queue', 'Obsidian task notes', 'Reminder feed'],
  },
]

interface PanelProps {
  dept: Dept
  onClose: () => void
}

function DeptPanel({ dept, onClose }: PanelProps) {
  return (
    <motion.div
      initial={{ x: 60, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 60, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#1a1714] border-l border-[rgba(255,255,255,0.1)] shadow-2xl overflow-y-auto"
    >
      <div className="sticky top-0 bg-[#1a1714] border-b border-[rgba(255,255,255,0.08)] px-5 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{dept.icon}</span>
          <div>
            <h3 className="font-semibold text-white">{dept.name}</h3>
            <p className="text-xs text-[#9a9491]">{dept.openItems} open items</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-lg text-[#9a9491] hover:text-white hover:bg-[rgba(255,255,255,0.08)] transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-5 space-y-5">
        <p className="text-sm text-[#9a9491] leading-relaxed">{dept.description}</p>

        <Separator />

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9a9491] mb-3">Recent Activity</h4>
          <div className="space-y-2">
            {dept.recentActivity.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <ChevronRight size={12} className="text-[#FF671F] mt-1 flex-shrink-0" />
                <p className="text-sm text-[#e9e9e9]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#9a9491] mb-3">Agent Configuration</h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-[#9a9491] mb-2">Sources</p>
              <div className="flex flex-wrap gap-1">
                {dept.sources.map((s) => (
                  <Badge key={s} variant="ghost" className="text-xs">{s}</Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-[#9a9491] mb-2">Outputs</p>
              <div className="flex flex-wrap gap-1">
                {dept.outputs.map((o) => (
                  <Badge key={o} variant="outline" className="text-xs">{o}</Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
          <div>
            <p className="text-xs font-medium text-white">Write-back Status</p>
            <p className="text-xs text-[#9a9491]">ERP writes are sandbox-only</p>
          </div>
          <Badge variant="warning">DISABLED / Sandbox</Badge>
        </div>
      </div>
    </motion.div>
  )
}

export default function DepartmentIntelligence() {
  const [selectedDept, setSelectedDept] = useState<Dept | null>(null)

  return (
    <div>
      {selectedDept && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSelectedDept(null)}
        />
      )}
      {selectedDept && (
        <DeptPanel dept={selectedDept} onClose={() => setSelectedDept(null)} />
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {departments.map((dept, i) => (
          <motion.div
            key={dept.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card
              className="p-4 cursor-pointer hover:border-[rgba(255,103,31,0.3)] transition-all"
              onClick={() => setSelectedDept(dept)}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{dept.icon}</span>
                {dept.openItems > 0 && (
                  <span className="text-xs font-bold bg-[rgba(255,103,31,0.15)] text-[#FF671F] border border-[rgba(255,103,31,0.3)] rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {dept.openItems > 9 ? '9+' : dept.openItems}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-white leading-tight mb-1">{dept.name}</p>
              <p className="text-xs text-[#9a9491] leading-relaxed line-clamp-2">{dept.description}</p>
              <div className="mt-3 flex items-center gap-1 text-xs text-[#FF671F] font-medium">
                <span>View details</span>
                <ChevronRight size={12} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
