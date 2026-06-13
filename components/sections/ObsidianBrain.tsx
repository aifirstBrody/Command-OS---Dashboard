'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { RefreshCw, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface VaultEntry {
  id: string
  icon: string
  title: string
  date: string
  time: string
  category: string
  categoryVariant: 'default' | 'secondary' | 'warning' | 'ghost' | 'destructive' | 'outline'
}

const initialEntries: VaultEntry[] = [
  { id: '1', icon: '📐', title: 'New SOP Draft: Vanilla Cream Mixing Parameters', date: 'Jun 13', time: '10:24 AM', category: 'SOP', categoryVariant: 'default' },
  { id: '2', icon: '🧠', title: 'Skill Node: Chad — Acumatica MO Entry', date: 'Jun 13', time: '9:15 AM', category: 'Skills', categoryVariant: 'secondary' },
  { id: '3', icon: '⚖️', title: 'Decision: Approve supplemental MO-20445', date: 'Jun 12', time: '4:30 PM', category: 'Decision', categoryVariant: 'warning' },
  { id: '4', icon: '📋', title: 'Summary: Rocky Chat — Production team June 8', date: 'Jun 12', time: '2:00 PM', category: 'Summary', categoryVariant: 'ghost' },
  { id: '5', icon: '🔔', title: 'Follow-up: Larry to verify maltodextrin PO', date: 'Jun 12', time: '11:00 AM', category: 'Follow-up', categoryVariant: 'warning' },
  { id: '6', icon: '💾', title: 'Raw Chat: Chris — Inventory review Jun 11', date: 'Jun 11', time: '6:45 PM', category: 'Raw', categoryVariant: 'outline' },
  { id: '7', icon: '📐', title: 'SOP Candidate: Reorder threshold review', date: 'Jun 11', time: '3:20 PM', category: 'SOP Candidate', categoryVariant: 'default' },
  { id: '8', icon: '🏷️', title: 'Dept Tags: Finance AR — Receipt duplication', date: 'Jun 10', time: '1:00 PM', category: 'Tags', categoryVariant: 'ghost' },
]

export default function ObsidianBrain() {
  const [entries, setEntries] = useState<VaultEntry[]>(initialEntries)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await fetch('/api/obsidian/activity')
    } catch (_) {}
    setTimeout(() => {
      setEntries((prev) => [...prev])
      setRefreshing(false)
    }, 800)
  }

  const handleViewInObsidian = async (id: string) => {
    try {
      await fetch(`/api/obsidian/activity/${id}`)
    } catch (_) {}
  }

  return (
    <div>
      {/* Header actions */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ACBF37] animate-pulse-dot" />
          <span className="text-xs text-[#9a9491]">Vault synced · {entries.length} recent entries</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </Button>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-2 bottom-2 w-px bg-[rgba(255,255,255,0.08)]" />
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="relative pl-12"
            >
              <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full bg-[#1a1714] border-2 border-[rgba(255,103,31,0.4)] -translate-x-1/2" />
              <Card className="hover:border-[rgba(255,103,31,0.2)] transition-colors">
                <div className="flex items-center gap-3 p-4">
                  <span className="text-xl flex-shrink-0">{entry.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white leading-tight truncate">{entry.title}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant={entry.categoryVariant} className="text-[10px] px-1.5 py-0">
                        {entry.category}
                      </Badge>
                      <span className="text-xs text-[#9a9491]">{entry.date} · {entry.time}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewInObsidian(entry.id)}
                    className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#9a9491] hover:text-white bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] hover:border-[rgba(255,103,31,0.2)] transition-all"
                  >
                    <ExternalLink size={11} />
                    View
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
