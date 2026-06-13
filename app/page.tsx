'use client'

import AppShell from '@/components/layout/AppShell'
import SectionWrapper from '@/components/sections/SectionWrapper'

import dynamic from 'next/dynamic'

const ExecutiveCommand       = dynamic(() => import('@/components/sections/ExecutiveCommand'),       { ssr: false })
const DepartmentIntelligence = dynamic(() => import('@/components/sections/DepartmentIntelligence'), { ssr: false })
const EmployeeInterview      = dynamic(() => import('@/components/sections/EmployeeInterview'),      { ssr: false })
const PainPointDiscovery     = dynamic(() => import('@/components/sections/PainPointDiscovery'),     { ssr: false })
const TrainingGaps           = dynamic(() => import('@/components/sections/TrainingGaps'),           { ssr: false })
const RecommendationEngine   = dynamic(() => import('@/components/sections/RecommendationEngine'),   { ssr: false })
const ObsidianBrain          = dynamic(() => import('@/components/sections/ObsidianBrain'),          { ssr: false })
const SystemStatus           = dynamic(() => import('@/components/sections/SystemStatus'),           { ssr: false })

export default function Home() {
  return (
    <AppShell>
      <SectionWrapper
        id="executive"
        question="What is happening now?"
        title="Executive Command"
        description="Live status across all operations — KPIs, active alerts, and agent activity."
      >
        <ExecutiveCommand />
      </SectionWrapper>

      <SectionWrapper
        id="departments"
        question="Where are the teams?"
        title="Department Intelligence"
        description="Status and signals organized by department. Click any tile to open a detail panel."
      >
        <DepartmentIntelligence />
      </SectionWrapper>

      <SectionWrapper
        id="interview"
        question="What are employees saying?"
        title="Employee Interview"
        description="Rocky chat for capturing team insights, pain points, and knowledge. Every conversation is logged."
      >
        <EmployeeInterview />
      </SectionWrapper>

      <SectionWrapper
        id="painpoints"
        question="What is slowing us down?"
        title="Pain Point Discovery"
        description="Identified friction points organized by severity and department. Expand any card for detail."
      >
        <PainPointDiscovery />
      </SectionWrapper>

      <SectionWrapper
        id="training"
        question="What do we need to learn?"
        title="Training Gaps"
        description="Skills and knowledge gaps identified across the team. Prioritized by impact."
      >
        <TrainingGaps />
      </SectionWrapper>

      <SectionWrapper
        id="recommendations"
        question="What does Rocky recommend?"
        title="Recommendation Engine"
        description="Rocky's suggested actions based on current data. Items requiring Chris approval are flagged."
      >
        <RecommendationEngine />
      </SectionWrapper>

      <SectionWrapper
        id="obsidian"
        question="What changed in the Peak Brain?"
        title="Obsidian Brain Activity"
        description="Recent vault changes — new SOPs, decisions, skill captures, and follow-ups."
      >
        <ObsidianBrain />
      </SectionWrapper>

      <SectionWrapper
        id="system"
        question="Are all systems operational?"
        title="System Status"
        description="Backend service health. All credentials live in backend .env — nothing stored in this browser."
      >
        <SystemStatus />
      </SectionWrapper>

      <div className="h-24" />
    </AppShell>
  )
}
