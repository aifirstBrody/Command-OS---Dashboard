export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low'
export type AlertSeverity = 'critical' | 'warning' | 'ok' | 'info'
export type AgentStatus = 'running' | 'idle' | 'error'
export type SystemStatus = 'ok' | 'warning' | 'error' | 'inactive'

export interface KPIData {
  label: string
  value: string
  trend: number
  trendLabel: string
  color?: string
}

export interface Alert {
  id: string
  title: string
  detail: string
  severity: AlertSeverity
  badge: string
  badgeColor: string
  time: string
}

export interface Agent {
  id: string
  name: string
  status: AgentStatus
  lastAction: string
}

export interface Department {
  id: string
  name: string
  icon: string
  description: string
  openItems: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface PainPoint {
  id: string
  title: string
  department: string
  severity: SeverityLevel
  date: string
  description: string
  detail: string
}

export interface TrainingGap {
  id: string
  skill: string
  department: string
  gapLevel: 'critical' | 'moderate' | 'minor'
  action: string
  assignee: string
}

export interface Recommendation {
  id: string
  title: string
  department: string
  urgency: 'Critical' | 'High' | 'Medium' | 'Low'
  needsApproval: boolean
  description: string
  status: 'pending' | 'approved' | 'dismissed'
}

export interface ObsidianEntry {
  id: string
  icon: string
  title: string
  timestamp: string
  category: string
  date: string
}
