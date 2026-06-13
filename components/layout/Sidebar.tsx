'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Building2, MessageCircle, AlertTriangle,
  GraduationCap, Lightbulb, Brain, Server,
  ChevronLeft, ChevronRight, Triangle
} from 'lucide-react'
import { SECTIONS } from './AppShell'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, React.ElementType> = {
  Zap, Building2, MessageCircle, AlertTriangle,
  GraduationCap, Lightbulb, Brain, Server,
}

const AGENTS = [
  { id: 'rocky',    name: 'Rocky Agent',    status: 'running' as const },
  { id: 'simon',    name: 'Simon Archive',  status: 'idle'    as const },
  { id: 'reorder',  name: 'Reorder Watch',  status: 'running' as const },
  { id: 'morning',  name: 'Morning Brief',  status: 'idle'    as const },
]

const STATUS_COLOR = {
  running: 'bg-[#ACBF37]',
  idle:    'bg-yellow-400',
  error:   'bg-red-500',
}

interface SidebarProps {
  activeSection: string
  collapsed: boolean
  onCollapse: () => void
  onNavigate: (id: string) => void
}

export default function Sidebar({ activeSection, collapsed, onCollapse, onNavigate }: SidebarProps) {
  return (
    <motion.aside
      className="sidebar-bg flex flex-col h-full flex-shrink-0 z-20"
      animate={{ width: collapsed ? 64 : 248 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/5 min-h-[60px]">
        <div className="flex-shrink-0">
          <svg width="36" height="29" viewBox="0 0 44 36" fill="none">
            <path d="M22 1L2 35h40L22 1z" fill="#FF671F" />
            <path d="M14.5 35L22 17l7.5 18" fill="#D6562B" />
            <path d="M22 1L13 18l9-3 9 3L22 1z" fill="rgba(0,0,0,0.2)" />
          </svg>
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-display font-black text-lg tracking-widest text-white leading-none">PEAK REFUEL</div>
              <div className="text-[10px] font-semibold tracking-widest text-[#FF671F] mt-0.5">COMMAND OS</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {!collapsed && (
          <div className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#6b6460]">
            Story Flow
          </div>
        )}

        {SECTIONS.map((section, i) => {
          const Icon = ICON_MAP[section.icon] || Zap
          const isActive = activeSection === section.id
          return (
            <button
              key={section.id}
              onClick={() => onNavigate(section.id)}
              className={cn(
                'nav-item w-full text-left relative',
                isActive && 'active'
              )}
              title={collapsed ? section.title : undefined}
            >
              {/* Step number */}
              <div className={cn(
                'w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold flex-shrink-0',
                isActive
                  ? 'border-[#FF671F] text-[#FF671F] bg-[rgba(255,103,31,0.12)]'
                  : 'border-white/15 text-[#6b6460]'
              )}>
                {i + 1}
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    className="overflow-hidden"
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-xs font-medium leading-tight whitespace-nowrap">{section.title}</div>
                    {isActive && (
                      <div className="text-[10px] text-[#FF671F]/70 leading-tight whitespace-nowrap truncate max-w-[140px] mt-0.5">
                        {section.question}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          )
        })}

        {/* Agents */}
        <div className={cn('mt-4 mb-1', !collapsed && 'px-4 py-1.5')}>
          {!collapsed && (
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#6b6460]">
              Agents
            </div>
          )}
        </div>
        {AGENTS.map(agent => (
          <div
            key={agent.id}
            className={cn(
              'flex items-center gap-2.5 px-5 py-2 text-xs text-[#9a9491]',
              collapsed && 'justify-center px-0'
            )}
            title={collapsed ? agent.name : undefined}
          >
            <div className={cn(
              'w-2 h-2 rounded-full flex-shrink-0 animate-[pulse-dot_2s_infinite]',
              STATUS_COLOR[agent.status]
            )} />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className="truncate"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {agent.name}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>

      {/* Footer / collapse toggle */}
      <div className="border-t border-white/5 p-3 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ACBF37] animate-[pulse-dot_2s_infinite]" />
            <span className="text-xs text-[#9a9491]">Acumatica</span>
            <span className="text-xs text-yellow-400 font-medium">Sandbox</span>
          </div>
        )}
        <button
          onClick={onCollapse}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#9a9491] hover:text-white hover:bg-white/8 transition-colors flex-shrink-0 ml-auto"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>
    </motion.aside>
  )
}
