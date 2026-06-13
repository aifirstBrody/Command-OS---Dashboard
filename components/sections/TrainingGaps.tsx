'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, User } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge, type BadgeProps } from '@/components/ui/badge'

type GapLevel = 'critical' | 'moderate' | 'minor'

interface TrainingGap {
  id: string
  skill: string
  department: string
  gapLevel: GapLevel
  action: string
  assignee: string
}

const gaps: TrainingGap[] = [
  {
    id: '1',
    skill: 'Acumatica PO workflow',
    department: 'Production',
    gapLevel: 'critical',
    action: 'Schedule 1:1 walkthrough with Larry. Document step-by-step PO creation and approval flow.',
    assignee: 'Chad',
  },
  {
    id: '2',
    skill: 'Yield calculation spreadsheet',
    department: 'Production',
    gapLevel: 'moderate',
    action: 'Create shared Google Sheet template with automated variance calculations. Train Chad on formula updates.',
    assignee: 'Chad',
  },
  {
    id: '3',
    skill: 'Sales order entry',
    department: 'Sales',
    gapLevel: 'moderate',
    action: 'Document SO entry SOP in Acumatica. Host 30-min training session. Add to onboarding checklist.',
    assignee: 'Sales team',
  },
  {
    id: '4',
    skill: 'Receipt photo capture SOP',
    department: 'Shepherds',
    gapLevel: 'critical',
    action: 'Create one-page visual SOP for receipt photo standards. Distribute via Slack and laminated card in trucks.',
    assignee: 'All drivers',
  },
  {
    id: '5',
    skill: 'Inventory reorder triggers',
    department: 'Inventory',
    gapLevel: 'critical',
    action: 'Configure reorder points in Acumatica for all 12 active ingredients. Set alert thresholds. Train Larry on monitoring.',
    assignee: 'Larry',
  },
  {
    id: '6',
    skill: 'Slack notification routing',
    department: 'All',
    gapLevel: 'minor',
    action: 'Create #alerts-production, #alerts-inventory channels. Document which alerts go where. 15-min all-hands walk-through.',
    assignee: 'All',
  },
  {
    id: '7',
    skill: 'MO status update procedure',
    department: 'Production',
    gapLevel: 'moderate',
    action: 'Document when and how to update MO status in Acumatica (pending → in progress → complete). Add to production SOP.',
    assignee: 'Chad',
  },
  {
    id: '8',
    skill: 'Vendor contact management',
    department: 'Vendors',
    gapLevel: 'moderate',
    action: 'Build vendor contact directory in Acumatica. Document escalation contacts for each supplier. Train Larry.',
    assignee: 'Larry',
  },
]

const gapConfig: Record<GapLevel, { variant: BadgeProps['variant']; borderColor: string; label: string }> = {
  critical: { variant: 'destructive', borderColor: 'border-l-red-500', label: 'Critical' },
  moderate: { variant: 'warning', borderColor: 'border-l-yellow-400', label: 'Moderate' },
  minor: { variant: 'ghost', borderColor: 'border-l-[#9a9491]', label: 'Minor' },
}

const allDepts = ['All', ...Array.from(new Set(gaps.map((g) => g.department)))]

export default function TrainingGaps() {
  const [activeDept, setActiveDept] = useState('All')

  const filtered = activeDept === 'All'
    ? gaps
    : gaps.filter((g) => g.department === activeDept)

  const criticalCount = gaps.filter((g) => g.gapLevel === 'critical').length

  return (
    <div>
      {/* Summary pill */}
      <div className="flex items-center gap-2 mb-5 p-3 rounded-lg bg-[rgba(239,68,68,0.08)] border border-[rgba(239,68,68,0.2)]">
        <BookOpen size={14} className="text-red-400 flex-shrink-0" />
        <p className="text-xs text-red-300">
          <span className="font-bold">{criticalCount} critical gaps</span> require immediate training assignment
        </p>
      </div>

      {/* Dept Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {allDepts.map((dept) => (
          <button
            key={dept}
            onClick={() => setActiveDept(dept)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              activeDept === dept
                ? 'bg-[rgba(255,103,31,0.15)] text-[#FF671F] border-[rgba(255,103,31,0.3)]'
                : 'text-[#9a9491] border-[rgba(255,255,255,0.08)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((gap, i) => {
          const config = gapConfig[gap.gapLevel]
          return (
            <motion.div
              key={gap.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.02 }}
            >
              <Card className={`border-l-2 ${config.borderColor} hover:border-[rgba(255,103,31,0.25)] transition-colors h-full`}>
                <div className="p-4">
                  <div className="flex items-start gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant={config.variant}>{config.label}</Badge>
                        <Badge variant="ghost">{gap.department}</Badge>
                      </div>
                      <h4 className="font-semibold text-white text-sm leading-tight">{gap.skill}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-[#9a9491] leading-relaxed mb-3">{gap.action}</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)]">
                    <User size={11} className="text-[#9a9491]" />
                    <span className="text-xs text-[#9a9491]">Assign:</span>
                    <span className="text-xs font-medium text-[#FF671F]">{gap.assignee}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
