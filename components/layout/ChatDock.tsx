'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Send, BookOpen, FileText, CheckSquare, FileCode, Brain, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  time: string
  dept?: string
  tags?: string[]
  source?: string
}

const DEPTS = ['Executive','Finance AR','Production','Inventory','Sales','Marketing','Vendors','Shepherds Receipts','SOPs','Skills','People','Agent Logs','Decisions','Follow Ups']

const LOG_TYPES = [
  { type: 'raw',      icon: BookOpen,   label: 'Raw Chat'     },
  { type: 'summary',  icon: FileText,   label: 'Summary'      },
  { type: 'actions',  icon: CheckSquare,label: 'Actions'      },
  { type: 'sop',      icon: FileCode,   label: 'SOP'          },
  { type: 'skills',   icon: Brain,      label: 'Skills'       },
  { type: 'deptTags', icon: Tag,        label: 'Dept Tags'    },
]

interface ChatDockProps { onClose: () => void }

export default function ChatDock({ onClose }: ChatDockProps) {
  const [messages, setMessages]   = useState<Message[]>([{
    id: '0', role: 'assistant',
    content: 'Hi Chris — I\'m Rocky. Ask me anything about Peak Refuel operations, production, inventory, or team intel.',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    source: 'Rocky',
  }])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [dept, setDept]           = useState('')
  const [urgency, setUrgency]     = useState<'normal'|'high'|'urgent'>('normal')
  const [followUp, setFollowUp]   = useState(false)
  const [showLog, setShowLog]     = useState(false)
  const [logHistory, setLogHistory] = useState<{ icon: string; label: string; time: string }[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const sessionId = useRef(`session-${Date.now()}`)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const content = input.trim()
    setInput('')
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user', content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dept: dept || undefined,
      tags: [dept, urgency !== 'normal' ? urgency : '', followUp ? 'follow-up' : ''].filter(Boolean),
    }
    setMessages(m => [...m, userMsg])
    setLoading(true)
    // Silently log (non-blocking)
    fetch('/api/log/conversation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...userMsg, session: sessionId.current, meta: { dept, urgency, followUp } }) }).catch(() => {})
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, department: dept, urgency, followUp, person: 'chris', session: sessionId.current, history: messages.slice(-10).map(m => ({ role: m.role, content: m.content })) }),
      })
      const data = await res.json()
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || data.message || '(empty response from backend)',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: data.source || 'backend',
        tags: data.tags || [],
      }
      setMessages(m => [...m, botMsg])
      fetch('/api/log/conversation', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...botMsg, session: sessionId.current }) }).catch(() => {})
    } catch {
      setMessages(m => [...m, {
        id: (Date.now() + 1).toString(), role: 'assistant',
        content: 'Backend unavailable — make sure /api/chat is running.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'error', tags: ['error'],
      }])
    } finally {
      setLoading(false)
    }
  }

  const logToObsidian = async (type: string, label: string, emoji: string) => {
    if (messages.length <= 1) return
    try {
      await fetch('/api/log/obsidian', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, messages, meta: { dept, urgency, followUp }, session: sessionId.current, timestamp: new Date().toISOString() }) })
      setLogHistory(h => [{ icon: emoji, label: `${label} saved`, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...h])
    } catch {
      // silently fail
    }
  }

  return (
    <motion.div
      className="chat-dock-bg flex flex-col h-full flex-shrink-0"
      style={{ width: 320 }}
      initial={{ x: 320 }}
      animate={{ x: 0 }}
      exit={{ x: 320 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/6 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: 'rgba(255,103,31,0.12)', border: '1px solid rgba(255,103,31,0.22)' }}>🤖</div>
          <div>
            <div className="text-sm font-semibold text-white">Rocky</div>
            <div className="text-[10px] text-[#9a9491]">via /api/chat · logged</div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowLog(v => !v)} className={cn('p-1.5 rounded-lg transition-colors text-[#9a9491] hover:text-white', showLog && 'bg-[rgba(255,103,31,0.1)] text-[#FF671F]')} title="Obsidian log panel">
            <BookOpen size={13} />
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/8 text-[#9a9491] hover:text-white transition-colors">
            <X size={13} />
          </button>
        </div>
      </div>

      {/* Obsidian log panel */}
      {showLog && (
        <div className="border-b border-white/6 px-3 py-3 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.2)' }}>
          <div className="text-[10px] font-semibold text-[#9a9491] uppercase tracking-widest mb-2">Obsidian Logging</div>
          <div className="grid grid-cols-3 gap-1.5 mb-2">
            {LOG_TYPES.map(l => (
              <button key={l.type} onClick={() => logToObsidian(l.type, l.label, '📝')} className="flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] text-[#9a9491] hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <l.icon size={11} />
                <span>{l.label}</span>
              </button>
            ))}
          </div>
          {logHistory.length > 0 && (
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {logHistory.slice(0, 4).map((l, i) => (
                <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#9a9491]">
                  <span>{l.icon}</span><span className="flex-1 truncate">{l.label}</span><span className="text-[#6b6460]">{l.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div style={{ maxWidth: '88%' }}>
              <div className={cn('flex items-center gap-1.5 mb-1', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                <span className="text-[10px] text-[#6b6460]">{msg.time}</span>
                {msg.source && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: msg.source === 'error' ? '#ef4444' : '#9a9491' }}>{msg.source}</span>}
              </div>
              <div className={cn('px-3 py-2.5 rounded-xl text-sm leading-relaxed', msg.role === 'user' ? 'text-white rounded-tr-sm' : 'text-[#E9E9E9] rounded-tl-sm')} style={{ background: msg.role === 'user' ? 'linear-gradient(135deg, rgba(255,103,31,0.2), rgba(214,86,43,0.12))' : 'rgba(255,255,255,0.05)', border: `1px solid ${msg.role === 'user' ? 'rgba(255,103,31,0.25)' : 'rgba(255,255,255,0.07)'}` }}>
                {msg.content}
              </div>
              {msg.tags && msg.tags.length > 0 && (
                <div className={cn('flex flex-wrap gap-1 mt-1', msg.role === 'user' ? 'justify-end' : '')}>
                  {msg.tags.map(t => <span key={t} className="text-[9px] px-1.5 py-0.5 rounded-full text-[#6b6460]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>{t}</span>)}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2.5 rounded-xl rounded-tl-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex gap-1">
                {[0, 150, 300].map(d => (
                  <div key={d} className="w-1.5 h-1.5 rounded-full bg-[#FF671F]" style={{ animation: `pulse-dot 1.2s ease-in-out ${d}ms infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tag bar */}
      <div className="px-3 py-2 border-t border-white/6 flex-shrink-0" style={{ background: 'rgba(0,0,0,0.15)' }}>
        <div className="flex items-center gap-1.5 flex-wrap">
          <select value={dept} onChange={e => setDept(e.target.value)} className="text-[10px] rounded-md px-2 py-1 text-[#9a9491] border-0 focus:outline-none" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <option value="">Dept…</option>
            {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={urgency} onChange={e => setUrgency(e.target.value as 'normal'|'high'|'urgent')} className="text-[10px] rounded-md px-2 py-1 text-[#9a9491] border-0 focus:outline-none" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <label className="flex items-center gap-1 text-[10px] text-[#9a9491] cursor-pointer">
            <input type="checkbox" checked={followUp} onChange={e => setFollowUp(e.target.checked)} className="w-3 h-3 accent-[#FF671F]" />
            Follow-up
          </label>
        </div>
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-white/6 flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Ask Rocky…"
            rows={2}
            className="flex-1 resize-none rounded-xl px-3 py-2 text-sm text-white placeholder-[#6b6460] focus:outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${input ? 'rgba(255,103,31,0.35)' : 'rgba(255,255,255,0.09)'}` }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-3 rounded-xl bg-[#FF671F] text-white hover:bg-[#D6562B] transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
