'use client'

import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Zap,
  Package,
  ShoppingCart,
  ClipboardList,
  BarChart3,
  Boxes,
  FileText,
  Wrench,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const kpis = [
  { label: 'Active SOs', value: '24', trend: 12 },
  { label: 'Open MOs', value: '6', trend: -8 },
  { label: 'Avg Yield', value: '91.4%', trend: 2.1 },
  { label: 'ATS Units', value: '18,240', trend: -5.3 },
]

const alerts = [
  { id: '1', severity: 'critical', title: 'Vanilla Cream yield below target', detail: 'Batch B-2241 yielded 82.1% vs 93% target — Chad flagged', time: '9:12 AM', badge: 'Production' },
  { id: '2', severity: 'critical', title: 'Whey Protein inventory critical', detail: 'On-hand: 48 lbs — reorder point is 200 lbs', time: '8:55 AM', badge: 'Inventory' },
  { id: '3', severity: 'warning', title: 'SO-4421 unfulfilled — customer waiting', detail: 'Chocolate Peanut Butter — 500 units short', time: '8:30 AM', badge: 'Sales' },
  { id: '4', severity: 'warning', title: 'PO-1183 overdue from vendor', detail: 'Maltodextrin — 3 days late from Ingredion', time: '7:45 AM', badge: 'Vendors' },
  { id: '5', severity: 'ok', title: 'MO-20441 completed on schedule', detail: 'Strawberry Shortcake — 2,400 units complete', time: '7:20 AM', badge: 'Production' },
  { id: '6', severity: 'info', title: 'Morning Brief ready', detail: 'Rocky has compiled the daily operations summary', time: '6:00 AM', badge: 'Agent' },
  { id: '7', severity: 'warning', title: 'Receipt entry backlog: 12 items', detail: 'Finance AR — manual duplicates detected', time: 'Yesterday', badge: 'Finance AR' },
  { id: '8', severity: 'ok', title: 'Google Sheets sync complete', detail: 'Ops log updated — 34 rows written', time: 'Yesterday', badge: 'System' },
]

const agents = [
  { id: '1', name: 'Sales Intelligence', status: 'running', lastAction: 'Analyzed SO-4421 shortfall' },
  { id: '2', name: 'Production Ready', status: 'idle', lastAction: 'Last run: 6:00 AM' },
  { id: '3', name: 'Reorder Agent', status: 'running', lastAction: 'Monitoring 3 low-stock items' },
  { id: '4', name: 'Morning Brief', status: 'idle', lastAction: 'Completed at 6:00 AM' },
  { id: '5', name: 'Market Ear', status: 'idle', lastAction: 'Last signal: Jun 12' },
  { id: '6', name: 'Communications', status: 'idle', lastAction: 'No outbound queued' },
]

const acuLinks = [
  { label: 'Production Orders', sub: 'MO status', icon: <ClipboardList size={16} /> },
  { label: 'Sales Orders', sub: 'SO pipeline', icon: <ShoppingCart size={16} /> },
  { label: 'Purchase Orders', sub: 'PO tracking', icon: <Package size={16} /> },
  { label: 'Inventory', sub: 'Stock levels', icon: <Boxes size={16} /> },
  { label: 'Item Receipts', sub: 'Receiving log', icon: <FileText size={16} /> },
  { label: 'BOM', sub: 'Bill of materials', icon: <BarChart3 size={16} /> },
  { label: 'Reports', sub: 'Analytics', icon: <TrendingUp size={16} /> },
  { label: 'Work Centers', sub: 'Production floor', icon: <Wrench size={16} /> },
]

const severityIcon = {
  critical: <XCircle size={14} className="text-red-400 mt-0.5 flex-shrink-0" />,
  warning: <AlertTriangle size={14} className="text-yellow-400 mt-0.5 flex-shrink-0" />,
  ok: <CheckCircle size={14} className="text-[#ACBF37] mt-0.5 flex-shrink-0" />,
  info: <Info size={14} className="text-[#FF671F] mt-0.5 flex-shrink-0" />,
}

const severityBorder = {
  critical: 'border-l-red-500',
  warning: 'border-l-yellow-400',
  ok: 'border-l-[#ACBF37]',
  info: 'border-l-[#FF671F]',
}

export default function ExecutiveCommand() {
  return (
    <div className="space-y-5">
      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.02 }}
          >
            <Card className="p-4 hover:border-[rgba(255,103,31,0.3)] transition-colors">
              <p className="text-xs text-[#9a9491] font-medium uppercase tracking-wider mb-2">{kpi.label}</p>
              <p className="metric-val text-white">{kpi.value}</p>
              <div className="flex items-center gap-1 mt-2">
                {kpi.trend > 0
                  ? <TrendingUp size={12} className="text-[#ACBF37]" />
                  : <TrendingDown size={12} className="text-red-400" />}
                <span className={`text-xs font-semibold ${kpi.trend > 0 ? 'text-[#ACBF37]' : 'text-red-400'}`}>
                  {kpi.trend > 0 ? '+' : ''}{kpi.trend}%
                </span>
                <span className="text-xs text-[#9a9491]">vs last wk</span>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Alerts + Agents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Live Alerts */}
        <Card className="lg:col-span-2 overflow-hidden hover:border-[rgba(255,103,31,0.3)] transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse-dot" />
              <span className="font-semibold text-sm text-white">Live Alerts</span>
            </div>
            <span className="text-xs text-[#9a9491]">{alerts.length} active</span>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)] max-h-72 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border-l-2 px-4 py-2.5 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors ${severityBorder[alert.severity as keyof typeof severityBorder]}`}
              >
                <div className="flex items-start gap-2">
                  {severityIcon[alert.severity as keyof typeof severityIcon]}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-white">{alert.title}</span>
                      <Badge variant="ghost" className="text-[10px] px-1.5 py-0">{alert.badge}</Badge>
                    </div>
                    <p className="text-xs text-[#9a9491] mt-0.5">{alert.detail}</p>
                  </div>
                  <span className="text-xs text-[#9a9491] flex-shrink-0 ml-2">{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Agent Status */}
        <Card className="p-4 hover:border-[rgba(255,103,31,0.3)] transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={14} className="text-[#FF671F]" />
            <span className="font-semibold text-sm text-white">AI Agents</span>
          </div>
          <div className="space-y-2">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-lg p-3"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">{agent.name}</span>
                  <span
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      agent.status === 'running'
                        ? 'bg-[#ACBF37] animate-pulse-dot'
                        : agent.status === 'error'
                        ? 'bg-red-500'
                        : 'bg-yellow-400'
                    }`}
                  />
                </div>
                <p className="text-xs text-[#9a9491]">{agent.lastAction}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Acumatica Quick Access */}
      <Card className="p-4 hover:border-[rgba(255,103,31,0.3)] transition-colors">
        <p className="font-semibold text-sm text-[#9a9491] mb-3">Acumatica Quick Access</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {acuLinks.map((link) => (
            <motion.button
              key={link.label}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 p-3 rounded-lg bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,103,31,0.08)] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,103,31,0.3)] transition-all text-left group"
            >
              <span className="text-[#9a9491] group-hover:text-[#FF671F] transition-colors">{link.icon}</span>
              <div>
                <p className="text-xs font-medium text-white group-hover:text-[#FF671F] transition-colors leading-tight">{link.label}</p>
                <p className="text-xs text-[#9a9491] leading-tight">{link.sub}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </Card>
    </div>
  )
}
