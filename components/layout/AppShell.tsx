'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import Sidebar from './Sidebar'
import CommandBar from './CommandBar'
import ChatDock from './ChatDock'

interface AppShellContext {
  activeSection: string
  setActiveSection: (id: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  chatOpen: boolean
  setChatOpen: (v: boolean) => void
  tvMode: boolean
  setTvMode: (v: boolean) => void
}

export const AppCtx = createContext<AppShellContext>({
  activeSection: 'executive',
  setActiveSection: () => {},
  sidebarCollapsed: false,
  setSidebarCollapsed: () => {},
  chatOpen: true,
  setChatOpen: () => {},
  tvMode: false,
  setTvMode: () => {},
})

export function useApp() { return useContext(AppCtx) }

export const SECTIONS = [
  { id: 'executive',    question: 'What is happening now?',           title: 'Executive Command',       icon: 'Zap' },
  { id: 'departments',  question: 'Where are the teams?',             title: 'Department Intelligence', icon: 'Building2' },
  { id: 'interview',    question: 'What are employees saying?',       title: 'Employee Interview',      icon: 'MessageCircle' },
  { id: 'painpoints',   question: 'What is slowing us down?',         title: 'Pain Point Discovery',    icon: 'AlertTriangle' },
  { id: 'training',     question: 'What do we need to learn?',        title: 'Training Gaps',           icon: 'GraduationCap' },
  { id: 'recommendations', question: 'What does Rocky recommend?',   title: 'Recommendations',         icon: 'Lightbulb' },
  { id: 'obsidian',     question: 'What changed in the Peak Brain?',  title: 'Obsidian Brain',          icon: 'Brain' },
  { id: 'system',       question: 'Are all systems operational?',     title: 'System Status',           icon: 'Server' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState('executive')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [chatOpen, setChatOpen] = useState(true)
  const [tvMode, setTvMode] = useState(false)

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (tvMode) {
    return (
      <AppCtx.Provider value={{ activeSection, setActiveSection, sidebarCollapsed, setSidebarCollapsed, chatOpen, setChatOpen, tvMode, setTvMode }}>
        <div className="fixed inset-0 bg-[#0c0a09] z-50 overflow-auto p-8">
          <button
            onClick={() => setTvMode(false)}
            className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-medium hover:bg-white/20 transition-colors"
          >
            ✕ Exit Full Screen
          </button>
          {children}
        </div>
      </AppCtx.Provider>
    )
  }

  return (
    <AppCtx.Provider value={{ activeSection, setActiveSection, sidebarCollapsed, setSidebarCollapsed, chatOpen, setChatOpen, tvMode, setTvMode }}>
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeSection={activeSection}
          collapsed={sidebarCollapsed}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNavigate={scrollTo}
        />

        {/* Main area */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <CommandBar
            activeSection={activeSection}
            onToggleTv={() => setTvMode(true)}
            onToggleChat={() => setChatOpen(!chatOpen)}
            chatOpen={chatOpen}
          />
          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto px-6 py-8 space-y-0">
            {children}
          </main>
        </div>

        {/* Chat Dock */}
        {chatOpen && (
          <ChatDock onClose={() => setChatOpen(false)} />
        )}
      </div>
    </AppCtx.Provider>
  )
}
