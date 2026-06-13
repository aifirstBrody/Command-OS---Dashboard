'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface Message {
  id: string
  role: 'rocky' | 'user'
  content: string
  timestamp: string
}

interface ObsidianLog {
  id: string
  icon: string
  label: string
  time: string
}

const INTRO_MESSAGE: Message = {
  id: 'intro',
  role: 'rocky',
  content: "Hey, I'm Rocky — the Peak Refuel operations assistant. I'm here to document what's happening across your team. Tell me about today's production, any blockers you're running into, inventory concerns, or anything else on your mind. I'll make sure it gets logged and routed to the right place.",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}

const DEPT_OPTIONS = [
  { value: '', label: 'Department…' },
  { value: 'executive', label: 'Executive' },
  { value: 'production', label: 'Production' },
  { value: 'inventory', label: 'Inventory' },
  { value: 'sales', label: 'Sales' },
  { value: 'finance-ar', label: 'Finance AR' },
  { value: 'vendors', label: 'Vendors' },
  { value: 'shepherds', label: 'Shepherds' },
]

const OBSIDIAN_BUTTONS = [
  { key: 'raw', icon: '💾', label: 'Raw Chat' },
  { key: 'summary', icon: '📋', label: 'Summary' },
  { key: 'actions', icon: '✅', label: 'Action Items' },
  { key: 'sop', icon: '📐', label: 'SOP Candidates' },
  { key: 'skills', icon: '🧠', label: 'Skills' },
  { key: 'deptTags', icon: '🏷️', label: 'Dept Tags' },
]

export default function EmployeeInterview() {
  const [messages, setMessages] = useState<Message[]>([INTRO_MESSAGE])
  const [chatInput, setChatInput] = useState('')
  const [dept, setDept] = useState('')
  const [urgency, setUrgency] = useState('normal')
  const [followUp, setFollowUp] = useState(false)
  const [sending, setSending] = useState(false)
  const [logs, setLogs] = useState<ObsidianLog[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async () => {
    const text = chatInput.trim()
    if (!text || sending) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setChatInput('')
    setSending(true)

    try {
      await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, dept, urgency, followUp }),
      })
    } catch (_) {}

    setTimeout(() => {
      const rockyMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'rocky',
        content: "Got it — I've logged that. Is there anything else you want to add, or should I flag this for follow-up with Chris?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, rockyMsg])
      setSending(false)
    }, 1000)
  }

  const logToObsidian = async (type: string, icon: string, label: string) => {
    try {
      await fetch('/api/obsidian/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, messages, dept, urgency }),
      })
    } catch (_) {}

    const newLog: ObsidianLog = {
      id: Date.now().toString(),
      icon,
      label: `${label} logged`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setLogs((prev) => [newLog, ...prev.slice(0, 9)])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Chat Panel */}
      <div className="lg:col-span-2">
        <Card className="flex flex-col overflow-hidden" style={{ minHeight: '560px' }}>
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
            <div className="w-9 h-9 rounded-xl bg-[rgba(255,103,31,0.12)] border border-[rgba(255,103,31,0.25)] flex items-center justify-center flex-shrink-0">
              <Bot size={16} className="text-[#FF671F]" />
            </div>
            <div>
              <p className="font-semibold text-sm text-white">Rocky</p>
              <p className="text-xs text-[#9a9491]">Peak Refuel Operations Interviewer</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ACBF37] animate-pulse-dot" />
              <span className="text-xs text-[#ACBF37]">Active</span>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="max-w-[80%]">
                  <div className={`flex items-center gap-2 mb-1 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                    {msg.role === 'rocky' && (
                      <span className="text-xs font-semibold text-[#FF671F]">Rocky</span>
                    )}
                    {msg.role === 'user' && (
                      <span className="text-xs font-semibold text-[#9a9491]">You</span>
                    )}
                    <span className="text-xs text-[#9a9491]">{msg.timestamp}</span>
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[rgba(255,103,31,0.12)] border border-[rgba(255,103,31,0.2)] rounded-tr-sm text-white'
                        : 'bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-tl-sm text-[#e9e9e9]'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {sending && (
              <div className="flex justify-start">
                <div className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-2 h-2 rounded-full bg-[#FF671F] animate-pulse-dot"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tags Bar */}
          <div className="px-4 py-2 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(0,0,0,0.15)]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#9a9491]">Tag:</span>
              <select
                value={dept}
                onChange={(e) => setDept(e.target.value)}
                className="text-xs rounded-lg px-2 py-1 text-[#e9e9e9] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[rgba(255,103,31,0.4)]"
              >
                {DEPT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                className="text-xs rounded-lg px-2 py-1 text-[#e9e9e9] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] focus:outline-none focus:border-[rgba(255,103,31,0.4)]"
              >
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <label className="flex items-center gap-1.5 text-xs text-[#9a9491] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={followUp}
                  onChange={(e) => setFollowUp(e.target.checked)}
                  className="rounded accent-[#FF671F]"
                />
                Follow-up needed
              </label>
              {followUp && <Badge variant="warning">Follow-up</Badge>}
              {urgency === 'urgent' && <Badge variant="destructive">Urgent</Badge>}
              {urgency === 'high' && <Badge variant="warning">High</Badge>}
            </div>
          </div>

          {/* Input Row */}
          <div className="px-4 py-3 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex gap-3 items-end">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendMessage()
                  }
                }}
                placeholder="Tell Rocky what's happening… (Enter to send · Shift+Enter for new line)"
                rows={2}
                className="flex-1"
              />
              <Button
                onClick={sendMessage}
                disabled={sending || !chatInput.trim()}
                className="px-4 py-2.5 h-auto self-stretch"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Panel */}
      <div className="space-y-3">
        {/* Session Info */}
        <Card className="p-4">
          <p className="font-semibold text-sm text-white mb-3">Session Info</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#9a9491]">Person</span>
              <span className="text-white font-medium">Employee</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a9491]">Messages</span>
              <span className="text-white font-medium">{messages.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a9491]">Department</span>
              <span className="text-[#FF671F] font-medium capitalize">{dept || 'Untagged'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a9491]">Urgency</span>
              <span className={`font-medium capitalize ${
                urgency === 'urgent' ? 'text-red-400' : urgency === 'high' ? 'text-yellow-400' : 'text-[#ACBF37]'
              }`}>{urgency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#9a9491]">Follow-up</span>
              <span className={followUp ? 'text-yellow-400' : 'text-[#9a9491]'}>{followUp ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <button
            onClick={() => { setMessages([INTRO_MESSAGE]); setChatInput(''); setLogs([]) }}
            className="mt-3 w-full text-xs py-1.5 rounded-lg text-[#9a9491] hover:text-white bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
          >
            Clear Session
          </button>
        </Card>

        {/* Obsidian Logging */}
        <Card className="p-4">
          <p className="font-semibold text-sm text-white flex items-center gap-2 mb-3">
            <span>📓</span> Obsidian Logging
          </p>
          <div className="space-y-2">
            {OBSIDIAN_BUTTONS.map((btn) => (
              <button
                key={btn.key}
                onClick={() => logToObsidian(btn.key, btn.icon, btn.label)}
                className="w-full text-left text-xs px-3 py-2 rounded-lg text-[#9a9491] hover:text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(255,103,31,0.2)] transition-all"
              >
                {btn.icon} {btn.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Recent Logs */}
        <Card className="p-4">
          <p className="font-semibold text-sm text-white mb-3">Recent Logs</p>
          <div className="space-y-2">
            {logs.length === 0 && (
              <p className="text-xs text-[#9a9491]">No logs yet this session</p>
            )}
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-2 text-xs">
                <span>{log.icon}</span>
                <span className="text-[#9a9491] flex-1 truncate">{log.label}</span>
                <span className="text-[#9a9491] flex-shrink-0">{log.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
